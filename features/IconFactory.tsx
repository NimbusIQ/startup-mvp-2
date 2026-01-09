import React, { useState, useEffect, useRef } from 'react';
import { PageTitle, ActionButton, LoadingState, ErrorState } from '../components/shared';
import { MaterialSymbol } from '../components/icons';
import { GoogleGenAI } from '@google/genai';

type IconStyle = 'frosted-obsidian' | 'holographic-mesh' | '3d-glass' | 'minimal-vector' | 'tech-blueprint' | 'neon-circuit';

interface IconPreset {
  id: IconStyle;
  label: string;
  icon: string;
  description: string;
  promptPrefix: string;
}

const PRESETS: IconPreset[] = [
  { 
    id: 'frosted-obsidian', 
    label: 'Frosted Obsidian', 
    icon: 'dark_mode', 
    description: 'Dark, matte-textured depth with subtle rim lighting.',
    promptPrefix: 'A premium 3D icon made of frosted obsidian and polished dark glass, depicting ' 
  },
  { 
    id: 'holographic-mesh', 
    label: 'Holographic Mesh', 
    icon: 'grid_guides', 
    description: 'Iridescent wireframe lattices with light-refracting cores.',
    promptPrefix: 'A futuristic holographic wireframe mesh icon of ' 
  },
  { 
    id: '3d-glass', 
    label: 'Vertex Glass', 
    icon: 'layers', 
    description: 'Refractive translucent layers with caustic light effects.',
    promptPrefix: 'A high-fidelity 3D translucent glass icon with refractive caustics, of ' 
  },
  { 
    id: 'minimal-vector', 
    label: 'Sovereign Vector', 
    icon: 'change_history', 
    description: 'High-contrast, razor-sharp minimalist geometry.',
    promptPrefix: 'A professional minimalist flat-vector icon, razor-sharp lines, centered, of ' 
  },
  { 
    id: 'tech-blueprint', 
    label: 'Draft Blueprint', 
    icon: 'architecture', 
    description: 'Technical CAD-style lines on a blueprint slate.',
    promptPrefix: 'A detailed white-line technical CAD blueprint architectural icon of ' 
  },
  { 
    id: 'neon-circuit', 
    label: 'Neon Flux', 
    icon: 'bolt', 
    description: 'Electric cyan pulses through circuit-integrated paths.',
    promptPrefix: 'A glowing cyan neon circuit-integrated tech icon of ' 
  },
];

const IconFactory: React.FC = () => {
  const [apiKeySelected, setApiKeySelected] = useState(false);
  const [isCheckingKey, setIsCheckingKey] = useState(true);
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<IconStyle>('frosted-obsidian');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedIcon, setGeneratedIcon] = useState<string | null>(null);
  const [telemetry, setTelemetry] = useState<string[]>([]);
  
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkKey = async () => {
      const hasKey = await window.aistudio.hasSelectedApiKey();
      setApiKeySelected(hasKey);
      setIsCheckingKey(false);
    };
    checkKey();
  }, []);

  const addTelemetry = (msg: string) => {
    setTelemetry(prev => [...prev.slice(-4), `> ${msg}`]);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setError(null);
    setTelemetry([]);
    addTelemetry("INITIALIZING NEURAL FORGE...");

    try {
      addTelemetry(`SELECTING STYLE VECTOR: ${selectedStyle.toUpperCase()}`);
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
      const preset = PRESETS.find(p => p.id === selectedStyle);
      const fullPrompt = `${preset?.promptPrefix}${prompt}. The asset must be isolated on a solid #020617 dark slate background, centered, professional UI asset, cinematic product lighting, 4k, ultra-sharp detail, sovereign aesthetic.`;

      addTelemetry("SYNTHESIZING TEMPORAL MESH...");
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: { parts: [{ text: fullPrompt }] },
        config: {
          imageConfig: { aspectRatio: '1:1', imageSize: '1K' }
        }
      });

      addTelemetry("DECODING PIXEL TENSORS...");

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          setGeneratedIcon(`data:image/png;base64,${part.inlineData.data}`);
          addTelemetry("ASSET MANIFESTED SUCCESSFULLY.");
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Forge synthesis failed.';
      if (msg.includes("Requested entity was not found")) {
        setApiKeySelected(false);
        setError("API key reset. Please re-authorize the Forge Engine.");
      } else {
        setError(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingKey) return <LoadingState message="Connecting to Neural Forge..." />;

  if (!apiKeySelected) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center max-w-2xl mx-auto space-y-12 animate-fade-in relative z-20">
        <div className="p-16 bg-indigo-500/10 rounded-full border border-indigo-500/20 shadow-[0_0_100px_rgba(99,102,241,0.2)]">
          <MaterialSymbol icon="token" className="text-9xl text-indigo-400 animate-pulse" />
        </div>
        <div className="space-y-6">
          <h2 className="text-6xl font-black text-white tracking-tighter uppercase liquid-chrome leading-none">Authorize <br /> The Forge</h2>
          <p className="text-slate-500 text-xl font-medium leading-relaxed">High-fidelity UI asset synthesis requires a paid Google Cloud project via the Nano Banana Pro engine.</p>
        </div>
        <div className="flex flex-col gap-6 w-full max-w-sm">
            <ActionButton onClick={() => window.aistudio.openSelectKey()} variant="primary" className="py-8 text-xl" icon={<MaterialSymbol icon="vpn_key" />}>
              Connect Neural Pipeline
            </ActionButton>
            <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="text-[10px] font-black uppercase text-slate-600 hover:text-indigo-400 tracking-[0.4em] transition-all">Billing Portal Documentation</a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full animate-fade-in space-y-10 relative">
      <PageTitle 
        title="Sovereign Icon Factory" 
        subtitle="Generate premium UI assets and custom icons tailored for the high-tier Nimbus IQ ecosystem." 
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Input & Styles */}
        <div className="lg:col-span-5 space-y-8">
          <div className="glass-panel rounded-[3.5rem] p-10 space-y-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 blur-[80px]"></div>
            
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Asset Concept Descriptor</label>
              <textarea 
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder="e.g., 'A geometric raven head looking right', 'A circuit-infused shield', 'A futuristic house skeleton'..."
                className="w-full h-36 bg-slate-950/50 border border-white/10 rounded-3xl p-8 text-sm text-white outline-none focus:border-indigo-500/50 resize-none transition-all shadow-inner"
              />
            </div>

            <div className="space-y-6">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Sovereign Aesthetic Matrix</label>
              <div className="grid grid-cols-1 gap-4">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => setSelectedStyle(preset.id)}
                    className={`flex items-start gap-5 p-6 rounded-[2rem] border transition-all text-left group relative overflow-hidden ${
                      selectedStyle === preset.id 
                        ? 'bg-indigo-600/10 border-indigo-500/50 text-white' 
                        : 'bg-slate-950/30 border-white/5 text-slate-500 hover:border-white/10'
                    }`}
                  >
                    <div className={`p-3 rounded-2xl shrink-0 ${selectedStyle === preset.id ? 'bg-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]' : 'bg-slate-900 text-slate-600 group-hover:text-slate-400'}`}>
                      <MaterialSymbol icon={preset.icon} className="text-2xl" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-black uppercase tracking-widest">{preset.label}</p>
                      <p className="text-[10px] opacity-60 font-medium leading-relaxed">{preset.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <ActionButton 
              onClick={handleGenerate}
              isLoading={isLoading}
              disabled={!prompt.trim() || isLoading}
              className="w-full py-8 text-xl uppercase tracking-[0.4em] shadow-2xl shadow-indigo-600/20"
              icon={<MaterialSymbol icon="auto_fix_high" />}
            >
              Forge Asset
            </ActionButton>
          </div>

          {/* Telemetry Log */}
          <div className="bg-[#020617] border border-white/5 rounded-[2rem] p-6 h-32 flex flex-col font-mono text-[9px] text-slate-500 overflow-hidden">
             <div className="flex items-center gap-2 mb-3 opacity-50">
                <MaterialSymbol icon="terminal" className="text-xs" />
                <span className="uppercase tracking-widest font-black">Synthesis Telemetry</span>
             </div>
             <div ref={logContainerRef} className="space-y-1.5 overflow-y-auto custom-scrollbar">
                {telemetry.map((log, i) => (
                    <div key={i} className="animate-fade-in text-indigo-400/70">{log}</div>
                ))}
                {!isLoading && telemetry.length === 0 && <div className="opacity-20 italic">Awaiting Forge command...</div>}
                {isLoading && <div className="animate-pulse text-indigo-400">SYNCING_TENSORS...</div>}
             </div>
          </div>
        </div>

        {/* Forge Canvas */}
        <div className="lg:col-span-7 h-full flex flex-col">
          <div className="flex-grow glass-panel rounded-[4rem] p-12 flex flex-col shadow-[0_40px_100px_rgba(0,0,0,0.8)] relative overflow-hidden">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.02)_0%,transparent_80%)]"></div>
             
             <div className="flex-grow flex flex-col items-center justify-center bg-slate-950/80 rounded-[3.5rem] border border-white/5 shadow-inner relative group/preview">
                {isLoading ? (
                  <div className="space-y-10 flex flex-col items-center animate-pulse">
                      <div className="h-64 w-64 rounded-full border-4 border-dashed border-indigo-500/30 flex items-center justify-center relative">
                        <div className="absolute inset-0 border-4 border-indigo-500/10 rounded-full animate-ping"></div>
                        <MaterialSymbol icon="token" className="text-8xl text-indigo-500 opacity-20" />
                      </div>
                      <div className="text-center space-y-2">
                        <h3 className="text-xl font-black text-white uppercase tracking-widest">Neural Sculpting</h3>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">Executing Gradient Descent Cycles</p>
                      </div>
                  </div>
                ) : error ? (
                  <ErrorState error={error} />
                ) : generatedIcon ? (
                  <div className="w-full h-full flex flex-col items-center justify-center p-10 animate-pop-in space-y-12">
                    <div className="relative group/asset">
                        <div className="absolute -inset-1 bg-gradient-to-br from-indigo-500/50 to-transparent blur-xl opacity-40 group-hover/asset:opacity-100 transition-opacity"></div>
                        <img 
                          src={generatedIcon} 
                          className="w-72 h-72 md:w-96 md:h-96 rounded-[3.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.9)] border border-white/10 relative z-10 hover:scale-[1.02] transition-transform duration-700 cursor-zoom-in" 
                          alt="Generated Asset" 
                        />
                    </div>
                    
                    <div className="flex flex-wrap gap-6 justify-center z-20">
                        <ActionButton 
                          variant="secondary" 
                          className="px-10 h-16 font-black uppercase text-[10px] tracking-widest" 
                          icon={<MaterialSymbol icon="download" />}
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = generatedIcon;
                            link.download = `nimbus-asset-${Date.now()}.png`;
                            link.click();
                          }}
                        >
                          Export PNG
                        </ActionButton>
                        <ActionButton 
                          variant="secondary" 
                          className="px-10 h-16 font-black uppercase text-[10px] tracking-widest" 
                          icon={<MaterialSymbol icon="content_copy" />}
                          onClick={() => {
                             navigator.clipboard.writeText(generatedIcon);
                             addTelemetry("BASE64_BUFFER_COPIED");
                          }}
                        >
                          Copy Base64
                        </ActionButton>
                        <ActionButton 
                          variant="secondary" 
                          className="px-10 h-16 font-black uppercase text-[10px] tracking-widest" 
                          icon={<MaterialSymbol icon="refresh" />}
                          onClick={() => {
                             setGeneratedIcon(null);
                             setTelemetry([]);
                          }}
                        >
                          Reset Forge
                        </ActionButton>
                    </div>

                    <div className="pt-10 border-t border-white/5 w-full max-w-lg flex items-center justify-between opacity-30">
                        <div className="flex items-center gap-3">
                            <div className="h-1.5 w-1.5 rounded-full bg-indigo-500"></div>
                            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-indigo-300">Sovereign Origin Certified</span>
                        </div>
                        <span className="text-[8px] font-mono text-slate-500">MODEL: BANANA_PRO_V3</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-12 opacity-5 grayscale transition-all group-hover/preview:opacity-10 group-hover/preview:grayscale-0">
                    <MaterialSymbol icon="token" className="text-[220px]" />
                    <div className="space-y-2">
                        <h3 className="text-3xl font-black uppercase tracking-[0.4em]">Forge Buffer</h3>
                        <p className="text-xs font-black uppercase tracking-[0.2em]">Awaiting Ingress Vector</p>
                    </div>
                  </div>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IconFactory;