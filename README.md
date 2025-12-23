
# Psyche Signals 🧠

**Real-time behavioral signals for adaptive UX**

Psyche Signals es una biblioteca de **computación afectiva** ligera (< 3kb) que permite a tu aplicación web entender la intención del usuario en tiempo real. Analizando patrones cinemáticos del cursor (velocidad, entropía angular y "jerk"), predice estados cognitivos y micro-intenciones de negocio.

---

## 🚀 Características

- **Shadow Tracking (NUEVO v3.5)**: 
  - Predicción profunda de elementos dentro de **Shadow DOM** (Web Components).
  - Ignora automáticamente elementos decorativos (`<span>`, `<div>`) para enfocarse en el componente funcional padre.
  - Permite definir **Selectores Significativos** para priorizar lógica de negocio.
- **Touch Signals (v3.3)**: Soporte táctil con detección de presión y Rage Taps.
- **Privacy-First Mode (v3.4)**: Cumplimiento GDPR/CCPA mediante "Anonimización Local".
- **Micro-Intenciones**: Detección vectorial de abandono (Exit Intent) y Duda (Hesitation).
- **Micro-AI Adaptativa**: Calibración en tiempo real de los umbrales de comportamiento por usuario.

---

## 📦 Instalación

### NPM
```bash
npm install psyche-signals
```

### CDN
```html
<script src="https://unpkg.com/psyche-signals/dist/psyche.umd.js"></script>
<script>
  const engine = new Psyche();
</script>
```

---

## 🔒 Privacidad y Cumplimiento

Para entornos empresariales o estrictos (GDPR), activa el modo de privacidad.

```javascript
const engine = new Psyche({
  useAI: true,
  privacyMode: true // 🛡️ Activa la anonimización local
});
```

---

## 🕸️ Shadow Tracking & Elementos Dinámicos

Psyche ahora "perfora" el Shadow DOM y filtra el ruido visual para predecir interacciones con componentes reales.

```javascript
const engine = new Psyche({
  // Define qué elementos son vitales para tu negocio
  significantSelectors: ['.add-to-cart', '#signup-btn', 'stripe-element'],
  interval: 50
});

engine.on('metrics', (data) => {
  const el = data.predictedElement;
  
  if (el && el.isSignificant) {
     console.log("🔥 Alta probabilidad de conversión en:", el.tag);
  }
  
  if (el && el.isInShadow) {
     console.log("Elemento detectado dentro de un Web Component");
  }
});
```

---

## 🧠 Detección de Micro-Intenciones & Touch

### 1. Rage Taps (Móvil)
Detecta frustración cuando el usuario golpea la pantalla repetidamente.
- **Disparador**: > 3 toques en < 400ms en un radio de 30px.
- **Estado Resultante**: `FRUSTRADO`.

### 2. Exit Intent (Escritorio)
- **Disparador**: Cursor en el 10% superior + velocidad vertical negativa + alta aceleración.

### 3. Hesitation (Duda)
- **Disparador**: Cursor o foco táctil sobre un elemento interactivo por > 2000ms sin acción.

---

## ⚡ Inicio Rápido

```javascript
import Psyche from 'psyche-signals';

const engine = new Psyche({ useAI: true });

engine.on('stateChange', (state) => {
  if (state === 'FRUSTRADO') {
     console.log("Detectados Rage Taps o Rage Clicks - Ofreciendo ayuda.");
  }
});
```

---

## 📄 Licencia

MIT © Walter Sandoval
