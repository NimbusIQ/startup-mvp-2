
import React from 'react';
import { PageTitle } from '../components/shared';
import { MaterialSymbol } from '../components/icons';

const MarketIntel: React.FC = () => {
  return (
    <div className="space-y-12 animate-fade-in">
      <PageTitle title="Market Intelligence" subtitle="Competitive shingle specs, claim approval trends, and supplier logistics." />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Shingle Spec Matrix */}
        <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 shadow-xl overflow-hidden relative">
          <div className="flex items-center gap-3 mb-8 text-indigo-400">
            <MaterialSymbol icon="menu_book" className="text-2xl" />
            <h2 className="text-xl font-black uppercase tracking-tighter text-white">Shingle Spec Matrix</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-slate-500 font-black uppercase tracking-widest">
                  <th className="pb-4 pr-4">Attribute</th>
                  <th className="pb-4 pr-4 text-indigo-400">OC Duration Storm</th>
                  <th className="pb-4 text-emerald-400">GAF ArmorShield</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                <tr>
                  <td className="py-4 font-black text-slate-500 uppercase">Impact Rating</td>
                  <td className="py-4">UL 2218 Class 4</td>
                  <td className="py-4">UL 2218 Class 4</td>
                </tr>
                <tr>
                  <td className="py-4 font-black text-slate-500 uppercase">Wind Resistance</td>
                  <td className="py-4">130 MPH</td>
                  <td className="py-4">130 MPH</td>
                </tr>
                <tr>
                  <td className="py-4 font-black text-slate-500 uppercase">Patent Tech</td>
                  <td className="py-4">SureNail® Strip</td>
                  <td className="py-4">StainGuard Plus™</td>
                </tr>
                <tr>
                  <td className="py-4 font-black text-slate-500 uppercase">Weight / Sq</td>
                  <td className="py-4">~240 lbs</td>
                  <td className="py-4">~260 lbs</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-8 pt-8 border-t border-white/5 text-[9px] font-black uppercase text-slate-600 tracking-widest text-center">
             Verified Q3 2025 Industry Data
          </div>
        </div>

        {/* Claim Trends */}
        <div className="space-y-8">
          <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 shadow-xl">
            <div className="flex items-center gap-3 mb-8 text-emerald-400">
              <MaterialSymbol icon="bar_chart_4_bars" className="text-2xl" />
              <h2 className="text-xl font-black uppercase tracking-tighter text-white">Texas Claim Velocity</h2>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {[
                { label: 'Annual Claims', value: '680k', sub: 'Texas Region' },
                { label: 'Approval Rate', value: '62%', sub: 'Initial Filter' },
                { label: 'Denial Rate', value: '11%', sub: 'Pre-AAMA Analysis' },
                { label: 'Fraud Detection', value: '<1%', sub: 'Neural Audit' }
              ].map((stat, i) => (
                <div key={i} className="bg-slate-950 p-6 rounded-2xl border border-white/5">
                  <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-2">{stat.label}</p>
                  <p className="text-3xl font-black text-white font-mono leading-none">{stat.value}</p>
                  <p className="text-[8px] font-bold text-slate-600 uppercase mt-2">{stat.sub}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 shadow-xl">
             <div className="flex items-center gap-3 mb-6 text-amber-400">
                <MaterialSymbol icon="local_shipping" className="text-2xl" />
                <h2 className="text-xl font-black uppercase tracking-tighter text-white">Supply Chain Nodes</h2>
             </div>
             <div className="space-y-3">
                {['ABC Supply Co.', 'SRS Distribution', 'Beacon Building Products'].map((name, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-950 rounded-2xl border border-white/5 group hover:border-indigo-500/30 transition-all cursor-pointer">
                    <span className="text-sm font-black text-white uppercase tracking-tight">{name}</span>
                    <span className="text-[10px] font-mono text-indigo-500">Inventory_Sync: OK</span>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketIntel;
