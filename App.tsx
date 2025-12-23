import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import NeuralLab from './components/NeuralLab';
import CodeBlock from './components/CodeBlock';
import { Psyche } from './lib/Psyche'; // Import the Core Engine
import { PsycheMetrics, UserState } from './types';
import { Zap, Shuffle, Compass } from 'lucide-react';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('intro');
  
  // UI State synced with Engine
  const [metrics, setMetrics] = useState<PsycheMetrics>({ 
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
  });
  const [userState, setUserState] = useState<UserState>(UserState.STANDBY);
  
  const mainRef = useRef<HTMLElement>(null); 
  const engineRef = useRef<Psyche | null>(null);

  // --- Initialize Engine ---
  useEffect(() => {
    // We initialize the engine only once when the component mounts
    // We pass the mainRef as the scrolling element because in this layout, 'main' scrolls, not 'window'
    const engine = new Psyche({
      scrollElement: mainRef.current || window,
      debug: false
    });

    // Subscribe to Engine Events
    engine.on('metrics', (data: PsycheMetrics) => {
      setMetrics(data);
    });

    engine.on('stateChange', (state: UserState) => {
      setUserState(state);
    });

    engineRef.current = engine;

    // Cleanup
    return () => {
      engine.destroy();
    };
  }, []);

  // --- UI-Specific Logic (Scroll Spy) ---
  // This remains in UI layer because it's about highlighting menu items, 
  // not calculating user behavior metrics.
  const handleScrollSpy = () => {
    if (!mainRef.current) return;
    
    const sections = ['intro', 'instalacion', 'lab', 'conceptos', 'estados', 'constructor', 'metodos', 'ejemplos'];
    const scrollPos = mainRef.current.scrollTop;
    
    for (const sectionId of sections) {
      const element = document.getElementById(sectionId);
      if (element) {
        const offsetTop = element.offsetTop;
        if (scrollPos >= offsetTop - 150) {
          setActiveSection(sectionId);
        }
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30 selection:text-blue-200">
      
      <Sidebar 
        activeSection={activeSection} 
        metrics={metrics} 
        currentState={userState} 
      />

      <main 
        ref={mainRef}
        onScroll={handleScrollSpy}
        className="flex-1 overflow-y-auto relative bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.05)_0%,transparent_50%)]"
      >
        
        {/* Intro */}
        <section id="intro" className="py-20 border-b border-slate-800/40 scroll-mt-24 px-8 md:px-20 pt-24 pb-32">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-6xl md:text-7xl font-black mb-8 tracking-tighter leading-[0.9] text-white">
              Señales reales <br/><span className="text-blue-500">UX adaptativo.</span>
            </h2>
            <p className="text-xl text-slate-400 leading-relaxed max-w-2xl">
              <strong className="text-slate-200">Psyche Signals</strong> es la biblioteca de computación afectiva que permite a tu web entender la intención del usuario. Analiza señales de comportamiento en tiempo real, <strong>scroll y ritmo de escritura</strong> para adaptar la UX instantáneamente.
            </p>
            
            <div className="flex flex-wrap gap-4 mt-10">
              <button onClick={() => document.getElementById('instalacion')?.scrollIntoView({behavior: 'smooth'})} className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold transition-all shadow-xl shadow-blue-500/20">
                Comenzar Ahora
              </button>
              <a href="https://github.com/psychejs/core" target="_blank" rel="noreferrer" className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-bold transition-all border border-slate-700">
                Ver en GitHub
              </a>
            </div>
          </div>
        </section>

        {/* Installation */}
        <section id="instalacion" className="py-20 border-b border-slate-800/40 scroll-mt-24 px-8 md:px-20">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold mb-6 text-white">Instalación</h3>
            <p className="text-slate-400 mb-8">Comienza a monitorizar señales de comportamiento en segundos.</p>
            
            <div className="space-y-6">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase mb-3">Administrador de Paquetes</p>
                <CodeBlock 
                  code="npm install psyche-signals"
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl"
                  textClassName="text-blue-300"
                />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase mb-3">Uso vía CDN</p>
                <CodeBlock 
                  code={'<script src="https://cdn.psychejs.com/v3/core.min.js"></script>'}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl"
                  textClassName="text-purple-300"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Neural Lab */}
        <NeuralLab metrics={metrics} currentState={userState} />

        {/* Concepts */}
        <section id="conceptos" className="py-20 border-b border-slate-800/40 scroll-mt-24 px-8 md:px-20">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold mb-10 text-white">Conceptos Core</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-colors">
                <h4 className="text-xl font-bold mb-4 text-blue-400">Cinemática de Intento</h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Psyche no usa la posición estática del cursor. Usa <strong>vectores</strong>. Calcula la trayectoria y predice qué elemento del DOM es el objetivo probable del usuario milisegundos antes del impacto físico.
                </p>
              </div>
              <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-colors">
                <h4 className="text-xl font-bold mb-4 text-pink-400">Entropía Angular</h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Mide la "caoticidad" del movimiento. Una trayectoria errática es un indicador matemático directo de <strong>indecisión cognitiva</strong> o búsqueda visual infructuosa.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* States */}
        <section id="estados" className="py-20 border-b border-slate-800/40 scroll-mt-24 px-8 md:px-20">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold mb-10 text-white">Perfiles de Usuario</h3>
            <div className="space-y-4">
              {/* Urgent */}
              <div className="flex gap-6 p-6 rounded-2xl bg-slate-900/40 border border-slate-800 items-center">
                <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 shrink-0">
                  <Zap className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h5 className="font-bold text-white mb-1 flex items-center gap-2">
                    URGENTE 
                    <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded border border-red-500/20 uppercase tracking-widest">Estado 1</span>
                  </h5>
                  <p className="text-xs text-slate-500">Alta velocidad, baja entropía. El usuario tiene un objetivo claro.</p>
                </div>
              </div>
              {/* Undecided */}
              <div className="flex gap-6 p-6 rounded-2xl bg-slate-900/40 border border-slate-800 items-center">
                <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-500 shrink-0">
                  <Shuffle className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h5 className="font-bold text-white mb-1 flex items-center gap-2">
                    INDECISO 
                    <span className="text-[10px] bg-pink-500/20 text-pink-400 px-2 py-0.5 rounded border border-pink-500/20 uppercase tracking-widest">Estado 2</span>
                  </h5>
                  <p className="text-xs text-slate-500">Baja velocidad, alta entropía. El usuario necesita ayuda.</p>
                </div>
              </div>
              {/* Exploring */}
              <div className="flex gap-6 p-6 rounded-2xl bg-slate-900/40 border border-slate-800 items-center">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                  <Compass className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h5 className="font-bold text-white mb-1 flex items-center gap-2">
                    EXPLORADOR 
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 uppercase tracking-widest">Estado 3</span>
                  </h5>
                  <p className="text-xs text-slate-500">Velocidad media, fluidez alta. Navegación de disfrute.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Constructor & API */}
        <section id="constructor" className="py-20 border-b border-slate-800/40 scroll-mt-24 px-8 md:px-20">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold mb-8 text-white">API Reference</h3>
            
            <h4 className="text-xl font-bold mb-4 text-blue-400">new Psyche()</h4>
            <p className="text-slate-400 mb-6">Inicializa el motor global de análisis.</p>
            <CodeBlock 
              code={`import { Psyche } from 'psyche-signals';

const engine = new Psyche({
  interval: 100,       // Ciclo de análisis en ms
  historySize: 20,     // Puntos de rastreo a mantener
  scrollElement: window, // Elemento a monitorear (window o div)
  debug: false         
});

// Suscribirse a métricas en tiempo real (60fps)
engine.on('metrics', (data) => {
  console.log(data.velocity, data.interactionRate);
});

// Suscribirse a cambios de estado cognitivo
engine.on('stateChange', (state) => {
  if (state === 'FRUSTRADO') showHelpModal();
});`}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl mb-12"
              textClassName="text-sm leading-relaxed text-slate-300"
            />
            
            <div id="metodos">
              <h4 className="text-xl font-bold mt-12 mb-6 text-white">Métodos Públicos</h4>
              <div className="w-full overflow-hidden rounded-xl border border-slate-800">
                <table className="w-full text-left border-collapse bg-slate-900/30">
                  <thead>
                    <tr>
                      <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800">Método</th>
                      <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800">Descripción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    <tr>
                      <td className="py-4 px-6 text-sm text-blue-400 font-mono">.on(event, callback)</td>
                      <td className="py-4 px-6 text-sm text-slate-400">Escucha eventos: <code className="text-xs bg-slate-800 px-1 rounded">metrics</code> o <code className="text-xs bg-slate-800 px-1 rounded">stateChange</code>.</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6 text-sm text-blue-400 font-mono">.getMetrics()</td>
                      <td className="py-4 px-6 text-sm text-slate-400">Retorna síncronamente el estado actual de todas las variables.</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6 text-sm text-blue-400 font-mono">.destroy()</td>
                      <td className="py-4 px-6 text-sm text-slate-400">Limpia todos los listeners y detiene el loop de análisis.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Examples */}
        <section id="ejemplos" className="py-20 px-8 md:px-20 pb-40">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold mb-10 text-white">Casos de Uso</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Ex 1 */}
              <div className="p-8 rounded-[2rem] bg-slate-900 border border-slate-800 space-y-6">
                <div className="text-blue-500 font-black text-xs uppercase tracking-widest">E-commerce</div>
                <h5 className="text-xl font-bold text-white">Optimización de Abandono</h5>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Detecta movimiento rápido hacia la salida y estrés en el movimiento.
                </p>
                <CodeBlock 
                  code="psyche.on('stateChange', (s) => {
  if (s === 'URGENTE') showExitIntent();
});"
                  className="bg-black/30 p-4 rounded-xl border border-white/5"
                  textClassName="text-[10px] text-blue-200"
                />
              </div>

              {/* Ex 2 */}
              <div className="p-8 rounded-[2rem] bg-slate-900 border border-slate-800 space-y-6">
                <div className="text-pink-500 font-black text-xs uppercase tracking-widest">SaaS</div>
                <h5 className="text-xl font-bold text-white">Detección de Ira (Rage Clicks)</h5>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Si el usuario hace muchos clics o teclea furiosamente (alto jerk), ofrece soporte inmediato.
                </p>
                <CodeBlock 
                  code="psyche.on('stateChange', (s) => {
  if (s === 'FRUSTRADO') openChatSupport();
});"
                  className="bg-black/30 p-4 rounded-xl border border-white/5"
                  textClassName="text-[10px] text-pink-200"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="p-12 border-t border-slate-800 text-center text-[10px] text-slate-600 uppercase tracking-widest font-bold">
          Psyche Signals Open Source Project • 2024 • Estabilidad Cuántica v3.0
        </footer>

      </main>
    </div>
  );
};

export default App;