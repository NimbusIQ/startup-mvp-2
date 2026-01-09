import React, { useState, useEffect, useRef } from 'react';
import { PageTitle, ActionButton } from '../components/shared';
import { MaterialSymbol } from '../components/icons';

interface Log {
  id: number;
  type: 'thinking' | 'call' | 'result' | 'info' | 'security' | 'swarm';
  msg: string;
  time: string;
}

const INITIAL_FUNCTIONS = [
  {
    id: 'fn_quantum_mesh',
    name: 'quantum_production_agent_mesh',
    description: 'Autonomous swarm orchestration via high-concurrency Python/FastAPI backend nodes.',
    status: 'active',
    node: 'gke-us-central-01',
    riskLevel: 'medium',
    requireApproval: true,
    lastCalled: 'Just now'
  },
  {
    id: 'fn_alloydb_sync',
    name: 'alloydb_vector_memory_sync',
    description: 'Synchronizing long-term neural memory with transactional state in AlloyDB clusters.',
    status: 'active',
    node: 'postgres-high-avail-01',
    riskLevel: 'low',
    requireApproval: false,
    lastCalled: '8 mins ago'
  },
  {
    id: 'fn_claimcore_audit',
    name: 'claimcore_forensic_trigger',
    description: 'Initializing forensic audit of carrier scopes against IRC/IBC 2021 building codes.',
    status: 'active',
    node: 'vision-compute-v3',
    riskLevel: 'high',
    requireApproval: true,
    lastCalled: '42 mins ago'
  },
  {
    id: 'fn_spanner_global',
    name: 'spanner_global_consensus_lock',
    description: 'Executing multi-regional consistency locks for cross-market insurance settlement.',
    status: 'active',
    node: 'spanner-global-mesh',
    riskLevel: 'critical',
    requireApproval: true,
    lastCalled: '1 hour ago'
  }
];

const AgentSwarmVisualizer = () => {
    const [agents, setAgents] = useState(Array.from({ length: 12 }, (_, i) => ({
        id: i,
        load: Math.random() * 100,
        status: Math.random() > 0.1 ? 'active' : 'recalibrating'
    })));

    useEffect(() => {
        const interval = setInterval(() => {
            setAgents(prev => prev.map(a => ({
                ...a,
                load: Math.min(100, Math.max(0, a.load + (Math.random() * 20 - 10))),
                status: Math.random() > 0.95 ? (a.status === 'active' ? 'recalibrating' : 'active') : a.status
            })));
        }, 1500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="grid grid-cols-6 gap-3 mb-10">
            {agents.map(agent => (
                <div key={agent.id} className="bg-slate-950 border border-white/5 p-3 rounded-xl flex flex-col gap-2 relative overflow-hidden group">
                    <div className="flex justify-between items-center relative z-10">
                        <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest">N_0{agent.id}</span>
                        <div className={`h-1 w-1 rounded-full ${agent.status === 'active' ? 'bg-indigo-500 animate-pulse' : 'bg-rose-500'}`}></div>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden relative z-10">
                        <div 
                            className={`h-full transition-all duration-1000 ${agent.load > 80 ? 'bg-rose-500' : 'bg-indigo-500'}`}
                            style={{ width: `${agent.load}%` }}
                        ></div>
                    </div>
                    <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
            ))}
        </div>
    );
};

const TheBrain: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const [functions, setFunctions] = useState(INITIAL_FUNCTIONS);
  const [logs, setLogs] = useState<Log[]>([
    { id: 1, type: 'info', msg: 'Sovereign Core Hub v3.5 (FLUX ORBIT) initialized. Security hardened.', time: '09:00:01' }
  ]);
  const [isAutoPilot, setIsAutoPilot] = useState(true);
  const [securityHardened, setSecurityHardened] = useState(true);
  const [investmentMax, setInvestmentMax] = useState(true);
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAutoPilot) return;

    const interval = setInterval(() => {
      const randomAction = Math.random();
      const timestamp = new Date().toLocaleTimeString();

      if (randomAction > 0.85) {
        addLog('swarm', 'Swarm Agent N_04 identified redundant compute cycle. Auto-trimming...', timestamp);
      } else if (randomAction > 0.7) {
        addLog('thinking', 'Neural Teacher refining Worker Curriculum for regional sector TX-CENTRAL...', timestamp);
      } else if (randomAction > 0.5) {
        addLog('security', 'Verifying forensic signatures for GKE-Inbound node cluster alpha...', timestamp);
      } else if (randomAction > 0.2) {
        const fn = functions[Math.floor(Math.random() * functions.length)];
        addLog('call', `Core Protocol invoking node: ${fn.node} [${fn.name}]`, timestamp);
        
        setTimeout(() => {
          addLog('result', `Node ${fn.node} returned Deterministic Ack (ID: ${Math.random().toString(36).substr(2, 8).toUpperCase()})`, timestamp);
        }, 1200);
      }
    }, 4500);

    return () => clearInterval(interval);
  }, [isAutoPilot, functions]);

  const addLog = (type: any, msg: string, time: string) => {
    setLogs(prev => [...prev, { id: Date.now(), type, msg, time }].slice(-30));
  };

  const toggleApproval = (id: string) => {
    setFunctions(prev => prev.map(f => 
      f.id === id ? { ...f, requireApproval: !f.requireApproval } : f
    ));
  };

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="flex flex-col space-y-12 py-10 animate-fade-in bg-[#020617] min-h-screen relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-[800px] bg-[radial-gradient(circle_at_50%_0%,rgba(79,70,229,0.08)_0%,transparent_70%)] pointer-events-none"></div>
      
      <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16">
            <PageTitle 
                title="Sovereign Prime Hub" 
                subtitle="The command center for Solid State Intelligence and multi-agent orchestration." 
            />
            <div className="flex gap-8 mb-10 bg-slate-900/40 p-6 rounded-[2.5rem] border border-white/5 backdrop-blur-xl">
                <div className="text-right">
                    <div className="text-[9px] text-slate-500 uppercase font-black tracking-[0.3em]">Neural Efficiency</div>
                    <div className="text-xl font-black text-indigo-400 font-mono">99.98%</div>
                </div>
                <div className="w-px h-10 bg-white/10 self-center"></div>
                <div className="text-right">
                    <div className="text-[9px] text-slate-500 uppercase font-black tracking-[0.3em]">Quantum Load</div>
                    <div className="text-xl font-black text-emerald-400 font-mono">STABLE</div>
                </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left: Functional Mesh & Swarm */}
            <div className="lg:col-span-8 space-y-10">
                
                {/* Agent Swarm Visualizer Component */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                        <MaterialSymbol icon="hub" className="text-indigo-500" />
                        <h3 className="text-xs font-black uppercase text-slate-500 tracking-[0.4em]">Active Swarm Topology</h3>
                    </div>
                    <AgentSwarmVisualizer />
                </div>

                {/* Safety & Optimization Controls */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-slate-900/60 border border-white/10 rounded-[3rem] p-10 flex flex-col space-y-6 shadow-2xl relative overflow-hidden group backdrop-blur-md">
                        <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="flex items-center justify-between">
                             <div className="flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500">
                                    <MaterialSymbol icon="shield" className="text-2xl" />
                                </div>
                                <h3 className="text-lg font-black uppercase text-white tracking-tight">Perimeter Hardening</h3>
                             </div>
                             <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
                        </div>
                        <p className="text-slate-500 text-xs font-medium leading-relaxed">Solid-state protection protocols enforced at the ingress layer. Drawing in safety features from US-CENTRAL1 private clusters.</p>
                        <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Hardened State</span>
                            <button onClick={() => setSecurityHardened(!securityHardened)} className="transition-all active:scale-75 haptic-feedback">
                                <MaterialSymbol icon={securityHardened ? "lock" : "lock_open"} className={`text-4xl ${securityHardened ? 'text-indigo-500' : 'text-rose-500'}`} />
                            </button>
                        </div>
                    </div>

                    <div className="bg-slate-900/60 border border-white/10 rounded-[3rem] p-10 flex flex-col space-y-6 shadow-2xl relative overflow-hidden group backdrop-blur-md">
                         <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="flex items-center justify-between">
                             <div className="flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400">
                                    <MaterialSymbol icon="insights" className="text-2xl" />
                                </div>
                                <h3 className="text-lg font-black uppercase text-white tracking-tight">Investment ROI Max</h3>
                             </div>
                             <div className="text-[8px] font-black uppercase text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-full shadow-lg">Scaling ROI</div>
                        </div>
                        <p className="text-slate-500 text-xs font-medium leading-relaxed">Refining the pedagogical curriculum to maximize compute yield. Trimming redundant agent latency by 42%.</p>
                        <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Yield Optimization</span>
                            <button onClick={() => setInvestmentMax(!investmentMax)} className="transition-all active:scale-75 haptic-feedback">
                                <MaterialSymbol icon={investmentMax ? "leaderboard" : "rebase_edit"} className={`text-4xl ${investmentMax ? 'text-indigo-500' : 'text-slate-700'}`} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Node functional Mesh */}
                <div className="bg-slate-900/40 border border-white/10 rounded-[3.5rem] p-12 relative shadow-2xl overflow-hidden backdrop-blur-xl">
                    <div className="absolute inset-0 bg-indigo-500/[0.02] pointer-events-none"></div>
                    <div className="flex items-center justify-between mb-12">
                        <div className="flex items-center gap-5">
                            <div className="p-4 rounded-[2rem] bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 shadow-inner">
                                 <MaterialSymbol icon="terminal" className="text-3xl" />
                            </div>
                            <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Production Agentfunctional Mesh</h2>
                        </div>
                        <div className="bg-slate-950 px-6 py-3 rounded-2xl border border-white/10 flex items-center gap-4 shadow-2xl">
                            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping shadow-[0_0_8px_rgba(99,102,241,0.8)]"></div>
                            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-indigo-400">LATENCY_TRIM: ACTIVE</span>
                        </div>
                    </div>

                    <div className="grid gap-6">
                        {functions.map(fn => (
                            <div key={fn.id} className="bg-[#020617] p-8 rounded-[2.5rem] border border-white/5 hover:border-indigo-500/30 transition-all group/card relative overflow-hidden shadow-lg">
                                <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-indigo-500/[0.02] to-transparent pointer-events-none opacity-0 group-hover/card:opacity-100 transition-opacity"></div>
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <code className="text-indigo-400 font-mono text-lg font-black flex items-center gap-3 bg-white/[0.02] px-3 py-1 rounded-xl">
                                                <MaterialSymbol icon="memory" className="text-xs opacity-50" />
                                                {fn.name}()
                                            </code>
                                            <span className="text-[7px] font-mono text-slate-700 bg-slate-900 px-2 py-0.5 rounded uppercase tracking-widest">{fn.node}</span>
                                        </div>
                                        <p className="text-sm text-slate-500 font-medium max-w-xl leading-relaxed">{fn.description}</p>
                                    </div>
                                    <div className={`text-[9px] font-black uppercase tracking-[0.3em] px-5 py-2.5 rounded-full shadow-2xl whitespace-nowrap ${fn.riskLevel === 'critical' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/20' : 'bg-slate-900 text-slate-500 border border-white/5'}`}>
                                        {fn.riskLevel} vector_load
                                    </div>
                                </div>
                                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]"></span>
                                        <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.5em]">LAST_INVOCATION: {fn.lastCalled}</span>
                                    </div>
                                    <div className="flex items-center gap-8">
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Manual Sign-Off</span>
                                        <button 
                                            onClick={() => toggleApproval(fn.id)}
                                            className="transition-all transform active:scale-90 haptic-feedback"
                                        >
                                            <MaterialSymbol 
                                                icon={fn.requireApproval ? "toggle_on" : "toggle_off"} 
                                                className={`text-5xl ${fn.requireApproval ? 'text-indigo-500' : 'text-slate-700'}`} 
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right: Neural Stream HUD */}
            <div className="lg:col-span-4 flex flex-col h-full min-h-[800px]">
                <div className="bg-[#020617] border border-slate-800 rounded-[3.5rem] p-10 flex flex-col h-full shadow-[0_30px_100px_rgba(0,0,0,0.8)] relative overflow-hidden group/hud">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.04)_0%,transparent_60%)] pointer-events-none transition-opacity opacity-50 group-hover/hud:opacity-100"></div>
                    
                    <div className="flex items-center justify-between mb-10 border-b border-white/5 pb-8 relative z-10">
                        <div className="flex items-center gap-4">
                            <MaterialSymbol icon="electric_bolt" className="text-indigo-500 text-2xl animate-pulse" />
                            <h3 className="text-sm font-black uppercase tracking-[0.4em] text-slate-400">Telemetry Stream</h3>
                        </div>
                        <div className="flex gap-2.5">
                            <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-ping"></div>
                            <div className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-ping delay-75"></div>
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping delay-150"></div>
                        </div>
                    </div>

                    <div 
                        ref={logContainerRef}
                        className="flex-grow overflow-y-auto custom-scrollbar font-mono text-[10px] space-y-6 pr-4 relative z-10"
                    >
                        {logs.map(log => (
                            <div key={log.id} className="animate-slide-in-bottom border-l border-slate-800 pl-6 py-2 relative group/log">
                                <div className="absolute left-[-4.5px] top-4 w-2 h-2 rounded-full bg-slate-800 group-hover/log:bg-indigo-500 transition-colors"></div>
                                <div className="flex items-center gap-3 mb-1 text-slate-700 font-black tracking-widest text-[8px]">
                                    <span>[{log.time}]</span>
                                    <span className="uppercase text-indigo-500/50">{log.type}</span>
                                </div>
                                <div className={`leading-relaxed font-medium transition-colors ${
                                    log.type === 'security' ? 'text-rose-400 font-black' : 
                                    log.type === 'call' ? 'text-indigo-400' :
                                    log.type === 'swarm' ? 'text-cyan-400 italic' :
                                    'text-slate-500'
                                }`}>
                                    {log.type === 'thinking' && 'CURRICULUM: '}{log.msg}
                                </div>
                            </div>
                        ))}
                        {isAutoPilot && (
                            <div className="flex items-center gap-5 mt-10 bg-indigo-500/[0.03] p-5 rounded-3xl border border-indigo-500/10 shadow-inner">
                                <div className="flex space-x-1.5">
                                    <div className="h-1.5 w-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                    <div className="h-1.5 w-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                    <div className="h-1.5 w-1.5 bg-indigo-500 rounded-full animate-bounce"></div>
                                </div>
                                <span className="text-[9px] uppercase font-black tracking-[0.5em] text-indigo-400 animate-pulse">Refining v3.5 States...</span>
                            </div>
                        )}
                    </div>

                    <div className="mt-12 pt-10 border-t border-white/5 space-y-8 relative z-10">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">OS Protocol Status</span>
                                <p className="text-[8px] text-slate-700 font-mono">FLUX_ORBIT_MASTER_NODE_647</p>
                            </div>
                            <span className={`text-[10px] font-black uppercase px-4 py-1.5 rounded-xl shadow-lg ${isAutoPilot ? 'bg-indigo-500 text-white animate-pulse' : 'bg-slate-800 text-slate-500'}`}>
                                {isAutoPilot ? 'SYSTEM_LIVE' : 'STANDBY'}
                            </span>
                        </div>
                        <ActionButton 
                            onClick={() => setIsAutoPilot(!isAutoPilot)} 
                            className={`w-full py-8 text-xl uppercase tracking-[0.4em] font-black shadow-2xl transition-all duration-500 ${isAutoPilot ? 'bg-rose-600/10 border-rose-500/30 text-rose-500 hover:bg-rose-600/20' : 'bg-indigo-600 text-white shadow-indigo-600/20'}`} 
                            icon={<MaterialSymbol icon={isAutoPilot ? "power_settings_new" : "bolt"} />}
                        >
                            {isAutoPilot ? 'TRIM CONTEXT' : 'INITIALIZE HUB'}
                        </ActionButton>
                    </div>
                </div>
            </div>
          </div>
      </div>
      
      {/* Footer Strategy Section */}
      <div className="container mx-auto px-6 py-32 text-center relative z-10">
          <div className="max-w-4xl mx-auto space-y-14">
              <h2 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-[0.9] liquid-chrome">Hardening the foundation. <br /> Trimming the latency.</h2>
              <p className="text-slate-500 text-xl md:text-2xl max-w-3xl mx-auto font-medium leading-relaxed tracking-tight">
                NimbusIQ is the infrastructure layer for the high-concurrency property ecosystem. 
                Solid-state intelligence drawn from sovereign data swarms and Python-native orchestration.
              </p>
              <div className="flex justify-center pt-10">
                   <ActionButton 
                    onClick={() => onNavigate('mission_control')} 
                    className="px-24 py-10 text-3xl font-black uppercase tracking-[0.2em] shadow-2xl shadow-indigo-600/40 border-indigo-400/50 bg-indigo-600 text-white" 
                    icon={<MaterialSymbol icon="rocket_launch" />}
                   >
                    Enter Mission Control
                   </ActionButton>
              </div>
          </div>
      </div>
    </div>
  );
};

export default TheBrain;