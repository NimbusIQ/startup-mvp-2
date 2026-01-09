
import React, { useState, useRef } from 'react';
import { PageTitle, ActionButton, LoadingState, ErrorState, EmptyState } from '../components/shared';
import { MaterialSymbol } from '../components/icons';
import { GoogleGenAI, Type } from '@google/genai';

type EngineStep = 'upload' | 'analyze' | 'generate' | 'deploy';

const SpreadsheetEngine: React.FC = () => {
    const [step, setStep] = useState<EngineStep>('upload');
    const [fileName, setFileName] = useState<string | null>(null);
    const [analysis, setAnalysis] = useState<any | null>(null);
    const [generatedCode, setGeneratedCode] = useState<string | null>(null);
    const [deployUrl, setDeployUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileName(file.name);
            setStep('analyze');
            runAnalysis();
        }
    };

    const runAnalysis = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
            // Simulate reading the CSV header for a roofing inventory
            const mockHeaders = "PropertyID, Material, Color, SquareFootage, DamageSeverity, InspectedDate";
            
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: `Analyze these CSV headers for a construction SaaS app: ${mockHeaders}. Map them to a semantic JSON schema for a React application.`,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            mappings: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        column: { type: Type.STRING },
                                        type: { type: Type.STRING },
                                        purpose: { type: Type.STRING }
                                    }
                                }
                            }
                        }
                    }
                }
            });
            setAnalysis(JSON.parse(response.text));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Analysis failed.');
        } finally {
            setIsLoading(false);
        }
    };

    const runGeneration = async () => {
        setIsLoading(true);
        setStep('generate');
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
            const response = await ai.models.generateContent({
                model: 'gemini-3-pro-preview',
                contents: `Using the following schema mappings: ${JSON.stringify(analysis.mappings)}, generate a modern React dashboard component that displays this data beautifully. Include tailwind classes and glassmorphism.`,
                config: {
                    thinkingConfig: { thinkingBudget: 16000 }
                }
            });
            setGeneratedCode(response.text);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Generation failed.');
        } finally {
            setIsLoading(false);
        }
    };

    const runDeploy = () => {
        setIsLoading(true);
        setStep('deploy');
        setTimeout(() => {
            setDeployUrl(`https://inventory-${Math.random().toString(36).substring(7)}.nimbusiq.ai`);
            setIsLoading(false);
        }, 3000);
    };

    const reset = () => {
        setStep('upload');
        setFileName(null);
        setAnalysis(null);
        setGeneratedCode(null);
        setDeployUrl(null);
    };

    return (
        <div className="flex flex-col h-full space-y-10 animate-fade-in">
            <PageTitle title="Sheet OS Engine" subtitle="Transform legacy spreadsheets into scalable, AI-native SaaS micro-apps instantly." />
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-grow">
                {/* Process HUD */}
                <div className="lg:col-span-4 bg-slate-900/60 border border-slate-800 rounded-[2.5rem] p-10 flex flex-col space-y-8">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Engine Protocol Status</label>
                        <div className="space-y-3">
                            {[
                                { id: 'upload', label: 'Data Ingestion', status: step === 'upload' ? 'Active' : 'Complete' },
                                { id: 'analyze', label: 'Semantic Mapping', status: step === 'analyze' ? 'Processing' : step === 'upload' ? 'Pending' : 'Complete' },
                                { id: 'generate', label: 'Neural Synthesis', status: step === 'generate' ? 'Processing' : (step === 'upload' || step === 'analyze') ? 'Pending' : 'Complete' },
                                { id: 'deploy', label: 'Cloud Deployment', status: step === 'deploy' ? 'Active' : deployUrl ? 'Live' : 'Pending' }
                            ].map((s) => (
                                <div key={s.id} className="flex items-center justify-between p-4 bg-slate-950 border border-white/5 rounded-2xl">
                                    <span className="text-xs font-bold text-slate-300">{s.label}</span>
                                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${s.status === 'Processing' || s.status === 'Active' ? 'bg-indigo-500 text-white animate-pulse' : s.status === 'Complete' || s.status === 'Live' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-700'}`}>
                                        {s.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {step === 'analyze' && analysis && !isLoading && (
                        <ActionButton onClick={runGeneration} className="w-full">Initialize Synthesis</ActionButton>
                    )}
                    {step === 'generate' && generatedCode && !isLoading && (
                        <ActionButton onClick={runDeploy} className="w-full">Initialize Deployment</ActionButton>
                    )}
                    {deployUrl && (
                        <ActionButton onClick={reset} variant="secondary" className="w-full">New Application</ActionButton>
                    )}
                </div>

                {/* Interactive Canvas */}
                <div className="lg:col-span-8 bg-[#020617] border border-slate-800 rounded-[3rem] p-12 flex flex-col shadow-inner overflow-hidden relative">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.03)_0%,transparent_70%)]"></div>
                    
                    {step === 'upload' && (
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="flex-grow flex flex-col items-center justify-center border-4 border-dashed border-white/5 rounded-[2rem] hover:border-indigo-500/40 transition-all group cursor-pointer"
                        >
                            <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
                            <MaterialSymbol icon="cloud_upload" className="text-8xl text-slate-800 group-hover:text-indigo-500 transition-colors mb-6" />
                            <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Drag Spreadsheet</h3>
                            <p className="text-slate-500 mt-2 text-sm">CSV, XLSX, or Google Sheet Export</p>
                        </div>
                    )}

                    {step === 'analyze' && (
                        <div className="flex-grow flex flex-col">
                            {isLoading ? (
                                <LoadingState message="Mapping Data Semantics" details="Using Gemini 3 Flash to detect column relationships and schema types." />
                            ) : analysis && (
                                <div className="space-y-6 animate-fade-in">
                                    <h3 className="text-xl font-black text-white uppercase tracking-tighter">Inferred Schema Matrix</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {analysis.mappings.map((m: any, i: number) => (
                                            <div key={i} className="p-4 bg-slate-900 border border-white/5 rounded-2xl flex items-center justify-between">
                                                <div>
                                                    <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{m.type}</p>
                                                    <p className="text-sm font-bold text-white">{m.column}</p>
                                                </div>
                                                <span className="text-[10px] text-slate-600 font-mono italic">{m.purpose}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {step === 'generate' && (
                        <div className="flex-grow flex flex-col">
                            {isLoading ? (
                                <LoadingState message="Neural Synthesis Active" details="Gemini 3 Pro is architecting a custom React interface with deep reasoning." />
                            ) : generatedCode && (
                                <div className="flex-grow flex flex-col space-y-4">
                                    <h3 className="text-xl font-black text-white uppercase tracking-tighter">App Manifest Core</h3>
                                    <pre className="flex-grow bg-slate-950 border border-slate-800 rounded-2xl p-6 font-mono text-[10px] text-indigo-400 overflow-auto custom-scrollbar">
                                        {generatedCode}
                                    </pre>
                                </div>
                            )}
                        </div>
                    )}

                    {step === 'deploy' && (
                        <div className="flex-grow flex flex-col items-center justify-center space-y-8">
                            {isLoading ? (
                                <LoadingState message="Provisioning Cloud Run" details="Building container image and pushing to Google Cloud infrastructure." />
                            ) : deployUrl && (
                                <div className="text-center space-y-8 animate-pop-in">
                                    <div className="w-32 h-32 bg-emerald-500/10 rounded-full mx-auto flex items-center justify-center border border-emerald-500/20">
                                        <MaterialSymbol icon="verified" className="text-6xl text-emerald-500" />
                                    </div>
                                    <div>
                                        <h3 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">App Is Live</h3>
                                        <p className="text-slate-500 mt-2 font-medium">Deployed to Nimbus IQ Global Edge</p>
                                    </div>
                                    <div className="p-4 bg-slate-900 rounded-2xl border border-white/10 flex items-center gap-4">
                                        <code className="text-indigo-400 font-mono text-xs">{deployUrl}</code>
                                        <button className="text-white hover:text-indigo-400"><MaterialSymbol icon="content_copy" /></button>
                                    </div>
                                    <ActionButton className="px-12">Launch Application</ActionButton>
                                </div>
                            )}
                        </div>
                    )}

                    {error && <ErrorState error={error} />}
                </div>
            </div>
        </div>
    );
};

export default SpreadsheetEngine;
