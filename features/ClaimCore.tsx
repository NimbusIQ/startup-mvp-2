import React, { useState, useRef } from 'react';
import { PageTitle, ActionButton, LoadingState, ErrorState, EmptyState } from '../components/shared';
import { MaterialSymbol } from '../components/icons';
import { GoogleGenAI } from '@google/genai';
import ReactMarkdown from 'https://esm.sh/react-markdown@9';
import remarkGfm from 'https://esm.sh/remark-gfm@4';

const ClaimCore: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [supplementReport, setSupplementReport] = useState<string | null>(null);
    const [scopeData, setScopeData] = useState('');
    const [photos, setPhotos] = useState<string[]>([]);
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            // FIX: Added explicit type annotation for 'file' parameter to resolve implicit 'any' error
            Array.from(files).forEach((file: File) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPhotos(prev => [...prev, reader.result as string]);
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const runClaimInference = async () => {
        if (!scopeData && photos.length === 0) return;
        setIsLoading(true);
        setError(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
            
            // Forensic instructions for ClaimCore
            const systemInstruction = `
                You are CLAIMCORE, the Senior Insurance Supplement Specialist for Nimbus Roofing.
                Your goal is to build detailed Supplement Reports. Every line item added must include:
                1. Xactimate Code (e.g., 'RFG 300S')
                2. Justification based on IRC/IBC Building Code (e.g., "Ice & Water Shield required per IRC R905.1.2").
                3. Reference to provided photo evidence.
                Tone: Factual, assertive, data-driven.
            `;

            const promptParts: any[] = [{ text: `Analyze this Scope of Loss data and inspection photos: \n\n SCOPE: ${scopeData}` }];
            
            photos.forEach(photo => {
                promptParts.push({
                    inlineData: {
                        data: photo.split(',')[1],
                        mimeType: 'image/jpeg'
                    }
                });
            });

            const response = await ai.models.generateContent({
                model: 'gemini-3-pro-preview',
                contents: [{ parts: promptParts }],
                config: {
                    systemInstruction,
                    thinkingConfig: { thinkingBudget: 16000 }
                }
            });

            setSupplementReport(response.text);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Claim synthesis failure.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full animate-fade-in space-y-10">
            <PageTitle title="ClaimCore: Forensic Engine" subtitle="Aggressive Xactimate supplement justification via Multi-Modal RAG." />
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-5 space-y-8">
                    <div className="glass-panel rounded-[3rem] p-10 space-y-8 shadow-2xl relative overflow-hidden">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Scope of Loss Data</label>
                            <textarea 
                                value={scopeData}
                                onChange={e => setScopeData(e.target.value)}
                                placeholder="Paste Adjuster Scope line items or OCR output..."
                                className="w-full h-48 bg-slate-950/50 border border-white/10 rounded-2xl p-6 text-xs font-mono text-indigo-300 outline-none focus:border-indigo-500/50 resize-none"
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Inspection Assets</label>
                                <button onClick={() => fileInputRef.current?.click()} className="text-[10px] font-black text-indigo-400 hover:text-white uppercase tracking-widest">+ Add Photos</button>
                            </div>
                            <div className="grid grid-cols-4 gap-3">
                                {photos.map((p, i) => (
                                    <div key={i} className="aspect-square rounded-xl overflow-hidden border border-white/5 relative group">
                                        <img src={p} className="w-full h-full object-cover" />
                                        <button onClick={() => setPhotos(prev => prev.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><MaterialSymbol icon="close" className="text-[10px]" /></button>
                                    </div>
                                ))}
                                <div onClick={() => fileInputRef.current?.click()} className="aspect-square rounded-xl border border-dashed border-white/10 flex items-center justify-center cursor-pointer hover:border-indigo-500/30 transition-all">
                                    <MaterialSymbol icon="add_a_photo" className="text-slate-700" />
                                </div>
                            </div>
                            <input type="file" ref={fileInputRef} multiple accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                        </div>

                        <ActionButton 
                            onClick={runClaimInference} 
                            isLoading={isLoading} 
                            disabled={(!scopeData && photos.length === 0) || isLoading}
                            className="w-full py-6 text-xl uppercase tracking-widest"
                            icon={<MaterialSymbol icon="shield_search" />}
                        >
                            Generate Supplement
                        </ActionButton>
                    </div>
                </div>

                <div className="lg:col-span-7">
                    <div className="bg-slate-950 border border-white/5 rounded-[3.5rem] p-12 h-full min-h-[600px] shadow-inner relative overflow-hidden">
                        {isLoading ? (
                            <LoadingState message="ClaimCore Reasoning" details="Cross-referencing manufacturer specs with IRC 2021 building codes for maximum recoverable depreciation." />
                        ) : error ? (
                            <ErrorState error={error} />
                        ) : supplementReport ? (
                            <div className="prose prose-invert prose-indigo max-w-none animate-slide-in-bottom">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{supplementReport}</ReactMarkdown>
                                <div className="mt-12 pt-8 border-t border-white/10 flex justify-between">
                                    <ActionButton variant="secondary" icon={<MaterialSymbol icon="download" />}>Export PDF</ActionButton>
                                    <ActionButton variant="secondary" icon={<MaterialSymbol icon="mail" />}>Draft Rebuttal</ActionButton>
                                </div>
                            </div>
                        ) : (
                            <EmptyState title="Forensic Buffer Standby" message="Upload a Scope of Loss or inspection photos to begin the CLAIMCORE audit protocol." icon={<MaterialSymbol icon="gavel" className="text-[120px] opacity-5" />} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClaimCore;