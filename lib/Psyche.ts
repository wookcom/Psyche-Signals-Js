
import { PsycheConfig, PsycheMetrics, UserState, MousePoint, PsycheEventListener, PsycheEvent, PsycheElement } from '../types';

export class Psyche {
  private config: PsycheConfig;
  private history: MousePoint[] = [];
  private listeners: Record<string, PsycheEventListener[]> = {};
  
  // Internal State
  private state: UserState = UserState.STANDBY;
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
    currentSelection: null
  };

  // Telemetry Counters
  private lastScrollPos: number = 0;
  private interactionCount: number = 0;
  private selectionCount: number = 0;
  private lastMouseMoveTime: number = Date.now(); // Track last movement time
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
      ...config
    };

    this.init();
  }

  private init() {
    if (typeof window === 'undefined') return;

    // 1. Mouse Tracking
    window.addEventListener('mousemove', this.handleMouseMoveBound);

    // 2. Interaction Tracking
    window.addEventListener('keydown', this.handleInteractionBound);
    window.addEventListener('click', this.handleClickBound);

    // 3. Selection Tracking
    document.addEventListener('selectionchange', this.handleSelectionBound);

    // 4. Scroll Tracking
    const scrollTarget = this.config.scrollElement || window;
    scrollTarget.addEventListener('scroll', this.handleScrollSpyBound);

    // Start Loop
    this.timer = window.setInterval(() => this.analyze(), this.config.interval);
    
    if (this.config.debug) console.log('Psyche Engine Started');
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

  // --- Event Handlers ---

  private handleMouseMove(e: MouseEvent) {
    const now = Date.now();
    this.history.push({ x: e.clientX, y: e.clientY, t: now });
    if (this.history.length > (this.config.historySize || 20)) {
      this.history.shift();
    }
    this.lastMouseMoveTime = now; // Reset pause timer on move
  }

  private handleInteraction() {
    this.interactionCount++;
    this.lastMouseMoveTime = Date.now(); // Interaction also resets pause
  }

  private handleClick(e: MouseEvent) {
    this.handleInteraction(); // Increment counters as usual
    
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

  private handleScrollSpy() {
    // Optional: Could emit specific scroll events here if needed immediately
  }

  // --- Core Analysis Logic ---

  private analyze() {
    const now = Date.now();
    const dt = now - this.lastAnalysisTime || 1;
    this.lastAnalysisTime = now;

    // 1. Calculate Mouse Metrics & Vectors
    const { velocity, entropy, jerk, vx, vy } = this.calculateKinematics();

    // 2. Calculate Pause Duration
    const pauseDuration = now - this.lastMouseMoveTime;

    // 3. Object Detection (Current & Predicted)
    let currentElement: PsycheElement | null = null;
    let predictedElement: PsycheElement | null = null;
    
    if (this.history.length > 0) {
      const lastPoint = this.history[this.history.length - 1];
      
      // A. Identify Current Element
      const el = document.elementFromPoint(lastPoint.x, lastPoint.y);
      if (el) currentElement = this.parseElement(el);

      // B. Predict Target Element (Lookahead 150ms)
      if (velocity > 0.5) { // Only predict if moving significantly
        const predictionTime = 150; // ms
        const predX = lastPoint.x + (vx * predictionTime);
        const predY = lastPoint.y + (vy * predictionTime);
        
        // Bounds check
        if (predX >= 0 && predX <= window.innerWidth && predY >= 0 && predY <= window.innerHeight) {
          const predEl = document.elementFromPoint(predX, predY);
          if (predEl) predictedElement = this.parseElement(predEl);
        }
      }
    }

    // 4. Calculate Scroll Metrics
    const scrollTarget = this.config.scrollElement;
    let currentScroll = 0;
    
    if (scrollTarget instanceof Window) {
        currentScroll = scrollTarget.scrollY;
    } else if (scrollTarget instanceof HTMLElement) {
        currentScroll = scrollTarget.scrollTop;
    }
    
    const scrollDelta = Math.abs(currentScroll - this.lastScrollPos);
    const scrollSpeed = scrollDelta / dt; // px/ms
    this.lastScrollPos = currentScroll;

    // 5. Calculate Rates (normalized to events per second)
    const interactionRate = this.interactionCount * (1000 / dt);
    const selectionActivity = this.selectionCount * (1000 / dt);

    // Reset counters
    this.interactionCount = 0;
    this.selectionCount = 0;

    // Update Metrics
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
      lastClick: this.metrics.lastClick, // Persist last click
      currentSelection: this.metrics.currentSelection // Persist or update selection
    };

    this.emit('metrics', this.metrics);
    this.determineState();
  }

  private calculateKinematics() {
    const h = this.history;
    let velocity = 0;
    let entropy = 0;
    let jerk = 0;
    let vx = 0;
    let vy = 0;

    if (h.length >= 5) {
      const n = h.length;
      const last = h[n-1];
      const first = h[0]; // Or h[n-5] for strictly local velocity, but using window is fine
      const timeSpan = last.t - first.t || 1;

      // Velocity Vectors
      vx = (last.x - first.x) / timeSpan;
      vy = (last.y - first.y) / timeSpan;

      // Scalar Velocity
      velocity = Math.hypot(last.x - first.x, last.y - first.y) / timeSpan;

      // Entropy
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

      // Jerk
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
      className: typeof el.className === 'string' ? el.className.split(' ')[0] : '', // Get first class only for brevity
      interactive: isInteractive
    };
  }

  private determineState() {
    const { velocity, entropy, jerk, scrollSpeed, interactionRate, selectionActivity } = this.metrics;
    let nextState = UserState.EXPLORING;

    // Logic Tree
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

    if (nextState !== this.state) {
      this.state = nextState;
      this.emit('stateChange', this.state);
    }
  }

  // --- Public API ---

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
