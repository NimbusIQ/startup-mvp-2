import React from 'react';
import { PageTitle } from '../components/shared';
import { MaterialSymbol } from '../components/icons';

const Mascot: React.FC = () => {
  return (
    <div className="flex flex-col space-y-20 py-20 animate-fade-in max-w-6xl mx-auto px-6 min-h-screen">
      <div className="text-center space-y-4">
        <PageTitle 
            title="Mascot: Nimbus" 
            subtitle="Concept: AI Raven / Storm Architect" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
        <div className="relative group">
            <div className="absolute inset-0 bg-indigo-600/10 blur-[120px] rounded-full opacity-50"></div>
            <div className="aspect-[4/5] bg-slate-900 border border-white/5 rounded-[4rem] overflow-hidden relative shadow-2xl">
                <img 
                    src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200" 
                    className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000" 
                    alt="Nimbus Raven"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                <div className="absolute bottom-12 left-12 right-12 text-left">
                    <h2 className="text-6xl font-black text-white tracking-tighter uppercase leading-none">The Raven</h2>
                    <p className="text-indigo-400 font-bold uppercase tracking-widest text-xs mt-4">Storm Forensic Protocol Active</p>
                </div>
            </div>
        </div>

        <div className="space-y-12 text-left">
            <div className="space-y-6">
                <h3 className="text-sm font-black text-indigo-500 uppercase tracking-[0.4em]">Every system needs a guide.</h3>
                <p className="text-slate-400 text-xl leading-relaxed font-medium">
                    Nimbus is a Storm Architect—a silent observer trained to find truth in the noise of operational chaos. 
                    Like a sentinel in the storm, it navigates complex telemetry to provide clarity when it's needed most.
                </p>
            </div>

            <div className="grid gap-8">
                {[
                    { title: 'Broad Perspective', desc: 'Nimbus scans the entire operational landscape to identify hidden risks.' },
                    { title: 'Forensic Precision', desc: 'Trained on thousands of hours of high-concurrency property data.' },
                    { title: 'Adaptive Wisdom', desc: 'A living mascot that evolves as your ecosystem scales.' }
                ].map((trait, i) => (
                    <div key={i} className="flex gap-6 items-start group">
                        <div className="h-12 w-12 rounded-2xl bg-slate-900 border border-white/10 shrink-0 flex items-center justify-center text-slate-500 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                            <MaterialSymbol icon="verified" className="text-xl" />
                        </div>
                        <div className="text-left">
                            <h4 className="text-lg font-black text-white uppercase tracking-tight">{trait.title}</h4>
                            <p className="text-sm text-slate-500 leading-relaxed">{trait.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Mascot;