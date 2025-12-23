import React from 'react';
import { Zap, Shuffle, Compass, AlertTriangle, Coffee, Fingerprint, Activity } from 'lucide-react';
import { UserState } from '../types';

interface UserStatesProps {
  currentState: UserState;
}

const UserStates: React.FC<UserStatesProps> = ({ currentState }) => {

  const states = [
    {
      id: UserState.URGENT,
      label: 'Urgente / Decidido',
      description: 'Alta velocidad y baja entropía. El usuario tiene un objetivo claro y se mueve en línea recta.',
      trigger: 'Velocity > 1.8 && Entropy < 0.3',
      color: 'red',
      icon: Zap,
      path: (
        <svg viewBox="0 0 100 50" className="w-full h-12 opacity-50">
          <path d="M10,40 L90,10" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2" />
          <circle cx="90" cy="10" r="3" fill="currentColor" />
        </svg>
      )
    },
    {
      id: UserState.UNDECIDED,
      label: 'Indeciso / Confuso',
      description: 'Movimiento errático (alta entropía) o pausas prolongadas sobre elementos interactivos.',
      trigger: 'Entropy > 0.8 || Hover Time > 2s',
      color: 'pink',
      icon: Shuffle,
      path: (
        <svg viewBox="0 0 100 50" className="w-full h-12 opacity-50">
          <path d="M10,25 C30,10 30,40 50,25 C70,10 70,40 90,25" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      )
    },
    {
      id: UserState.FRUSTRATED,
      label: 'Frustrado (Rage)',
      description: 'Clics repetitivos rápidos (Rage Clicks) o movimientos bruscos (High Jerk).',
      trigger: 'RageTaps > 2 || Jerk > 0.5',
      color: 'orange',
      icon: AlertTriangle,
      path: (
        <svg viewBox="0 0 100 50" className="w-full h-12 opacity-50">
          <path d="M10,25 L20,10 L30,40 L40,10 L50,40 L60,10 L70,40 L90,25" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      )
    },
    {
      id: UserState.EXPLORING,
      label: 'Explorador',
      description: 'Navegación fluida con velocidad moderada. Estado ideal de consumo de contenido.',
      trigger: '0.2 < Velocity < 1.0',
      color: 'blue',
      icon: Compass,
      path: (
        <svg viewBox="0 0 100 50" className="w-full h-12 opacity-50">
          <path d="M10,40 Q50,0 90,40" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      )
    },
    {
      id: UserState.CALM,
      label: 'Calmado / Standby',
      description: 'Ausencia de interacción significativa o movimientos muy lentos (Lectura).',
      trigger: 'Velocity < 0.1',
      color: 'slate',
      icon: Coffee,
      path: (
        <svg viewBox="0 0 100 50" className="w-full h-12 opacity-50">
          <line x1="10" y1="25" x2="90" y2="25" stroke="currentColor" strokeWidth="2" strokeDasharray="1 4" />
        </svg>
      )
    }
  ];

  return (
    <section id="estados" className="py-24 px-8 md:px-20 border-b border-slate-800/40 scroll-mt-24 relative overflow-hidden bg-slate-950">
       
       {/* Background Glows */}
       <div className="absolute top-0 right-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>

       <div className="max-w-6xl mx-auto relative z-10">
          
          <div className="mb-12">
            <h2 className="text-4xl font-black text-white mb-4 tracking-tight">Perfiles de <span className="text-blue-500">Comportamiento</span></h2>
            <p className="text-slate-400 max-w-2xl text-lg">
                Psyche clasifica la intención del usuario en tiempo real. Estas tarjetas se iluminarán cuando tu comportamiento coincida con el perfil descrito.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {states.map((state) => {
                  const isActive = currentState === state.id;
                  const Icon = state.icon;
                  
                  return (
                    <div 
                        key={state.id}
                        className={`group relative p-6 rounded-2xl border transition-all duration-500 overflow-hidden ${
                            isActive 
                                ? `bg-${state.color}-900/20 border-${state.color}-500/50 shadow-[0_0_30px_rgba(var(--tw-color-${state.color}-500),0.2)] scale-[1.02]` 
                                : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                        }`}
                    >
                        {/* Active Pulse Background */}
                        {isActive && (
                            <div className={`absolute inset-0 bg-${state.color}-500/5 animate-pulse pointer-events-none`}></div>
                        )}

                        {/* Top Bar */}
                        <div className="flex justify-between items-start mb-6">
                            <div className={`p-3 rounded-xl border ${
                                isActive 
                                    ? `bg-${state.color}-500 text-white border-${state.color}-400 shadow-lg` 
                                    : `bg-slate-900 border-slate-800 text-${state.color}-500 group-hover:bg-slate-800 transition-colors`
                            }`}>
                                <Icon className="w-6 h-6" />
                            </div>
                            
                            {isActive && (
                                <span className={`flex items-center gap-2 px-2 py-1 rounded-full bg-${state.color}-500/10 border border-${state.color}-500/20 text-${state.color}-400 text-[10px] font-bold uppercase tracking-widest animate-fade-in`}>
                                    <span className={`w-1.5 h-1.5 rounded-full bg-${state.color}-500 animate-pulse`}></span>
                                    Active
                                </span>
                            )}
                        </div>

                        {/* Path Visualization */}
                        <div className={`mb-6 text-${state.color}-500 transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-40 group-hover:opacity-70'}`}>
                            {state.path}
                        </div>

                        {/* Text Content */}
                        <h3 className={`text-xl font-bold mb-2 ${isActive ? 'text-white' : 'text-slate-200'}`}>
                            {state.label}
                        </h3>
                        <p className="text-sm text-slate-500 leading-relaxed mb-6">
                            {state.description}
                        </p>

                        {/* Logic Footer */}
                        <div className="pt-4 border-t border-slate-800/50 flex items-center gap-2">
                            <Activity className="w-3 h-3 text-slate-600" />
                            <code className={`text-[10px] font-mono ${isActive ? `text-${state.color}-300` : 'text-slate-600'}`}>
                                {state.trigger}
                            </code>
                        </div>

                    </div>
                  );
              })}

              {/* Learning Card */}
              <div className="p-6 rounded-2xl border border-dashed border-slate-800 bg-slate-950/50 flex flex-col justify-center items-center text-center group hover:border-slate-700 transition-colors">
                  <div className="p-4 rounded-full bg-slate-900 text-slate-600 mb-4 group-hover:scale-110 transition-transform">
                      <Fingerprint className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-300 mb-2">Machine Learning</h3>
                  <p className="text-xs text-slate-500 max-w-[200px]">
                      El motor aprende tu velocidad base y ajusta los umbrales automáticamente cada 30 segundos.
                  </p>
              </div>

          </div>

       </div>
    </section>
  );
};

export default UserStates;