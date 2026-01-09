import React from 'react';
import { PageTitle, ActionButton } from '../components/shared';
import { MaterialSymbol } from '../components/icons';

const InvestorCodex: React.FC = () => {
  return (
    <div className="flex flex-col space-y-20 py-20 animate-fade-in px-6 min-h-screen">
      <div className="text-center max-w-4xl mx-auto space-y-4">
        <PageTitle 
            title="Investor Codex" 
            subtitle="We don’t pitch hype. We present systems, margins, and defensibility." 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
            { title: 'Architecture', icon: 'account_tree', desc: 'Multi-agent sovereign mesh built on Vertex AI and AlloyDB.' },
            { title: 'Moat', icon: 'castle', desc: 'Proprietary visual training data and regional regulatory vectors.' },
            { title: 'Expansion Vectors', icon: 'trending_up', desc: 'Scaling from roofing into total PropTech and GovTech verticals.' },
            { title: 'Exit Paths', icon: 'exit_to_app', desc: 'Strategic alignment with cloud hyperscalers and insurance leaders.' }
        ].map((block, i) => (
            <div key={i} className="bg-slate-900 border border-white/10 rounded-[3rem] p-12 space-y-8 shadow-xl hover:border-indigo-500/30 transition-all group">
                <div className="h-16 w-16 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-lg">
                    <MaterialSymbol icon={block.icon} className="text-3xl" />
                </div>
                <h3 className="text-3xl font-black text-white tracking-tighter uppercase text-left">{block.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed text-left">{block.desc}</p>
            </div>
        ))}
      </div>

      <div className="bg-[#0f172a] border border-white/5 rounded-[4rem] p-20 flex flex-col lg:flex-row gap-16 items-center shadow-2xl overflow-hidden relative max-w-6xl mx-auto">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(79,70,229,0.1)_0%,transparent_60%)]"></div>
        <div className="lg:w-1/2 space-y-8 relative z-10 text-left">
            <h2 className="text-5xl font-black text-white tracking-tighter leading-none uppercase">Systemic <br /> Defensibility</h2>
            <p className="text-slate-400 text-lg leading-relaxed">
                Nimbus IQ isn't just an application. It's an infrastructure layer for the next era of industrial property management. 
                Our moat is built on deterministic outcomes and sovereign data integrity.
            </p>
            <ActionButton className="px-10 py-5" icon={<MaterialSymbol icon="download" />}>Request Full Pro Forma</ActionButton>
        </div>
        <div className="lg:w-1/2 grid grid-cols-2 gap-6 relative z-10">
            {[
                { label: 'Project Status', val: 'Solid State' },
                { label: 'Compliance', val: 'TRAIGA TX' },
                { label: 'Inference', val: '84 tok/s' },
                { label: 'Rating', val: '4.98/5' }
            ].map((stat, i) => (
                <div key={i} className="p-10 bg-slate-950 border border-white/5 rounded-[2.5rem] flex flex-col justify-center text-center group hover:border-indigo-500/30 transition-colors">
                    <span className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-600 mb-2">{stat.label}</span>
                    <span className="text-xl font-black text-white tracking-tighter">{stat.val}</span>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default InvestorCodex;