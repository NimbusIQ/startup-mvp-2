
import React, { useState } from 'react';
import { PageTitle, ActionButton } from '../components/shared';
import { MaterialSymbol } from '../components/icons';
import { GoogleGenAI } from '@google/genai';
import ReactMarkdown from 'https://esm.sh/react-markdown@9';
import remarkGfm from 'https://esm.sh/remark-gfm@4';

const SeoAgent: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt) return;
    setGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Act as the Nimbus SEO Agent. Generate high-performance location-aware content and structured keywords for the following request: ${prompt}. 
        Focus on PropTech, Roofing, and construction terminology. Include keyword clusters and ad copy snippets. Respond in professional markdown.`,
      });
      setResult(response.text);
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full min-h-[600px] animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-12 flex flex-col space-y-8 shadow-2xl">
        <div className="flex items-center gap-3 text-indigo-400">
          <MaterialSymbol icon="search_insights" className="text-3xl" />
          <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Marketing Intelligence</h2>
        </div>
        
        <p className="text-slate-400 text-sm leading-relaxed">
           Domain-specific RAG system trained on construction and local-market telemetry. 
           Generate location-aware content and structured schema at scale.
        </p>

        <div className="flex-grow flex flex-col space-y-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Campaign Brief</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., 'Target hail damage keywords for Frisco homeowners...'"
            className="flex-grow bg-slate-950 border border-white/5 rounded-3xl p-8 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-mono resize-none"
          />
        </div>
        
        <ActionButton 
          onClick={handleGenerate}
          isLoading={generating}
          className="w-full py-6 text-xl"
          icon={<MaterialSymbol icon="bolt" />}
        >
          Generate Growth Strategy
        </ActionButton>
      </div>

      <div className="bg-[#020617] border border-slate-800 rounded-[3rem] p-12 overflow-y-auto custom-scrollbar shadow-inner relative">
         <div className="absolute top-8 right-12 opacity-50">
            <MaterialSymbol icon="auto_graph" className="text-slate-700 text-4xl" />
         </div>
         {result ? (
           <div className="prose prose-invert prose-indigo max-w-none animate-slide-in-bottom">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{result}</ReactMarkdown>
           </div>
         ) : (
           <div className="h-full flex flex-col items-center justify-center text-slate-700 space-y-6">
              <MaterialSymbol icon="file_present" className="text-8xl opacity-10" />
              <p className="text-xs font-black uppercase tracking-[0.4em]">Awaiting Input Vectors</p>
           </div>
         )}
      </div>
    </div>
  );
};

export default SeoAgent;
