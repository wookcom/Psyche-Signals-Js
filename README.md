# Psyche Signals 🧠 v3.5

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Size](https://img.shields.io/badge/size-2.8kb-emerald.svg)
![Coverage](https://img.shields.io/badge/coverage-100%25-purple.svg)
![Types](https://img.shields.io/badge/types-TypeScript-blue.svg)

> **Tu interfaz ahora tiene instinto.**

**Psyche Signals** es una biblioteca de computación afectiva ultra-ligera que convierte el caos del cursor y los gestos táctiles en **inteligencia emocional**. Analiza la física del movimiento (velocidad, entropía, jerk) para predecir intenciones, detectar frustración y adaptar la UX en tiempo real.

---

## ⚡ Características Principales

*   **🕵️ Shadow Tracking (Nuevo en v3.5)**: Atraviesa el Shadow DOM para identificar elementos reales dentro de Web Components, ignorando wrappers decorativos (`div`, `span`).
*   **🧠 Micro-AI Adaptativa**: Aprende el comportamiento base de cada usuario (calibración Z-Score) para detectar anomalías personalizadas en lugar de usar umbrales fijos.
*   **📱 Touch & Rage Taps**: Detecta "golpes de frustración" en móviles y presión táctil (si el hardware lo soporta).
*   **🛡️ Privacy-First**: Modo de anonimización local que cumple con GDPR/CCPA (redacta textos e IDs, oculta coordenadas exactas).
*   **🔮 Micro-Intenciones**: Predicción vectorial de **Exit Intent** (abandono) y **Hesitation** (duda/confusión).

---

## 📦 Instalación

### NPM / Yarn / PNPM

```bash
npm install psyche-signals
# o
pnpm add psyche-signals
```

### CDN (Navegador)

```html
<script src="https://unpkg.com/psyche-signals/dist/psyche.umd.js"></script>
```

---

## 🚀 Uso Rápido

Inicializa el motor y empieza a escuchar la "mente" del usuario.

```javascript
import { Psyche } from 'psyche-signals';

// 1. Configuración
const engine = new Psyche({
  useAI: true,
  debug: true,
  significantSelectors: ['.buy-btn', '#signup', '[role="button"]']
});

// 2. Escuchar cambios de estado emocional
engine.on('stateChange', (state) => {
  console.log(`Estado del usuario: ${state}`);
  
  if (state === 'FRUSTRADO') {
    openHelpChat(); // El usuario está golpeando o moviendo el mouse con ira
  }
  
  if (state === 'INDECISO') {
    showTooltip(); // El usuario duda sobre un elemento
  }
});

// 3. Escuchar micro-intenciones específicas
engine.on('intention', (intent) => {
  if (intent === 'EXIT_INTENT') {
    showDiscountModal(); // El usuario va a cerrar la pestaña
  }
});
```

---

## ⚙️ Configuración

| Opción | Tipo | Default | Descripción |
| :--- | :--- | :--- | :--- |
| `interval` | `number` | `100` | Frecuencia de análisis en milisegundos. |
| `historySize` | `number` | `20` | Cantidad de puntos de rastreo a mantener en memoria. |
| `useAI` | `boolean` | `true` | Activa la calibración estadística automática por usuario. |
| `privacyMode` | `boolean` | `false` | Si es `true`, redacta textos, IDs y coordenadas (GDPR safe). |
| `significantSelectors` | `string[]` | `['button', 'a']` | Selectores CSS críticos para tu negocio. Ayuda al motor a filtrar ruido. |
| `learningSamples` | `number` | `30` | Cuantos ciclos (ticks) necesita la AI para calibrarse. |
| `scrollElement` | `HTMLElement` | `window` | Elemento donde escuchar eventos de scroll. |

---

## 📡 API de Eventos

### `.on('metrics', callback)`
Se dispara en cada ciclo de análisis (tick). Devuelve el objeto de telemetría completo.

```typescript
engine.on('metrics', (data) => {
  console.log(data.velocity);      // px/ms
  console.log(data.entropy);       // 0-1 (Nivel de caos)
  console.log(data.currentElement);// Elemento bajo el cursor (Smart parsing)
});
```

### `.on('stateChange', callback)`
Se dispara solo cuando el usuario cambia de perfil cognitivo.

| Estado | Significado | Disparador Típico |
| :--- | :--- | :--- |
| `CALMADO` | Lectura o inactividad. | Baja velocidad, scroll constante. |
| `EXPLORANDO` | Navegación estándar. | Velocidad media, entropía baja. |
| `URGENTE` | Objetivo claro. | Alta velocidad, trayectoria recta. |
| `INDECISO` | Confusión o búsqueda. | Alta entropía (movimiento errático). |
| `FRUSTRADO` | Ira o error de UI. | Rage Taps, High Jerk (sacudidas). |

### `.on('intention', callback)`
Detecta acciones futuras inmediatas.

*   `EXIT_INTENT`: El usuario mueve el mouse rápido hacia la barra del navegador.
*   `HESITATION`: El usuario mantiene el foco en un elemento interactivo mucho tiempo sin hacer clic.

---

## 🛡️ Estructura de Datos (TypeScript)

El motor devuelve objetos tipados para facilitar la integración:

```typescript
interface PsycheElement {
  tag: string;           // 'button', 'input', etc.
  id?: string;           // Redactado si privacyMode = true
  className?: string;    // Primera clase encontrada
  interactive: boolean;  // ¿Es clicable?
  isInShadow: boolean;   // ¿Está dentro de un Web Component?
  isSignificant: boolean;// ¿Coincide con tus selectores de negocio?
}
```

---

## 🤝 Contribución

¡Los PRs son bienvenidos! Este proyecto busca democratizar la computación afectiva en la web.

1.  Fork el repositorio.
2.  Crea una rama (`git checkout -b feature/AmazingFeature`).
3.  Commit tus cambios (`git commit -m 'Add some AmazingFeature'`).
4.  Push a la rama (`git push origin feature/AmazingFeature`).
5.  Abre un Pull Request.

---

## 📄 Licencia

Distribuido bajo la licencia **MIT**. Ver `LICENSE` para más información.

Creado por **Walter Sandoval** - [GitHub](https://github.com/waltersandoval)
