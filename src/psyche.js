
import { STATES } from './constants.js';
import { distance, angularEntropy, jerkValue } from './utils.js';

export default class Psyche {
  constructor(config = {}) {
    this.history = [];
    this.metrics = { 
      velocity: 0, 
      entropy: 0, 
      jerk: 0,
      currentElement: null,
      predictedElement: null,
      lastClick: null,
      currentSelection: null
    };
    this.state = STATES.CALMADO;
    this.listeners = {};

    this.config = {
      interval: 100,
      historySize: 20,
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

    this.metrics = { 
      ...this.metrics, 
      velocity, 
      entropy, 
      jerk, 
      currentElement, 
      predictedElement 
    };
    
    this._updateState();
    this._emit('metrics', this.metrics);
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

    if (this.metrics.velocity > 1.8 && this.metrics.entropy < 0.3) {
      next = STATES.URGENTE;
    } else if (this.metrics.entropy > 0.8) {
      next = STATES.INDECISO;
    } else if (this.metrics.velocity < 0.1) {
      next = STATES.CALMADO;
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
