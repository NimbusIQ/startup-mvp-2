import React, { useState, useEffect, useRef } from 'react';
import { PageTitle, ActionButton, LoadingState } from '../components/shared';
import { MaterialSymbol } from '../components/icons';

interface CallLog {
    id: string;
    caller: string;
    number: string;
    duration: string;
    status: 'completed' | 'active' | 'missed';
    intent: string;
    time: string;
}

interface AdminTask {
    id: string;
    type: 'scheduling' | 'billing' | 'dispatch' | 'mcp_sync';
    description: string;
    status: 'success' | 'pending';
    timestamp: string;
}

const NancyeAssistant: React.FC = () => {
    const [isLive, setIsLive] = useState(true);
    const [activeCall, setActiveCall] = useState<CallLog | null>(null);
    const [callLogs, setCallLogs] = useState<CallLog[]>([
        { id: '1', caller: 'John Smith', number: '214-555-0199', duration: '2:45', status: 'completed', intent: 'Inspection Request', time: '10:15 AM' },
        { id: '2', caller: 'Homeowners Assoc.', number: '972-555-4433', duration: '1:12', status: 'completed', intent: 'Code Inquiry', time: '09:45 AM' },
        { id: '3', caller: 'Sarah Lee', number: '469-555-2211', duration: '0:00', status: 'missed', intent: 'Unknown', time: '08:30 AM' },
    ]);
    const [tasks, setTasks] = useState<AdminTask[]>([
        { id: 't1', type: 'scheduling', description: 'Booked roof inspection for John Smith (March 15th)', status: 'success', timestamp: '10:18 AM' },
        { id: 't2', type: 'billing', description: 'Generated QuickBooks invoice #8841 for Sarah Lee', status: 'success', timestamp: '09:10 AM' },
        { id: 't3', type: 'dispatch', description: 'Alerted crew #4 to McKinney weather update', status: 'success', timestamp: '08:45 AM' },
    ]);

    const [transcription, setTranscription] = useState<string[]>([]);
    const transcriptRef = useRef<HTMLDivElement>(null);

    // Simulate real-time interaction
    useEffect(() => {
        if (!isLive) return;
        const interval = setInterval(() => {
            const lines = [
                "Nancye: Hello, thank you for calling Nimbus Roofing. How can I help you today?",
                "Caller: Hi, I have some hail damage from the storm last night.",
                "Nancye: I understand. I'm checking our McKinney storm records... Yes, we recorded 1.5 inch hail in your sector.",
                "Nancye: Dustin has an opening this Friday at 2:00 PM. Would you like me to book that for you?",
                "Caller: Yes, that works great.",
                "Nancye: Perfect. I've scheduled your inspection and synced it with your project file.",
                "Nancye: Is there anything else I can assist with?"
            ];
            
            setTranscription(prev => {
                if (prev.length >= lines.length) return prev;
                return [...prev, lines[prev.length]];
            });
        }, 3000);
        return () => clearInterval(interval);
    }, [isLive]);

    useEffect(() => {
        if (transcriptRef.current) {
            transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
        }
    }, [transcription]);

    return (
        <div className="flex flex-col space-y-10 animate-fade-in bg-[#020617] min-h-screen">
            <div className="flex justify-between items-end">
                <PageTitle 
                    title="Nancye: AI Admin Assistant" 
                    subtitle="Sovereign Voice Native Agent for Nimbus Roofing Operations." 
                />
                <div className="flex items-center gap-4 mb-10">
                    <div className="text-right">
                        <div className="text-[10px] text-slate-500 uppercase font-black">Voice Engine</div>
                        <div className="text-sm font-black text-indigo-400 font-mono">ElevenLabs Turbo v2.5</div>
                    </div>
                    <div className="text-right">
                        <div className="text-[10px] text-slate-500 uppercase font-black">SIP Gateway</div>
                        <div className="text-sm font-black text-emerald-400 font-mono">Twilio_OK</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left Col: Live Call HUD */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="bg-slate-900 border border-white/5 rounded-[3.5rem] p-12 relative overflow-hidden group shadow-2xl">
                        <div className="absolute inset-0 bg-indigo-500/5 pointer-events-none"></div>
                        <div className="flex items-center justify-between mb-10">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400">
                                     <MaterialSymbol icon="headset_mic" className="text-3xl" />
                                </div>
                                <h2 className="text-xl font-black uppercase tracking-tighter text-white">Live Intelligence HUD</h2>
                            </div>
                            <div className="flex items-center gap-3 bg-slate-950 border border-white/5 px-4 py-2 rounded-xl">
                                <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-slate-700'}`}></div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">
                                    {isLive ? 'SYSTEM_LISTENING' : 'OFFLINE'}
                                </span>
                            </div>
                        </div>

                        {/* Waveform Visualization */}
                        <div className="h-40 bg-slate-950 border border-white/5 rounded-[2rem] flex items-center justify-center gap-1.5 px-10 mb-10">
                            {[...Array(30)].map((_, i) => (
                                <div 
                                    key={i} 
                                    className={`w-1 rounded-full bg-indigo-500 transition-all duration-300 ${isLive ? 'animate-pulse' : 'h-1'}`}
                                    style={{ 
                                        height: isLive ? `${Math.random() * 80 + 10}%` : '4px',
                                        animationDelay: `${i * 0.1}s`,
                                        opacity: 0.3 + (i / 30) * 0.7
                                    }}
                                />
                            ))}
                        </div>

                        {/* Neural Stream Transcript */}
                        <div 
                            ref={transcriptRef}
                            className="bg-slate-950 border border-white/5 rounded-[2rem] p-8 h-80 overflow-y-auto custom-scrollbar font-mono text-sm space-y-4"
                        >
                            {transcription.map((line, i) => (
                                <div key={i} className={`animate-fade-in ${line.startsWith('Nancye:') ? 'text-indigo-400 font-bold' : 'text-slate-400'}`}>
                                    <span className="text-slate-700 mr-4">[{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}]</span>
                                    {line}
                                </div>
                            ))}
                            {transcription.length === 0 && (
                                <div className="h-full flex items-center justify-center text-slate-700 uppercase tracking-widest font-black text-xs">
                                    Awaiting Incoming Stream...
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Controls */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { label: 'Voice Forward', icon: 'call_forward', active: true },
                            { label: 'Quiet Mode', icon: 'notifications_off', active: false },
                            { label: 'Auto Billing', icon: 'account_balance_wallet', active: true },
                            { label: 'Recording', icon: 'fiber_manual_record', active: true },
                        ].map((ctrl, i) => (
                            <button key={i} className={`p-6 bg-slate-900 border border-white/5 rounded-[2.5rem] flex flex-col items-center justify-center text-center gap-3 transition-all hover:border-indigo-500/50 ${ctrl.active ? 'bg-indigo-500/5 border-indigo-500/20' : ''}`}>
                                <MaterialSymbol icon={ctrl.icon} className={`text-2xl ${ctrl.active ? 'text-indigo-400' : 'text-slate-600'}`} />
                                <span className={`text-[9px] font-black uppercase tracking-widest ${ctrl.active ? 'text-indigo-300' : 'text-slate-600'}`}>{ctrl.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right Col: Ledger & Logs */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Admin Task Ledger */}
                    <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 flex flex-col h-full shadow-2xl relative overflow-hidden">
                        <div className="flex items-center gap-3 mb-8">
                            <MaterialSymbol icon="assignment" className="text-indigo-500" />
                            <h3 className="text-sm font-black uppercase tracking-[0.4em] text-white">Admin Ledger</h3>
                        </div>

                        <div className="space-y-4 overflow-y-auto custom-scrollbar pr-2 h-[400px]">
                            {tasks.map(task => (
                                <div key={task.id} className="p-5 bg-slate-950/50 border border-white/5 rounded-2xl flex items-start gap-4 hover:border-indigo-500/30 transition-all group">
                                    <div className={`p-2 rounded-xl ${task.type === 'scheduling' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                                        <MaterialSymbol icon={task.type === 'scheduling' ? 'event' : 'payments'} className="text-lg" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-slate-300 leading-snug">{task.description}</p>
                                        <div className="flex items-center gap-3">
                                            <span className="text-[8px] font-black uppercase text-slate-600">{task.timestamp}</span>
                                            <span className="text-[8px] font-black uppercase text-emerald-500 flex items-center gap-1">
                                                <MaterialSymbol icon="verified" className="text-[10px]" /> COMPLETED
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 pt-8 border-t border-white/5">
                            <ActionButton onClick={() => setIsLive(!isLive)} className={`w-full py-6 text-sm uppercase tracking-widest ${isLive ? 'bg-rose-600/10 border-rose-500/30 text-rose-500' : ''}`} icon={<MaterialSymbol icon={isLive ? "power_settings_new" : "play_circle"} />}>
                                {isLive ? 'SHUTDOWN ASSISTANT' : 'INITIALIZE NANCYE'}
                            </ActionButton>
                        </div>
                    </div>

                    {/* Recent Call History */}
                    <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 space-y-6">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Recent Stream Sessions</h3>
                        <div className="space-y-4">
                            {callLogs.map(log => (
                                <div key={log.id} className="flex items-center justify-between group cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className={`h-2 w-2 rounded-full ${log.status === 'completed' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                                        <div>
                                            <p className="text-xs font-black text-white group-hover:text-indigo-400 transition-colors uppercase">{log.caller}</p>
                                            <p className="text-[9px] font-mono text-slate-600">{log.intent}</p>
                                        </div>
                                    </div>
                                    <span className="text-[9px] font-black text-slate-600 uppercase">{log.time}</span>
                                </div>
                            ))}
                        </div>
                        <button className="w-full pt-4 text-center text-[10px] font-black uppercase tracking-widest text-indigo-500 hover:text-white transition-colors">
                            View Full Telemetry Log →
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="container mx-auto px-6 py-20 text-center space-y-8 bg-slate-900/20 border border-white/5 rounded-[4rem]">
                 <MaterialSymbol icon="psychology" className="text-7xl text-indigo-500 opacity-20" />
                 <h2 className="text-4xl font-black text-white uppercase tracking-tighter liquid-chrome">Cognition is the <br /> Administrative Standard.</h2>
                 <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">Nancye doesn't just answer phones. She negotiates, schedules, bills, and dispatches—eliminating human clerical latency with native intelligence.</p>
            </div>
        </div>
    );
};

export default NancyeAssistant;