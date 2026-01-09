import React, { useState } from 'react';
import Header from './components/Header';
import LandingPage from './features/LandingPage';
import FeatureGrid from './components/FeatureGrid';
import Chatbot from './features/Chatbot';
import ImageStudio from './features/ImageStudio';
import VideoStudio from './features/VideoStudio';
import AudioStudio from './features/AudioStudio';
import Search from './features/Search';
import ArchitectureStudio from './features/ArchitectureStudio';
import KnowledgeBase from './features/KnowledgeBase';
import AgentMarketplace from './features/AgentMarketplace';
import ClaimCore from './features/ClaimCore';
import TheBrain from './features/TheBrain';
import InvestorCodex from './features/InvestorCodex';
import About from './features/About';
import Contact from './features/Contact';
import NancyeAssistant from './features/NancyeAssistant';
import IconFactory from './features/IconFactory';

const UniverseBackground = () => (
  <div className="universe-bg">
    <div className="nebula-glow"></div>
    <div className="stars-container"></div>
    <div className="stars-container" style={{ animationDelay: '-60s', opacity: 0.3 }}></div>
    <div className="breeze-wave"></div>
  </div>
);

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<string>('landing');

  const renderContent = () => {
    switch (activePage) {
      case 'landing': return <LandingPage onNavigate={setActivePage} />;
      case 'about': return <About />;
      case 'mission_control': return <FeatureGrid onSelectFeature={setActivePage} />;
      case 'the_brain': return <TheBrain onNavigate={setActivePage} />;
      case 'investor_codex': return <InvestorCodex />;
      case 'contact': return <Contact />;
      
      // Feature Components
      case 'chatbot': return <Chatbot />;
      case 'image_studio': return <ImageStudio />;
      case 'video_studio': return <VideoStudio />;
      case 'audio_studio': return <AudioStudio />;
      case 'search': return <Search />;
      case 'architecture_studio': return <ArchitectureStudio />;
      case 'knowledge_base': return <KnowledgeBase />;
      case 'agent_marketplace': return <AgentMarketplace onSelectFeature={setActivePage} />;
      case 'claim_core': return <ClaimCore />;
      case 'nancye_assistant': return <NancyeAssistant />;
      case 'icon_factory': return <IconFactory />;
      default: return <LandingPage onNavigate={setActivePage} />;
    }
  };

  const isUtilityPage = ['landing', 'about', 'investor_codex', 'the_brain', 'contact'].includes(activePage);

  return (
    <div className="min-h-screen relative text-slate-100 flex flex-col font-sans overflow-x-hidden selection:bg-indigo-500/30">
      <UniverseBackground />
      <Header 
        onLogoClick={() => setActivePage('landing')} 
        onNavigate={setActivePage}
        activePage={activePage}
        showBackArrow={activePage !== 'landing'} 
      />
      <main className={`flex-grow flex flex-col relative z-10 ${!isUtilityPage ? 'container mx-auto p-4 md:p-8' : ''}`}>
        <div className="animate-fade-in w-full h-full flex flex-col">
            {renderContent()}
        </div>
      </main>
      <footer className="py-20 border-t border-white/10 bg-slate-950/40 backdrop-blur-3xl relative overflow-hidden z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(79,70,229,0.05)_0%,transparent_70%)]"></div>
        <div className="container mx-auto px-8 flex flex-col md:flex-row justify-between items-start gap-16 relative z-10">
          <div className="max-w-md text-left">
            <div className="flex items-center mb-8">
              <img src="https://storage.googleapis.com/aistudio-ux-team-data/demos/nimbus-logo.png" alt="Nimbus Logo" className="h-10 w-10 mr-4 opacity-90 drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
              <span className="text-xl font-black uppercase tracking-[0.2em] text-white">Nimbus IQ <span className="text-indigo-500">Flux</span></span>
            </div>
            <p className="text-slate-500 text-xs font-medium leading-relaxed max-w-sm mb-8">
                Nimbus IQ is a Sovereign AI OS and PropTech infrastructure company. 
                Engineering cognitive systems for construction and enterprise operations.
                NAICS 541715 Compliant. US-Central1 Sovereign Cloud.
            </p>
            <div className="flex items-center gap-4 bg-white/5 px-4 py-3 rounded-2xl border border-white/10 w-fit grayscale hover:grayscale-0 transition-all duration-700">
                <img src="https://www.gstatic.com/images/branding/googlelogo/svg/googlelogo_clr_74x24dp.svg" className="h-4 invert" alt="Google" />
                <div className="h-4 w-px bg-white/20"></div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Startup Cloud Partner</span>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-16 text-[11px] font-bold uppercase tracking-widest text-slate-500">
            <div className="flex flex-col gap-4">
                <span className="text-white mb-2">Cognitive Ecosystem</span>
                <button onClick={() => setActivePage('the_brain')} className="text-left hover:text-indigo-400 transition-colors">The Brain</button>
                <button onClick={() => setActivePage('mission_control')} className="text-left hover:text-indigo-400 transition-colors">Mission Control</button>
                <button onClick={() => setActivePage('knowledge_base')} className="text-left hover:text-indigo-400 transition-colors">Documentation</button>
            </div>
            <div className="flex flex-col gap-4">
                <span className="text-white mb-2">Corporate</span>
                <button onClick={() => setActivePage('investor_codex')} className="text-left hover:text-indigo-400 transition-colors">Investor Codex</button>
                <button onClick={() => setActivePage('contact')} className="text-left hover:text-indigo-400 transition-colors">Contact</button>
            </div>
            <div className="flex flex-col gap-4 hidden lg:flex">
                <span className="text-white mb-2">Legal Ops</span>
                <a href="#" className="hover:text-indigo-400 transition-colors">Privacy Shield</a>
                <a href="#" className="hover:text-indigo-400 transition-colors">Terms of Logic</a>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-8 mt-20 pt-10 border-t border-white/5 text-center flex flex-col md:flex-row justify-between items-center gap-4">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-700">Nimbus IQ Neural Systems &copy; 2025 • Project 647601353731 • Sovereign Core IP</span>
            <div className="flex gap-4">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">GCP_US_CENTRAL1_ACTIVE</span>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default App;