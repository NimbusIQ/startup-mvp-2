
import React from 'react';
import { PageTitle, ActionButton } from '../components/shared';
import { MaterialSymbol } from '../components/icons';

interface ServicesProps {
    onNavigate: (page: string) => void;
}

const Services: React.FC<ServicesProps> = ({ onNavigate }) => {
  const modules = [
    { title: 'Agentic SaaS Architecture', icon: 'hub', desc: 'Deploy micro-service swarms that evolve with your business logic.' },
    { title: 'RAG Knowledge Systems', icon: 'storage', desc: 'Convert technical documentation into live, queryable neural memory.' },
    { title: 'MCP / ADK Engineering', icon: 'settings_input_component', desc: 'Seamlessly link legacy data streams to modern AI protocols.' },
    { title: 'Performance-Wrapped Apps', icon: 'speed', desc: 'UI/UX focused on real-time telemetry and ROI halos.' },
    { title: 'AI Ops & Deployment', icon: 'cloud_done', desc: 'Sovereign-grade infrastructure management for highly regulated sectors.' },
  ];

  return (
    <div className="flex flex-col space-y-24 py-20 animate-fade-in bg-[#020617] px-6">
      <div className="max-w-6xl mx-auto w-full space-y-20">
        <PageTitle 
            title="Service Modules" 
            subtitle="Every system is sovereign. Every service is modular." 
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {modules.map((m, i) => (
                <div key={i} className="bg-slate-900/40 border border-white/5 rounded-[4rem] p-12 space-y-8 hover:border-indigo-500/40 transition-all group relative overflow-hidden">
                    <div className="h-16 w-16 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-lg">
                        <MaterialSymbol icon={m.icon} className="text-3xl" />
                    </div>
                    <h3 className="text-3xl font-black text-white tracking-tight uppercase leading-none">{m.title}</h3>
                    <p className="text-slate-500 text-lg leading-relaxed font-medium">{m.desc}</p>
                </div>
            ))}
            
            <div className="bg-indigo-600/10 border border-indigo-500/30 rounded-[4rem] p-12 flex flex-col items-center justify-center text-center space-y-6 group cursor-pointer hover:bg-indigo-600/20 transition-all" onClick={() => onNavigate('contact')}>
                <div className="h-20 w-20 rounded-full bg-indigo-500 text-white flex items-center justify-center shadow-[0_0_40px_rgba(99,102,241,0.4)]">
                    <MaterialSymbol icon="add" className="text-4xl" />
                </div>
                <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Custom <br /> Blueprint</h3>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Inquire for Architecture</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
