
import React, { useState, useRef, useEffect } from 'react';
import { PageTitle, ActionButton, LoadingState, ErrorState, TabGroup, Tab } from '../components/shared';
import { MaterialSymbol } from '../components/icons';
import { GoogleGenAI } from '@google/genai';

type AspectRatio = '1:1' | '3:4' | '4:3' | '9:16' | '16:9';
type ImageSize = '1K' | '2K' | '4K';
type StudioMode = 'generate' | 'edit';

const AISignature = () => (
    <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between opacity-40 select-none pointer-events-none group-hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.8)]"></div>
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-indigo-300">Sovereign Visual Engine v3</span>
        </div>
        <div className="flex items-center gap-2 grayscale group-hover:grayscale-0 transition-all">
            <img src="https://storage.googleapis.com/aistudio-ux-team-data/demos/nimbus-logo.png" className="h-4 w-4" alt="IQ" />
            <span className="text-[8px] font-mono tracking-tighter text-slate-500">NI_IMG_{Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
        </div>
    </div>
);

const ImageStudio: React.FC = () => {
    const [apiKeySelected, setApiKeySelected] = useState(false);
    const [isCheckingKey, setIsCheckingKey] = useState(true);
    const [mode, setMode] = useState<StudioMode>('generate');
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // Premium Config Dials
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
    const [imageSize, setImageSize] = useState<ImageSize>('1K');
    
    // Result Assets
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [foundationImage, setFoundationImage] = useState<string | null>(null);
    const [foundationMime, setFoundationMime] = useState<string>('image/png');
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const checkKey = async () => {
            const hasKey = await window.aistudio.hasSelectedApiKey();
            setApiKeySelected(hasKey);
            setIsCheckingKey(false);
        };
        checkKey();
    }, []);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFoundationImage(reader.result as string);
                setFoundationMime(file.type);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleExecute = async () => {
        if (!prompt.trim() && mode === 'generate') return;
        setIsLoading(true);
        setError(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
            
            if (mode === 'generate') {
                const response = await ai.models.generateContent({
                    model: 'gemini-3-pro-image-preview',
                    contents: { parts: [{ text: prompt }] },
                    config: {
                        imageConfig: { aspectRatio, imageSize },
                        tools: [{ googleSearch: {} }] 
                    }
                });

                for (const part of response.candidates[0].content.parts) {
                    if (part.inlineData) {
                        setGeneratedImage(`data:image/png;base64,${part.inlineData.data}`);
                    }
                }
            } else {
                if (!foundationImage) throw new Error("Foundation asset ingress required.");
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash-image',
                    contents: {
                        parts: [
                            { inlineData: { data: foundationImage.split(',')[1], mimeType: foundationMime } },
                            { text: prompt || "Refine visual clarity and forensic detail." }
                        ]
                    }
                });

                for (const part of response.candidates[0].content.parts) {
                    if (part.inlineData) {
                        setGeneratedImage(`data:image/png;base64,${part.inlineData.data}`);
                    }
                }
            }
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Visual synthesis failure.';
            if (msg.includes("Requested entity was not found")) {
                setApiKeySelected(false);
                setError("Neural Key Expired. Re-authorization required.");
            } else {
                setError(msg);
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (isCheckingKey) return <LoadingState message="Scanning Neural Credentials..." />;

    if (!apiKeySelected) {
        return (
            <div className="flex flex-col items-center justify-center py-32 text-center max-w-3xl mx-auto space-y-12 animate-fade-in">
                <div className="p-16 bg-indigo-500/10 rounded-[4rem] border border-indigo-500/20 shadow-[0_0_100px_rgba(99,102,241,0.2)]">
                    <MaterialSymbol icon="image_lock" className="text-[120px] text-indigo-400" />
                </div>
                <div className="space-y-6">
                    <h2 className="text-6xl font-black text-white tracking-tighter uppercase liquid-chrome leading-none">Activate <br /> The Forge</h2>
                    <p className="text-slate-400 text-xl font-medium max-w-lg">High-fidelity 4K visual synthesis is restricted to premium partner projects.</p>
                </div>
                <div className="flex flex-col gap-6 w-full max-w-sm">
                    <ActionButton onClick={() => window.aistudio.openSelectKey()} variant="primary" className="py-8 text-2xl" icon={<MaterialSymbol icon="vpn_key" />}>
                        Deploy API Key
                    </ActionButton>
                    <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="text-[10px] font-black uppercase text-slate-600 hover:text-indigo-400 tracking-[0.5em] transition-all">GCP Billing Documentation</a>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full animate-fade-in space-y-10 pb-20">
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-10">
                <PageTitle title="Sovereign Visual Studio" subtitle="Generate 4K cinematic assets or execute forensic image editing." />
                
                {/* Premium Dial Control Panel */}
                <div className="flex flex-wrap items-center gap-6 bg-slate-900/60 p-4 rounded-[2.5rem] border border-white/10 backdrop-blur-3xl shadow-2xl">
                    <div className="flex flex-col gap-1.5 px-6 border-r border-white/10">
                        <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Resolution Matrix</span>
                        <select value={imageSize} onChange={e => setImageSize(e.target.value as ImageSize)} className="bg-transparent text-sm font-black text-indigo-400 outline-none cursor-pointer uppercase">
                            <option value="1K" className="bg-slate-900">1K Standard</option>
                            <option value="2K" className="bg-slate-900">2K Precision</option>
                            <option value="4K" className="bg-slate-900">4K Sovereign</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-1.5 px-6">
                        <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Aspect Vector</span>
                        <select value={aspectRatio} onChange={e => setAspectRatio(e.target.value as AspectRatio)} className="bg-transparent text-sm font-black text-indigo-400 outline-none cursor-pointer uppercase">
                            {['1:1', '3:4', '4:3', '9:16', '16:9'].map(r => <option key={r} value={r} className="bg-slate-900">{r}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            <TabGroup>
                <Tab label="Neural Manifest" icon="add_photo_alternate" isActive={mode === 'generate'} onClick={() => setMode('generate')} />
                <Tab label="Forensic Edit" icon="image_edit" isActive={mode === 'edit'} onClick={() => setMode('edit')} />
            </TabGroup>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 flex-grow">
                {/* Control Sidebar */}
                <div className="lg:col-span-4 space-y-10">
                    <div className="glass-panel rounded-[3.5rem] p-12 space-y-10 shadow-2xl relative overflow-hidden bg-white/[0.02]">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl pointer-events-none"></div>
                        
                        {mode === 'edit' && (
                            <div className="space-y-6 animate-fade-in">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Foundation Ingress</label>
                                <div 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="relative h-64 bg-slate-950/80 border-2 border-dashed border-white/10 rounded-[3rem] flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500/50 transition-all group overflow-hidden shadow-inner"
                                >
                                    {foundationImage ? (
                                        <img src={foundationImage} className="w-full h-full object-cover" />
                                    ) : (
                                        <>
                                            <MaterialSymbol icon="cloud_upload" className="text-6xl text-slate-700 group-hover:text-indigo-400 mb-4 transition-colors" />
                                            <span className="text-[10px] font-black uppercase text-slate-600 tracking-[0.4em]">Ingest Buffer</span>
                                        </>
                                    )}
                                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
                                </div>
                            </div>
                        )}

                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Manifest Prompt</label>
                            <textarea 
                                value={prompt} 
                                onChange={e => setPrompt(e.target.value)} 
                                placeholder={mode === 'generate' ? "Define visual reality..." : "Define modifications (e.g., 'Enhance roof shingles', 'Highlight damage')..."}
                                className="w-full bg-slate-950/80 border border-white/10 rounded-[2rem] p-8 text-sm text-white outline-none focus:border-indigo-500/50 min-h-[160px] resize-none transition-all shadow-inner placeholder:text-slate-700"
                            />
                        </div>

                        <ActionButton 
                            onClick={handleExecute} 
                            isLoading={isLoading} 
                            className="w-full py-8 text-2xl uppercase tracking-[0.3em] shadow-2xl"
                            icon={<MaterialSymbol icon={mode === 'generate' ? 'bolt' : 'auto_fix_high'} />}
                        >
                            {mode === 'generate' ? 'Manifest' : 'Transform'}
                        </ActionButton>
                    </div>
                </div>

                {/* Synthesis Output Area */}
                <div className="lg:col-span-8">
                    <div className="h-full glass-panel rounded-[4.5rem] p-12 flex flex-col shadow-[0_40px_120px_-20px_rgba(0,0,0,0.8)] relative overflow-hidden bg-slate-950/50">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.03)_0%,transparent_70%)] pointer-events-none"></div>
                        
                        <div className="flex-grow flex flex-col items-center justify-center bg-black/40 rounded-[3.5rem] border border-white/5 overflow-hidden shadow-inner relative group">
                            {isLoading ? (
                                <LoadingState message="Visual Synthesis" details="Gemini 3 Pro is sculpting pixel tensors via Sovereign Cloud clusters." />
                            ) : error ? (
                                <ErrorState error={error} />
                            ) : generatedImage ? (
                                <div className="w-full h-full flex flex-col items-center justify-center p-8 md:p-16 animate-pop-in">
                                    <div className="relative group/asset">
                                        <div className="absolute -inset-1 bg-gradient-to-br from-indigo-500/30 to-transparent blur-2xl opacity-0 group-hover/asset:opacity-100 transition-opacity"></div>
                                        <img src={generatedImage} className="max-h-full max-w-full rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.9)] border border-white/10 object-contain relative z-10" />
                                    </div>
                                    <div className="mt-16 flex flex-wrap gap-8 z-20">
                                        <ActionButton variant="secondary" className="px-12 h-16 text-xs uppercase font-black" icon={<MaterialSymbol icon="download" />} onClick={() => {
                                            const link = document.createElement('a');
                                            link.href = generatedImage!;
                                            link.download = `nimbus-synthesis-${Date.now()}.png`;
                                            link.click();
                                        }}>Export Asset</ActionButton>
                                        <ActionButton variant="secondary" className="px-12 h-16 text-xs uppercase font-black" icon={<MaterialSymbol icon="cloud_done" />} onClick={() => setFoundationImage(generatedImage)}>Set as Foundation</ActionButton>
                                    </div>
                                    <div className="w-full max-w-4xl"><AISignature /></div>
                                </div>
                            ) : (
                                <div className="text-center space-y-10 opacity-5 grayscale group-hover:opacity-20 transition-all duration-700">
                                    <MaterialSymbol icon="palette" className="text-[180px]" />
                                    <p className="text-sm font-black uppercase tracking-[1.5em]">Awaiting Ingress</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageStudio;
