import React, { useState } from 'react';
import CodeBlock from './CodeBlock';
import { Sliders, ToggleLeft, ToggleRight, Box, Zap, Trash2, Activity, Play, Code2 } from 'lucide-react';

const ApiReference: React.FC = () => {
  const [config, setConfig] = useState({
    interval: 100,
    historySize: 20,
    useAI: true,
    privacyMode: false,
    debug: false
  });

  const generateCode = () => {
    return `import { Psyche } from 'psyche-signals';

const engine = new Psyche({
  interval: ${config.interval}, // Loop de análisis en ms
  historySize: ${config.historySize}, // Puntos de rastreo guardados
  useAI: ${config.useAI}, // Aprendizaje adaptativo
  privacyMode: ${config.privacyMode}, // Anonimización GDPR
  debug: ${config.debug},
  // Selectores críticos de negocio
  significantSelectors: ['.buy-button', '#signup', '.cta']
});`;
  };

  const methods = [
    {
      name: '.on(event, callback)',
      desc: 'Suscribe una función a eventos del motor (metrics, stateChange, intention).',
      args: "('metrics' | 'stateChange', fn)",
      returns: 'void',
      icon: Zap
    },
    {
      name: '.getMetrics()',
      desc: 'Obtiene síncronamente la última instantánea de telemetría y variables cinemáticas.',
      args: 'void',
      returns: 'PsycheMetrics',
      icon: Activity
    },
    {
      name: '.destroy()',
      desc: 'Detiene el loop de análisis, limpia listeners y libera memoria.',
      args: 'void',
      returns: 'void',
      icon: Trash2
    },
    {
      name: '.getState()',
      desc: 'Devuelve el perfil cognitivo actual del usuario (URGENTE, INDECISO, etc).',
      args: 'void',
      returns: 'UserState',
      icon: Play
    }
  ];

  return (
    <section id="constructor" className="py-24 px-8 md:px-20 border-b border-slate-800/40 scroll-mt-24 relative overflow-hidden bg-slate-950">
      
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex items-center gap-3 mb-12">
           <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400 border border-indigo-500/20">
              <Box className="w-6 h-6" />
           </div>
           <div>
              <h3 className="text-3xl font-black text-white tracking-tight">API & <span className="text-indigo-400">Configuración</span></h3>
              <p className="text-slate-400 text-sm mt-1">Generador interactivo de instancias y referencia de métodos.</p>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Config Generator */}
          <div className="space-y-8">
            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 backdrop-blur-sm relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
               
               <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-2 relative z-10">
                  <Sliders className="w-4 h-4" /> Config Builder
               </h4>
               
               <div className="space-y-8 relative z-10">
                  {/* Slider: Interval */}
                  <div>
                    <div className="flex justify-between mb-3 text-xs font-mono font-bold">
                       <span className="text-slate-500 uppercase">interval (ms)</span>
                       <span className="text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">{config.interval}ms</span>
                    </div>
                    <input 
                      type="range" min="10" max="500" step="10" 
                      value={config.interval}
                      onChange={(e) => setConfig({...config, interval: parseInt(e.target.value)})}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400"
                    />
                  </div>

                  {/* Slider: History */}
                  <div>
                    <div className="flex justify-between mb-3 text-xs font-mono font-bold">
                       <span className="text-slate-500 uppercase">historySize</span>
                       <span className="text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">{config.historySize} pts</span>
                    </div>
                    <input 
                      type="range" min="5" max="100" step="5" 
                      value={config.historySize}
                      onChange={(e) => setConfig({...config, historySize: parseInt(e.target.value)})}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400"
                    />
                  </div>

                  {/* Toggles */}
                  <div className="grid grid-cols-2 gap-4 pt-4">
                     <button 
                       onClick={() => setConfig({...config, useAI: !config.useAI})}
                       className={`p-4 rounded-2xl border flex flex-col justify-between h-24 transition-all duration-300 ${config.useAI ? 'bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 'bg-slate-800/50 border-slate-700 hover:bg-slate-800'}`}
                     >
                        <span className={`text-[10px] font-black uppercase tracking-widest ${config.useAI ? 'text-emerald-400' : 'text-slate-500'}`}>Micro-AI</span>
                        <div className="flex justify-between items-end">
                            <span className="text-xs text-slate-400">{config.useAI ? 'Enabled' : 'Disabled'}</span>
                            {config.useAI ? <ToggleRight className="w-6 h-6 text-emerald-500" /> : <ToggleLeft className="w-6 h-6 text-slate-600" />}
                        </div>
                     </button>
                     
                     <button 
                       onClick={() => setConfig({...config, privacyMode: !config.privacyMode})}
                       className={`p-4 rounded-2xl border flex flex-col justify-between h-24 transition-all duration-300 ${config.privacyMode ? 'bg-indigo-500/10 border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.1)]' : 'bg-slate-800/50 border-slate-700 hover:bg-slate-800'}`}
                     >
                        <span className={`text-[10px] font-black uppercase tracking-widest ${config.privacyMode ? 'text-indigo-400' : 'text-slate-500'}`}>Privacy Mode</span>
                        <div className="flex justify-between items-end">
                             <span className="text-xs text-slate-400">{config.privacyMode ? 'Active' : 'Off'}</span>
                             {config.privacyMode ? <ToggleRight className="w-6 h-6 text-indigo-500" /> : <ToggleLeft className="w-6 h-6 text-slate-600" />}
                        </div>
                     </button>
                  </div>
               </div>
            </div>

            <CodeBlock 
               code={generateCode()} 
               className="bg-black/40 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-xl"
               textClassName="text-xs md:text-sm text-indigo-100 leading-relaxed"
            />
          </div>

          {/* Methods Grid */}
          <div id="metodos" className="space-y-8">
             <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Code2 className="w-4 h-4" /> Métodos Públicos
                </h4>
                
                <div className="grid gap-4">
                    {methods.map((m, i) => (
                    <div key={i} className="group p-5 rounded-2xl bg-slate-900/30 border border-slate-800 hover:border-indigo-500/30 hover:bg-slate-900/60 transition-all duration-300 cursor-default">
                        <div className="flex items-center gap-4 mb-3">
                            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/20 transition-all duration-300">
                                <m.icon className="w-4 h-4" />
                            </div>
                            <code className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors font-mono">{m.name}</code>
                        </div>
                        <p className="text-xs text-slate-500 mb-4 pl-[52px] leading-relaxed group-hover:text-slate-400 transition-colors">{m.desc}</p>
                        <div className="pl-[52px] flex flex-wrap gap-3 text-[10px] font-mono">
                            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-950 border border-slate-800 text-slate-400">
                                <span className="text-slate-600 font-bold">ARGS</span>
                                <span>{m.args}</span>
                            </div>
                            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-950 border border-slate-800 text-emerald-400">
                                <span className="text-slate-600 font-bold">RETURN</span>
                                <span>{m.returns}</span>
                            </div>
                        </div>
                    </div>
                    ))}
                </div>
             </div>

             {/* Events Tip */}
             <div className="p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5 flex gap-3 items-start">
                <div className="p-1 rounded bg-indigo-500/20 text-indigo-400 mt-0.5"><Zap className="w-3 h-3"/></div>
                <div>
                    <h5 className="text-xs font-bold text-indigo-300 mb-1">Event Loop</h5>
                    <p className="text-[10px] text-indigo-200/60 leading-relaxed">
                        El motor emite eventos `metrics` cada {config.interval}ms (o según configuración). `stateChange` solo se dispara cuando el perfil cognitivo cambia.
                    </p>
                </div>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ApiReference;