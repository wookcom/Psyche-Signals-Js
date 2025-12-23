import React from 'react';
import { PsycheMetrics, UserState, PsycheElement, MicroIntention, InputType } from '../types';
import { TestTube, Activity, Target, MapPin, TextCursor, Brain, LogOut, HelpCircle, MousePointer2, Fingerprint, ShieldCheck, Lock, Star, Layers, Zap, MoreHorizontal, ScanLine } from 'lucide-react';

interface NeuralLabProps {
  metrics: PsycheMetrics;
  currentState: UserState;
}

const NeuralLab: React.FC<NeuralLabProps> = ({ metrics, currentState }) => {
  // --- Visualization Helpers ---
  const getPercent = (val: number, max: number) => Math.min((val / max) * 100, 100);
  
  const velPercent = getPercent(metrics.velocity, 2.5);
  const entropyPercent = getPercent(metrics.entropy, 1.5); // Entropy usually 0-1 range, >1 is chaotic
  const jerkPercent = getPercent(metrics.jerk, 1.0);
  const scrollPercent = getPercent(metrics.scrollSpeed, 2.0); 

  // Privacy Detection (Inferred from metrics sentinel values)
  const isPrivacyActive = metrics.lastClick?.x === -1;

  // --- Components ---

  const StatBar = ({ label, value, percent, color, icon: Icon }: any) => (
    <div className="group relative">
      <div className="flex justify-between items-end mb-1.5">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
            {Icon && <Icon className="w-3 h-3 opacity-70" />}
            {label}
        </span>
        <span className={`font-mono text-[10px] ${color}`}>{value}</span>
      </div>
      <div className="h-1.5 w-full bg-slate-800 rounded-sm overflow-hidden border border-white/5">
        <div 
            className={`h-full transition-all duration-300 ease-out ${color.replace('text-', 'bg-')}`} 
            style={{ width: `${percent}%` }}
        ></div>
      </div>
    </div>
  );

  const ElementCard = ({ title, el, colorClass, icon: Icon }: { title: string, el: PsycheElement | null, colorClass: string, icon: any }) => {
     const hasEl = !!el;
     const isShadow = el?.isInShadow;
     const isVital = el?.isSignificant;
     const isRedacted = el?.id === 'REDACTED';

     return (
        <div className={`relative p-4 rounded-xl border transition-all duration-300 ${hasEl ? `bg-slate-900/80 border-${colorClass}-500/30` : 'bg-slate-900/40 border-slate-800/50'}`}>
            {/* Header */}
            <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                    <Icon className={`w-3 h-3 ${hasEl ? `text-${colorClass}-400` : 'text-slate-600'}`} />
                    {title}
                </span>
                {isVital && (
                    <span className="flex items-center gap-1 px-1.5 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded text-[9px] font-bold text-amber-400 uppercase">
                        <Star className="w-2 h-2 fill-amber-400" /> Vital
                    </span>
                )}
                {isShadow && (
                    <span className="flex items-center gap-1 px-1.5 py-0.5 bg-purple-500/10 border border-purple-500/20 rounded text-[9px] font-bold text-purple-400 uppercase ml-auto">
                        <Layers className="w-2 h-2" /> Shadow
                    </span>
                )}
            </div>

            {/* Content */}
            {hasEl ? (
                <div className="font-mono text-xs space-y-1">
                    <div className={`font-bold flex items-center gap-2 ${isVital ? 'text-amber-300' : 'text-slate-200'}`}>
                        <span className="opacity-50">&lt;</span>
                        {el.tag.toUpperCase()}
                        <span className="opacity-50">&gt;</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 text-[10px]">
                        {el.id && (
                            <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                                {isRedacted ? <span className="flex items-center gap-1"><Lock className="w-2 h-2"/> ID</span> : `#${el.id}`}
                            </span>
                        )}
                        {el.className && (
                            <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                                {isRedacted ? <span className="flex items-center gap-1"><Lock className="w-2 h-2"/> CLASS</span> : `.${el.className}`}
                            </span>
                        )}
                    </div>
                </div>
            ) : (
                <div className="h-10 flex items-center justify-center">
                    <span className="text-[10px] text-slate-700 italic flex items-center gap-2">
                        <MoreHorizontal className="w-4 h-4 opacity-50" />
                        Esperando señal...
                    </span>
                </div>
            )}
        </div>
     );
  };

  // State Logic for "The Brain" Badge
  let stateColor = "text-slate-400 border-slate-700 bg-slate-800";
  let statePulse = "";
  
  if (currentState === UserState.URGENT) { stateColor = "text-orange-400 border-orange-500/50 bg-orange-900/20"; statePulse = "animate-pulse"; }
  if (currentState === UserState.FRUSTRATED) { stateColor = "text-red-400 border-red-500/50 bg-red-900/20"; statePulse = "animate-ping"; }
  if (currentState === UserState.UNDECIDED) { stateColor = "text-pink-400 border-pink-500/50 bg-pink-900/20"; }
  if (currentState === UserState.EXPLORING) { stateColor = "text-blue-400 border-blue-500/50 bg-blue-900/20"; }

  return (
    <section id="lab" className="py-20 px-8 md:px-20 scroll-mt-24 border-b border-slate-800/40 relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
                        <TestTube className="w-6 h-6" />
                    </div>
                    <h3 className="text-3xl font-black text-white tracking-tight">Laboratorio <span className="text-blue-500">Neural</span></h3>
                </div>
                <p className="text-slate-400 text-sm max-w-lg">
                    Visualiza en tiempo real cómo el motor <span className="font-mono text-xs text-blue-400 bg-blue-500/10 px-1 py-0.5 rounded">v3.5</span> procesa, anonimiza y predice tus intenciones.
                </p>
            </div>

            {/* Global Status Badge */}
            <div className={`flex items-center gap-4 px-6 py-3 rounded-2xl border backdrop-blur-md transition-all duration-500 ${stateColor}`}>
                 <div className="relative">
                    <Brain className="w-6 h-6 relative z-10" />
                    <div className={`absolute inset-0 bg-current blur-lg opacity-40 ${statePulse}`}></div>
                 </div>
                 <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">Estado Cognitivo</span>
                    <span className="text-lg font-black tracking-tight">{currentState}</span>
                 </div>
            </div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Col: Kinematics (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
                <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><Activity className="w-24 h-24 text-white" /></div>
                    
                    <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <Activity className="w-4 h-4" /> Telemetría Cinemática
                    </h4>

                    <div className="space-y-6 relative z-10">
                        <StatBar 
                            label={metrics.inputType === InputType.TOUCH ? "Velocidad Dedo" : "Velocidad Cursor"} 
                            value={`${metrics.velocity.toFixed(2)} px/ms`} 
                            percent={velPercent} 
                            color="text-blue-400"
                            icon={metrics.inputType === InputType.TOUCH ? Fingerprint : MousePointer2}
                        />
                        <StatBar 
                            label="Entropía (Confusión)" 
                            value={`${Math.round(entropyPercent)}%`} 
                            percent={entropyPercent} 
                            color="text-pink-400"
                            icon={HelpCircle}
                        />
                        <StatBar 
                            label="Jerk (Estrés Motor)" 
                            value={metrics.jerk.toFixed(3)} 
                            percent={jerkPercent} 
                            color="text-purple-400"
                            icon={Zap}
                        />
                        <div className="pt-4 border-t border-slate-800/50 mt-4">
                            <div className="flex justify-between items-center text-[10px] text-slate-500 mb-2">
                                <span className="uppercase font-bold tracking-widest">Calibración AI</span>
                                <span className={metrics.isLearning ? "text-yellow-400 animate-pulse" : "text-emerald-400"}>
                                    {metrics.isLearning ? "APRENDIENDO..." : "ACTIVO"}
                                </span>
                            </div>
                            <div className="flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className={`h-1 flex-1 rounded-full ${i < (metrics.baseline.samples / 6) ? (metrics.isLearning ? 'bg-yellow-500' : 'bg-emerald-500') : 'bg-slate-800'}`}></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Micro Intention Alert */}
                {metrics.currentIntention !== MicroIntention.NONE && (
                    <div className={`p-4 rounded-2xl border flex items-center gap-4 animate-in slide-in-from-left duration-300 ${
                        metrics.currentIntention === MicroIntention.EXIT ? 'bg-red-500/10 border-red-500/30 text-red-400' :
                        metrics.currentIntention === MicroIntention.HESITATION ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' : 
                        'bg-slate-800 border-slate-700'
                    }`}>
                        {metrics.currentIntention === MicroIntention.EXIT ? <LogOut className="w-6 h-6" /> : <HelpCircle className="w-6 h-6" />}
                        <div>
                            <div className="text-[10px] font-bold uppercase tracking-widest opacity-70">Intención Detectada</div>
                            <div className="font-bold">{metrics.currentIntention}</div>
                        </div>
                    </div>
                )}
            </div>

            {/* Center Col: DOM Intelligence (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
                 {/* Inspector Window */}
                 <div className="bg-slate-950 border border-slate-800 rounded-3xl p-1 overflow-hidden shadow-2xl flex flex-col h-full">
                    <div className="bg-slate-900/50 px-4 py-3 border-b border-slate-800 flex justify-between items-center">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                            <ScanLine className="w-3 h-3" /> DOM Inspector
                        </span>
                        {isPrivacyActive && (
                            <span className="flex items-center gap-1.5 px-2 py-1 bg-emerald-900/30 border border-emerald-500/30 rounded text-[9px] font-bold text-emerald-400 uppercase tracking-wide">
                                <ShieldCheck className="w-3 h-3" /> Privacy Mode
                            </span>
                        )}
                    </div>
                    
                    <div className="p-4 space-y-4 flex-1 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-slate-950 to-slate-950">
                        
                        <ElementCard 
                            title="Elemento Actual" 
                            el={metrics.currentElement} 
                            colorClass="blue" 
                            icon={MousePointer2}
                        />

                        <div className="flex justify-center -my-2 relative z-10">
                            <div className="bg-slate-800 rounded-full p-1 border border-slate-700">
                                <Zap className="w-3 h-3 text-slate-500" />
                            </div>
                        </div>

                        <ElementCard 
                            title="Predicción (150ms)" 
                            el={metrics.predictedElement} 
                            colorClass="emerald" 
                            icon={Target}
                        />

                        {/* Last Interaction Log */}
                        <div className="mt-4 pt-4 border-t border-slate-800/50">
                            <div className="flex justify-between items-center text-[10px] text-slate-500 mb-2">
                                <span className="uppercase font-bold tracking-widest">Última Interacción</span>
                                {metrics.lastClick && (
                                    <span className="font-mono text-slate-400">
                                        {isPrivacyActive ? (
                                            <span className="text-emerald-500 flex items-center gap-1"><Lock className="w-2 h-2"/> REDACTED</span>
                                        ) : (
                                            `[${metrics.lastClick.x}, ${metrics.lastClick.y}]`
                                        )}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-xl border border-slate-800/50">
                                <MapPin className="w-4 h-4 text-purple-400" />
                                <div className="flex-1">
                                    {metrics.lastClick?.element ? (
                                        <div className="text-xs font-mono text-slate-300">
                                            Click en <span className="text-purple-400 font-bold">&lt;{metrics.lastClick.element.tag}&gt;</span>
                                        </div>
                                    ) : (
                                        <div className="text-xs text-slate-600 italic">Esperando click...</div>
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>
                 </div>
            </div>

            {/* Right Col: Input & Text (3 cols) */}
            <div className="lg:col-span-3 flex flex-col gap-6">
                
                {/* Selection Monitor */}
                <div className="p-5 rounded-3xl bg-slate-900/50 border border-slate-800 flex-1 flex flex-col">
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <TextCursor className="w-3 h-3" /> Selección
                    </h4>
                    
                    {metrics.currentSelection ? (
                        <div className="flex-1 bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-blue-500/5 animate-pulse"></div>
                            <p className="relative z-10 text-xs text-blue-100 font-mono break-all opacity-80">
                                "{metrics.currentSelection.text}"
                            </p>
                            <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-blue-500 text-white text-[9px] font-bold rounded">
                                {metrics.currentSelection.length} chars
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 border-2 border-dashed border-slate-800 rounded-xl flex items-center justify-center text-slate-600 text-xs">
                            Selecciona texto...
                        </div>
                    )}
                </div>

                {/* Interactive Test Area */}
                <div className="p-1 rounded-3xl bg-gradient-to-br from-slate-800 to-slate-950 border border-slate-700 shadow-xl">
                    <div className="bg-slate-950 rounded-[1.3rem] p-4">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">
                            Zona de Pruebas
                        </label>
                        <input 
                            type="text" 
                            placeholder={isPrivacyActive ? "Input protegido..." : "Escribe para calibrar..."}
                            className={`w-full bg-slate-900 border text-xs rounded-xl px-3 py-3 focus:outline-none transition-all ${
                                isPrivacyActive ? 'border-emerald-500/30 text-emerald-400 placeholder:text-emerald-700/50 focus:border-emerald-500' : 'border-slate-700 text-slate-200 focus:border-blue-500'
                            }`}
                        />
                        {isPrivacyActive && (
                            <div className="mt-2 flex items-center gap-1.5 text-[9px] text-emerald-500">
                                <Lock className="w-2.5 h-2.5" />
                                <span>Keystrokes no registrados</span>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>

      </div>
      
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-5xl pointer-events-none">
         <div className="absolute inset-0 bg-blue-500/5 blur-[100px] rounded-full opacity-20"></div>
      </div>
    </section>
  );
};

export default NeuralLab;