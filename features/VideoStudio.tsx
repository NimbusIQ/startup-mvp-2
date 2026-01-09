
import React, { useState, useEffect, useRef } from 'react';
import { PageTitle, ActionButton, LoadingState, ErrorState, EmptyState, TabGroup, Tab } from '../components/shared';
import { MaterialSymbol } from '../components/icons';
import { GoogleGenAI, GenerateVideosOperation } from '@google/genai';
import { fileToBase64 } from '../utils/media';
import ReactMarkdown from 'https://esm.sh/react-markdown@9';
import remarkGfm from 'https://esm.sh/remark-gfm@4';

type ActiveTab = 'generate' | 'animate' | 'forensics';
type Resolution = '720p' | '1080p';
type AspectRatio = '16:9' | '9:16';

const AISignature = () => (
    <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between opacity-40 select-none pointer-events-none">
        <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></div>
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-indigo-300">Veo Temporal Matrix</span>
        </div>
        <div className="flex items-center gap-2">
            <img src="https://storage.googleapis.com/aistudio-ux-team-data/demos/nimbus-logo.png" className="h-4 w-4 grayscale" alt="IQ" />
            <span className="text-[8px] font-mono text-slate-500 uppercase tracking-tighter">SIG_{Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
        </div>
    </div>
);

const VideoStudio: React.FC = () => {
    const [apiKeySelected, setApiKeySelected] = useState(false);
    const [isCheckingKey, setIsCheckingKey] = useState(true);
    const [activeTab, setActiveTab] = useState<ActiveTab>('generate');
    const [prompt, setPrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
    const [resolution, setResolution] = useState<Resolution>('1080p');
    
    const [mediaFile, setMediaFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const pollingIntervalRef = useRef<number | null>(null);

    useEffect(() => {
        const checkKey = async () => {
            const hasKey = await window.aistudio.hasSelectedApiKey();
            setApiKeySelected(hasKey);
            setIsCheckingKey(false);
        };
        checkKey();
        return () => { if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current); };
    }, []);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setMediaFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleGenerate = async () => {
        if (!prompt.trim() && activeTab === 'generate') return;
        setIsLoading(true);
        setError(null);
        setVideoUrl(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
            setLoadingMessage("Calibrating Temporal Anchors...");
            
            let operation: GenerateVideosOperation;
            if (activeTab === 'animate') {
                if (!mediaFile) throw new Error("Source foundation required.");
                const base64 = await fileToBase64(mediaFile);
                operation = await ai.models.generateVideos({
                    model: 'veo-3.1-fast-generate-preview',
                    prompt: prompt || 'Cinematic sweep, temporal consistency.',
                    image: { imageBytes: base64, mimeType: mediaFile.type },
                    config: { numberOfVideos: 1, resolution, aspectRatio }
                });
            } else {
                operation = await ai.models.generateVideos({
                    model: 'veo-3.1-fast-generate-preview',
                    prompt: prompt || 'Cinematic aerial view of architectural restoration.',
                    config: { numberOfVideos: 1, resolution, aspectRatio }
                });
            }
            pollOperation(operation);
        } catch (err) { setError(err instanceof Error ? err.message : 'Temporal failure.'); setIsLoading(false); }
    };

    const handleAnalyze = async () => {
        if (!mediaFile) return;
        setIsLoading(true);
        setError(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
            const data = await fileToBase64(mediaFile);
            const response = await ai.models.generateContent({
                model: 'gemini-3-pro-preview',
                contents: [{ parts: [{ inlineData: { data, mimeType: mediaFile.type } }, { text: prompt || "Full forensic temporal audit of this visual stream." }] }]
            });
            setAnalysisResult(response.text);
        } catch (err) { setError(err instanceof Error ? err.message : 'Forensic failure.'); } finally { setIsLoading(false); }
    };

    const pollOperation = (operation: GenerateVideosOperation) => {
        pollingIntervalRef.current = window.setInterval(async () => {
            try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
                const updated = await ai.operations.getVideosOperation({ operation });
                if (updated.done) {
                    if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
                    if (updated.error) { 
                        // FIX: Safely cast the error message to string to fix assignment of 'unknown' type
                        setError(updated.error.message ? String(updated.error.message) : "Internal synthesis error."); 
                        setIsLoading(false); 
                        return; 
                    }
                    const uri = updated.response?.generatedVideos?.[0]?.video?.uri;
                    if (uri) {
                        const res = await fetch(`${uri}&key=${process.env.API_KEY}`);
                        const blob = await res.blob();
                        setVideoUrl(URL.createObjectURL(blob));
                    }
                    setIsLoading(false);
                } else { setLoadingMessage(`Manifesting: ${updated.metadata?.progressPercent || 0}%`); }
            } catch (e) { if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current); setIsLoading(false); }
        }, 10000);
    };

    if (isCheckingKey) return <LoadingState message="Neural Clearance" />;
    if (!apiKeySelected) return (
        <div className="flex flex-col items-center justify-center py-32 text-center max-w-3xl mx-auto space-y-12">
            <div className="p-16 bg-indigo-500/10 rounded-full border border-indigo-500/20 shadow-2xl animate-pulse"><MaterialSymbol icon="video_lock" className="text-[120px] text-indigo-400" /></div>
            <h2 className="text-6xl font-black text-white uppercase liquid-chrome leading-none">Activate <br /> Veo Studio</h2>
            <p className="text-slate-500 text-xl max-w-md">Temporal synthesis via the Veo engine is restricted to authorized partners.</p>
            <ActionButton onClick={() => window.aistudio.openSelectKey()} variant="primary" className="px-16 py-8 text-2xl" icon={<MaterialSymbol icon="vpn_key" />}>Connect Veo Engine</ActionButton>
        </div>
    );

    return (
        <div className="flex flex-col h-full animate-fade-in space-y-12 pb-20">
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-10">
                <PageTitle title="Motion Intelligence" subtitle="Cinematic synthesis via the Sovereign Veo 3 engine." />
                
                <div className="flex items-center gap-6 bg-slate-900/60 p-4 rounded-[2.5rem] border border-white/10 backdrop-blur-3xl shadow-2xl">
                    <div className="flex flex-col gap-1 px-4 border-r border-white/10">
                        <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Temporal Res</span>
                        <select value={resolution} onChange={e => setResolution(e.target.value as Resolution)} className="bg-transparent text-sm font-black text-indigo-400 outline-none uppercase">
                            <option value="720p">720p HD</option><option value="1080p">1080p Full HD</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-1 px-4">
                        <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Motion Ratio</span>
                        <select value={aspectRatio} onChange={e => setAspectRatio(e.target.value as AspectRatio)} className="bg-transparent text-sm font-black text-indigo-400 outline-none uppercase">
                            <option value="16:9">16:9 Landscape</option><option value="9:16">9:16 Portrait</option>
                        </select>
                    </div>
                </div>
            </div>
            
            <TabGroup>
                <Tab label="Prompt-to-Video" icon="movie_edit" isActive={activeTab === 'generate'} onClick={() => setActiveTab('generate')} />
                <Tab label="Neural Animation" icon="auto_videocam" isActive={activeTab === 'animate'} onClick={() => setActiveTab('animate')} />
                <Tab label="Visual Audit" icon="biotech" isActive={activeTab === 'forensics'} onClick={() => setActiveTab('forensics')} />
            </TabGroup>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 flex-grow">
                <div className="lg:col-span-4 space-y-10">
                    <div className="glass-panel rounded-[3.5rem] p-12 space-y-10 shadow-2xl bg-white/[0.02]">
                        {(activeTab === 'animate' || activeTab === 'forensics') && (
                            <div onClick={() => fileInputRef.current?.click()} className="relative h-72 bg-slate-950/80 border-2 border-dashed border-white/10 rounded-[3rem] overflow-hidden group cursor-pointer flex flex-col items-center justify-center transition-all hover:border-indigo-500/50">
                                {previewUrl ? <img src={previewUrl} className="w-full h-full object-cover" /> : <>
                                    <MaterialSymbol icon="cloud_upload" className="text-6xl text-slate-700 mb-4 group-hover:text-indigo-400" />
                                    <span className="text-[10px] font-black uppercase text-slate-600 tracking-[0.4em]">Ingest Foundation</span>
                                </>}
                                <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
                            </div>
                        )}
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Temporal Vector</label>
                            <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Define the flow of time and matter..." className="w-full bg-slate-950/80 border border-white/10 rounded-[2rem] p-8 text-sm text-white outline-none focus:border-indigo-500/50 min-h-[160px] resize-none shadow-inner" />
                        </div>
                        <ActionButton onClick={activeTab === 'forensics' ? handleAnalyze : handleGenerate} isLoading={isLoading} className="w-full py-8 text-2xl uppercase tracking-[0.3em]" icon={<MaterialSymbol icon="auto_videocam" />}>
                            Synthesize
                        </ActionButton>
                    </div>
                </div>

                <div className="lg:col-span-8 bg-slate-950/50 border border-white/5 rounded-[4.5rem] p-12 relative overflow-hidden flex flex-col justify-center items-center shadow-inner">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.03)_0%,transparent_80%)]"></div>
                    {isLoading ? <LoadingState message={loadingMessage} details="Utilizing Veo clusters for temporal motion inference." /> : error ? <ErrorState error={error} /> : videoUrl ? (
                        <div className="w-full h-full flex flex-col items-center justify-center p-8 animate-pop-in">
                            <div className="relative group/vid">
                                <div className="absolute -inset-2 bg-indigo-500/20 blur-3xl opacity-0 group-hover/vid:opacity-100 transition-opacity"></div>
                                <video src={videoUrl} controls autoPlay loop className="max-h-[85%] rounded-[3.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.9)] border border-white/10 relative z-10" />
                            </div>
                            <div className="mt-16 flex gap-8 z-20">
                                <ActionButton variant="secondary" className="px-12 h-16 font-black uppercase text-xs" icon={<MaterialSymbol icon="download" />} onClick={() => {
                                    const link = document.createElement('a');
                                    link.href = videoUrl!;
                                    link.download = `veo-synthesis-${Date.now()}.mp4`;
                                    link.click();
                                }}>Export MP4</ActionButton>
                            </div>
                            <div className="w-full max-w-5xl"><AISignature /></div>
                        </div>
                    ) : analysisResult ? (
                        <div className="w-full h-full prose prose-invert prose-indigo p-12 overflow-y-auto bg-slate-900/40 rounded-[3rem] border border-white/5 animate-fade-in"><ReactMarkdown remarkPlugins={[remarkGfm]}>{analysisResult}</ReactMarkdown></div>
                    ) : (
                        <div className="text-center space-y-12 opacity-5 grayscale group-hover:opacity-10 transition-all duration-700">
                            <MaterialSymbol icon="movie" className="text-[180px]" />
                            <p className="text-sm font-black uppercase tracking-[1.5em]">Temporal Buffer Ready</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VideoStudio;
