import React, { useState } from 'react';
import { PageTitle, ActionButton, LoadingState, ErrorState } from '../components/shared';
import { MaterialSymbol } from '../components/icons';
import { GoogleGenAI } from '@google/genai';
import { STORM_DATE_SCHEMA } from '../constants';

const StormDateValidator: React.FC = () => {
    const [address, setAddress] = useState('');
    const [date, setDate] = useState('2025-03-01');
    const [isLoading, setIsLoading] = useState(false);
    const [report, setReport] = useState<any | null>(null);
    const [sources, setSources] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    const validateDate = async () => {
        if (!address) return;
        setIsLoading(true);
        setError(null);
        setReport(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
            const response = await ai.models.generateContent({
                model: 'gemini-3-pro-preview',
                contents: `
                    Act as the Sovereign Storm Forensic Meteorologist. 
                    ADDRESS: ${address}
                    DATE OF LOSS: ${date}
                    
                    TASK:
                    1. Use Google Search to find historical weather records for ${address} on ${date}.
                    2. Look for NOAA, NWS, or local news reports confirming hail size, wind speed, and lightning strikes.
                    3. Verify if a "Date of Loss" event is meteorologically consistent with regional storm cells on that specific day.
                    
                    Output valid JSON for the Sovereign Storm Date Verification Schema.
                `,
                config: {
                    tools: [{ googleSearch: {} }],
                    responseMimeType: "application/json",
                    responseSchema: STORM_DATE_SCHEMA
                }
            });

            setReport(JSON.parse(response.text));
            setSources(response.candidates?.[0]?.groundingMetadata?.groundingChunks || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Weather grounding protocol failure.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col space-y-12 animate-fade-in">
            <PageTitle 
                title="Storm Chronology Validator" 
                subtitle="Exact-date verification using historical weather grounding and NOAA data." 
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="bg-slate-900 border border-white/10 rounded-[3rem] p-12 space-y-8 shadow-2xl relative">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Loss Location</label>
                        <input 
                            value={address}
                            onChange={e => setAddress(e.target.value)}
                            placeholder="Enter property address..."
                            className="w-full bg-slate-950 border border-white/10 rounded-2xl p-6 text-white font-bold outline-none focus:border-indigo-500/50"
                        />
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Proposed Date of Loss (DOL)</label>
                        <input 
                            type="date"
                            value={date}
                            onChange={e => setDate(e.target.value)}
                            className="w-full bg-slate-950 border border-white/10 rounded-2xl p-6 text-white font-bold outline-none focus:border-indigo-500/50 color-scheme-dark"
                        />
                    </div>
                    <ActionButton onClick={validateDate} isLoading={isLoading} className="w-full py-8 text-2xl uppercase">
                        Execute Chronology Verification
                    </ActionButton>
                </div>

                <div className="bg-slate-950 border border-white/5 rounded-[3.5rem] p-10 shadow-inner overflow-y-auto custom-scrollbar">
                    {isLoading ? (
                        <LoadingState message="Accessing NOAA Data Feeds" details="Grounding model reasoning in factual atmospheric records for the specified sector." />
                    ) : error ? (
                        <ErrorState error={error} />
                    ) : report ? (
                        <div className="space-y-10 animate-slide-in-bottom">
                            <div className="flex items-center justify-between p-8 bg-slate-900 border border-indigo-500/30 rounded-[2.5rem]">
                                <div>
                                    <span className="text-[10px] font-black uppercase text-slate-500">Verification Status</span>
                                    <h3 className={`text-4xl font-black tracking-tighter uppercase leading-none mt-1 ${report.event_verification.is_verified ? 'text-emerald-400' : 'text-rose-500'}`}>
                                        {report.event_verification.is_verified ? 'Verified' : 'Unconfirmed'}
                                    </h3>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] font-black uppercase text-slate-500">Confidence</span>
                                    <p className="text-2xl font-black text-white font-mono">{(report.event_verification.confidence * 100).toFixed(0)}%</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="p-6 bg-slate-900 rounded-2xl border border-white/5">
                                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block mb-2">Max Hail Diameter</span>
                                    <span className="text-xl font-black text-white font-mono">{report.event_verification.recorded_hail_size}</span>
                                </div>
                                <div className="p-6 bg-slate-900 rounded-2xl border border-white/5">
                                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block mb-2">Peak Wind Speed</span>
                                    <span className="text-xl font-black text-white font-mono">{report.event_verification.recorded_wind_gusts}</span>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Chronology Stream</h3>
                                <div className="space-y-4 relative border-l border-white/10 pl-6 ml-2">
                                    {report.meteorological_timeline.map((t: any, i: number) => (
                                        <div key={i} className="relative">
                                            <div className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full bg-indigo-500 border-4 border-slate-950"></div>
                                            <span className="text-[9px] font-black text-indigo-400 uppercase">{t.timestamp}</span>
                                            <p className="text-sm font-medium text-slate-300">{t.condition}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="p-8 bg-indigo-500/5 border border-indigo-500/20 rounded-[2.5rem]">
                                <h4 className="text-[10px] font-black uppercase text-indigo-400 mb-2">Sovereign Recommendation</h4>
                                <p className="text-sm text-slate-300 italic">"{report.sovereign_recommendation}"</p>
                            </div>

                            {sources.length > 0 && (
                                <div className="pt-8 border-t border-white/5">
                                    <h4 className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-4">Verification Sources</h4>
                                    <div className="flex flex-wrap gap-4">
                                        {sources.map((s, i) => s.web && (
                                            <a key={i} href={s.web.uri} target="_blank" rel="noreferrer" className="text-[9px] font-black text-indigo-500 hover:text-white transition-colors border border-indigo-500/20 px-3 py-1 rounded-full uppercase">
                                                {s.web.title || 'Grounding Data'}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-700 text-center space-y-6 grayscale opacity-10">
                            <MaterialSymbol icon="thunderstorm" className="text-9xl" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StormDateValidator;
