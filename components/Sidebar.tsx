import React from 'react';
import { BrainCircuit, BookOpen, Download, TestTube, Lightbulb, UserCheck, Box, Code, Zap } from 'lucide-react';
import { PsycheMetrics, UserState } from '../types';

interface SidebarProps {
  activeSection: string;
  currentState: UserState;
  metrics: PsycheMetrics;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, currentState, metrics }) => {
  
  const getNavLinkClass = (sectionId: string) => {
    const baseClass = "flex items-center gap-3 px-4 py-2 text-sm rounded-xl transition-all duration-200 cursor-pointer text-slate-400 hover:text-white hover:bg-white/5";
    const activeClass = "text-blue-400 bg-blue-500/10 font-semibold shadow-[inset_2px_0_0_#3b82f6] rounded-r-xl rounded-l-none";
    
    return activeSection === sectionId ? `${baseClass} ${activeClass}` : baseClass;
  };

  const scrollToSection = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getStatusColor = () => {
    switch(currentState) {
      case UserState.URGENT: return 'text-red-500';
      case UserState.UNDECIDED: return 'text-pink-500';
      case UserState.EXPLORING: return 'text-blue-400';
      case UserState.CALM: return 'text-slate-500';
      default: return 'text-green-500';
    }
  };

  const entropyPercent = Math.min(metrics.entropy * 60, 100);

  return (
    <aside className="w-full md:w-80 bg-slate-900/95 backdrop-blur-xl border-r border-white/10 flex flex-col h-screen shrink-0 sticky top-0 z-50">
      {/* Header */}
      <div className="p-8 border-b border-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.4)]">
          <BrainCircuit className="text-white w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tighter leading-none text-white">
            Psyche <span className="text-blue-500">Signals</span>
          </h1>
          <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mt-1">v3.0.8 Adaptive Statistical Engine</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-10">
        <div>
          <p className="px-4 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-4">Comenzando</p>
          <div className="space-y-1">
            <a href="#intro" onClick={(e) => scrollToSection(e, 'intro')} className={getNavLinkClass('intro')}>
              <BookOpen className="w-4 h-4" /> Introducción
            </a>
            <a href="#instalacion" onClick={(e) => scrollToSection(e, 'instalacion')} className={getNavLinkClass('instalacion')}>
              <Download className="w-4 h-4" /> Instalación
            </a>
            <a href="#lab" onClick={(e) => scrollToSection(e, 'lab')} className={getNavLinkClass('lab')}>
              <TestTube className="w-4 h-4" /> Laboratorio Neural
            </a>
          </div>
        </div>

        <div>
          <p className="px-4 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-4">Arquitectura</p>
          <div className="space-y-1">
            <a href="#conceptos" onClick={(e) => scrollToSection(e, 'conceptos')} className={getNavLinkClass('conceptos')}>
              <Lightbulb className="w-4 h-4" /> Conceptos Core
            </a>
            <a href="#estados" onClick={(e) => scrollToSection(e, 'estados')} className={getNavLinkClass('estados')}>
              <UserCheck className="w-4 h-4" /> Perfiles de Usuario
            </a>
          </div>
        </div>

        <div>
          <p className="px-4 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-4">Desarrollo</p>
          <div className="space-y-1">
            <a href="#constructor" onClick={(e) => scrollToSection(e, 'constructor')} className={getNavLinkClass('constructor')}>
              <Box className="w-4 h-4" /> Constructor
            </a>
            <a href="#metodos" onClick={(e) => scrollToSection(e, 'metodos')} className={getNavLinkClass('metodos')}>
              <Code className="w-4 h-4" /> Métodos Públicos
            </a>
            <a href="#ejemplos" onClick={(e) => scrollToSection(e, 'ejemplos')} className={getNavLinkClass('ejemplos')}>
              <Zap className="w-4 h-4" /> Casos de Uso
            </a>
          </div>
        </div>
      </nav>

      {/* Status Footer */}
      <div className="p-8 border-t border-slate-800 bg-slate-900/20">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] text-slate-500 font-bold uppercase">Estado Motor</span>
          <span className={`text-[10px] font-mono font-bold ${getStatusColor()}`}>
            {currentState}
          </span>
        </div>
        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden relative">
          <div 
            className="h-full bg-blue-500 metric-transition" 
            style={{ width: `${entropyPercent}%` }}
          />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;