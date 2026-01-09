
import React from 'react';
import { ActionButton } from '../components/shared';
import { MaterialSymbol } from '../components/icons';

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col bg-[#020617] overflow-hidden">
      {/* Premium Hero Section */}
      <section className="relative min-h-[95vh] flex flex-col items-center justify-center text-center px-4 pt-20">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none"></div>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1400px] h-[800px] bg-indigo-600/10 blur-[180px] rounded-full pointer-events-none animate-pulse"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto space-y-16">
          <div className="inline-flex items-center px-6 py-2 rounded-full bg-slate-950/80 border border-indigo-500/30 text-indigo-400 text-[10px] font-black tracking-[0.6em] uppercase shadow-[0_0_30px_rgba(99,102,241,0.2)] animate-fade-in backdrop-blur-xl">
            <span className="h-2 w-2 rounded-full bg-indigo-500 animate-ping mr-4 shadow-[0_0_10px_#6366f1]"></span>
            Sovereign OS • Google Startup Partner v3.1
          </div>
          
          <div className="space-y-6">
              <h1 className="text-7xl md:text-[12rem] font-black tracking-tighter leading-[0.75] uppercase liquid-chrome drop-shadow-2xl">
                Monetize <br />
                Intelligence. <br />
              </h1>
              <h1 className="text-7xl md:text-[12rem] font-black tracking-tighter leading-[0.75] uppercase text-white/90">
                Scale Trust.
              </h1>
          </div>
          
          <p className="text-slate-400 text-xl md:text-3xl max-w-4xl mx-auto font-light leading-relaxed tracking-tight">
            The premium front door for <span className="text-white font-bold">Gemini-Native</span> PropTech infrastructure. 
            NAICS 541715 Compliant Sovereign Core.
          </p>

          <div className="flex flex-col sm:flex-row gap-8 justify-center pt-12">
            <button 
              onClick={() => onNavigate('the_brain')} 
              className="px-16 py-10 bg-indigo-600 text-white font-black text-xl uppercase tracking-widest rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(99,102,241,0.5)] hover:scale-105 active:scale-95 transition-all flex items-center gap-4 group border border-indigo-400/50"
            >
              <MaterialSymbol icon="psychology" className="text-3xl group-hover:rotate-12 transition-transform" />
              Sovereign Core
            </button>
            <button 
              onClick={() => onNavigate('agent_marketplace')} 
              className="px-16 py-10 bg-white/5 backdrop-blur-3xl text-white font-black text-xl uppercase tracking-widest rounded-[2rem] border border-white/10 hover:bg-white/10 hover:border-indigo-500/30 shadow-2xl transition-all flex items-center gap-4 group"
            >
              <MaterialSymbol icon="shopping_bag" className="text-3xl group-hover:-translate-y-1 transition-transform" />
              Marketplace
            </button>
          </div>
        </div>

        {/* Global Telemetry HUD */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full max-w-7xl flex justify-between px-10 opacity-40 hover:opacity-100 transition-opacity duration-1000 font-mono">
            <div className="text-left space-y-1">
                <span className="block text-[8px] font-black uppercase tracking-[0.5em] text-slate-600">EIN Verification</span>
                <span className="text-xs font-black text-white">TX_39-37030017</span>
            </div>
            <div className="text-center space-y-1">
                <span className="block text-[8px] font-black uppercase tracking-[0.5em] text-slate-600">Model Load</span>
                <span className="text-xs font-black text-emerald-400">GEMINI_3_PRO_ACTIVE</span>
            </div>
            <div className="text-right space-y-1">
                <span className="block text-[8px] font-black uppercase tracking-[0.5em] text-slate-600">Jurisdiction</span>
                <span className="text-xs font-black text-indigo-500">TEXAS_GOV_REGISTERED</span>
            </div>
        </div>
      </section>

      {/* Feature Grids with Premium Glassmorphism */}
      <section className="py-48 border-y border-white/5 bg-slate-950/50 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.02)_0%,transparent_70%)]"></div>
        <div className="container mx-auto px-8 space-y-32">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {[
                    { title: 'Visual Forensics', icon: 'biotech', desc: 'Identify $10k+ in missing supplements via 4K satellite & drone imagery.' },
                    { title: 'Vocal Receptionist', icon: 'support_agent', desc: 'Nancye handles intake, scheduling, and billing with native voice intelligence.' },
                    { title: 'Sheet OS Engine', icon: 'grid_on', desc: 'Turn legacy Google Sheets into sovereign SaaS endpoints in 60 seconds.' }
                ].map((s, i) => (
                    <div key={i} className="glass-panel p-12 rounded-[4rem] border border-white/5 hover:border-indigo-500/40 transition-all group relative overflow-hidden bg-white/[0.02] shadow-2xl">
                        <div className="h-20 w-20 rounded-3xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-xl mb-10">
                            <MaterialSymbol icon={s.icon} className="text-4xl" />
                        </div>
                        <h3 className="text-3xl font-black text-white tracking-tight uppercase mb-6">{s.title}</h3>
                        <p className="text-slate-500 text-lg leading-relaxed">{s.desc}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
