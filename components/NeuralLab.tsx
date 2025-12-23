
import React from 'react';
import { PsycheMetrics, UserState, PsycheElement } from '../types';
import { TestTube, MousePointerClick, MoveVertical, Type, Clock, Scan, Target, MapPin, TextCursor } from 'lucide-react';

interface NeuralLabProps {
  metrics: PsycheMetrics;
  currentState: UserState;
}

const NeuralLab: React.FC<NeuralLabProps> = ({ metrics, currentState }) => {
  // Scaling values for visualization
  const velPercent = Math.min(metrics.velocity * 40, 100);
  const entropyPercent = Math.min(metrics.entropy * 60, 100);
  const jerkPercent = Math.min(metrics.jerk * 100, 100);
  const scrollPercent = Math.min(metrics.scrollSpeed * 50, 100); // 2px/ms is fast
  const interactionPercent = Math.min(metrics.interactionRate * 10, 100); // 10 events/sec is high

  // Pause Levels Logic
  const pauseSecs = metrics.pauseDuration / 1000;
  let pauseLabel = "BAJO";
  let pauseColor = "text-slate-400";
  let pauseBarColor = "bg-slate-500";
  let pauseWidth = "10%";

  if (pauseSecs > 1 && pauseSecs <= 3) {
    pauseLabel = "MEDIO";
    pauseColor = "text-blue-400";
    pauseBarColor = "bg-blue-500";
    pauseWidth = "40%";
  } else if (pauseSecs > 3 && pauseSecs <= 5) {
    pauseLabel = "ALTO";
    pauseColor = "text-orange-400";
    pauseBarColor = "bg-orange-500";
    pauseWidth = "70%";
  } else if (pauseSecs > 5) {
    pauseLabel = "CRÍTICO";
    pauseColor = "text-red-500 font-black animate-pulse";
    pauseBarColor = "bg-red-500";
    pauseWidth = "100%";
  }

  let badgeColorClass = "bg-slate-800 text-slate-400 border-slate-700";
  if (currentState === UserState.URGENT) badgeColorClass = "bg-orange-500/10 text-orange-400 border-orange-500/20";
  if (currentState === UserState.FRUSTRATED) badgeColorClass = "bg-red-500/10 text-red-400 border-red-500/20 animate-pulse";
  if (currentState === UserState.UNDECIDED) badgeColorClass = "bg-pink-500/10 text-pink-400 border-pink-500/20";
  if (currentState === UserState.EXPLORING) badgeColorClass = "bg-blue-500/10 text-blue-400 border-blue-500/20";
  if (currentState === UserState.READING) badgeColorClass = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";

  // Helper to render element badge
  const ElementBadge = ({ el, label, icon: Icon, color, coordinates }: { el: PsycheElement | null | undefined, label: string, icon: any, color: string, coordinates?: {x: number, y: number} }) => {
    if (!el && !coordinates) return (
      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-slate-800/50">
         <span className="text-[10px] uppercase font-bold text-slate-600 flex items-center gap-2"><Icon className="w-3 h-3"/> {label}</span>
         <span className="text-[10px] text-slate-700">Nada detectado</span>
      </div>
    );
    
    return (
      <div className={`flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border ${el?.interactive ? `border-${color}-500/30` : 'border-slate-800'} transition-all`}>
         <span className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-2"><Icon className="w-3 h-3"/> {label}</span>
         <div className="text-right">
            {coordinates && (
               <div className="text-[9px] text-slate-500 font-mono mb-0.5">[{coordinates.x}, {coordinates.y}]</div>
            )}
            {el ? (
               <>
                  <div className={`text-xs font-mono font-bold ${el.interactive ? `text-${color}-400` : 'text-slate-400'}`}>
                    &lt;{el.tag.toUpperCase()}{el.id ? `#${el.id}` : ''}&gt;
                  </div>
                  {el.className && <div className="text-[9px] text-slate-600">.{el.className}</div>}
               </>
            ) : (
                <div className="text-[9px] text-slate-600 italic">Sin elemento</div>
            )}
         </div>
      </div>
    );
  }

  return (
    <div id="lab" className="py-20 border-b border-slate-800/40 scroll-mt-24 px-8 md:px-20">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-blue-500/20 text-blue-500 rounded-lg">
            <TestTube className="w-5 h-5" />
          </div>
          <h3 className="text-3xl font-bold text-white">Laboratorio Neural</h3>
        </div>
        
        <div className="p-8 rounded-[2.5rem] border border-blue-500/20 bg-blue-500/5 backdrop-blur-sm relative overflow-hidden group">
          {/* Scanner Effect */}
          <div className="absolute inset-x-0 h-1/2 bg-gradient-to-b from-transparent via-blue-500/10 to-transparent pointer-events-none scanner-animation opacity-50"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
            
            {/* Column 1: Movement Metrics */}
            <div className="space-y-6">
              <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4 border-b border-slate-800/50 pb-2">Cinemática</h4>
              
              {/* Velocity */}
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold uppercase text-slate-400">
                  <span>Velocidad Cursor</span>
                  <span className="text-blue-400 font-mono">{metrics.velocity.toFixed(2)}</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 metric-transition" style={{ width: `${velPercent}%` }}></div>
                </div>
              </div>

              {/* Entropy */}
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold uppercase text-slate-400">
                  <span>Entropía (Caos)</span>
                  <span className="text-pink-400 font-mono">{Math.round(entropyPercent)}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-pink-500 metric-transition" style={{ width: `${entropyPercent}%` }}></div>
                </div>
              </div>

              {/* Jerk */}
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold uppercase text-slate-400">
                  <span>Jerk (Temblor)</span>
                  <span className="text-purple-400 font-mono">{(metrics.jerk * 10).toFixed(1)}</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 metric-transition" style={{ width: `${jerkPercent}%` }}></div>
                </div>
              </div>

              {/* Object Detection Panel */}
              <div className="mt-8 pt-4 border-t border-slate-800/50 space-y-3">
                 <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Detección Objetos</h4>
                 
                 {/* Current Element */}
                 <ElementBadge el={metrics.currentElement} label="Cursor Sobre" icon={Scan} color="emerald" />
                 
                 {/* Predicted Element */}
                 <ElementBadge el={metrics.predictedElement} label="Predicción (150ms)" icon={Target} color="orange" />
              </div>

            </div>

            {/* Column 2: Interaction Metrics */}
            <div className="space-y-6">
              <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4 border-b border-slate-800/50 pb-2">Interacción</h4>

              {/* Pause Duration */}
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold uppercase text-slate-400">
                  <span className="flex items-center gap-2"><Clock className="w-3 h-3"/> Tiempo Pausa ({pauseLabel})</span>
                  <span className={`font-mono transition-colors ${pauseColor}`}>{pauseSecs.toFixed(1)}s</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full metric-transition ${pauseBarColor}`} style={{ width: pauseWidth }}></div>
                </div>
              </div>

              {/* Scroll Speed */}
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold uppercase text-slate-400">
                  <span className="flex items-center gap-2"><MoveVertical className="w-3 h-3"/> Intensidad Scroll</span>
                  <span className="text-emerald-400 font-mono">{metrics.scrollSpeed.toFixed(1)} px/ms</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 metric-transition" style={{ width: `${scrollPercent}%` }}></div>
                </div>
              </div>

              {/* Last Click */}
              <div className="mt-6 pt-4 border-t border-slate-800/50">
                 <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Último Contacto</h4>
                 <ElementBadge 
                    el={metrics.lastClick?.element} 
                    label="Punto Click" 
                    icon={MapPin} 
                    color="blue" 
                    coordinates={metrics.lastClick ? {x: metrics.lastClick.x, y: metrics.lastClick.y} : undefined}
                 />
              </div>

              {/* Current Selection */}
              <div className="mt-3">
                 {metrics.currentSelection ? (
                    <div className="flex items-start justify-between p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 transition-all">
                      <div className="overflow-hidden">
                         <span className="text-[10px] uppercase font-bold text-blue-400 flex items-center gap-2 mb-1"><TextCursor className="w-3 h-3"/> Selección Activa</span>
                         <p className="text-[10px] text-slate-300 italic truncate max-w-[200px]">"{metrics.currentSelection.text}"</p>
                      </div>
                      <span className="text-[9px] font-mono bg-blue-500/20 text-blue-300 px-2 py-1 rounded-lg">
                        {metrics.currentSelection.length} chars
                      </span>
                    </div>
                 ) : (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-slate-800/50">
                       <span className="text-[10px] uppercase font-bold text-slate-600 flex items-center gap-2"><TextCursor className="w-3 h-3"/> Selección Activa</span>
                       <span className="text-[10px] text-slate-700">Ninguna</span>
                    </div>
                 )}
              </div>

              {/* Test Input */}
              <div className="pt-2">
                 <div className="relative">
                    <input 
                      id="test-input"
                      type="text" 
                      placeholder="Selecciona texto aquí para probar..." 
                      className="w-full bg-slate-900/50 border border-slate-700 text-xs text-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                    <Type className="absolute right-3 top-3 w-4 h-4 text-slate-600" />
                 </div>
              </div>

            </div>
          </div>

          <div className="mt-12 text-center relative z-10 flex flex-col items-center">
            <div className={`inline-block px-6 py-2 rounded-full border text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 shadow-xl ${badgeColorClass}`}>
              {currentState}
            </div>
            <p className="text-[10px] text-slate-600 mt-4 uppercase tracking-wider font-semibold">
              Estado Cognitivo Detectado
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NeuralLab;
