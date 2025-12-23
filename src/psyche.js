
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

    this.metrics = { 
      velocity: 0, 
      entropy: 0, 
      jerk: 0,
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
      ...config
    };

    this._init();
  }

  _init() {
    if (typeof window === 'undefined') return;

    window.addEventListener('mousemove', e => {
      this.history.push({ x: e.clientX, y: e.clientY, t: Date.now() });
      if (this.history.length > this.config.historySize) {
        this.history.shift();
      }
    });

    window.addEventListener('click', e => {
       const target = e.target;
       this.metrics.lastClick = {
         x: e.clientX,
         y: e.clientY,
         t: Date.now(),
         element: target ? this._parseElement(target) : null
       };
       // Reset timer on click
       this.focusTimer = 0;
       this._emit('metrics', this.metrics);
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

    // 1. Current
    const el = document.elementFromPoint(last.x, last.y);
    if (el) currentElement = this._parseElement(el);

    // 2. Prediction (150ms lookahead)
    if (velocity > 0.5) {
      const predX = last.x + (vx * 150);
      const predY = last.y + (vy * 150);
      if (predX >= 0 && predX <= window.innerWidth && predY >= 0 && predY <= window.innerHeight) {
        const predEl = document.elementFromPoint(predX, predY);
        if (predEl) predictedElement = this._parseElement(predEl);
      }
    }

    // Micro-Intentions
    let intention = 'NONE';
    
    // Exit Intent: Top area + moving up + fast
    if (last.y < 60 && vy < -0.5 && velocity > 0.5) {
        intention = 'EXIT_INTENT';
    }

    // Hesitation
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
    this._emit('metrics', this.metrics);
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
    const interactiveTags = ['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA'];
    const style = window.getComputedStyle(el);
    const isInteractive = interactiveTags.includes(el.tagName) || el.hasAttribute('onclick') || style.cursor === 'pointer';
    
    return {
      tag: el.tagName.toLowerCase(),
      id: el.id || null,
      className: typeof el.className === 'string' ? el.className.split(' ')[0] : null,
      interactive: isInteractive
    };
  }

  _updateState() {
    let next = STATES.EXPLORADOR;
    const { velocity, entropy, zScoreVelocity, zScoreEntropy, isLearning } = this.metrics;

    if (this.config.useAI && !isLearning) {
        if (zScoreVelocity > 1.5 && zScoreEntropy < 0.5) {
            next = STATES.URGENTE;
        } else if (zScoreEntropy > 1.5) {
            next = STATES.INDECISO;
        } else if (velocity < 0.1) {
            next = STATES.CALMADO;
        }
    } else {
        // Fallback static thresholds
        if (velocity > 1.8 && entropy < 0.3) {
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
    return this.metrics;
  }

  getState() {
    return this.state;
  }

  destroy() {
    clearInterval(this._timer);
    this.listeners = {};
  }
}
