
import React from 'react';
import { PageTitle } from '../components/shared';
import { MaterialSymbol } from '../components/icons';

const CaseStudies: React.FC = () => {
  const studies = [
    {
        title: 'Roofing Multi-Site Logic',
        client: 'Nimbus Roofing',
        problem: 'Insurance claim documentation required 12+ manual hours per project.',
        intelligence: 'Deployed "Shingle Shield AI" Vision Agent and AAMA Live Mapping.',
        outcome: '92% reduction in clerical latency. 100% compliance audit pass rate.',
        icon: 'home_repair_service',
        color: 'cyan'
    },
    {
        title: 'TCM Health Diagnostics',
        client: 'Holistic Wellness Group',
        problem: 'Manual diet plan synthesis was inconsistent and slow.',
        intelligence: 'Implemented multi-modal facial recognition for Yang Deficiency detection.',
        outcome: 'Real-time dietary protocols deployed to 1,000+ test subjects instantly.',
        icon: 'health_and_safety',
        color: 'emerald'
    },
    {
        title: 'Enterprise CRM Sentiment',
        client: 'Global Logistics Corp',
        problem: 'Undetected lead friction was causing a 12% annual churn.',
        intelligence: 'Agentic CRM mesh with predictive lead scoring and sentiment alerts.',
        outcome: 'First-quarter churn reduction of 4%. Predictive accuracy @ 88%.',
        icon: 'query_stats',
        color: 'indigo'
    }
  ];

  return (
    <div className="flex flex-col space-y-24 py-16 animate-fade-in bg-[#020617] px-6">
      <div className="max-w-6xl mx-auto w-full space-y-20">
        <PageTitle 
            title="Case Studies" 
            subtitle="Results measured in speed, margin, and clarity." 
        />
        
        <div className="space-y-16">
            {studies.map((s, i) => (
                <div key={i} className="bg-slate-900/40 border border-white/5 rounded-[4rem] p-12 md:p-20 flex flex-col lg:flex-row gap-16 hover:border-indigo-500/30 transition-all group shadow-2xl relative overflow-hidden">
                    <div className={`absolute top-0 left-0 w-2 h-full bg-${s.color}-500 group-hover:bg-indigo-500 transition-colors`}></div>
                    
                    <div className="lg:w-1/3 space-y-6">
                        <div className={`h-20 w-20 rounded-3xl bg-${s.color}-500/10 text-${s.color}-400 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-xl`}>
                            <MaterialSymbol icon={s.icon} className="text-4xl" />
                        </div>
                        <h3 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">{s.title}</h3>
                        <div className="flex items-center gap-3">
                            <span className="text-indigo-500 text-[10px] font-black uppercase tracking-widest">Client:</span>
                            <span className="text-slate-400 font-bold uppercase tracking-tight text-sm">{s.client}</span>
                        </div>
                    </div>

                    <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="space-y-3">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">Problem</span>
                            <p className="text-slate-300 text-sm leading-relaxed font-medium">{s.problem}</p>
                        </div>
                        <div className="space-y-3">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500">Intelligence Deployed</span>
                            <p className="text-white text-sm leading-relaxed font-black">{s.intelligence}</p>
                        </div>
                        <div className="space-y-3">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500">Outcome</span>
                            <p className="text-emerald-400 text-sm leading-relaxed font-black italic">{s.outcome}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default CaseStudies;
