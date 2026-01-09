import React, { useState, useRef, useEffect } from 'react';
import { PageTitle, Tab, TabGroup, ActionButton, ErrorState, LoadingState, EmptyState } from '../components/shared';
import { MaterialSymbol } from '../components/icons';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { encode, decode, decodeAudioData } from '../utils/media';
import ReactMarkdown from 'https://esm.sh/react-markdown@9';
import remarkGfm from 'https://esm.sh/remark-gfm@4';

type ActiveTab = 'live-map' | 'validate' | 'draft' | 'blueprints';

interface MediaBlob {
  data: string;
  mimeType: string;
}

const ArchitectureStudio: React.FC = () => {
    const [activeTab, setActiveTab] = useState<ActiveTab>('live-map');

    return (
        <div className="flex flex-col h-full space-y-12">
            <PageTitle 
                title="AAMA Architecture Studio" 
                subtitle="The Architecture Mapping Agent: Brainstorm infrastructure via voice, validate with Pro, and render 4K blueprints." 
            />
            
            <TabGroup>
                <Tab label="Live Mapping" icon="settings_input_antenna" isActive={activeTab === 'live-map'} onClick={() => setActiveTab('live-map')} />
                <Tab label="Pro Validation" icon="verified_user" isActive={activeTab === 'validate'} onClick={() => setActiveTab('validate')} />
                <Tab label="Quick Draft" icon="bolt" isActive={activeTab === 'draft'} onClick={() => setActiveTab('draft')} />
                <Tab label="4K Blueprints" icon="account_tree" isActive={activeTab === 'blueprints'} onClick={() => setActiveTab('blueprints')} />
            </TabGroup>

            <div className="flex-grow">
                {activeTab === 'live-map' && <LiveMappingModule />}
                {activeTab === 'validate' && <ProValidationModule />}
                {activeTab === 'draft' && <QuickDraftModule />}
                {activeTab === 'blueprints' && <BlueprintSynthModule />}
            </div>
        </div>
    );
};

const LiveMappingModule: React.FC = () => {
    const [isActive, setIsActive] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [transcription, setTranscription] = useState<{user: string, model: string}[]>([]);
    const [currentTurn, setCurrentTurn] = useState({user: '', model: ''});
    
    const sessionRef = useRef<any | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const outputAudioContextRef = useRef<AudioContext | null>(null);
    const nextStartTimeRef = useRef(0);

    const startSession = async () => {
        setIsConnecting(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
            
            const sessionPromise = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-12-2025',
                callbacks: {
                    onopen: () => {
                        setIsConnecting(false);
                        setIsActive(true);
                        const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
                        audioContextRef.current = inputCtx;
                        const source = inputCtx.createMediaStreamSource(stream);
                        const processor = inputCtx.createScriptProcessor(4096, 1, 1);
                        processor.onaudioprocess = (e) => {
                            const inputData = e.inputBuffer.getChannelData(0);
                            const pcmBlob: MediaBlob = {
                                data: encode(new Uint8Array(new Int16Array(inputData.map(x => x * 32768)).buffer)),
                                mimeType: 'audio/pcm;rate=16000',
                            };
                            sessionPromise.then(s => {
                                if (s) s.sendRealtimeInput({ media: pcmBlob });
                            });
                        };
                        source.connect(processor);
                        processor.connect(inputCtx.destination);
                        outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
                    },
                    onmessage: async (msg: LiveServerMessage) => {
                        if (msg.serverContent?.inputTranscription) setCurrentTurn(prev => ({...prev, user: prev.user + msg.serverContent.inputTranscription.text}));
                        if (msg.serverContent?.outputTranscription) setCurrentTurn(prev => ({...prev, model: prev.model + msg.serverContent.outputTranscription.text}));
                        if (msg.serverContent?.turnComplete) {
                            setTranscription(prev => [...prev, currentTurn]);
                            setCurrentTurn({user: '', model: ''});
                        }
                        const base64Audio = msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
                        if (base64Audio && outputAudioContextRef.current) {
                            const ctx = outputAudioContextRef.current;
                            const nextStartTime = Math.max(nextStartTimeRef.current, ctx.currentTime);
                            const buffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
                            const source = ctx.createBufferSource();
                            source.buffer = buffer;
                            source.connect(ctx.destination);
                            source.start(nextStartTime);
                            nextStartTimeRef.current = nextStartTime + buffer.duration;
                        }
                    }
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    inputAudioTranscription: {},
                    outputAudioTranscription: {},
                    systemInstruction: "You are the AAMA Architecture Mapping Agent. Brainstorm technical stacks. Use Spanner, AlloyDB, and GKE as defaults. Speak in technical architect tone."
                }
            });
            sessionRef.current = await sessionPromise;
        } catch (e) {
            setIsConnecting(false);
        }
    };

    const stopSession = () => {
        if (sessionRef.current) try { sessionRef.current.close(); } catch(e){}
        if (audioContextRef.current) try { audioContextRef.current.close(); } catch(e){}
        if (outputAudioContextRef.current) try { outputAudioContextRef.current.close(); } catch(e){}
        setIsActive(false);
        setIsConnecting(false);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-fade-in">
            <div className="bg-slate-900/40 border border-white/5 rounded-[3rem] p-12 flex flex-col items-center justify-center space-y-12">
                {!isActive ? (
                    <div className="text-center space-y-8 max-w-sm">
                        <div className="p-12 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                            <MaterialSymbol icon="settings_input_antenna" className="text-8xl animate-pulse" />
                        </div>
                        <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Initialize Link</h3>
                        <p className="text-slate-500 font-medium">Connect to the Gemini Live native audio stream for architecture mapping.</p>
                        <ActionButton onClick={startSession} isLoading={isConnecting} className="w-full py-5 text-xl">
                            Connect AAMA Link
                        </ActionButton>
                    </div>
                ) : (
                    <div className="w-full space-y-12 flex flex-col items-center">
                        <div className="relative">
                            <div className="absolute inset-0 bg-cyan-500 blur-[80px] opacity-20 animate-pulse"></div>
                            <div className="h-48 w-48 rounded-full border-4 border-cyan-500 flex items-center justify-center relative z-10">
                                <MaterialSymbol icon="mic" className="text-7xl text-cyan-400 animate-bounce" />
                            </div>
                        </div>
                        <div className="text-center">
                            <h3 className="text-2xl font-black uppercase text-white">Live Audio Mapping</h3>
                            <p className="text-cyan-400 text-[10px] font-black uppercase tracking-[0.4em] mt-2">Streaming Architecture Telemetry</p>
                        </div>
                        <ActionButton variant="danger" className="w-full py-5 text-xl" onClick={stopSession}>
                            Terminate Mapping
                        </ActionButton>
                    </div>
                )}
            </div>
            <div className="bg-slate-950 border border-white/5 rounded-[3rem] p-10 h-[600px] flex flex-col">
                <div className="flex items-center justify-between mb-8 opacity-50">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Live Transcript Log</span>
                    <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-ping"></div>
                        <span className="text-[9px] font-black text-cyan-500">NATIVE SYNC</span>
                    </div>
                </div>
                <div className="flex-grow overflow-y-auto custom-scrollbar space-y-8 pr-4">
                    {transcription.length === 0 && !currentTurn.user && (
                        <div className="h-full flex flex-col items-center justify-center opacity-10">
                            <MaterialSymbol icon="wysiwyg" className="text-9xl" />
                        </div>
                    )}
                    {transcription.map((t, i) => (
                        <div key={i} className="space-y-4 animate-slide-in-bottom">
                            <div className="flex flex-col gap-1">
                                <span className="text-[8px] font-black uppercase tracking-widest text-cyan-500">Architect</span>
                                <div className="text-slate-300 text-sm font-medium leading-relaxed bg-white/5 p-4 rounded-2xl">{t.user}</div>
                            </div>
                            <div className="flex flex-col gap-1 items-end">
                                <span className="text-[8px] font-black uppercase tracking-widest text-slate-600">AAMA AGENT</span>
                                <div className="text-white text-sm font-black leading-relaxed bg-cyan-500/10 p-4 rounded-2xl border border-cyan-500/20">{t.model}</div>
                            </div>
                        </div>
                    ))}
                    {(currentTurn.user || currentTurn.model) && (
                        <div className="opacity-50 space-y-4 animate-pulse">
                            {currentTurn.user && <div className="text-xs text-slate-500">{currentTurn.user}</div>}
                            {currentTurn.model && <div className="text-xs text-cyan-400">{currentTurn.model}</div>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const ProValidationModule: React.FC = () => {
    const [draft, setDraft] = useState('');
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleValidate = async () => {
        setIsLoading(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
            const response = await ai.models.generateContent({
                model: 'gemini-3-pro-preview',
                contents: `Critique this architecture. Check for GCP HA best practices. Highlight Spanner and GKE scalability. Input: ${draft}`,
                config: { thinkingConfig: { thinkingBudget: 16000 } }
            });
            setAnalysis(response.text);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-fade-in">
            <div className="space-y-6">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">System Constraints</label>
                <textarea 
                    value={draft}
                    onChange={e => setDraft(e.target.value)}
                    placeholder="Enter your proposed architecture stack for validation..."
                    className="w-full bg-slate-900/60 border border-white/10 rounded-[2.5rem] p-10 text-sm font-medium text-white outline-none focus:border-cyan-500/50 transition-colors h-[500px] resize-none"
                />
                <ActionButton onClick={handleValidate} isLoading={isLoading} className="w-full py-5 text-xl" icon={<MaterialSymbol icon="shield" />}>
                    Execute Pro Validation
                </ActionButton>
            </div>
            <div className="bg-slate-950 border border-white/5 rounded-[2.5rem] p-10 overflow-y-auto custom-scrollbar">
                {isLoading ? (
                    <LoadingState message="AAMA Reasoning Process" details="Executing Gemini 3 Pro reasoning cycles for HA validation." />
                ) : analysis ? (
                    <div className="prose prose-invert prose-cyan max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{analysis}</ReactMarkdown>
                    </div>
                ) : (
                    <EmptyState title="Awaiting Input" message="Enter a draft architecture to start the Gemini 3 Pro validation protocol." icon={<MaterialSymbol icon="analytics" className="text-7xl opacity-10" />} />
                )}
            </div>
        </div>
    );
};

const QuickDraftModule: React.FC = () => {
    const [input, setInput] = useState('');
    const [draft, setDraft] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleDraft = async () => {
        setIsLoading(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: `Generate a quick architectural draft manifest for: ${input}`
            });
            setDraft(response.text);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-12 animate-fade-in">
            <div className="flex flex-col gap-6">
                 <input 
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Briefly describe the app goal (e.g. Serverless SaaS with Stripe)..."
                    className="w-full bg-slate-900/60 border border-white/10 rounded-2xl p-6 text-sm font-medium text-white outline-none focus:border-cyan-500/50 transition-colors"
                />
                <ActionButton onClick={handleDraft} isLoading={isLoading} className="w-full" icon={<MaterialSymbol icon="bolt" />}>
                    Synthesize Flash Draft
                </ActionButton>
            </div>
            {draft && (
                <div className="bg-slate-950 border border-white/5 rounded-[2.5rem] p-10 prose prose-invert max-w-none animate-slide-in-bottom">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{draft}</ReactMarkdown>
                </div>
            )}
        </div>
    );
};

const BlueprintSynthModule: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [blueprint, setBlueprint] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSynth = async () => {
        setIsLoading(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
            const response = await ai.models.generateContent({
                model: 'gemini-3-pro-image-preview',
                contents: { parts: [{ text: `A technical architectural blueprint diagram of: ${prompt}. Cinematic lighting, white lines on dark slate background, professional 4K technical draft aesthetic.` }] },
                config: { imageConfig: { aspectRatio: '16:9', imageSize: '1K' } }
            });
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    setBlueprint(`data:image/png;base64,${part.inlineData.data}`);
                }
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-12 animate-fade-in">
            <div className="bg-slate-900/40 p-10 rounded-[3rem] border border-white/5 flex flex-col md:flex-row gap-8 items-center">
                <input 
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    placeholder="Describe the architecture for visual synthesis..."
                    className="flex-grow bg-slate-950 border border-white/10 rounded-2xl p-6 text-sm font-medium text-white outline-none focus:border-cyan-500/50 transition-colors"
                />
                <ActionButton onClick={handleSynth} isLoading={isLoading} className="px-12 py-5" icon={<MaterialSymbol icon="draw" />}>
                    Render Blueprint
                </ActionButton>
            </div>
            <div className="aspect-video bg-slate-950 border border-white/5 rounded-[3rem] overflow-hidden flex items-center justify-center relative group">
                {isLoading ? (
                    <LoadingState message="AAMA Visual Synthesis" details="Rendering 4K technical blueprint using Nano Banana Pro engine." />
                ) : blueprint ? (
                    <>
                        <img src={blueprint} className="w-full h-full object-cover animate-pop-in" alt="Blueprint" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6">
                            <ActionButton variant="secondary" icon={<MaterialSymbol icon="fullscreen" />}>Full View</ActionButton>
                            <ActionButton variant="secondary" icon={<MaterialSymbol icon="download" />}>Export 4K</ActionButton>
                        </div>
                    </>
                ) : (
                    <EmptyState title="Visual Buffer Empty" message="Input structural requirements to synthesize a technical diagram." icon={<MaterialSymbol icon="grid_view" className="text-9xl opacity-10" />} />
                )}
            </div>
        </div>
    );
};

export default ArchitectureStudio;