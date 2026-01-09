import React from 'react';
import { PageTitle } from '../components/shared';
import { MaterialSymbol } from '../components/icons';

const About: React.FC = () => {
  return (
    <div className="flex flex-col space-y-24 py-20 animate-fade-in bg-[#020617] px-6 min-h-screen">
      <div className="max-w-6xl mx-auto w-full">
        <PageTitle 
            title="Sovereign Identity" 
            subtitle="We don't build software. We deploy living systems." 
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center mt-20">
            <div className="space-y-12">
                <div className="space-y-4">
                    <span className="text-indigo-500 text-[10px] font-black uppercase tracking-[0.4em]">The Vision</span>
                    <h2 className="text-6xl font-black text-white tracking-tighter uppercase leading-[0.9]">
                        Eliminating <br />
                        Fragile <br />
                        <span className="text-indigo-500">Workflows.</span>
                    </h2>
                </div>
                <p className="text-slate-400 text-xl leading-relaxed font-medium">
                    NimbusIQ was founded to eliminate fragile workflows and replace them with living systems. 
                    We don’t automate tasks — we deploy intelligence. 
                </p>
                <div className="p-10 bg-slate-900/60 border border-white/10 rounded-[3rem] relative overflow-hidden group">
                    <div className="absolute inset-0 bg-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <MaterialSymbol icon="format_quote" className="text-5xl text-indigo-500/20 mb-6" />
                    <p className="text-white text-lg font-bold leading-relaxed italic">
                        "The goal isn't better tools. It's a better brain at the center of your operation."
                    </p>
                    <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest mt-6">— Dustin Moore, Founder</p>
                </div>
            </div>
            
            <div className="relative group">
                <div className="aspect-[4/5] bg-slate-900 border border-white/10 rounded-[4rem] overflow-hidden relative shadow-2xl">
                    <img 
                        src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200" 
                        alt="Infrastructure" 
                        className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                    <div className="absolute bottom-12 left-12 right-12 text-left">
                        <span className="text-indigo-500 text-[10px] font-black uppercase tracking-[0.4em] mb-4 block text-left">Architectural Core</span>
                        <h3 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">Solid State <br /> Governance</h3>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default About;