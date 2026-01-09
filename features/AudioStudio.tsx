
import React, { useState, useRef, useEffect } from 'react';
import { PageTitle, Tab, TabGroup, ActionButton, ErrorState, LoadingState } from '../components/shared';
import { MaterialSymbol } from '../components/icons';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { encode, decode, decodeAudioData } from '../utils/media';

type ActiveTab = 'live-link' | 'transcription' | 'neural-tts';

interface MediaBlob {
  data: string;
  mimeType: string;
}

const AISignature = () => (
    <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between opacity-30 select-none pointer-events-none group-hover:opacity-80 transition-opacity">
        <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_10px_#6366f1]"></div>
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-indigo-300">Aural Matrix v2.5</span>
        </div>
        <div className="flex items-center gap-2 grayscale group-hover:grayscale-0 transition-all">
            <img src="https://storage.googleapis.com/aistudio-ux-team-data/demos/nimbus-logo.png" className="h-4 w-4" alt="IQ" />
            <span className="text-[8px] font-mono tracking-tighter text-slate-500">AUD_SIG_{Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
        </div>
    </div>
);

const AudioStudio: React.FC = () => {
    const [activeTab, setActiveTab] = useState<ActiveTab>('live-link');

    return (
        <div className="flex flex-col h-full space-y-12 animate-fade-in pb-20">
            <PageTitle title="Sub-Modal Aural Studio" subtitle="Real-time conversational intelligence and forensic vocal synthesis." />
            
            <TabGroup>
                <Tab label="Live Native Link" icon="record_voice_over" isActive={activeTab === 'live-link'} onClick={() => setActiveTab('live-link')} />
                <Tab label="Forensic Transcript" icon="speech_to_text" isActive={activeTab === 'transcription'} onClick={() => setActiveTab('transcription')} />
                <Tab label="Neural Synthesis" icon="graphic_eq" isActive={activeTab === 'neural-tts'} onClick={() => setActiveTab('neural-tts')} />
            </TabGroup>
            
            <div className="flex-grow">
                {activeTab === 'live-link' && <LiveIntelligence />}
                {activeTab === 'transcription' && <TranscriptionModule />}
                {activeTab === 'neural-tts' && <NeuralTTS />}
            </div>
        </div>
    );
};

const TranscriptionModule: React.FC = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState<string | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<BlobPart[]>([]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            mediaRecorderRef.current.ondataavailable = (e) => chunksRef.current.push(e.data);
            mediaRecorderRef.current.onstop = async () => {
                const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
                chunksRef.current = [];
                processTranscription(audioBlob);
            };
            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch (e) { setError("Microphone ingress denied."); }
    };

    const stopRecording = () => {
        mediaRecorderRef.current?.stop();
        mediaRecorderRef.current?.stream.getTracks().forEach(t => t.stop());
        setIsRecording(false);
    };

    const processTranscription = async (audioBlob: Blob) => {
        setIsLoading(true);
        try {
            const reader = new FileReader();
            reader.readAsDataURL(audioBlob);
            reader.onloadend = async () => {
                const base64Data = (reader.result as string).split(',')[1];
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
                const response = await ai.models.generateContent({
                    model: 'gemini-3-flash-preview',
                    contents: [
                        { parts: [{ inlineData: { data: base64Data, mimeType: 'audio/webm' } }, { text: "Transcribe this audio precisely. Use professional formatting." }] }
                    ]
                });
                setTranscript(response.text || "No data identified.");
                setIsLoading(false);
            };
        } catch (e) { setError("Synthesis failure."); setIsLoading(false); }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-fade-in">
            <div className="bg-slate-900/60 border border-white/5 rounded-[4rem] p-16 flex flex-col items-center justify-center space-y-12 shadow-2xl relative overflow-hidden backdrop-blur-3xl">
                <div className="absolute inset-0 bg-indigo-500/[0.02]"></div>
                <div className={`p-24 rounded-full border-4 transition-all duration-1000 ${isRecording ? 'border-indigo-500 bg-indigo-500/10 shadow-[0_0_80px_rgba(99,102,241,0.2)]' : 'border-white/10 bg-white/5'}`}>
                    <MaterialSymbol icon={isRecording ? "hearing" : "mic"} className={`text-[120px] ${isRecording ? 'text-indigo-400 animate-pulse' : 'text-slate-800'}`} />
                </div>
                <ActionButton 
                    onClick={isRecording ? stopRecording : startRecording} 
                    className={`w-full py-10 text-2xl uppercase tracking-[0.4em] font-black ${isRecording ? 'bg-rose-600 border-rose-400 text-white' : ''}`}
                    icon={<MaterialSymbol icon={isRecording ? "stop" : "record_voice_over"} />}
                >
                    {isRecording ? 'Terminate Ingress' : 'Initialize Ingress'}
                </ActionButton>
            </div>
            <div className="bg-slate-950/80 border border-white/10 rounded-[4rem] p-16 overflow-y-auto custom-scrollbar shadow-inner relative flex flex-col min-h-[600px]">
                {isLoading ? <LoadingState message="Linguistic Decoding" details="Gemini 3 Flash is processing the native audio stream." /> : transcript ? (
                    <div className="space-y-10 animate-slide-in-bottom">
                         <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-600">Sovereign Ledger</h3>
                         <div className="text-slate-200 text-xl leading-relaxed font-light">{transcript}</div>
                         <AISignature />
                    </div>
                ) : (
                    <div className="flex-grow flex flex-col items-center justify-center opacity-5 grayscale space-y-10">
                        <MaterialSymbol icon="description" className="text-[180px]" />
                        <span className="text-xs font-black uppercase tracking-[1em]">Awaiting Data</span>
                    </div>
                )}
            </div>
        </div>
    );
};

const LiveIntelligence: React.FC = () => {
    const [isConnecting, setIsConnecting] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [transcription, setTranscription] = useState<{user: string, model: string}[]>([]);
    const [currentTurn, setCurrentTurn] = useState({user: '', model: ''});
    
    const sessionRef = useRef<any | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const outputAudioContextRef = useRef<AudioContext | null>(null);
    const nextStartTimeRef = useRef(0);

    const stopSession = () => {
        if (sessionRef.current) { try { sessionRef.current.close(); } catch(e){} sessionRef.current = null; }
        if (mediaStreamRef.current) { mediaStreamRef.current.getTracks().forEach(t => t.stop()); mediaStreamRef.current = null; }
        if (audioContextRef.current) { try { audioContextRef.current.close(); } catch(e){} audioContextRef.current = null; }
        if (outputAudioContextRef.current) { try { outputAudioContextRef.current.close(); } catch(e){} outputAudioContextRef.current = null; }
        setIsActive(false);
        setIsConnecting(false);
    };

    const startSession = async () => {
        if (isActive || isConnecting) return;
        setIsConnecting(true);
        setError(null);

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStreamRef.current = stream;

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
                        const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
                        scriptProcessor.onaudioprocess = (e) => {
                            const inputData = e.inputBuffer.getChannelData(0);
                            const pcmBlob: MediaBlob = {
                                data: encode(new Uint8Array(new Int16Array(inputData.map(x => x * 32768)).buffer)),
                                mimeType: 'audio/pcm;rate=16000',
                            };
                            sessionPromise.then((session) => {
                                if (session) session.sendRealtimeInput({ media: pcmBlob });
                            });
                        };
                        source.connect(scriptProcessor);
                        scriptProcessor.connect(inputCtx.destination);
                        outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        if (message.serverContent?.inputTranscription) {
                            setCurrentTurn(prev => ({ ...prev, user: prev.user + message.serverContent!.inputTranscription!.text }));
                        }
                        if (message.serverContent?.outputTranscription) {
                            setCurrentTurn(prev => ({ ...prev, model: prev.model + message.serverContent!.outputTranscription!.text }));
                        }
                        if (message.serverContent?.turnComplete) {
                            setTranscription(prev => [...prev, currentTurn]);
                            setCurrentTurn({user: '', model: ''});
                        }
                        const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
                        if (base64Audio && outputAudioContextRef.current) {
                            const ctx = outputAudioContextRef.current;
                            const nextStartTime = Math.max(nextStartTimeRef.current, ctx.currentTime);
                            const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
                            const source = ctx.createBufferSource();
                            source.buffer = audioBuffer;
                            source.connect(ctx.destination);
                            source.start(nextStartTime);
                            nextStartTimeRef.current = nextStartTime + audioBuffer.duration;
                        }
                    },
                    onerror: (e) => { setError(`Protocol failure: ${e}`); stopSession(); },
                    onclose: () => stopSession(),
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    inputAudioTranscription: {},
                    outputAudioTranscription: {},
                    systemInstruction: "You are the Nimbus IQ Vocal Core. Sophisticated, factual, authoritative. You eliminate human clerical latency with intelligence."
                },
            });
            sessionRef.current = await sessionPromise;
        } catch (err) { setError(err instanceof Error ? err.message : 'Capture failed.'); setIsConnecting(false); }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-fade-in">
            <div className="bg-slate-900/60 border border-white/5 rounded-[4rem] p-16 flex flex-col items-center justify-center space-y-12 shadow-2xl backdrop-blur-3xl relative">
                {!isActive ? (
                    <div className="text-center space-y-10 max-w-md">
                        <div className="p-24 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shadow-[0_0_100px_rgba(99,102,241,0.1)]">
                            <MaterialSymbol icon="graphic_eq" className="text-[120px] animate-pulse" />
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-4xl font-black text-white uppercase tracking-tighter">Initialize Link</h3>
                            <p className="text-slate-500 font-medium">Connect to the Gemini Native Audio pipeline for real-time sovereign intelligence.</p>
                        </div>
                        <ActionButton onClick={startSession} isLoading={isConnecting} className="w-full py-10 text-2xl uppercase tracking-[0.4em]" icon={<MaterialSymbol icon="bolt" />}>
                            Deploy Link
                        </ActionButton>
                    </div>
                ) : (
                    <div className="w-full space-y-16 flex flex-col items-center">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-indigo-500 blur-[120px] opacity-20 animate-pulse"></div>
                            <div className="h-56 w-56 rounded-full border-4 border-indigo-500 flex items-center justify-center relative z-10 shadow-[0_0_100px_rgba(99,102,241,0.4)]">
                                <MaterialSymbol icon="mic" className="text-[100px] text-indigo-400 animate-bounce" />
                            </div>
                        </div>
                        <div className="text-center space-y-2">
                            <h3 className="text-3xl font-black uppercase text-white tracking-tight">Active Matrix Ingress</h3>
                            <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.6em]">Streaming Sub-Modal Telemetry</p>
                        </div>
                        <ActionButton variant="danger" className="w-full py-8 text-xl uppercase font-black" onClick={stopSession} icon={<MaterialSymbol icon="link_off" />}>
                            Terminate Link
                        </ActionButton>
                    </div>
                )}
            </div>
            <div className="bg-slate-950/80 border border-white/10 rounded-[4rem] p-12 h-[750px] flex flex-col shadow-inner overflow-hidden">
                <div className="flex-grow overflow-y-auto custom-scrollbar space-y-10 pr-6">
                    {transcription.map((t, i) => (
                        <div key={i} className="space-y-6 animate-slide-in-bottom">
                            <div className="flex flex-col gap-2">
                                <span className="text-[8px] font-black uppercase tracking-widest text-indigo-500">Subject</span>
                                <div className="text-slate-300 text-base font-light leading-relaxed bg-white/[0.03] p-6 rounded-[2.5rem] border border-white/5">{t.user}</div>
                            </div>
                            <div className="flex flex-col gap-2 items-start">
                                <span className="text-[8px] font-black uppercase tracking-widest text-slate-700">Nimbus Core</span>
                                <div className="text-white text-base font-bold leading-relaxed bg-indigo-600/10 p-6 rounded-[2.5rem] border border-indigo-500/20 shadow-xl">{t.model}<AISignature /></div>
                            </div>
                        </div>
                    ))}
                    {(currentTurn.user || currentTurn.model) && <div className="animate-pulse opacity-50 space-y-4">
                        {currentTurn.user && <div className="text-sm text-slate-500 italic">Target: {currentTurn.user}</div>}
                        {currentTurn.model && <div className="text-sm text-indigo-400 font-bold italic">Sovereign: {currentTurn.model}</div>}
                    </div>}
                </div>
            </div>
        </div>
    );
};

const NeuralTTS: React.FC = () => {
    const [text, setText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);

    const handleGenerateSpeech = async () => {
        if (!text.trim()) return;
        setIsLoading(true);
        setError(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash-preview-tts",
                contents: [{ parts: [{ text }] }],
                config: { responseModalities: [Modality.AUDIO] },
            });
            const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
            if (base64Audio) {
                if (!audioContextRef.current) audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
                const audioBuffer = await decodeAudioData(decode(base64Audio), audioContextRef.current, 24000, 1);
                const source = audioContextRef.current.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(audioContextRef.current.destination);
                source.start();
            }
        } catch (err) { setError(err instanceof Error ? err.message : 'Synthesis failure.'); } finally { setIsLoading(false); }
    };
    
    return (
        <div className="flex flex-col items-center justify-center py-10 max-w-4xl mx-auto space-y-12">
             <div className="w-full bg-slate-900/60 border border-white/10 p-16 rounded-[4rem] space-y-12 shadow-[0_40px_100px_rgba(0,0,0,0.7)] backdrop-blur-3xl relative overflow-hidden">
                 <div className="space-y-6">
                    <label className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500">Linguistic Input Vector</label>
                    <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Define technical documentation or operational briefings for vocal synthesis..." className="w-full bg-slate-950/80 border border-white/10 rounded-[2.5rem] p-10 text-lg text-white font-light outline-none focus:border-indigo-500/50 transition-all resize-none min-h-[350px] shadow-inner" />
                 </div>
                 <ActionButton onClick={handleGenerateSpeech} isLoading={isLoading} className="w-full py-10 text-2xl uppercase tracking-[0.4em] font-black" icon={<MaterialSymbol icon="graphic_eq" />}>Manifest Vocalization</ActionButton>
                 <AISignature />
            </div>
        </div>
    );
};

export default AudioStudio;
