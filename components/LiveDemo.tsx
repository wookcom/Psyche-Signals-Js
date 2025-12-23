import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Zap, 
  AlertTriangle, 
  Compass, 
  Clock, 
  Eye, 
  MousePointer2, 
  ZapOff, 
  LayoutGrid, 
  Activity, 
  Brain, 
  Type, 
  FileText, 
  Fingerprint,
  ArrowLeft
} from 'lucide-react';

// --- CONSTANTES DE ESTADO (Traducción Amigable) ---

const UserState = {
  CALM: 'PAUSADO',
  URGENT: 'DECIDIDO',
  UNDECIDED: 'DUDANDO',
  EXPLORING: 'CURIOSO',
  STANDBY: 'DORMIDO',
  FRUSTRATED: 'MOLESTO',
  READING: 'ANALIZANDO',
  SELECTING: 'INTERESADO' // Nuevo estado para selección de texto
};

const FriendlyElements: Record<string, string> = {
  'button': 'Botón de acción',
  'a': 'Enlace o link',
  'p': 'Párrafo de texto',
  'span': 'Etiqueta de texto',
  'img': 'Imagen del producto',
  'input': 'Caja de búsqueda',
  'div': 'Sección de la página',
  'header': 'Cabecera del sitio',
  'section': 'Bloque de contenido'
};

// --- MOTOR PSYCHE REDISEÑADO PARA HUMANOS ---

class PsycheEngine {
  history: {x: number, y: number, t: number}[];
  listeners: Record<string, Function[]>;
  state: string;
  config: any;
  metrics: {
    velocity: number;
    entropy: number;
    targetName: string;
    selectedText: string;
    lastAction: string;
    isInteractive?: boolean;
    path?: {x: number, y: number, t: number}[];
  };
  rageTapCounter: number;
  lastTapTime: number;
  lastMoveTime: number;
  moveHandler: (e: MouseEvent) => void;
  clickHandler: (e: MouseEvent) => void;
  selectionHandler: () => void;
  timer: any;

  constructor(config = {}) {
    this.history = [];
    this.listeners = {};
    this.state = UserState.STANDBY;
    this.config = { interval: 60, historySize: 40, ...config };
    this.metrics = { 
      velocity: 0, 
      entropy: 0, 
      targetName: 'Nada', 
      selectedText: '',
      lastAction: 'Esperando...'
    };
    this.rageTapCounter = 0;
    this.lastTapTime = 0;
    this.lastMoveTime = Date.now();
    
    this.moveHandler = (e: MouseEvent) => {
        this._push(e.clientX, e.clientY);
        this.lastMoveTime = Date.now();
    };
    this.clickHandler = (e: MouseEvent) => this._handleInteraction(e);
    this.selectionHandler = () => this._handleSelection();

    this._init();
  }

  _init() {
    window.addEventListener('mousemove', this.moveHandler);
    window.addEventListener('mousedown', this.clickHandler);
    document.addEventListener('selectionchange', this.selectionHandler);
    this.timer = setInterval(() => this._analyze(), this.config.interval);
  }

  _handleSelection() {
    const selection = window.getSelection()?.toString() || '';
    if (selection.length > 0) {
      this.metrics.selectedText = selection;
      this._updateState(UserState.SELECTING);
    } else {
      this.metrics.selectedText = '';
    }
  }

  _handleInteraction(e: MouseEvent) {
    const now = Date.now();
    const el = document.elementFromPoint(e.clientX, e.clientY);
    const tagName = el?.tagName.toLowerCase() || '';
    
    this.metrics.lastAction = `Clic en: ${FriendlyElements[tagName] || 'Elemento desconocido'}`;
    
    if (now - this.lastTapTime < 350) {
      this.rageTapCounter++;
    } else {
      this.rageTapCounter = 0;
    }
    this.lastTapTime = now;
  }

  _push(x: number, y: number) {
    this.history.push({ x, y, t: Date.now() });
    if (this.history.length > this.config.historySize) this.history.shift();
  }

  _analyze() {
    const now = Date.now();
    if (now - this.lastMoveTime > 5000) {
      this._updateState(UserState.STANDBY);
      return;
    }

    if (this.history.length < 5) return;
    const h = this.history;
    const last = h[h.length - 1];
    const first = h[0];
    const dtTotal = last.t - first.t || 1;

    const velocity = Math.hypot(last.x - first.x, last.y - first.y) / dtTotal;
    
    let chaos = 0;
    for(let i = 2; i < h.length; i++) {
      const a = h[i-2], b = h[i-1], c = h[i];
      const ang1 = Math.atan2(b.y - a.y, b.x - a.x);
      const ang2 = Math.atan2(c.y - b.y, c.x - b.x);
      let diff = Math.abs(ang1 - ang2);
      if (diff > Math.PI) diff = Math.PI * 2 - diff;
      chaos += diff;
    }
    const entropy = chaos / h.length;

    const el = document.elementFromPoint(last.x, last.y);
    const tagName = el?.tagName.toLowerCase() || '';
    
    this.metrics = { 
      ...this.metrics,
      velocity, 
      entropy, 
      targetName: FriendlyElements[tagName] || 'Fondo de pantalla',
      isInteractive: ['BUTTON', 'A', 'INPUT'].includes(el?.tagName || ''),
      path: this.history
    };
    
    let next = UserState.EXPLORING;
    if (this.metrics.selectedText) next = UserState.SELECTING;
    else if (this.rageTapCounter > 3) next = UserState.FRUSTRATED;
    else if (velocity < 0.06 && (tagName === 'p' || tagName === 'span')) next = UserState.READING;
    else if (velocity > 1.2 && entropy < 0.3) next = UserState.URGENT;
    else if (entropy > 0.9) next = UserState.UNDECIDED;
    else if (velocity < 0.1) next = UserState.CALM;

    this._updateState(next);
    this._emit('metrics', this.metrics);
  }

  _updateState(next: string) {
    if (next !== this.state) {
      this.state = next;
      this._emit('stateChange', this.state);
    }
  }

  on(ev: string, cb: Function) {
    if (!this.listeners[ev]) this.listeners[ev] = [];
    this.listeners[ev].push(cb);
  }

  _emit(ev: string, data: any) {
    (this.listeners[ev] || []).forEach(cb => cb(data));
  }

  destroy() {
    clearInterval(this.timer);
    window.removeEventListener('mousemove', this.moveHandler);
    window.removeEventListener('mousedown', this.clickHandler);
    document.removeEventListener('selectionchange', this.selectionHandler);
  }
}

// --- INTERFAZ ---

interface LiveDemoProps {
    onBack: () => void;
}

export default function LiveDemo({ onBack }: LiveDemoProps) {
  const [metrics, setMetrics] = useState<any>(null);
  const [state, setState] = useState(UserState.STANDBY);
  const [showLab, setShowLab] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const engine = new PsycheEngine();
    engine.on('metrics', setMetrics);
    engine.on('stateChange', setState);
    return () => engine.destroy();
  }, []);

  const addNotify = (text: string, color: string) => {
    const id = Date.now();
    setNotifications(prev => [{ id, text, color }, ...prev].slice(0, 3));
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 6000);
  };

  const themeMap: any = {
    [UserState.URGENT]: { color: 'text-orange-500', bg: 'bg-orange-500', label: 'Vas directo al grano', icon: <Zap size={14}/> },
    [UserState.FRUSTRATED]: { color: 'text-rose-500', bg: 'bg-rose-500', label: 'Parece que algo te molesta', icon: <AlertTriangle size={14}/> },
    [UserState.READING]: { color: 'text-emerald-500', bg: 'bg-emerald-500', label: 'Estás leyendo con atención', icon: <Eye size={14}/> },
    [UserState.UNDECIDED]: { color: 'text-indigo-500', bg: 'bg-indigo-500', label: 'No terminas de decidirte', icon: <Compass size={14}/> },
    [UserState.CALM]: { color: 'text-sky-500', bg: 'bg-sky-500', label: 'Navegas con calma', icon: <Clock size={14}/> },
    [UserState.STANDBY]: { color: 'text-slate-400', bg: 'bg-slate-400', label: 'La página está descansando', icon: <ZapOff size={14}/> },
    [UserState.EXPLORING]: { color: 'text-blue-500', bg: 'bg-blue-500', label: 'Estás curioseando', icon: <LayoutGrid size={14}/> },
    [UserState.SELECTING]: { color: 'text-yellow-500', bg: 'bg-yellow-500', label: 'Te interesa este texto', icon: <Type size={14}/> }
  };

  const currentTheme = themeMap[state] || themeMap[UserState.STANDBY];

  return (
    <div className={`min-h-screen font-sans transition-all duration-1000 ${state === UserState.STANDBY ? 'brightness-75 grayscale' : 'bg-slate-50'}`}>
      
      {/* HEADER PRINCIPAL */}
      <nav className="fixed top-0 left-0 w-full z-[100] bg-white/90 border-b border-slate-100 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
                <button 
                    onClick={onBack}
                    className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors"
                    title="Volver a la documentación"
                >
                    <ArrowLeft size={20} />
                </button>

                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${currentTheme.bg} shadow-lg transition-colors duration-500`}>
                        <Brain size={20} />
                    </div>
                    <div>
                        <h1 className="text-lg font-black text-slate-900 tracking-tighter uppercase leading-none">Tienda Inteligente</h1>
                        <div className="flex items-center gap-2 mt-1">
                            <div className={`w-1.5 h-1.5 rounded-full ${currentTheme.bg} animate-pulse`} />
                            <span className={`text-[9px] font-bold uppercase tracking-widest ${currentTheme.color}`}>{currentTheme.label}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button 
                    onClick={() => setShowLab(!showLab)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${showLab ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                    <Activity size={16} />
                    <span className="hidden md:inline">{showLab ? 'Ocultar Monitor' : 'Ver Monitor'}</span>
                </button>
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                    <ShoppingCart size={18} />
                </div>
            </div>
        </div>
      </nav>

      {/* MONITOR LATERAL */}
      <aside className={`fixed top-24 right-6 z-50 w-64 bg-slate-900/95 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl transition-all duration-500 ${showLab ? 'translate-x-0 opacity-100' : 'translate-x-[120%] opacity-0'}`}>
        <div className="p-5">
            <h3 className="text-white text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-blue-400">¿Qué detecta la IA?</h3>
            
            <div className="space-y-4">
                <div>
                    <label className="text-[9px] text-slate-500 font-bold uppercase">Estado Actual</label>
                    <p className="text-sm font-bold text-white mt-1">{state}</p>
                </div>
                
                <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                    <label className="text-[9px] text-slate-500 font-bold uppercase">Sobre qué estás</label>
                    <div className="flex items-center gap-2 mt-1">
                        {metrics?.isInteractive ? <MousePointer2 size={12} className="text-blue-400"/> : <Activity size={12} className="text-slate-500"/>}
                        <p className="text-xs text-slate-200 font-medium">{metrics?.targetName}</p>
                    </div>
                </div>

                <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                    <label className="text-[9px] text-slate-500 font-bold uppercase">Última acción</label>
                    <p className="text-[10px] text-slate-400 mt-1 italic">{metrics?.lastAction}</p>
                </div>

                {metrics?.selectedText && (
                    <div className="p-3 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 animate-in zoom-in">
                        <label className="text-[9px] text-yellow-500 font-bold uppercase">Texto Seleccionado</label>
                        <p className="text-[10px] text-yellow-200 mt-1 line-clamp-2">"{metrics.selectedText}"</p>
                    </div>
                )}
            </div>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="max-w-7xl mx-auto px-8 pt-32 pb-24">
        
        {/* Banner de Bienvenida */}
        <header className="mb-16">
            <h2 className="text-5xl font-black text-slate-900 tracking-tight leading-none mb-6">
                Productos que <br/>
                <span className="text-blue-600">entienden tu mente.</span>
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl leading-relaxed">
                Navega libremente. Nuestra tecnología analiza tus movimientos para saber cuándo ayudarte, cuándo dejarte leer y cuándo ofrecerte una oferta.
            </p>
        </header>

        {/* Productos de Prueba */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {[1, 2, 3].map(i => (
                <div key={i} className="group bg-white rounded-[2.5rem] border border-slate-100 p-2 transition-all hover:shadow-2xl hover:-translate-y-1">
                    <div className="h-48 bg-slate-100 rounded-[2rem] mb-4 overflow-hidden">
                        <img 
                          src={`https://images.unsplash.com/photo-${i === 1 ? '1505740420928-5e560c06d30e' : i === 2 ? '1523275335684-37898b6baf30' : '1526170315836-3f8a609181b4'}?auto=format&fit=crop&q=80&w=400`} 
                          alt="Producto" 
                          className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all"
                        />
                    </div>
                    <div className="px-4 pb-4">
                        <h4 className="font-bold text-slate-800">Producto Inteligente {i}</h4>
                        <div className="flex justify-between items-center mt-3">
                            <span className="text-lg font-black text-blue-600">$199.00</span>
                            <button className="p-3 bg-slate-900 text-white rounded-2xl hover:bg-blue-600 transition-colors">
                                <ShoppingCart size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        {/* Zona de Lectura y Selección */}
        <section className={`p-12 rounded-[3.5rem] border-2 transition-all duration-1000 ${state === UserState.SELECTING ? 'bg-yellow-50 border-yellow-200' : 'bg-white border-slate-100 shadow-xl'}`}>
            <div className="flex items-center gap-3 mb-6">
                <FileText className="text-blue-600" />
                <h3 className="text-xl font-black text-slate-900 uppercase italic">¿Por qué es esto importante?</h3>
            </div>
            <div className="space-y-6 text-xl text-slate-600 leading-relaxed max-w-4xl">
                <p>
                    Cuando <span className="text-blue-600 font-bold underline decoration-blue-200 decoration-4 cursor-help">seleccionas una frase</span> en este párrafo, la IA entiende que ese fragmento específico de información es valioso para ti. No es solo un clic, es una señal de interés real.
                </p>
                <p>
                    Del mismo modo, si mueves el ratón lentamente por estas líneas, detectamos el estado de <strong>LECTURA</strong>. Esto nos permite saber que estás procesando información y que no deberíamos interrumpirte con ventanas emergentes o anuncios.
                </p>
            </div>
        </section>
      </main>

      {/* NOTIFICACIONES DINÁMICAS */}
      <div className="fixed bottom-8 left-8 z-[110] space-y-3 pointer-events-none">
        {notifications.map(n => (
          <div key={n.id} className="bg-slate-900 text-white p-5 rounded-3xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-left duration-500 pointer-events-auto">
             <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
               <Fingerprint size={16} />
             </div>
             <p className="text-sm font-bold">{n.text}</p>
          </div>
        ))}
      </div>

      {/* CURSOR VISUALIZADOR */}
      <div 
        className="fixed pointer-events-none z-[120] hidden lg:block"
        style={{ 
          left: metrics?.path?.[metrics.path.length-1]?.x || 0, 
          top: metrics?.path?.[metrics.path.length-1]?.y || 0,
          transform: 'translate(-50%, -50%)' 
        }}
      >
        <div className={`w-8 h-8 border-2 rounded-full transition-all duration-300 ${metrics?.isInteractive ? 'scale-150 border-blue-500 bg-blue-500/10' : 'border-slate-300'}`}>
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-1 h-1 bg-slate-900 rounded-full"></div>
          </div>
        </div>
        {metrics?.isInteractive && (
          <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-bold px-2 py-1 rounded-lg shadow-xl whitespace-nowrap">
            LISTO PARA CLIC
          </div>
        )}
      </div>

    </div>
  );
}