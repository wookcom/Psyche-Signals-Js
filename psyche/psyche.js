import { STATES } from './constants.js';
import { distance, angularEntropy, jerkValue } from './utils.js';

export default class Psyche {
  constructor(config = {}) {
    this.history = [];
    this.metrics = { velocity: 0, entropy: 0, jerk: 0 };
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
    window.addEventListener('mousemove', e => {
      this.history.push({ x: e.clientX, y: e.clientY, t: Date.now() });
      if (this.history.length > this.config.historySize) {
        this.history.shift();
      }
    });

    this._timer = setInterval(() => this._analyze(), this.config.interval);
  }

  _analyze() {
    if (this.history.length < 10) return;

    const h = this.history;
    const first = h[0];
    const last = h[h.length - 1];
    const dt = last.t - first.t || 1;

    const velocity = distance(first, last) / dt;
    const entropy = angularEntropy(h);
    const jerk = jerkValue(h);

    this.metrics = { velocity, entropy, jerk };
    this._updateState();
    this._emit('metrics', this.metrics);
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