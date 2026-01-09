
import React, { useState } from 'react';
import { PageTitle, ActionButton } from '../components/shared';
import { MaterialSymbol } from '../components/icons';

interface AgentProfile {
    id: string;
    name: string;
    type: string;
    tagline: string;
    description: string;
    price: string;
    features: string[];
    image: string;
    badge?: string;
}

const AGENT_LIST: AgentProfile[] = [
    {
        id: 'shingle-shield',
        name: 'Shingle Shield AI',
        type: 'SaaS Vision',
        tagline: 'Deterministic Damage Classification',
        description: 'Automate roof damage detection, classification, and documentation from camera streams. Built on Gemini 1.5 Flash.',
        price: '$49/mo',
        features: ['B2B Visual Inference', 'Structured JSON Output', 'Texas Standard Compliance'],
        image: 'https://images.unsplash.com/photo-1631545724501-310116863190?auto=format&fit=crop&q=80&w=800',
        badge: 'Popular'
    },
    {
        id: 'seo-nexus',
        name: 'Nimbus SEO Agent',
        type: 'Domain RAG',
        tagline: 'Location-Aware Growth Engine',
        description: 'Domain-specific RAG system for contractors. Generate location-aware content and structured schema at scale.',
        price: '$199/mo',
        features: ['Location Modifiers', 'Google Ads Snippets', 'Headless API Access'],
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
        badge: 'Growth Tier'
    },
    {
        id: 'enterprise-infra',
        name: 'Enterprise Nexus',
        type: 'PropTech Core',
        tagline: 'Custom Inference Layer',
        description: 'Dedicated GKE nodes, white-label UI integration, and private inference layer for large-scale property ecosystems.',
        price: 'Custom',
        features: ['Vertex AI Fine-Tuning', 'Private GKE Clusters', 'Direct Cloud Support'],
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800',
        badge: 'SLA Guaranteed'
    }
];

interface MarketplaceProps {
    onSelectFeature: (id: string) => void;
}

const AgentMarketplace: React.FC<MarketplaceProps> = ({ onSelectFeature }) => {
    const [selectedAgent, setSelectedAgent] = useState<AgentProfile | null>(null);
    const [orderStep, setOrderStep] = useState(0); // 0: gallery, 1: configure, 2: success

    const handleDeploy = (agent: AgentProfile) => {
        if (agent.price === 'Custom') {
             window.location.href = 'mailto:genaifirst@nimbusiq.ai?subject=Enterprise Licensing Inquiry';
             return;
        }
        setSelectedAgent(agent);
        setOrderStep(1);
    };

    if (orderStep === 1 && selectedAgent) {
        return (
            <div className="max-w-4xl mx-auto py-12 animate-slide-in-bottom">
                <button onClick={() => setOrderStep(0)} className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-10 group">
                    <MaterialSymbol icon="arrow_back" className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Return to Marketplace</span>
                </button>
                <div className="bg-slate-900/60 border border-white/5 rounded-[3.5rem] p-16 shadow-2xl space-y-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[100px] -mr-32 -mt-32"></div>
                    <div className="flex flex-col md:flex-row gap-12 items-center relative z-10">
                        <img src={selectedAgent.image} className="w-40 h-40 rounded-[2.5rem] object-cover shadow-2xl border-4 border-white/5" />
                        <div className="text-center md:text-left">
                            <h2 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">Provision {selectedAgent.name}</h2>
                            <p className="text-cyan-400 font-bold uppercase tracking-widest text-xs mt-3">SaaS Node Activation</p>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Inference Mode</label>
                            <select className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 text-sm font-bold text-white outline-none focus:border-cyan-500/50 transition-colors">
                                <option>Standard Flash (Latency-First)</option>
                                <option>Pro Reasoning (Accuracy-First)</option>
                            </select>
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">API Region</label>
                            <select className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 text-sm font-bold text-white outline-none focus:border-cyan-500/50 transition-colors">
                                <option>us-central1 (North America)</option>
                                <option>europe-west4 (EMEA)</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
                        <div className="text-center md:text-left">
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-black text-white">{selectedAgent.price}</span>
                                <span className="text-slate-600 text-sm font-bold uppercase">/month</span>
                            </div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-600 mt-2">Billed as per GCP Startup Framework</p>
                        </div>
                        <ActionButton className="px-16 py-7 text-xl" onClick={() => setOrderStep(2)}>Activate License</ActionButton>
                    </div>
                </div>
            </div>
        );
    }

    if (orderStep === 2) {
        return (
            <div className="max-w-2xl mx-auto py-32 text-center space-y-12 animate-pop-in">
                <div className="relative">
                    <div className="absolute inset-0 bg-green-500 blur-[80px] opacity-10 animate-pulse"></div>
                    <div className="h-40 w-40 rounded-full bg-slate-950 border-4 border-green-500 flex items-center justify-center mx-auto relative z-10">
                        <MaterialSymbol icon="verified" className="text-7xl text-green-500" />
                    </div>
                </div>
                <div className="space-y-6">
                    <h2 className="text-5xl font-black text-white uppercase tracking-tighter leading-none">Node Provisioned</h2>
                    <p className="text-slate-400 text-xl font-medium max-w-lg mx-auto leading-relaxed">
                        SaaS instance for <span className="text-cyan-400">{selectedAgent?.name}</span> is live. Inference endpoints are now reachable.
                    </p>
                </div>
                <div className="flex gap-6 justify-center">
                    <ActionButton icon={<MaterialSymbol icon="dashboard" />} onClick={() => onSelectFeature('image_studio')}>Enter Studio</ActionButton>
                    <ActionButton variant="secondary" onClick={() => setOrderStep(0)}>Return to Gallery</ActionButton>
                </div>
                <div className="bg-white/5 p-6 rounded-3xl border border-white/5 inline-block">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">RESTful Base URL</p>
                    <code className="text-cyan-400 font-mono text-sm">https://api.nimbusiq.ai/v1/analyze</code>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full space-y-20 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-end gap-10">
                <PageTitle title="SaaS License Marketplace" subtitle="Deploy specialized AI infrastructure for your property enterprise." />
                <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-white/5 mb-10">
                    <button className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl bg-cyan-500 text-slate-950 shadow-lg">Featured</button>
                    <button className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl text-slate-500 hover:text-slate-300 transition-all">All Tiers</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {AGENT_LIST.map((agent) => (
                    <div key={agent.id} className="bg-slate-900/60 border border-white/5 rounded-[3.5rem] overflow-hidden group hover:border-cyan-500/30 transition-all shadow-xl flex flex-col h-full">
                        <div className="h-64 overflow-hidden relative">
                            <img src={agent.image} alt={agent.name} className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent"></div>
                            {agent.badge && (
                                <div className="absolute top-8 left-8 px-5 py-2 rounded-full bg-cyan-500 text-[10px] font-black uppercase tracking-[0.2em] text-slate-950 shadow-2xl">
                                    {agent.badge}
                                </div>
                            )}
                            <div className="absolute bottom-8 left-10">
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-400">{agent.type}</span>
                                <h3 className="text-4xl font-black text-white tracking-tighter uppercase mt-2">{agent.name}</h3>
                            </div>
                        </div>
                        <div className="p-12 flex-grow flex flex-col space-y-10">
                            <div>
                                <p className="text-white font-black text-sm uppercase tracking-tight mb-3">{agent.tagline}</p>
                                <p className="text-slate-400 text-sm font-medium leading-relaxed">{agent.description}</p>
                            </div>
                            <ul className="space-y-5 flex-grow">
                                {agent.features.map((feature, i) => (
                                    <li key={i} className="flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                                        <MaterialSymbol icon="verified" className="text-cyan-400 mr-4 text-xl" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <div className="pt-10 border-t border-white/5 flex items-center justify-between">
                                <div>
                                    <span className="text-3xl font-black text-white">{agent.price}</span>
                                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-600 mt-1">SaaS Economy</p>
                                </div>
                                <ActionButton className="px-10 py-5" onClick={() => handleDeploy(agent)}>Activate Tier</ActionButton>
                            </div>
                        </div>
                    </div>
                ))}

                <div className="bg-slate-950 border-4 border-dashed border-white/5 rounded-[3.5rem] p-16 flex flex-col items-center justify-center text-center space-y-10 group hover:border-cyan-500/50 transition-all cursor-pointer">
                    <div className="h-32 w-32 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-cyan-500/10 transition-colors">
                        <MaterialSymbol icon="add_moderator" className="text-7xl text-slate-700 group-hover:text-cyan-400 transition-colors" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-white uppercase tracking-tighter">White-Label</h3>
                        <p className="text-slate-500 text-sm font-medium mt-3 max-w-[240px] mx-auto leading-relaxed">
                            Custom private-instance deployment for large property management ecosystems.
                        </p>
                    </div>
                    <ActionButton variant="secondary" className="px-12 h-16 text-lg" icon={<MaterialSymbol icon="edit_note" />}>Request Quote</ActionButton>
                </div>
            </div>
            
            <div className="bg-white/5 border border-white/10 rounded-[4rem] p-24 text-center space-y-12">
                <MaterialSymbol icon="format_quote" className="text-8xl text-cyan-500/20 mx-auto" />
                <h2 className="text-4xl font-black text-white tracking-tighter max-w-4xl mx-auto italic leading-tight">
                    "Nimbus IQ converted our manual inspections into an automated infrastructure pipeline overnight. Deterministic JSON is the differentiator."
                </h2>
                <div className="flex flex-col items-center">
                    <p className="text-cyan-400 font-black uppercase tracking-[0.4em] text-sm">Sarah Jenkins</p>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2">CTO, CloudProp Systems</p>
                </div>
            </div>
        </div>
    );
};

export default AgentMarketplace;
