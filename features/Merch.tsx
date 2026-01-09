import React from 'react';
import { PageTitle, ActionButton } from '../components/shared';
import { MaterialSymbol } from '../components/icons';

const Merch: React.FC = () => {
  const items = [
    { title: 'Neural Hoodie', price: '$85', desc: 'Wear the system.', img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800' },
    { title: 'Circuit Hat', price: '$40', desc: 'Wear the system.', img: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=800' },
    { title: 'Sovereign Sticker Pack', price: '$15', desc: 'Wear the system.', img: 'https://images.unsplash.com/photo-1572375927902-1c09e2d5c9d2?auto=format&fit=crop&q=80&w=800' },
    { title: 'Telemetry Desk Mat', price: '$55', desc: 'Wear the system.', img: 'https://images.unsplash.com/photo-1616627547584-bf28cee262db?auto=format&fit=crop&q=80&w=800' }
  ];

  return (
    <div className="flex flex-col space-y-16 py-10 animate-fade-in px-6 min-h-screen">
      <div className="text-center max-w-4xl mx-auto space-y-4">
        <PageTitle 
            title="Merch" 
            subtitle="Wear the system. High-performance artifacts for the agentic era." 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {items.map((item, i) => (
            <div key={i} className="bg-slate-900 border border-white/5 rounded-[3rem] overflow-hidden group hover:border-indigo-500/30 transition-all shadow-xl flex flex-col">
                <div className="h-80 overflow-hidden relative">
                    <img src={item.img} className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" alt={item.title} />
                    <div className="absolute top-6 right-6 px-4 py-2 bg-indigo-600 text-white text-xs font-black uppercase rounded-full shadow-lg">
                        {item.price}
                    </div>
                </div>
                <div className="p-8 space-y-4 flex-grow flex flex-col text-left">
                    <h3 className="text-xl font-black text-white tracking-tight uppercase">{item.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed flex-grow">{item.desc}</p>
                    <ActionButton className="w-full py-3 text-xs" variant="secondary" icon={<MaterialSymbol icon="shopping_cart" />}>
                        Add to Signal
                    </ActionButton>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default Merch;