import React, { useState } from 'react';
import { MaterialSymbol } from './icons';

interface HeaderProps {
  onLogoClick: () => void;
  onNavigate: (page: string) => void;
  activePage: string;
  showBackArrow: boolean;
}

const Header: React.FC<HeaderProps> = ({ onLogoClick, onNavigate, activePage, showBackArrow }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);

  const navItems = [
    { id: 'landing', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'mission_control', label: 'Mission Control' },
    { id: 'the_brain', label: 'Sovereign Core' },
    { id: 'investor_codex', label: 'Investor Codex' },
  ];

  return (
    <header className="bg-slate-950/30 backdrop-blur-3xl border-b border-white/10 sticky top-0 z-[100]">
      <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        <div onClick={onLogoClick} className="flex items-center cursor-pointer group">
            <div className="flex items-center transition-transform duration-300 hover:scale-[1.02]">
                {showBackArrow && (
                    <div className="mr-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5">
                        <MaterialSymbol icon="arrow_back" className="text-slate-400 group-hover:text-indigo-400" />
                    </div>
                )}
                <div className="relative">
                    <img src="https://storage.googleapis.com/aistudio-ux-team-data/demos/nimbus-logo.png" alt="Nimbus IQ Logo" className="h-10 w-10 mr-4 drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
                    <div className="absolute -top-1 -right-1 h-3 w-3 bg-emerald-500 border-2 border-slate-950 rounded-full animate-pulse"></div>
                </div>
                <div className="hidden xs:block">
                    <h1 className="text-xl font-black text-white tracking-tighter uppercase">NIMBUS <span className="text-indigo-500">IQ</span></h1>
                    <p className="text-[8px] uppercase tracking-[0.3em] font-black text-slate-500 mt-0.5">Sovereign AI OS</p>
                </div>
            </div>
        </div>

        <nav className="hidden xl:flex items-center bg-slate-900/50 p-1.5 rounded-2xl border border-white/5 shadow-inner">
            {navItems.map(item => (
                <button key={item.id} onClick={() => onNavigate(item.id)} className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activePage === item.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>{item.label}</button>
            ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-4">
            <button onClick={() => setIsDark(!isDark)} className="p-3 text-slate-500 hover:text-indigo-400 transition-colors hidden sm:block">
                <MaterialSymbol icon={isDark ? "dark_mode" : "light_mode"} className="text-xl" />
            </button>
            <button onClick={() => onNavigate('chatbot')} className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-all shadow-lg active:scale-95 group border border-indigo-400/30">
                <MaterialSymbol icon="smart_toy" className="text-xl group-hover:rotate-12 transition-transform" />
            </button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="xl:hidden p-3 text-slate-400 hover:text-white transition-colors">
                <MaterialSymbol icon={isMenuOpen ? "close" : "menu"} className="text-2xl" />
            </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="xl:hidden bg-slate-950 border-b border-white/10 animate-slide-in-bottom">
            <div className="flex flex-col p-4 gap-2">
                {navItems.map(item => (
                    <button key={item.id} onClick={() => { onNavigate(item.id); setIsMenuOpen(false); }} className={`p-4 text-left text-xs font-black uppercase tracking-widest rounded-xl ${activePage === item.id ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' : 'text-slate-500'}`}>{item.label}</button>
                ))}
            </div>
        </div>
      )}
    </header>
  );
};

export default Header;