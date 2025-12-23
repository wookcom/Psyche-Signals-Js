
import { PsycheConfig, PsycheMetrics, UserState, MousePoint, PsycheEventListener, PsycheEvent, PsycheElement, PsycheBaseline, MicroIntention } from '../types';

export class Psyche {
  private config: PsycheConfig;
  private history: MousePoint[] = [];
  private listeners: Record<string, PsycheEventListener[]> = {};
  
  // Internal State
  private state: UserState = UserState.STANDBY;
  private currentIntention: MicroIntention = MicroIntention.NONE;
  
  // Hesitation Tracking
  private focusTimer: number = 0;
  private lastFocusedSignature: string = '';

  // AI / Statistical Learning State
  private stats = {
    velSum: 0, velSqSum: 0,
    entSum: 0, entSqSum: 0,
    jerkSum: 0, jerkSqSum: 0,
    count: 0
  };

  private metrics: PsycheMetrics = {
    velocity: 0,
    entropy: 0,
    jerk: 0,
    scrollSpeed: 0,
    interactionRate: 0,
    selectionActivity: 0,
    pauseDuration: 0,
    currentElement: null,
    predictedElement: null,
    lastClick: null,
    currentSelection: null,
    baseline: { avgVelocity: 0, avgEntropy: 0, avgJerk: 0, samples: 0 },
    isLearning: true,
    zScoreVelocity: 0,
    zScoreEntropy: 0,
    currentIntention: MicroIntention.NONE,
    focusTime: 0
  };

  // Telemetry Counters
  private lastScrollPos: number = 0;
  private interactionCount: number = 0;
  private selectionCount: number = 0;
  private lastMouseMoveTime: number = Date.now(); 
  private lastAnalysisTime: number = Date.now();
  private timer: number | null = null;

  // Bound Event Handlers
  private handleMouseMoveBound = this.handleMouseMove.bind(this);
  private handleInteractionBound = this.handleInteraction.bind(this);
  private handleClickBound = this.handleClick.bind(this);
  private handleSelectionBound = this.handleSelection.bind(this);
  private handleScrollSpyBound = this.handleScrollSpy.bind(this);

  constructor(config: PsycheConfig = {}) {
    this.config = {
      interval: 100,
      historySize: 20,
      scrollElement: window,
      debug: false,
      useAI: true,
      learningSamples: 30, // Approx 3 seconds to calibrate @ 100ms interval
      ...config
    };

    this.init();
  }

  private init() {
    if (typeof window === 'undefined') return;

    window.addEventListener('mousemove', this.handleMouseMoveBound);
    window.addEventListener('keydown', this.handleInteractionBound);
    window.addEventListener('click', this.handleClickBound);
    document.addEventListener('selectionchange', this.handleSelectionBound);

    const scrollTarget = this.config.scrollElement || window;
    scrollTarget.addEventListener('scroll', this.handleScrollSpyBound);

    this.timer = window.setInterval(() => this.analyze(), this.config.interval);
    
    if (this.config.debug) console.log('Psyche Neural Engine v3.2 Started');
  }

  public destroy() {
    if (typeof window === 'undefined') return;

    window.removeEventListener('mousemove', this.handleMouseMoveBound);
    window.removeEventListener('keydown', this.handleInteractionBound);
    window.removeEventListener('click', this.handleClickBound);
    document.removeEventListener('selectionchange', this.handleSelectionBound);
    
    const scrollTarget = this.config.scrollElement || window;
    scrollTarget.removeEventListener('scroll', this.handleScrollSpyBound);

    if (this.timer) window.clearInterval(this.timer);
  }

  private handleMouseMove(e: MouseEvent) {
    const now = Date.now();
    this.history.push({ x: e.clientX, y: e.clientY, t: now });
    if (this.history.length > (this.config.historySize || 20)) {
      this.history.shift();
    }
    this.lastMouseMoveTime = now; 
  }

  private handleInteraction() {
    this.interactionCount++;
    this.lastMouseMoveTime = Date.now(); 
    // Reset hesitation timer on click/interaction as action was taken
    this.focusTimer = 0;
  }

  private handleClick(e: MouseEvent) {
    this.handleInteraction(); 
    
    const target = e.target as Element;
    this.metrics.lastClick = {
      x: e.clientX,
      y: e.clientY,
      t: Date.now(),
      element: target ? this.parseElement(target) : undefined
    };
  }

  private handleSelection() {
    this.selectionCount++;
    const selection = window.getSelection();
    const text = selection ? selection.toString() : '';
    
    if (text.length > 0) {
      this.metrics.currentSelection = {
        text: text,
        length: text.length,
        t: Date.now()
      };
    } else {
      this.metrics.currentSelection = null;
    }
  }

  private handleScrollSpy() { }

  private analyze() {
    const now = Date.now();
    const dt = now - this.lastAnalysisTime || 1;
    this.lastAnalysisTime = now;

    const { velocity, entropy, jerk, vx, vy } = this.calculateKinematics();
    const pauseDuration = now - this.lastMouseMoveTime;

    // --- AI Learning Step ---
    if (velocity > 0.01 && this.config.useAI) {
      this.updateBaseline(velocity, entropy, jerk);
    }
    
    const isLearning = this.config.useAI ? this.stats.count < (this.config.learningSamples || 30) : false;

    // --- Object Detection ---
    let currentElement: PsycheElement | null = null;
    let predictedElement: PsycheElement | null = null;
    
    // Last point
    let lastPoint = { x: 0, y: 0 };

    if (this.history.length > 0) {
      lastPoint = this.history[this.history.length - 1];
      const el = document.elementFromPoint(lastPoint.x, lastPoint.y);
      if (el) currentElement = this.parseElement(el);

      if (velocity > 0.5) { 
        const predictionTime = 150; 
        const predX = lastPoint.x + (vx * predictionTime);
        const predY = lastPoint.y + (vy * predictionTime);
        
        if (predX >= 0 && predX <= window.innerWidth && predY >= 0 && predY <= window.innerHeight) {
          const predEl = document.elementFromPoint(predX, predY);
          if (predEl) predictedElement = this.parseElement(predEl);
        }
      }
    }

    // --- Micro-Intentions Analysis ---
    const detectedIntention = this.detectIntentions(currentElement, velocity, vx, vy, lastPoint.y, dt);

    const scrollTarget = this.config.scrollElement;
    let currentScroll = 0;
    if (scrollTarget instanceof Window) currentScroll = scrollTarget.scrollY;
    else if (scrollTarget instanceof HTMLElement) currentScroll = scrollTarget.scrollTop;
    
    const scrollDelta = Math.abs(currentScroll - this.lastScrollPos);
    const scrollSpeed = scrollDelta / dt; 
    this.lastScrollPos = currentScroll;

    const interactionRate = this.interactionCount * (1000 / dt);
    const selectionActivity = this.selectionCount * (1000 / dt);

    this.interactionCount = 0;
    this.selectionCount = 0;

    // --- Calculate Z-Scores ---
    const velStdDev = Math.sqrt((this.stats.velSqSum / this.stats.count) - Math.pow(this.metrics.baseline.avgVelocity, 2)) || 1;
    const entStdDev = Math.sqrt((this.stats.entSqSum / this.stats.count) - Math.pow(this.metrics.baseline.avgEntropy, 2)) || 1;

    const zScoreVelocity = (velocity - this.metrics.baseline.avgVelocity) / (velStdDev || 0.1);
    const zScoreEntropy = (entropy - this.metrics.baseline.avgEntropy) / (entStdDev || 0.1);

    this.metrics = {
      velocity,
      entropy,
      jerk,
      scrollSpeed,
      interactionRate,
      selectionActivity,
      pauseDuration,
      currentElement,
      predictedElement,
      lastClick: this.metrics.lastClick,
      currentSelection: this.metrics.currentSelection,
      baseline: this.metrics.baseline,
      isLearning,
      zScoreVelocity,
      zScoreEntropy,
      currentIntention: detectedIntention,
      focusTime: this.focusTimer
    };

    if (detectedIntention !== this.currentIntention) {
      this.currentIntention = detectedIntention;
      if (detectedIntention !== MicroIntention.NONE) {
        this.emit('intention', detectedIntention);
      }
    }

    this.emit('metrics', this.metrics);
    this.determineState();
  }

  private detectIntentions(
    currentElement: PsycheElement | null, 
    velocity: number, 
    vx: number, 
    vy: number, 
    mouseY: number,
    dt: number
  ): MicroIntention {
    
    // 1. EXIT INTENT
    // Logic: Cursor near top (0-60px), moving UP (vy < 0) fast enough
    if (mouseY < 60 && vy < -0.5 && velocity > 0.5) {
      return MicroIntention.EXIT;
    }

    // 2. HESITATION / DUDA
    // Logic: Cursor is over an interactive element for > 2000ms (accumulative)
    if (currentElement && currentElement.interactive) {
      const sig = `${currentElement.tag}-${currentElement.id || currentElement.className}`;
      
      if (sig === this.lastFocusedSignature) {
        this.focusTimer += dt;
        // Threshold: 2 seconds of "orbiting" or hovering
        if (this.focusTimer > 2000) {
          return MicroIntention.HESITATION;
        }
      } else {
        // Changed element, reset timer
        this.lastFocusedSignature = sig;
        this.focusTimer = 0;
      }
    } else {
      // Not on interactive element, reset
      this.lastFocusedSignature = '';
      this.focusTimer = 0;
    }

    return MicroIntention.NONE;
  }

  private updateBaseline(v: number, e: number, j: number) {
    this.stats.count++;
    this.stats.velSum += v;
    this.stats.velSqSum += v * v;
    this.stats.entSum += e;
    this.stats.entSqSum += e * e;
    this.stats.jerkSum += j;
    this.stats.jerkSqSum += j * j;

    this.metrics.baseline = {
      avgVelocity: this.stats.velSum / this.stats.count,
      avgEntropy: this.stats.entSum / this.stats.count,
      avgJerk: this.stats.jerkSum / this.stats.count,
      samples: this.stats.count
    };
  }

  private calculateKinematics() {
    const h = this.history;
    let velocity = 0, entropy = 0, jerk = 0, vx = 0, vy = 0;

    if (h.length >= 5) {
      const n = h.length;
      const last = h[n-1];
      const first = h[0]; 
      const timeSpan = last.t - first.t || 1;

      vx = (last.x - first.x) / timeSpan;
      vy = (last.y - first.y) / timeSpan;
      velocity = Math.hypot(last.x - first.x, last.y - first.y) / timeSpan;

      let chaos = 0;
      for(let i = 2; i < n; i++) {
          const a = h[i-2], b = h[i-1], c = h[i];
          const ang1 = Math.atan2(b.y - a.y, b.x - a.x);
          const ang2 = Math.atan2(c.y - b.y, c.x - b.x);
          let diff = Math.abs(ang1 - ang2);
          if (diff > Math.PI) diff = Math.PI * 2 - diff;
          chaos += diff;
      }
      entropy = chaos / n;

      const v1 = Math.hypot(h[n-1].x - h[n-2].x, h[n-1].y - h[n-2].y);
      const v2 = Math.hypot(h[n-2].x - h[n-3].x, h[n-2].y - h[n-3].y);
      jerk = Math.abs(v2 - v1) / (h[n-1].t - h[n-2].t || 1);
    }

    return { velocity, entropy, jerk, vx, vy };
  }

  private parseElement(el: Element): PsycheElement {
    const interactiveTags = ['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA'];
    const isInteractive = interactiveTags.includes(el.tagName) || el.hasAttribute('onclick') || window.getComputedStyle(el).cursor === 'pointer';
    
    return {
      tag: el.tagName.toLowerCase(),
      id: el.id,
      className: typeof el.className === 'string' ? el.className.split(' ')[0] : '', 
      interactive: isInteractive
    };
  }

  private determineState() {
    const { velocity, entropy, jerk, scrollSpeed, interactionRate, selectionActivity, zScoreVelocity, zScoreEntropy, isLearning } = this.metrics;
    let nextState = UserState.EXPLORING;

    if (this.config.useAI && !isLearning) {
      if (jerk > 0.5 || interactionRate > 8) {
        nextState = UserState.FRUSTRATED; 
      } else if (scrollSpeed > 0.5 && velocity < 0.2) {
        nextState = UserState.READING;
      } else if (zScoreVelocity > 1.5 && zScoreEntropy < 0.5) {
        nextState = UserState.URGENT; 
      } else if (zScoreEntropy > 1.5 || selectionActivity > 2) {
        nextState = UserState.UNDECIDED; 
      } else if (velocity < 0.1 && scrollSpeed < 0.1 && interactionRate < 1) {
        nextState = UserState.CALM;
      }

    } else {
      if (jerk > 0.5 || interactionRate > 8) {
        nextState = UserState.FRUSTRATED;
      } else if (scrollSpeed > 0.5 && velocity < 0.2) {
        nextState = UserState.READING;
      } else if (velocity > 1.8 && entropy < 0.3) {
        nextState = UserState.URGENT;
      } else if (entropy > 0.8 || selectionActivity > 2) {
        nextState = UserState.UNDECIDED;
      } else if (velocity < 0.1 && scrollSpeed < 0.1 && interactionRate < 1) {
        nextState = UserState.CALM;
      }
    }

    if (nextState !== this.state) {
      this.state = nextState;
      this.emit('stateChange', this.state);
    }
  }

  public on(event: PsycheEvent, callback: PsycheEventListener) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  public off(event: PsycheEvent, callback: PsycheEventListener) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
  }

  private emit(event: PsycheEvent, data: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }

  public getMetrics(): PsycheMetrics {
    return { ...this.metrics };
  }

  public getState(): UserState {
    return this.state;
  }
}
