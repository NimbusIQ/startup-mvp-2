import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Content } from '@google/genai';
import type { ChatMessage } from '../types';
import { PageTitle, ErrorState, ActionButton } from '../components/shared';
import { MaterialSymbol } from '../components/icons';
import ReactMarkdown from 'https://esm.sh/react-markdown@9';
import remarkGfm from 'https://esm.sh/remark-gfm@4';

const AISignature = () => (
    <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between opacity-50 select-none pointer-events-none group-hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.8)]"></div>
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-indigo-300">Prime Core Verified</span>
        </div>
        <div className="flex items-center gap-2 grayscale group-hover:grayscale-0 transition-all">
            <img src="https://storage.googleapis.com/aistudio-ux-team-data/demos/nimbus-logo.png" className="h-4 w-4" alt="IQ" />
            <span className="text-[8px] font-mono tracking-tighter text-slate-500">SIG_ID_{Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
        </div>
    </div>
);

const Chatbot: React.FC = () => {
    const [history, setHistory] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [useThinking, setUseThinking] = useState(true);
    const [groundingUrls, setGroundingUrls] = useState<{uri: string, title: string}[]>([]);
    
    const endOfMessagesRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history, isLoading]);

    const handleSendMessage = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const finalInput = input.trim();
        if (!finalInput || isLoading) return;

        const userMessage: ChatMessage = { role: 'user', parts: [{ text: finalInput }] };
        setHistory(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        setError(null);
        setGroundingUrls([]);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
            
            const systemInstruction = `
                You are the Nimbus Sovereign Core Architect. You are the "Lead Teacher" for the AI-Native PropTech ecosystem.
                Your goal is to guide the user through the Sovereign Curriculum, providing grounded, deterministic technical insights.
                TONE: Strategic, authoritative, concise.
                CAPACITY: You excel at complex reasoning, code auditing, and structural architecture.
                REASONING: When Thinking Mode is enabled, perform deep multi-step verification of your logic.
            `;

            const response = await ai.models.generateContent({
                model: 'gemini-3-pro-preview',
                contents: [...history, userMessage] as Content[],
                config: {
                    systemInstruction,
                    thinkingConfig: useThinking ? { thinkingBudget: 32768 } : undefined, // Max thinking for Pro
                    tools: [{ googleSearch: {} }] // Integrated search grounding
                }
            });
            
            const modelText = response.text || 'Synthesis complete.';
            setHistory(prev => [...prev, { role: 'model', parts: [{ text: modelText }] }]);
            
            const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
            if (chunks) {
                setGroundingUrls(chunks.filter(c => c.web).map(c => ({ uri: c.web!.uri, title: c.web!.title || 'Source' })));
            }
        } catch (err) { setError(err instanceof Error ? err.message : 'Neural uplink failure.'); } finally { setIsLoading(false); }
    };

    return (
        <div className="flex flex-col h-full max-h-[calc(100vh-140px)] animate-fade-in space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <PageTitle title="Sovereign Prime Chat" subtitle="Strategic reasoning with Gemini 3 Pro and deep thinking cycles." />
                <button 
                    onClick={() => setUseThinking(!useThinking)}
                    className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${useThinking ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-900 text-slate-500 hover:text-white border border-white/5'}`}
                >
                    Thinking Mode: {useThinking ? '32K Max' : 'Standard'}
                </button>
            </div>

            <div className="flex-grow overflow-y-auto pr-2 space-y-10 custom-scrollbar glass-panel rounded-[3.5rem] p-10 mb-6 relative overflow-x-hidden border border-white/10">
                {history.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center opacity-10 space-y-8 grayscale">
                        <MaterialSymbol icon="forum" className="text-[140px]" />
                        <p className="text-sm font-black uppercase tracking-[1em]">Awaiting Ingress</p>
                    </div>
                )}
                
                {history.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                         <div className={`max-w-[85%] lg:max-w-[75%] px-10 py-8 rounded-[3rem] shadow-2xl ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-900/80 backdrop-blur-2xl border border-white/5 text-slate-200 rounded-tl-none'}`}>
                            <div className="prose prose-invert prose-sm max-w-none prose-headings:text-indigo-400 prose-strong:text-indigo-400">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.parts[0].text}</ReactMarkdown>
                            </div>
                            {msg.role === 'model' && <AISignature />}
                        </div>
                    </div>
                ))}
                
                {isLoading && (
                    <div className="flex justify-start">
                         <div className="bg-slate-900 border border-dashed border-white/20 px-10 py-8 rounded-[3rem] flex items-center gap-6 shadow-xl animate-pulse">
                            <div className="flex space-x-3">
                                <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce"></div>
                            </div>
                            <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em]">
                                {useThinking ? 'Executing Reasoning Cycles...' : 'Synthesizing...'}
                            </span>
                        </div>
                    </div>
                )}
                <div ref={endOfMessagesRef} />
            </div>

            {groundingUrls.length > 0 && (
                <div className="px-10 py-6 bg-indigo-500/5 border border-indigo-500/20 rounded-[2.5rem] animate-slide-in-bottom">
                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-indigo-400 mb-4">Evidence Grounding</p>
                    <div className="flex flex-wrap gap-4">
                        {groundingUrls.map((s, i) => (
                            <a key={i} href={s.uri} target="_blank" rel="noreferrer" className="text-[10px] font-bold text-slate-400 hover:text-white transition-all bg-slate-900 border border-white/5 px-6 py-2 rounded-2xl flex items-center gap-3">
                                <MaterialSymbol icon="link" className="text-indigo-500" /> {s.title}
                            </a>
                        ))}
                    </div>
                </div>
            )}

            {error && <ErrorState error={error} />}

            <form onSubmit={handleSendMessage} className="relative group">
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { handleSendMessage(); e.preventDefault(); }}}
                    placeholder="Inquire with the Sovereign Prime Core..."
                    className="w-full bg-slate-950 border border-white/10 rounded-[2.5rem] p-8 pr-32 text-sm text-white outline-none focus:border-indigo-500/40 transition-all shadow-inner resize-none min-h-[90px]"
                />
                <button 
                    disabled={isLoading || !input.trim()} 
                    className="absolute right-6 bottom-6 p-4 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-500 disabled:opacity-20 transition-all shadow-xl active:scale-95 border border-indigo-400/30"
                >
                    <MaterialSymbol icon="send" className="text-2xl" />
                </button>
            </form>
        </div>
    );
};

export default Chatbot;