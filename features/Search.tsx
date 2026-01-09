import React, { useState, useEffect } from 'react';
import { PageTitle, ActionButton, LoadingState, ErrorState, EmptyState } from '../components/shared';
import { MaterialSymbol } from '../components/icons';
import { GoogleGenAI } from '@google/genai';
import ReactMarkdown from 'https://esm.sh/react-markdown@9';
import remarkGfm from 'https://esm.sh/remark-gfm@4';

interface Source { title: string; uri: string; }

const Search: React.FC = () => {
    const [query, setQuery] = useState('');
    const [mode, setMode] = useState<'search' | 'maps'>('search');
    const [location, setLocation] = useState<{ lat: number, lon: number } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<string | null>(null);
    const [sources, setSources] = useState<Source[]>([]);
    
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
                () => console.warn('Geolocation denied.')
            );
        }
    }, []);

    const handleSearch = async () => {
        if (!query.trim()) return;
        setIsLoading(true);
        setError(null);
        setSources([]);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
            
            if (mode === 'maps') {
                // Gemini 2.5 Flash for Maps Grounding
                const response = await ai.models.generateContent({
                    model: "gemini-2.5-flash",
                    contents: query,
                    config: {
                        tools: [{ googleMaps: {} }, { googleSearch: {} }],
                        toolConfig: location ? {
                            retrievalConfig: { latLng: { latitude: location.lat, longitude: location.lon } }
                        } : undefined
                    },
                });
                setResult(response.text);
                const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
                if (chunks) {
                    setSources(chunks.flatMap(c => {
                        const s: Source[] = [];
                        if (c.web) s.push({ title: c.web.title || 'Web Source', uri: c.web.uri });
                        if (c.maps) s.push({ title: c.maps.title || 'Map Location', uri: c.maps.uri });
                        return s;
                    }));
                }
            } else {
                // Gemini 3 Flash for Fast Search Grounding
                const response = await ai.models.generateContent({
                    model: "gemini-3-flash-preview",
                    contents: query,
                    config: { tools: [{ googleSearch: {} }] },
                });
                setResult(response.text);
                const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
                if (chunks) {
                    setSources(chunks.filter(c => c.web).map(c => ({ title: c.web!.title || 'Verified Source', uri: c.web!.uri })));
                }
            }
        } catch (err) { setError(err instanceof Error ? err.message : 'Grounding failure.'); } finally { setIsLoading(false); }
    };

    return (
        <div className="flex flex-col h-full animate-fade-in space-y-10">
            <PageTitle title="Grounded Matrix" subtitle="Verifiable intelligence synthesis from live global data streams." />
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-4 bg-slate-900 border border-white/5 rounded-[3.5rem] p-10 space-y-10 shadow-2xl relative overflow-hidden">
                    <div className="flex bg-slate-950 p-1 rounded-2xl border border-white/5">
                        <button onClick={() => setMode('search')} className={`flex-grow py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'search' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}>Search Mode</button>
                        <button onClick={() => setMode('maps')} className={`flex-grow py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'maps' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}>Maps Mode</button>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Query Vector</label>
                        <textarea value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { handleSearch(); e.preventDefault(); }}} placeholder={mode === 'maps' ? "Find local facilities, sites, or landmarks..." : "Search live news, codes, or technical data..."} className="w-full bg-slate-950 border border-white/10 rounded-3xl p-6 text-sm text-white outline-none focus:border-indigo-500/50 min-h-[160px] resize-none" />
                    </div>

                    <ActionButton onClick={handleSearch} isLoading={isLoading} className="w-full py-6 text-xl uppercase" icon={<MaterialSymbol icon="search" />}>Execute Synthesis</ActionButton>
                </div>

                <div className="lg:col-span-8 bg-slate-950 border border-white/5 rounded-[3.5rem] p-12 h-full min-h-[600px] shadow-inner overflow-y-auto custom-scrollbar relative">
                    {isLoading ? <LoadingState message="Neural Grounding" details="Cross-referencing search clusters with sovereign logic." /> : result ? (
                        <div className="space-y-12 animate-slide-in-bottom">
                            <div className="prose prose-invert prose-indigo max-w-none"><ReactMarkdown remarkPlugins={[remarkGfm]}>{result}</ReactMarkdown></div>
                            {sources.length > 0 && (
                                <div className="pt-10 border-t border-white/5 space-y-6">
                                    <h4 className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-500">Evidence Citations</h4>
                                    <div className="flex flex-wrap gap-4">
                                        {sources.map((s, i) => (
                                            <a key={i} href={s.uri} target="_blank" rel="noreferrer" className="flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-2.5 rounded-2xl text-[10px] font-bold text-slate-400 hover:text-white hover:border-indigo-500/50 transition-all"><MaterialSymbol icon="link" className="text-indigo-500" />{s.title}</a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : <EmptyState title="Buffer Standby" message="Awaiting intelligence request." icon={<MaterialSymbol icon="travel_explore" className="text-[120px] opacity-5" />} />}
                </div>
            </div>
        </div>
    );
};

export default Search;