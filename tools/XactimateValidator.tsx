import React, { useState, useRef } from 'react';
import { PageTitle, ActionButton, LoadingState, ErrorState } from '../components/shared';
import { MaterialSymbol } from '../components/icons';
import { GoogleGenAI } from '@google/genai';
import { XACTIMATE_VALIDATOR_SCHEMA } from '../constants';
import { fileToBase64 } from '../utils/media';

const XactimateValidator: React.FC = () => {
    const [xmlData, setXmlData] = useState('');
    const [jurisdiction, setJurisdiction] = useState('McKinney, TX');
    const [isLoading, setIsLoading] = useState(false);
    const [report, setReport] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);
    
    // Multi-modal Ingress State
    const [attachedFile, setAttachedFile] = useState<{ name: string, data: string, mime: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const base64 = await fileToBase64(file);
                setAttachedFile({
                    name: file.name,
                    data: base64,
                    mime: file.type || 'application/pdf'
                });
                setXmlData(''); // Clear text if file is attached
            } catch (err) {
                setError("Failed to process document ingress.");
            }
        }
    };

    const clearAttachment = () => {
        setAttachedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const runValidation = async () => {
        if (!xmlData && !attachedFile) return;
        setIsLoading(true);
        setError(null);
        setReport(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
            
            const promptParts: any[] = [
                {
                    text: `
                        Act as the Sovereign Xactimate Forensic Auditor. 
                        JURISDICTION: ${jurisdiction}
                        
                        TASK:
                        1. EXTRACT: Analyze the provided ${attachedFile ? 'document' : 'text/XML data'} and extract all roofing-related line items.
                        2. AUDIT: Cross-check items against IRC 2021 building codes for ${jurisdiction}.
                        3. IDENTIFY: Flag missing code upgrades (e.g., drip edge, ice and water shield).
                        4. SNIPER MODE: Detect fraud and inflation. Flag overlapping items (e.g., charging for both "Steep Charge" and "High Roof" incorrectly).
                        5. VERIFY: Ensure material matching for "Duration Storm" or "Class 4" requirements.
                        
                        ${xmlData ? `DATA TO ANALYZE: ${xmlData}` : 'ANALYZE THE ATTACHED DOCUMENT.'}
                        
                        Output strictly valid JSON conforming to the Sovereign Forensic Audit Schema.
                    `
                }
            ];

            if (attachedFile) {
                promptParts.unshift({
                    inlineData: {
                        data: attachedFile.data,
                        mimeType: attachedFile.mime
                    }
                });
            }

            const response = await ai.models.generateContent({
                model: 'gemini-3-pro-preview',
                contents: [{ parts: promptParts }],
                config: {
                    responseMimeType: "application/json",
                    responseSchema: XACTIMATE_VALIDATOR_SCHEMA,
                    thinkingConfig: { thinkingBudget: 16000 }
                }
            });

            setReport(JSON.parse(response.text));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Auditing protocol failure.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col space-y-10 animate-fade-in">
            <PageTitle 
                title="Forensic Xactimate Validator" 
                subtitle="High-fidelity building code auditing via Multi-Modal Document Extraction." 
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-5 space-y-6">
                    <div className="bg-slate-900 border border-white/10 rounded-[3rem] p-10 space-y-8 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl"></div>
                        
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Jurisdiction Nexus</label>
                            <input 
                                value={jurisdiction}
                                onChange={e => setJurisdiction(e.target.value)}
                                className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 text-white font-bold outline-none focus:border-indigo-500/50 transition-all"
                            />
                        </div>

                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Document Ingress</label>
                                <button 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="text-[10px] font-black text-indigo-400 hover:text-white transition-colors"
                                >
                                    + UPLOAD DOC
                                </button>
                            </div>

                            {attachedFile ? (
                                <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-2xl p-4 flex items-center justify-between group animate-fade-in">
                                    <div className="flex items-center gap-3">
                                        <MaterialSymbol icon="description" className="text-indigo-400" />
                                        <span className="text-xs font-mono text-indigo-200 truncate max-w-[200px]">{attachedFile.name}</span>
                                    </div>
                                    <button onClick={clearAttachment} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                                        <MaterialSymbol icon="close" className="text-sm" />
                                    </button>
                                </div>
                            ) : (
                                <div 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500/50 transition-all group"
                                >
                                    <MaterialSymbol icon="cloud_upload" className="text-4xl text-slate-700 group-hover:text-indigo-500 transition-colors mb-4" />
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">PDF / Image / DOCX</p>
                                </div>
                            )}
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                className="hidden" 
                                accept=".pdf,.doc,.docx,image/*" 
                                onChange={handleFileUpload} 
                            />

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                    <div className="w-full border-t border-white/5"></div>
                                </div>
                                <div className="relative flex justify-center text-[8px] font-black uppercase tracking-[0.4em] text-slate-700">
                                    <span className="bg-slate-900 px-4">OR PASTE DATA</span>
                                </div>
                            </div>

                            <textarea 
                                value={xmlData}
                                onChange={e => {
                                    setXmlData(e.target.value);
                                    if (e.target.value) setAttachedFile(null); // Clear file if typing
                                }}
                                placeholder="Paste estimate XML, text summary, or line items..."
                                className="w-full h-48 bg-slate-950 border border-white/10 rounded-3xl p-6 text-xs font-mono text-indigo-400 outline-none focus:border-indigo-500/50 resize-none transition-all"
                            />
                        </div>

                        <ActionButton 
                            onClick={runValidation} 
                            isLoading={isLoading} 
                            disabled={(!xmlData && !attachedFile) || isLoading}
                            className="w-full py-6 text-xl shadow-indigo-600/20"
                            icon={<MaterialSymbol icon="shield_search" />}
                        >
                            Execute Forensic Audit
                        </ActionButton>
                    </div>
                </div>

                <div className="lg:col-span-7">
                    <div className="bg-slate-950 border border-white/5 rounded-[3rem] p-10 h-full min-h-[600px] shadow-inner relative overflow-hidden flex flex-col">
                        {isLoading ? (
                            <LoadingState 
                                message="Executing Neural Reasoning" 
                                details="Performing OCR extraction and cross-referencing extracted items against local building code and fraud pattern databases." 
                            />
                        ) : error ? (
                            <ErrorState error={error} />
                        ) : report ? (
                            <div className="space-y-10 animate-slide-in-bottom overflow-y-auto custom-scrollbar flex-grow pr-2">
                                {/* Summary HUD */}
                                <div className="grid grid-cols-3 gap-6">
                                    <div className="p-6 bg-slate-900 border border-white/5 rounded-[2rem] text-center shadow-lg">
                                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block mb-1">Compliance</span>
                                        <span className="text-3xl font-black text-indigo-400 font-mono">{report.audit_summary.compliance_score}%</span>
                                    </div>
                                    <div className="p-6 bg-slate-900 border border-white/5 rounded-[2rem] text-center shadow-lg">
                                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block mb-1">Audit Hits</span>
                                        <span className="text-3xl font-black text-white font-mono">{report.audit_summary.discrepancies_found}</span>
                                    </div>
                                    <div className={`p-6 border rounded-[2rem] text-center shadow-lg transition-colors ${report.audit_summary.fraud_risk_probability > 0.4 ? 'bg-rose-500/10 border-rose-500/30' : 'bg-slate-900 border-white/5'}`}>
                                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block mb-1">Fraud Risk</span>
                                        <span className={`text-3xl font-black font-mono ${report.audit_summary.fraud_risk_probability > 0.4 ? 'text-rose-500' : 'text-emerald-500'}`}>
                                            {(report.audit_summary.fraud_risk_probability * 100).toFixed(0)}%
                                        </span>
                                    </div>
                                </div>

                                {/* Discrepancy List */}
                                <div className="space-y-6">
                                    <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                        <MaterialSymbol icon="list_alt" className="text-indigo-400" /> Code Deficiencies
                                    </h3>
                                    <div className="grid gap-4">
                                        {report.code_discrepancies.map((d: any, i: number) => (
                                            <div key={i} className="p-6 bg-slate-900 border-l-4 border-indigo-500 rounded-2xl group hover:bg-slate-800/50 transition-all shadow-md">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="text-white font-black uppercase text-sm">{d.violation_type}</span>
                                                    <span className="text-[9px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-md">{d.relevant_code_section}</span>
                                                </div>
                                                <p className="text-xs text-slate-400 leading-relaxed font-medium">{d.required_action}</p>
                                                {d.cost_impact && <p className="text-[10px] font-black text-emerald-400 mt-3 flex items-center gap-2">
                                                    <MaterialSymbol icon="payments" /> Projected Supplement: +${d.cost_impact}
                                                </p>}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Fraud Alerts */}
                                {report.fraud_alerts?.length > 0 && (
                                    <div className="space-y-6">
                                        <h3 className="text-xs font-black text-rose-500/50 uppercase tracking-widest flex items-center gap-2">
                                            <MaterialSymbol icon="gavel" className="text-rose-500" /> Audit Alerts
                                        </h3>
                                        <div className="grid gap-4">
                                            {report.fraud_alerts.map((a: any, i: number) => (
                                                <div key={i} className="p-6 bg-rose-500/5 border border-rose-500/20 rounded-2xl animate-pulse-slow">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <MaterialSymbol icon="warning" className="text-rose-500" />
                                                        <span className="text-rose-400 font-black text-xs uppercase">{a.alert_severity} THREAT</span>
                                                    </div>
                                                    <p className="text-xs text-slate-300 italic leading-relaxed">{a.redundancy_check}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-700 text-center space-y-6">
                                <MaterialSymbol icon="analytics" className="text-9xl opacity-10" />
                                <p className="text-xs font-black uppercase tracking-[0.4em] max-w-[280px]">Initialize Ingress Vector for Forensic Synthesis</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default XactimateValidator;