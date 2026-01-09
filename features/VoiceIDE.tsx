
import React from 'react';
import { PageTitle, ActionButton } from '../components/shared';
import { MaterialSymbol } from '../components/icons';

const VoiceIDE: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full min-h-[700px] animate-fade-in">
      {/* Sidebar: Context */}
      <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-[3rem] p-10 flex flex-col space-y-10 shadow-2xl">
        <div className="flex items-center gap-3 text-indigo-400">
           <MaterialSymbol icon="code_blocks" className="text-3xl" />
           <h3 className="text-xl font-black uppercase tracking-tighter text-white">Voice Context</h3>
        </div>

        <div className="space-y-6 flex-grow">
           <div className="bg-slate-950 p-8 rounded-3xl border border-white/5 relative group">
              <div className="flex items-center gap-3 mb-4">
                 <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Mic Active</span>
              </div>
              <div className="h-12 flex items-end gap-1.5 justify-center">
                 {[...Array(12)].map((_, i) => (
                    <div key={i} className="w-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ height: `${Math.random() * 40 + 10}px`, animationDelay: `${i * 0.1}s` }} />
                 ))}
              </div>
           </div>

           <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Last Intent Recognized</p>
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-xs font-mono text-indigo-300 leading-relaxed italic">
                 "Synthesize a new multi-tenant SaaS dashboard for Project 647... include GKE cluster status."
              </div>
           </div>
        </div>

        <div className="p-6 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl">
           <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest text-center">Identity_Matrix: Dustin_D_Moore (Verified)</p>
        </div>
      </div>

      {/* Main: Visual Canvas */}
      <div className="lg:col-span-8 bg-[#020617] border border-slate-800 rounded-[3rem] relative overflow-hidden flex flex-col items-center justify-center group shadow-inner">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.05)_0%,transparent_70%)]"></div>
        
        <div className="relative z-10 text-center space-y-10 max-w-xl px-12">
           <div className="w-24 h-24 bg-slate-900 rounded-[2rem] mx-auto flex items-center justify-center border border-slate-800 shadow-2xl group-hover:scale-110 group-hover:border-indigo-500/50 transition-all duration-700">
              <MaterialSymbol icon="keyboard_voice" className="text-5xl text-slate-700 group-hover:text-indigo-500 transition-all" />
           </div>
           <div>
              <h2 className="text-4xl font-black text-white tracking-tighter leading-none mb-4 uppercase">Voice-First Dev Environment</h2>
              <p className="text-slate-400 text-lg leading-relaxed font-medium">
                 Speak naturally to generate React modules, API agents, or AlloyDB schemas. 
                 The "IDE-for-Non-Devs" powered by Gemini 3 and the Nimbus Flux ADK.
              </p>
           </div>
           
           <div className="flex flex-col items-center gap-4">
              <ActionButton className="px-12 py-6 text-xl" icon={<MaterialSymbol icon="play_arrow" />}>Initialize IDE Session</ActionButton>
              <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.4em]">Ready for SCP-Transform Process</p>
           </div>
        </div>

        {/* Dynamic Wave Decor */}
        <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-indigo-900/10 to-transparent pointer-events-none opacity-50"></div>
      </div>
    </div>
  );
};

export default VoiceIDE;
