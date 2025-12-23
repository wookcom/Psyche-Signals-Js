
import { STATES } from './constants.js';
import { distance, angularEntropy, jerkValue } from './utils.js';

export default class Psyche {
  constructor(config = {}) {
    this.history = [];
    
    this.stats = {
        velSum: 0, velSqSum: 0,
        entSum: 0, entSqSum: 0,
        jerkSum: 0, jerkSqSum: 0,
        count: 0
    };

    // Hesitation tracking
    this.focusTimer = 0;
    this.lastFocusedSignature = '';

    // Touch tracking
    this.lastTapTime = 0;
    this.lastTapLoc = { x: 0, y: 0 };
    this.rageTapCounter = 0;

    this.metrics = { 
      inputType: 'MOUSE',
      velocity: 0, 
      entropy: 0, 
      jerk: 0,
      touchPressure: 0,
      rageTaps: 0,
      currentElement: null,
      predictedElement: null,
      lastClick: null,
      currentSelection: null,
      baseline: { avgVelocity: 0, avgEntropy: 0, avgJerk: 0, samples: 0 },
      isLearning: true,
      zScoreVelocity: 0,
      zScoreEntropy: 0,
      currentIntention: 'NONE',
      focusTime: 0
    };
    this.state = STATES.CALMADO;
    this.listeners = {};

    this.config = {
      interval: 100,
      historySize: 20,
      useAI: true,
      learningSamples: 30,
      privacyMode: false,
      significantSelectors: ['button', 'a', '.cta', '[role="button"]'],
      ...config
    };

    this._init();
  }

  _init() {
    if (typeof window === 'undefined') return;

    // Mouse
    window.addEventListener('mousemove', e => {
      this.metrics.inputType = 'MOUSE';
      this.metrics.touchPressure = 0;
      this._pushHistory(e.clientX, e.clientY);
    });

    // Touch
    window.addEventListener('touchmove', e => {
      if (e.touches.length > 0) {
        this.metrics.inputType = 'TOUCH';
        const t = e.touches[0];
        this.metrics.touchPressure = t.force || 0.5;
        this._pushHistory(t.clientX, t.clientY, t.force);
      }
    }, { passive: true });

    window.addEventListener('touchstart', e => {
      this.metrics.inputType = 'TOUCH';
      if (e.touches.length > 0) {
         const t = e.touches[0];
         // Rage Taps
         const now = Date.now();
         const dist = Math.hypot(t.clientX - this.lastTapLoc.x, t.clientY - this.lastTapLoc.y);
         if (now - this.lastTapTime < 400 && dist < 30) {
            this.rageTapCounter++;
         } else {
            this.rageTapCounter = 0;
         }
         this.lastTapTime = now;
         this.lastTapLoc = {x: t.clientX, y: t.clientY};
         this.metrics.rageTaps = this.rageTapCounter;
      }
    }, { passive: true });

    window.addEventListener('click', e => {
       const target = this._getDeepElement(e.clientX, e.clientY);
       this.metrics.lastClick = {
         x: e.clientX,
         y: e.clientY,
         t: Date.now(),
         element: target ? this._parseElement(target) : null
       };
       this.focusTimer = 0;
       this._emit('metrics', this._getPublicMetrics());
    });

    document.addEventListener('selectionchange', () => {
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
    });

    this._timer = setInterval(() => this._analyze(), this.config.interval);
  }

  _pushHistory(x, y, force = 0) {
    this.history.push({ x, y, t: Date.now(), force });
    if (this.history.length > this.config.historySize) {
      this.history.shift();
    }
  }

  _analyze() {
    if (this.history.length < 5) return;

    const h = this.history;
    const first = h[0];
    const last = h[h.length - 1];
    const dt = last.t - first.t || 1;

    // Kinematics
    const velocity = distance(first, last) / dt;
    const entropy = angularEntropy(h);
    const jerk = jerkValue(h);

    // AI Training
    if (velocity > 0.01 && this.config.useAI) {
        this._updateBaseline(velocity, entropy, jerk);
    }
    const isLearning = this.config.useAI ? this.stats.count < this.config.learningSamples : false;

    // Z-Score Calculation
    const velStdDev = Math.sqrt((this.stats.velSqSum / this.stats.count) - Math.pow(this.metrics.baseline.avgVelocity, 2)) || 1;
    const entStdDev = Math.sqrt((this.stats.entSqSum / this.stats.count) - Math.pow(this.metrics.baseline.avgEntropy, 2)) || 1;

    const zScoreVelocity = (velocity - this.metrics.baseline.avgVelocity) / (velStdDev || 0.1);
    const zScoreEntropy = (entropy - this.metrics.baseline.avgEntropy) / (entStdDev || 0.1);

    // Vector Velocity for Prediction
    const vx = (last.x - first.x) / dt;
    const vy = (last.y - first.y) / dt;

    // Object Detection
    let currentElement = null;
    let predictedElement = null;

    const el = this._getDeepElement(last.x, last.y);
    if (el) currentElement = this._parseElement(el);

    if (velocity > 0.5) {
      const predX = last.x + (vx * 150);
      const predY = last.y + (vy * 150);
      if (predX >= 0 && predX <= window.innerWidth && predY >= 0 && predY <= window.innerHeight) {
        const predEl = this._getDeepElement(predX, predY);
        if (predEl) predictedElement = this._parseElement(predEl);
      }
    }

    // Micro-Intentions
    let intention = 'NONE';
    if (this.metrics.inputType === 'MOUSE' && last.y < 60 && vy < -0.5 && velocity > 0.5) {
        intention = 'EXIT_INTENT';
    }

    if (currentElement && currentElement.interactive) {
        const sig = `${currentElement.tag}-${currentElement.id || currentElement.className}`;
        if (sig === this.lastFocusedSignature) {
            this.focusTimer += dt;
            if (this.focusTimer > 2000) intention = 'HESITATION';
        } else {
            this.lastFocusedSignature = sig;
            this.focusTimer = 0;
        }
    } else {
        this.lastFocusedSignature = '';
        this.focusTimer = 0;
    }

    this.metrics = { 
      ...this.metrics, 
      velocity, 
      entropy, 
      jerk, 
      currentElement, 
      predictedElement,
      baseline: this.metrics.baseline,
      isLearning,
      zScoreVelocity,
      zScoreEntropy,
      currentIntention: intention,
      focusTime: this.focusTimer
    };
    
    if (intention !== 'NONE') this._emit('intention', intention);
    this._updateState();
    this._emit('metrics', this._getPublicMetrics());
  }

  _getDeepElement(x, y) {
      let el = document.elementFromPoint(x, y);
      while (el && el.shadowRoot && el.shadowRoot.elementFromPoint) {
          const shadowEl = el.shadowRoot.elementFromPoint(x, y);
          if (!shadowEl || shadowEl === el) break;
          el = shadowEl;
      }
      return el;
  }

  _getPublicMetrics() {
     if (!this.config.privacyMode) return { ...this.metrics };
     
     const m = { ...this.metrics };
     if (m.currentSelection) m.currentSelection = { ...m.currentSelection, text: '***REDACTED***' };
     if (m.currentElement) m.currentElement = { ...m.currentElement, id: 'REDACTED', className: 'REDACTED' };
     if (m.predictedElement) m.predictedElement = { ...m.predictedElement, id: 'REDACTED', className: 'REDACTED' };
     if (m.lastClick) m.lastClick = { ...m.lastClick, x: -1, y: -1 };
     return m;
  }

  _updateBaseline(v, e, j) {
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

  _parseElement(el) {
    let target = el;
    const interactiveTags = ['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA'];
    const maxDepth = 4;
    let depth = 0;

    const isLikelyDecorative = (e) => {
        const tag = e.tagName;
        return (tag === 'SPAN' || tag === 'DIV' || tag === 'SVG' || tag === 'PATH' || tag === 'I');
    }

    while (
       target && 
       target.parentElement && 
       depth < maxDepth && 
       isLikelyDecorative(target) && 
       !target.hasAttribute('onclick') &&
       !interactiveTags.includes(target.tagName)
    ) {
        target = target.parentElement;
        depth++;
    }

    let isSignificant = false;
    if (this.config.significantSelectors) {
      isSignificant = this.config.significantSelectors.some(selector => {
         try { return target.matches(selector); } catch { return false; }
      });
    }

    const style = window.getComputedStyle(target);
    const isInteractive = interactiveTags.includes(target.tagName) || target.hasAttribute('onclick') || style.cursor === 'pointer' || isSignificant;
    const isInShadow = (target.getRootNode() instanceof ShadowRoot);

    return {
      tag: target.tagName.toLowerCase(),
      id: target.id || null,
      className: typeof target.className === 'string' ? target.className.split(' ')[0] : null,
      interactive: isInteractive,
      isSignificant,
      isInShadow
    };
  }

  _updateState() {
    let next = STATES.EXPLORADOR;
    const { velocity, entropy, zScoreVelocity, zScoreEntropy, isLearning, rageTaps, jerk } = this.metrics;

    if (this.config.useAI && !isLearning) {
        if (rageTaps > 2 || jerk > 0.5) {
            next = STATES.FRUSTRATED; // Touch rage handled here
        } else if (zScoreVelocity > 1.5 && zScoreEntropy < 0.5) {
            next = STATES.URGENTE;
        } else if (zScoreEntropy > 1.5) {
            next = STATES.INDECISO;
        } else if (velocity < 0.1) {
            next = STATES.CALMADO;
        }
    } else {
        if (rageTaps > 2) next = STATES.FRUSTRATED;
        else if (velocity > 1.8 && entropy < 0.3) {
            next = STATES.URGENTE;
        } else if (entropy > 0.8) {
            next = STATES.INDECISO;
        } else if (velocity < 0.1) {
            next = STATES.CALMADO;
        }
    }

    if (next !== this.state) {
      this.state = next;
      this._emit('state', this.state);
    }
  }

  on(event, cb) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(cb);
  }

  _emit(event, data) {
    (this.listeners[event] || []).forEach(cb => cb(data));
  }

  getMetrics() {
    return this._getPublicMetrics();
  }

  getState() {
    return this.state;
  }

  destroy() {
    clearInterval(this._timer);
    this.listeners = {};
  }
}
