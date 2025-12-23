import React from 'react';
import { MousePointer2, GitCommit, Activity, Layers, ArrowUpRight, Zap, Code2, Fingerprint } from 'lucide-react';

const Concepts: React.FC = () => {
  
  const ConceptCard = ({ 
    title, 
    subtitle, 
    description, 
    icon: Icon, 
    color, 
    formula, 
    delay 
  }: any) => (
    <div className={`group relative p-8 rounded-3xl bg-slate-900/40 border border-slate-800 hover:border-${color}-500/30 transition-all duration-500 hover:shadow-[0_0_30px_-10px_rgba(var(--tw-color-${color}-500),0.1)] overflow-hidden flex flex-col h-full`}>
        
        {/* Background Decor (Formula) */}
        <div className="absolute -bottom-4 -right-4 text-[4rem] font-black text-slate-800/20 font-mono pointer-events-none select-none group-hover:text-slate-800/40 transition-colors duration-500 rotate-[-10deg]">
            {formula}
        </div>

        {/* Hover Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br from-${color}-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

        {/* Header */}
        <div className="relative z-10 mb-6 flex justify-between items-start">
            <div className={`p-3 rounded-2xl bg-slate-950 border border-slate-800 text-${color}-400 group-hover:scale-110 transition-transform duration-300 shadow-xl`}>
                <Icon className="w-6 h-6" />
            </div>
            <ArrowUpRight className="w-5 h-5 text-slate-700 group-hover:text-white transition-colors" />
        </div>

        {/* Content */}
        <div className="relative z-10 mt-auto">
            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                {subtitle}
            </h4>
            <h3 className="text-2xl font-bold text-white mb-4 leading-tight">
                {title}
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed group-hover:text-slate-200 transition-colors">
                {description}
            </p>
        </div>

        {/* Tech Spec Reveal */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-slate-700 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </div>
  );

  return (
    <section id="conceptos" className="py-32 px-8 md:px-20 border-b border-slate-800/40 scroll-mt-24 relative overflow-hidden">
        
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                <div className="max-w-2xl">
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
                        Arquitectura <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Cognitiva</span>
                    </h2>
                    <p className="text-lg text-slate-400 leading-relaxed">
                        Psyche Signals no solo "rastrea" el ratón. Construye un modelo matemático en tiempo real del estado mental del usuario basándose en la física del movimiento.
                    </p>
                </div>
                <div className="hidden md:block">
                    <div className="px-4 py-2 rounded-full border border-slate-700 bg-slate-900/50 text-xs font-mono text-slate-400 flex items-center gap-2">
                        <Activity className="w-3 h-3 text-emerald-500" />
                        <span>System Status: <span className="text-emerald-400 font-bold">ONLINE</span></span>
                    </div>
                </div>
            </div>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(300px,auto)]">
                
                {/* Card 1: Vectors (Large) */}
                <div className="md:col-span-2">
                    <ConceptCard 
                        title="Cinemática Vectorial"
                        subtitle="Física de Precisión"
                        description="Psyche ignora las coordenadas estáticas (X,Y). En su lugar, calcula vectores de velocidad y aceleración diferencial (dx/dt) para predecir trayectorias futuras y detectar la intención antes de que ocurra el clic."
                        icon={MousePointer2}
                        color="blue"
                        formula="Δv/Δt"
                    />
                </div>

                {/* Card 2: Entropy */}
                <div className="md:col-span-1">
                    <ConceptCard 
                        title="Entropía Angular"
                        subtitle="Detección de Caos"
                        description="Mide la 'duda' calculando la variabilidad de los ángulos de movimiento. Un movimiento errático indica alta carga cognitiva o confusión."
                        icon={GitCommit}
                        color="pink"
                        formula="Σ|θ1-θ2|"
                    />
                </div>

                {/* Card 3: Adaptive AI */}
                <div className="md:col-span-1">
                    <ConceptCard 
                        title="Micro-AI Adaptativa"
                        subtitle="Calibración Z-Score"
                        description="Cada usuario es único. El sistema aprende la velocidad 'normal' de cada persona y detecta anomalías basándose en desviaciones estándar, no en umbrales fijos."
                        icon={Fingerprint}
                        color="emerald"
                        formula="σ²"
                    />
                </div>

                {/* Card 4: Shadow DOM */}
                <div className="md:col-span-2">
                    <ConceptCard 
                        title="Shadow DOM Piercing"
                        subtitle="Deep Tree Analysis"
                        description="La mayoría de analytics fallan con Web Components. Psyche implementa un algoritmo recursivo que atraviesa Shadow Roots para identificar el verdadero elemento funcional, ignorando wrappers decorativos."
                        icon={Layers}
                        color="purple"
                        formula="root.host"
                    />
                </div>

            </div>

            {/* Technical Footer */}
            <div className="mt-16 pt-8 border-t border-slate-800 flex flex-wrap gap-8 justify-center md:justify-start">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-900 rounded-lg border border-slate-800 text-slate-400"><Zap className="w-4 h-4"/></div>
                    <div>
                        <div className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Sampling Rate</div>
                        <div className="text-xs font-mono text-white">~60hz (16ms)</div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-900 rounded-lg border border-slate-800 text-slate-400"><Code2 className="w-4 h-4"/></div>
                    <div>
                        <div className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Bundle Size</div>
                        <div className="text-xs font-mono text-white">2.8kb (Gzipped)</div>
                    </div>
                </div>
            </div>

        </div>
    </section>
  );
};

export default Concepts;