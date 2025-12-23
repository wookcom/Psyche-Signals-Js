
# Psyche Signals 🧠

**Real-time behavioral signals for adaptive UX**

Psyche Signals es una biblioteca de **computación afectiva** ligera (< 2kb) que permite a tu aplicación web entender la intención del usuario en tiempo real. Analizando patrones cinemáticos del cursor (velocidad, entropía angular y "jerk" o sacudida), predice estados cognitivos como duda, urgencia o frustración, e identifica elementos de interés antes de que ocurra el clic.

---

## 🚀 Características

- **Detección de Intención en Tiempo Real**: Analiza el comportamiento a 60fps (configurable).
- **Predicción de Objetivos**: Calcula la trayectoria vectorial para predecir qué elemento interactivo va a pulsar el usuario hasta 150ms antes.
- **Puntos de Contacto**: Detecta y expone la última posición de clic y el elemento interactuado.
- **Selección de Texto (NUEVO)**: Detecta selecciones activas, ideal para análisis de lectura o intención de copia.
- **Estados Cognitivos Automáticos**: Clasifica al usuario en perfiles como `URGENTE`, `INDECISO`, `EXPLORADOR` o `CALMADO`.
- **Métricas Avanzadas**:
  - **Velocidad**: Rapidez de interacción hacia un objetivo.
  - **Entropía**: Medida del caos en la trayectoria (indicador de confusión).
  - **Jerk**: Cambios bruscos de aceleración (indicador de estrés motor).
- **Cero Dependencias**: Matemática pura y listeners del DOM.
- **Universal**: Compatible con React, Vue, Svelte o Vanilla JS.

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

## ⚡ Inicio Rápido

```javascript
import Psyche from 'psyche-signals';

// 1. Inicializar el motor
const engine = new Psyche({
  interval: 100, // Ciclo de análisis en ms
  historySize: 20 // Puntos de rastreo para el cálculo vectorial
});

// 2. Escuchar cambios de estado emocional
engine.on('stateChange', (state) => {
  console.log(`Estado detectado: ${state}`);
});

// 3. Obtener métricas, predicciones, clicks y selecciones
engine.on('metrics', (data) => {
  // Predicción
  if (data.predictedElement?.interactive) {
     console.log(`Destino probable: ${data.predictedElement.id}`);
  }
  
  // Selección de texto
  if (data.currentSelection) {
    console.log(`Texto seleccionado (${data.currentSelection.length} chars): "${data.currentSelection.text}"`);
  }
});
```

---

## 🧠 Conceptos Core

### Métricas Cinemáticas
1.  **Velocidad**: Qué tan rápido se mueve el usuario. Alta velocidad + Baja entropía indica **Intención Clara**.
2.  **Entropía Angular**: Mide el "ruido" o la indecisión en la trayectoria. Una entropía alta sugiere que el usuario está buscando o comparando, no navegando linealmente.
3.  **Jerk (Sacudida)**: La tasa de cambio de la aceleración. Valores altos suelen correlacionarse con **Frustración** o problemas de accesibilidad.

### Estados de Usuario
| Estado | Condición Disparadora | Implicación UX |
|-------|-------------------|----------------|
| `URGENTE` | Alta Velocidad, Baja Entropía | El usuario sabe lo que quiere. Eliminar fricción y animaciones lentas. |
| `INDECISO` | Alta Entropía | El usuario está perdido. Ofrecer ayuda proactiva o tooltips. |
| `EXPLORADOR` | Velocidad Media | Navegación de ocio. Habilitar efectos ricos y storytelling. |
| `CALMADO` | Baja Actividad | Lectura pasiva o usuario distraído. |

---

## 📚 Referencia API

### `new Psyche(config)`
Constructor principal.
- `config.interval` (number): Milisegundos entre ciclos de análisis (Default: 100).
- `config.historySize` (number): Cantidad de vectores previos a mantener en memoria (Default: 20).

### Métodos
- `.on(event, callback)`: Suscribirse a eventos.
  - Eventos soportados: `'metrics'`, `'stateChange'`.
- `.getMetrics()`: Retorna el objeto de métricas actual sincrónicamente.
- `.getState()`: Retorna el string del estado actual.
- `.destroy()`: Limpia listeners y timers. Útil para SPAs al desmontar componentes.

---

## 💡 Casos de Uso

1. **Optimización de Conversión (CRO)**: Detectar movimientos rápidos hacia la barra de navegación (Intención de Salida) basándose en vectores.
2. **Análisis de Lectura**: Usar `metrics.currentSelection` para entender qué párrafos encuentran más interesantes los usuarios.
3. **Prefetching Inteligente**: Usar `predictedElement` para cargar datos de la siguiente página 150ms antes de que el usuario haga clic.

---

## 📄 Licencia

MIT © Walter Sandoval
