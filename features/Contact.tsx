import React from 'react';
import { PageTitle, ActionButton } from '../components/shared';
import { MaterialSymbol } from '../components/icons';

const Contact: React.FC = () => {
  return (
    <div className="flex flex-col space-y-24 py-16 animate-fade-in bg-[#020617] px-6 min-h-screen">
      <div className="max-w-4xl mx-auto w-full space-y-20">
        <PageTitle 
            title="Inquiry Interface" 
            subtitle="Serious inquiries only. Builders. Operators. Investors." 
        />
        
        <div className="bg-slate-900 border border-white/10 rounded-[4rem] p-12 md:p-20 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(79,70,229,0.05)_0%,transparent_70%)]"></div>
            
            <form className="space-y-10 relative z-10" onSubmit={e => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Legal Name</label>
                        <input type="text" placeholder="Identity Matrix" className="w-full bg-slate-950 border border-white/10 rounded-2xl p-6 text-white outline-none focus:border-indigo-500 transition-all font-mono text-sm" />
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Sovereign Domain</label>
                        <input type="email" placeholder="email@enterprise.ai" className="w-full bg-slate-950 border border-white/10 rounded-2xl p-6 text-white outline-none focus:border-indigo-500 transition-all font-mono text-sm" />
                    </div>
                </div>
                
                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Inquiry Vector</label>
                    <select className="w-full bg-slate-950 border border-white/10 rounded-2xl p-6 text-white outline-none focus:border-indigo-500 transition-all font-mono text-sm appearance-none">
                        <option>SaaS Licensing Inquiry</option>
                        <option>Architecture Blueprint Request</option>
                        <option>Investor Relations</option>
                        <option>Sovereign Cloud Migration</option>
                    </select>
                </div>

                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Mission Brief</label>
                    <textarea rows={6} placeholder="Describe the fragile workflows you wish to eliminate..." className="w-full bg-slate-950 border border-white/10 rounded-2xl p-6 text-white outline-none focus:border-indigo-500 transition-all font-mono text-sm resize-none" />
                </div>

                <div className="pt-6">
                    <ActionButton className="w-full py-8 text-2xl uppercase tracking-[0.2em]" icon={<MaterialSymbol icon="send" />}>
                        Deploy Inquiry
                    </ActionButton>
                </div>
            </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-1000">
            <div className="bg-slate-950 border border-white/5 rounded-[2.5rem] p-10 flex items-center gap-8">
                <MaterialSymbol icon="location_on" className="text-4xl text-indigo-500" />
                <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 block mb-1">HQ Texas</span>
                    <span className="text-white font-black text-sm uppercase">McKinney Innovation Hub</span>
                </div>
            </div>
            <div className="bg-slate-950 border border-white/5 rounded-[2.5rem] p-10 flex items-center gap-8">
                <MaterialSymbol icon="mail" className="text-4xl text-indigo-500" />
                <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 block mb-1">Direct Sync</span>
                    <span className="text-white font-black text-sm uppercase">genaifirst@nimbusiq.ai</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;