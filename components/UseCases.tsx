import React, { useState } from 'react';
import CodeBlock from './CodeBlock';
import { ShoppingCart, MessageSquare, BookOpen, Play, CheckCircle2, Zap } from 'lucide-react';

const UseCases: React.FC = () => {
    // State to handle "simulation" feedback for each card
    const [triggered, setTriggered] = useState<string | null>(null);

    const simulate = (id: string) => {
        setTriggered(id);
        setTimeout(() => setTriggered(null), 2500);
    };

    const cases = [
        {
            id: 'ecommerce',
            category: 'E-commerce',
            icon: ShoppingCart,
            color: 'blue',
            title: 'Recuperación de Carrito',
            description: 'Detecta cuando un usuario mueve el cursor rápidamente hacia la barra de pestañas (intención de salida) y dispara un modal antes de que se vaya.',
            code: `psyche.on('intention', (intent) => {
  if (intent === 'EXIT_INTENT') {
    openModal({ 
      offer: '10% OFF', 
      urgency: 'high' 
    });
  }
});`
        },
        {
            id: 'saas',
            category: 'SaaS Support',
            icon: MessageSquare,
            color: 'pink',
            title: 'Anti-Frustración',
            description: 'Identifica "Rage Clicks" o movimientos erráticos del ratón (High Jerk) para ofrecer ayuda proactiva mediante chat o documentación.',
            code: `psyche.on('metrics', (m) => {
  if (m.rageTaps > 2 || m.jerk > 0.8) {
    Intercom('show');
    logFrustrationEvent(m.currentElement);
  }
});`
        },
        {
            id: 'media',
            category: 'Content / Media',
            icon: BookOpen,
            color: 'emerald',
            title: 'Lectura Inmersiva',
            description: 'Si el usuario entra en estado "CALMADO" con velocidad de scroll constante, oculta menús flotantes para mejorar la concentración.',
            code: `psyche.on('stateChange', (state) => {
  if (state === 'READING') {
    document.body.classList.add('immersive-mode');
  } else {
    document.body.classList.remove('immersive-mode');
  }
});`
        }
    ];

    return (
        <section id="ejemplos" className="py-24 px-8 md:px-20 pb-40 relative overflow-hidden bg-slate-950">
            {/* Background Decor */}
             <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="mb-16">
                    <h3 className="text-4xl font-black text-white mb-4 tracking-tight">Implementaciones <span className="text-blue-500">Reales</span></h3>
                    <p className="text-slate-400 text-lg max-w-2xl">
                        Patrones de diseño listos para producción que aumentan la conversión y retención basándose en señales no verbales.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {cases.map((c) => {
                        const isTriggered = triggered === c.id;
                        return (
                            <div 
                                key={c.id} 
                                className={`group relative flex flex-col p-1 rounded-[2rem] bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-800 hover:border-${c.color}-500/30 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2`}
                            >
                                {/* Inner Card Content */}
                                <div className="flex-1 bg-slate-950 rounded-[1.8rem] p-6 flex flex-col overflow-hidden relative">
                                    
                                    {/* Simulation Overlay */}
                                    {isTriggered && (
                                        <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm z-20 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
                                            <div className={`p-4 rounded-full bg-${c.color}-500/20 text-${c.color}-400 mb-4 animate-bounce`}>
                                                <CheckCircle2 className="w-8 h-8" />
                                            </div>
                                            <h5 className="text-white font-bold text-lg mb-1">Evento Disparado</h5>
                                            <p className={`text-xs text-${c.color}-400 font-mono`}>Executing callback...</p>
                                        </div>
                                    )}

                                    {/* Header */}
                                    <div className="flex justify-between items-start mb-6">
                                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-${c.color}-500/10 text-${c.color}-400 text-[10px] font-bold uppercase tracking-widest border border-${c.color}-500/20`}>
                                            <c.icon className="w-3 h-3" />
                                            {c.category}
                                        </div>
                                    </div>

                                    <h4 className="text-xl font-bold text-white mb-3 group-hover:text-blue-200 transition-colors">
                                        {c.title}
                                    </h4>
                                    <p className="text-sm text-slate-400 leading-relaxed mb-6">
                                        {c.description}
                                    </p>

                                    {/* Code Snippet */}
                                    <div className="mt-auto relative">
                                        <div className="absolute -inset-2 bg-gradient-to-b from-transparent to-slate-950/50 pointer-events-none"></div>
                                        <CodeBlock 
                                            code={c.code}
                                            className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-[10px] leading-relaxed shadow-inner"
                                            textClassName={`text-${c.color}-100 opacity-80`}
                                        />
                                    </div>

                                    {/* Action Footer */}
                                    <div className="mt-6 pt-6 border-t border-slate-800/50 flex justify-between items-center">
                                        <button 
                                            onClick={() => simulate(c.id)}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 hover:border-${c.color}-500/50 transition-all group/btn`}
                                        >
                                            <Play className={`w-3 h-3 text-${c.color}-500 group-hover/btn:fill-current`} />
                                            Simular
                                        </button>
                                        <Zap className="w-4 h-4 text-slate-700" />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default UseCases;