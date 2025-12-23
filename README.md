
# Psyche Signals 🧠

**Real-time behavioral signals for adaptive UX**

Psyche Signals es una biblioteca de **computación afectiva** ligera (< 3kb) que permite a tu aplicación web entender la intención del usuario en tiempo real. Analizando patrones cinemáticos del cursor (velocidad, entropía angular y "jerk"), predice estados cognitivos y micro-intenciones de negocio.

---

## 🚀 Características

- **Micro-Intenciones (NUEVO)**:
  - **Exit Intent Vectorial**: Detecta la intención de abandono analizando la velocidad y aceleración hacia la barra de direcciones, prediciendo la salida antes de que el cursor salga del viewport.
  - **Checkout Hesitation (Duda)**: Identifica cuando un usuario "orbita" o duda sobre un elemento interactivo (como un botón de compra) durante más de 2 segundos.
- **Micro-AI Adaptativa**: Algoritmo de aprendizaje estadístico que calibra los umbrales para cada usuario.
- **Predicción de Objetivos**: Predice qué elemento interactivo va a pulsar el usuario hasta 150ms antes.
- **Puntos de Contacto & Selección**: Rastreo de clicks y selección de texto en tiempo real.
- **Cero Dependencias**: Matemática pura y listeners del DOM.

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

## 🧠 Detección de Micro-Intenciones

Psyche v3.2 introduce un motor de detección específico para reglas de negocio:

### 1. Exit Intent (Intención de Salida)
A diferencia de librerías tradicionales que solo escuchan `mouseleave`, Psyche analiza vectores.
- **Disparador**: Cursor en el 10% superior de la pantalla (`y < 60px`) + Velocidad vertical negativa (`vy < -0.5`) + Alta velocidad absoluta.
- **Uso**: Mostrar modales de retención *antes* de que el usuario alcance la barra de pestañas.

### 2. Hesitation (Duda)
Detecta indecisión crítica en puntos de conversión.
- **Disparador**: El cursor permanece sobre el mismo elemento interactivo (`BUTTON`, `INPUT`, `A`) por más de **2000ms** sin hacer clic.
- **Uso**: Si ocurre en un botón de "Pagar", disparar un tooltip de ayuda o un descuento.

---

## ⚡ Inicio Rápido

```javascript
import Psyche from 'psyche-signals';

const engine = new Psyche({ useAI: true });

// Escuchar Micro-Intenciones
engine.on('intention', (intention) => {
  if (intention === 'EXIT_INTENT') {
     console.log("⚠️ El usuario va a cerrar la pestaña!");
     showRetentionModal();
  }
  
  if (intention === 'HESITATION') {
     console.log("🤔 El usuario duda sobre un elemento.");
     offerHelp();
  }
});
```

---

## 📚 Referencia API

### `new Psyche(config)`
- `config.useAI` (boolean): Activa el aprendizaje adaptativo.
- `config.interval` (number): Intervalo de análisis (ms).

### Métodos
- `.on(event, callback)`: Suscribirse a eventos.
  - Eventos: `'metrics'`, `'stateChange'`, `'intention'`.
- `.getMetrics()`: Retorna métricas incluyendo `currentIntention` y `focusTime`.

---

## 📄 Licencia

MIT © Walter Sandoval
