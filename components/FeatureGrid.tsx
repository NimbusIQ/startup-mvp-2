import React, { useState, useEffect } from 'react';
import FeatureCard from './FeatureCard';
import { ActionButton } from './shared';
import { MaterialSymbol } from './icons';

interface FeatureGridProps {
  onSelectFeature: (id: string) => void;
}

const FeatureGrid: React.FC<FeatureGridProps> = ({ onSelectFeature }) => {
  const [terminalOutput, setTerminalOutput] = useState([
    "> INITIALIZING NIMBUS FLUX ORBIT v3.2 (FORENSIC)...",
    "> LOADING SOVEREIGN IDENTITY MATRIX...",
    "> CONNECTING TO CLAIMCORE REASONING ENGINE...",
    "> CHRONOLOGY_GROUNDING: SYNCED",
    "> CODE_COMPLIANCE_VECTOR: IRC_2021_ACTIVE"
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const msgs = [
        "> TELEMETRY: Supplemental audit identified $2,400 code missing.",
        "> ALERT: NOAA grounding confirmed hail event TX-DOL-03-25.",
        "> SYNC: ClaimCore sniper detected Carrier Padding in Sector 7.",
        "> OPTIMIZATION: Forensic Vision Agent refined damage labels.",
        "> LOG: AG2P settlement gateway verified signature.",
        "> SIP: Incoming call from 214-555-0123 handled by Nancye."
      ];
      setTerminalOutput(prev => [...prev.slice(-4), msgs[Math.floor(Math.random() * msgs.length)]]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const coreProducts = [
    { id: 'claim_core', title: 'ClaimCore Agent', icon: 'gavel', description: 'Aggressive insurance supplement specialist with code citation.' },
    { id: 'image_studio', title: '4K Forensic Lab', icon: 'biotech', description: '2K/4K visual damage classification and forensic heatmap labels.' },
    { id: 'icon_factory', title: 'Icon Factory', icon: 'token', description: 'Generate custom sovereign-styled icons and UI assets.' },
    { id: 'nancye_assistant', title: 'AI Admin Nancye', icon: 'support_agent', description: 'Sovereign voice assistant for dispatch, billing, and scheduling.' },
  ];

  const devTools = [
    { id: 'video_studio', title: 'Motion Lab', icon: 'movie_edit', description: 'Cinematic temporal synthesis via Veo 3 engine.' },
    { id: 'audio_studio', title: 'Vocal Studio', icon: 'settings_voice', description: 'Ultra-low latency live sensory interaction.' },
    { id: 'architecture_studio', title: 'AAMA Architect', icon: 'account_tree', description: 'Brainstorm infrastructure via voice and render 4K blueprints.' },
    { id: 'knowledge_base', title: 'Neural Library', icon: 'menu_book', description: 'Technical documentation and system logic specs.' },
  ];

  return (
    <div className="space-y-12 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8 space-y-6">
                <div className="bg-gradient-to-br from-[#0f172a] to-[#020617] border border-slate-800 rounded-[3rem] p-12 relative overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(79,70,229,0.15)_0%,transparent_70%)]"></div>
                    <div className="relative z-10 space-y-8">
                        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black tracking-[0.3em] uppercase">
                            <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse mr-2"></span>
                            Forensic Nexus v3.2
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none">
                            Mission <br />
                            <span className="text-indigo-500">Control</span>
                        </h1>
                        <p className="text-slate-400 text-lg md:text-xl max-w-2xl font-medium leading-relaxed">
                            Deploy aggressive cognitive infrastructure. Eliminate clerical latency with high-fidelity agents.
                        </p>
                        <div className="flex gap-4 pt-4">
                            <ActionButton onClick={() => onSelectFeature('claim_core')} icon={<MaterialSymbol icon="shield_search" />}>Run Claim Audit</ActionButton>
                            <ActionButton variant="secondary" onClick={() => onSelectFeature('chatbot')} icon={<MaterialSymbol icon="chat" />}>Speak to Prime</ActionButton>
                        </div>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-4 h-full">
                <div className="bg-[#020617] border border-slate-800 rounded-[2.5rem] p-8 h-full flex flex-col shadow-inner">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <MaterialSymbol icon="terminal" className="text-indigo-500" />
                            <span className="text-[10px] font-mono font-black uppercase tracking-widest text-slate-500">Audit_Log</span>
                        </div>
                    </div>
                    <div className="flex-grow font-mono text-[11px] space-y-3">
                        {terminalOutput.map((log, i) => (
                            <div key={i} className="text-slate-400 border-l-2 border-slate-800 pl-3 leading-relaxed">
                                <span className="text-indigo-500 mr-2 opacity-50">{(new Date()).toLocaleTimeString()}</span>
                                {log}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        <div className="space-y-16 pb-12">
            <div className="space-y-8">
                <div className="flex items-center gap-3">
                    <MaterialSymbol icon="layers" className="text-indigo-500 text-2xl" />
                    <h2 className="text-sm font-black text-slate-500 uppercase tracking-[0.4em]">Core Agents</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {coreProducts.map(p => <FeatureCard key={p.id} {...p} onSelect={onSelectFeature} />)}
                </div>
            </div>

            <div className="space-y-8">
                <div className="flex items-center gap-3">
                    <MaterialSymbol icon="developer_board" className="text-slate-500 text-2xl" />
                    <h2 className="text-sm font-black text-slate-500 uppercase tracking-[0.4em]">Sensory & Infra</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {devTools.map(p => <FeatureCard key={p.id} {...p} onSelect={onSelectFeature} />)}
                </div>
            </div>
        </div>
    </div>
  );
};

export default FeatureGrid;