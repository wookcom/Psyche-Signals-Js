import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import NeuralLab from './components/NeuralLab';
import Concepts from './components/Concepts'; 
import UserStates from './components/UserStates'; 
import ApiReference from './components/ApiReference'; 
import UseCases from './components/UseCases'; // Import new component
import CodeBlock from './components/CodeBlock';
import { Psyche } from './lib/Psyche'; 
import { PsycheMetrics, UserState, MicroIntention, InputType } from './types';
import { ShieldCheck, Layers, Brain, ArrowRight, Github, Activity, Terminal, Globe, Package, CheckCircle2, Box } from 'lucide-react';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('intro');
  const [privacyMode, setPrivacyMode] = useState<boolean>(false);
  const [installTab, setInstallTab] = useState<'npm' | 'pnpm' | 'cdn'>('npm');
  
  // UI State synced with Engine
  const [metrics, setMetrics] = useState<PsycheMetrics>({ 
    inputType: InputType.MOUSE,
    velocity: 0, 
    entropy: 0, 
    jerk: 0,
    scrollSpeed: 0,
    interactionRate: 0,
    selectionActivity: 0,
    pauseDuration: 0,
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
    currentIntention: MicroIntention.NONE,
    focusTime: 0
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
      debug: true, // Enable debug to verify engine is running
      useAI: true, // Enable Neural Learning
      interval: 50, // Faster updates for smoother UI (50ms)
      privacyMode: privacyMode, // Dynamic Privacy Mode
      // Define what counts as "Business Critical" for visualizer
      significantSelectors: ['button', 'a[href]', 'input', '.cta-button', '#signup']
    });

    // Subscribe to Engine Events
    engine.on('metrics', (data: PsycheMetrics) => {
      // Vital: Spread object to ensure React detects a new reference and triggers re-render
      setMetrics({ ...data });
    });

    engine.on('stateChange', (state: UserState) => {
      setUserState(state);
    });

    engineRef.current = engine;

    // Cleanup
    return () => {
      engine.destroy();
    };
  }, [privacyMode]); // Re-run if privacyMode changes

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

  const getInstallCode = () => {
    switch (installTab) {
      case 'npm': return 'npm install psyche-signals';
      case 'pnpm': return 'pnpm add psyche-signals';
      case 'cdn': return '<script src="https://cdn.psychejs.com/v3/core.min.js"></script>';
      default: return '';
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
        <section id="intro" className="relative py-24 border-b border-slate-800/40 scroll-mt-24 px-8 md:px-20 pt-32 pb-40 overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none"></div>

            <div className="max-w-5xl mx-auto relative z-10">
                {/* Version Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-8 shadow-sm hover:border-blue-500/30 transition-colors animate-fade-in-up">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                    v3.5 Stable Release
                </div>

                <h2 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 tracking-tighter leading-[0.95] text-white">
                    Tu interfaz ahora <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                        tiene instinto.
                    </span>
                </h2>
                
                <p className="text-lg md:text-2xl text-slate-400 leading-relaxed max-w-3xl mb-10 font-light">
                    <strong className="text-slate-200 font-semibold">Psyche Signals</strong> convierte el caos del cursor en <strong>inteligencia emocional</strong>. Predice intenciones en Shadow DOM, detecta frustración y adapta la experiencia antes del clic.
                </p>

                {/* Feature Pills */}
                <div className="flex flex-wrap gap-3 mb-12 text-xs font-bold uppercase tracking-wide text-slate-500">
                   <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-emerald-500/30 hover:text-emerald-400 transition-all cursor-default">
                        <ShieldCheck className="w-4 h-4"/> Privacy First
                   </div>
                   <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-purple-500/30 hover:text-purple-400 transition-all cursor-default">
                        <Layers className="w-4 h-4"/> Shadow Tracking
                   </div>
                   <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-pink-500/30 hover:text-pink-400 transition-all cursor-default">
                        <Brain className="w-4 h-4"/> Micro-AI
                   </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-yellow-500/30 hover:text-yellow-400 transition-all cursor-default">
                        <Activity className="w-4 h-4"/> Real-time
                   </div>
                </div>
                
                <div className="flex flex-wrap gap-4 items-center">
                    <button 
                        onClick={() => document.getElementById('instalacion')?.scrollIntoView({behavior: 'smooth'})} 
                        className="group relative px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold transition-all shadow-[0_10px_40px_-10px_rgba(59,130,246,0.5)] hover:shadow-[0_20px_60px_-10px_rgba(59,130,246,0.6)] hover:-translate-y-1 cta-button"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            Comenzar Ahora 
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform"/>
                        </span>
                    </button>
                    
                    <a 
                        href="https://github.com/wookcom/Psyche-Signals-Js" 
                        target="_blank" 
                        rel="noreferrer" 
                        className="px-8 py-4 bg-transparent hover:bg-slate-900/50 text-slate-300 hover:text-white rounded-2xl font-bold transition-all border border-slate-800 hover:border-slate-600 flex items-center gap-2 group"
                    >
                        <Github className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity"/> 
                        <span>GitHub</span>
                    </a>
                    
                    <div className="ml-4 text-xs font-mono text-slate-600 hidden md:block select-all cursor-pointer hover:text-slate-400 transition-colors">
                        npm install psyche-signals
                    </div>
                </div>
            </div>
        </section>

        {/* Installation */}
        <section id="instalacion" className="py-24 border-b border-slate-800/40 scroll-mt-24 px-8 md:px-20 bg-slate-900/20">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
             
             {/* Left Column: Benefits */}
             <div className="space-y-8">
                <div>
                   <h3 className="text-4xl font-black text-white mb-4">Instalación <span className="text-blue-500">Instantánea</span></h3>
                   <p className="text-lg text-slate-400 leading-relaxed">
                     Integra el Adaptive Statistical Engine en tu proyecto en menos de 30 segundos. Compatible con cualquier framework moderno o vanilla JS.
                   </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 mt-1"><CheckCircle2 className="w-5 h-5" /></div>
                    <div>
                      <h4 className="font-bold text-white">Ultra Ligero (&lt; 3kb)</h4>
                      <p className="text-sm text-slate-500">Cero dependencias externas. No afecta al rendimiento del main thread.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 mt-1"><Box className="w-5 h-5" /></div>
                    <div>
                      <h4 className="font-bold text-white">TypeScript Ready</h4>
                      <p className="text-sm text-slate-500">Tipos completos incluidos out-of-the-box para una DX superior.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 mt-1"><Layers className="w-5 h-5" /></div>
                    <div>
                      <h4 className="font-bold text-white">Agnóstico</h4>
                      <p className="text-sm text-slate-500">React, Vue, Svelte, Angular o HTML plano. Funciona donde sea.</p>
                    </div>
                  </div>
                </div>
             </div>

             {/* Right Column: Interactive Code Card */}
             <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000"></div>
                
                <div className="relative bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                   {/* Tabs Header */}
                   <div className="flex items-center border-b border-slate-800 bg-slate-900/50">
                      <button 
                        onClick={() => setInstallTab('npm')}
                        className={`px-6 py-4 text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2 border-r border-slate-800 ${installTab === 'npm' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'}`}
                      >
                         <Terminal className="w-4 h-4"/> NPM
                      </button>
                      <button 
                        onClick={() => setInstallTab('pnpm')}
                        className={`px-6 py-4 text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2 border-r border-slate-800 ${installTab === 'pnpm' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'}`}
                      >
                         <Package className="w-4 h-4"/> PNPM
                      </button>
                      <button 
                        onClick={() => setInstallTab('cdn')}
                        className={`px-6 py-4 text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2 ${installTab === 'cdn' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'}`}
                      >
                         <Globe className="w-4 h-4"/> CDN
                      </button>
                   </div>

                   {/* Code Body */}
                   <div className="p-8 bg-slate-950 min-h-[140px] flex items-center">
                      <CodeBlock 
                        code={getInstallCode()}
                        className="w-full"
                        textClassName={installTab === 'cdn' ? 'text-purple-300' : 'text-blue-300'}
                      />
                   </div>

                   {/* Config Footer / Live Preview */}
                   <div className="bg-slate-900/50 p-4 border-t border-slate-800 flex flex-col sm:flex-row gap-4 justify-between items-center">
                      <div className="flex items-center gap-3">
                         <div className={`p-1.5 rounded-full ${privacyMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                            <ShieldCheck className="w-4 h-4" />
                         </div>
                         <div className="text-left">
                            <p className="text-xs font-bold text-white uppercase tracking-wider">Configuración en Vivo</p>
                            <p className="text-[10px] text-slate-500">Prueba cómo cambia la librería al activar opciones</p>
                         </div>
                      </div>

                      <button
                        onClick={() => setPrivacyMode(!privacyMode)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${privacyMode ? 'bg-emerald-500' : 'bg-slate-700'}`}
                      >
                        <span className="sr-only">Activar Modo Privacidad</span>
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${privacyMode ? 'translate-x-6' : 'translate-x-1'}`}
                        />
                      </button>
                   </div>
                </div>
             </div>

          </div>
        </section>

        {/* Neural Lab */}
        <NeuralLab metrics={metrics} currentState={userState} />

        {/* Concepts */}
        <Concepts />

        {/* User States */}
        <UserStates currentState={userState} />

        {/* Constructor & API */}
        <ApiReference />

        {/* Examples - Replaced with Component */}
        <UseCases />

        {/* Footer */}
        <footer className="p-12 border-t border-slate-800 text-center text-[10px] text-slate-600 uppercase tracking-widest font-bold">
          Psyche Signals Open Source Project • 2024 • Estabilidad Cuántica v3.0
        </footer>

      </main>
    </div>
  );
};

export default App;