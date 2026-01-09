
import React, { useState } from 'react';
import { PageTitle, ActionButton } from '../components/shared';
import { MaterialSymbol } from '../components/icons';

const mockAlerts = [
  { id: 1, type: 'tornado', severity: 'extreme', location: 'McKinney, TX', issued: '2025-09-11 05:30:00', description: 'Confirmed large and dangerous tornado on the ground.', safetyGuide: 'Take shelter in an interior room on the lowest floor.' },
  { id: 2, type: 'hurricane', severity: 'high', location: 'Plano, TX', issued: '2025-09-11 04:00:00', description: 'Hurricane force winds expected within 12 hours.', safetyGuide: 'Secure home, board windows, follow evacuation orders.' },
  { id: 3, type: 'hail', severity: 'moderate', location: 'Frisco, TX', issued: '2025-09-11 02:00:00', description: 'Quarter sized hail reported. Roof damage likely.', safetyGuide: 'Stay indoors away from skylights and windows.' },
  { id: 4, type: 'flood', severity: 'low', location: 'Dallas, TX', issued: '2025-09-10 23:00:00', description: 'Flash flood warning for low-lying areas.', safetyGuide: 'Turn around, don\'t drown. Move to higher ground.' },
];

const StormWatch: React.FC = () => {
  const [selectedAlert, setSelectedAlert] = useState<any>(null);

  const getIcon = (type: string) => {
    switch (type) {
      case 'hurricane': return 'cyclone';
      case 'tornado': return 'tornado';
      case 'hail': return 'cloud_hail';
      case 'flood': return 'flood';
      default: return 'warning';
    }
  };

  return (
    <div className="h-full flex flex-col space-y-10 animate-fade-in">
      <PageTitle title="Storm Sentinel" subtitle="Real-time NOAA telemetry and autonomous drone deployment alerts." />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-grow">
        {/* Alerts List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Active Vectors</h3>
              <div className="flex gap-2">
                <span className="flex items-center gap-1.5 text-[9px] font-black uppercase text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">Live Feed</span>
              </div>
            </div>
            
            <div className="grid gap-4">
              {mockAlerts.map(alert => (
                <div 
                  key={alert.id}
                  onClick={() => setSelectedAlert(alert)}
                  className={`p-6 bg-slate-950 border transition-all cursor-pointer rounded-2xl flex items-center justify-between group ${selectedAlert?.id === alert.id ? 'border-indigo-500 ring-2 ring-indigo-500/10' : 'border-white/5 hover:border-white/10'}`}
                >
                  <div className="flex items-center gap-6">
                    <div className={`p-4 rounded-xl ${alert.severity === 'extreme' ? 'bg-rose-500/20 text-rose-400 animate-pulse' : 'bg-slate-800 text-slate-500'}`}>
                      <MaterialSymbol icon={getIcon(alert.type)} className="text-2xl" />
                    </div>
                    <div>
                      <h4 className="text-white font-black uppercase tracking-tight">{alert.type} Warning</h4>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">{alert.location} • {alert.issued}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full ${alert.severity === 'extreme' ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                      {alert.severity}
                    </span>
                    <MaterialSymbol icon="chevron_right" className="text-slate-700 group-hover:text-indigo-400 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detail & Drone Control */}
        <div className="lg:col-span-4 h-full">
          <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 h-full flex flex-col shadow-2xl relative overflow-hidden">
            {selectedAlert ? (
              <div className="space-y-8 animate-slide-in-bottom">
                <div className="flex items-center gap-2 text-rose-400 font-black text-[10px] uppercase tracking-widest">
                  <MaterialSymbol icon="emergency" /> Emergency Protocol Active
                </div>
                <h2 className="text-3xl font-black text-white tracking-tighter leading-none">{selectedAlert.description}</h2>
                
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Safety Instructions</h3>
                  <div className="p-5 bg-slate-950 border border-white/5 rounded-2xl text-slate-300 text-sm leading-relaxed italic">
                    {selectedAlert.safetyGuide}
                  </div>
                </div>

                <div className="pt-8 border-t border-white/5 space-y-4">
                  <ActionButton className="w-full py-5 text-lg" icon={<MaterialSymbol icon="location_searching" />}>Deploy Drone Swarm</ActionButton>
                  <p className="text-[9px] text-center text-slate-500 uppercase tracking-widest">Autonomous Flight Authorization Required</p>
                </div>

                {/* Satellite Mini Map Placeholder */}
                <div className="flex-grow bg-slate-950 rounded-2xl border border-white/5 mt-4 relative overflow-hidden group">
                   <img src={`https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=800`} className="w-full h-full object-cover opacity-20 grayscale" />
                   <div className="absolute inset-0 flex items-center justify-center">
                      <MaterialSymbol icon="satellite" className="text-4xl text-slate-800 group-hover:text-indigo-500 transition-all" />
                   </div>
                   <div className="absolute bottom-4 left-4 text-[8px] font-mono text-indigo-500 uppercase">Sector_Analysis: {selectedAlert.location}</div>
                </div>
              </div>
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center text-slate-700 text-center space-y-6">
                <MaterialSymbol icon="globe" className="text-8xl opacity-10" />
                <p className="text-xs font-black uppercase tracking-[0.4em] max-w-[200px]">Select An Alert Vector For Analysis</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StormWatch;
