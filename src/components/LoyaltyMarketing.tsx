import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CustomerProfile } from '../types';
import { 
  Users, Heart, Sparkles, Image as ImageIcon, 
  Send, ShieldCheck, Tag, Download, Check 
} from 'lucide-react';

export const LoyaltyMarketing: React.FC = () => {
  const { customers, currentRestaurant, menuItems } = useApp();
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerProfile>(customers[0]);
  const [generatedPoster, setGeneratedPoster] = useState<{
    headline: string;
    subheadline: string;
    offerBadge: string;
    usualDish: string;
    newLaunchDish: string;
    validity: string;
  } | null>(null);

  const generateAIPoster = () => {
    setGeneratedPoster({
      headline: `Welcome Back, ${selectedCustomer.fullName.split(' ')[0]}!`,
      subheadline: `Because you love our authentic Malabar delicacies at ${currentRestaurant.displayName}`,
      offerBadge: `FLAT 20% OFF ON NEW LAUNCH`,
      usualDish: `Your Favorite: Thalassery Dum Biryani`,
      newLaunchDish: `Pair it with our newly launched: Unnakaya & Pazham Nirachathu`,
      validity: `Valid till this Sunday for Dine-In & Takeaway`,
    });
  };

  return (
    <div className="max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-orange-500" />
            <h1 className="text-2xl font-black text-white">Customer Loyalty & AI Marketing Posters</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Consent-based patron recognition, points ledger, and automated branded promotional graphics.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800 text-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-300">Indian Data Protection Compliant (Explicit Opt-in)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Customer Profiles (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <h3 className="text-base font-extrabold text-white mb-3">Recognized Repeat Customers</h3>
            
            <div className="space-y-3">
              {customers.map(cust => (
                <div 
                  key={cust.id}
                  onClick={() => setSelectedCustomer(cust)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex justify-between items-center ${
                    selectedCustomer.id === cust.id
                      ? 'bg-orange-950/30 border-orange-500/60 ring-1 ring-orange-500/30'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-white text-sm">{cust.fullName}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        {cust.totalVisits} Visits
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {cust.phone} • Total Spend: ₹{cust.totalSpend.toFixed(2)}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Loyalty Points</span>
                    <strong className="text-orange-400 text-base">{cust.loyaltyPoints} pts</strong>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-slate-800">
              <button
                onClick={generateAIPoster}
                className="w-full py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-orange-600/20 transition-all active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate Branded AI Campaign Poster for {selectedCustomer.fullName.split(' ')[0]}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: AI Poster Output (6 cols) */}
        <div className="lg:col-span-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Branded Poster Generator (Phase 9 & 10)
                </span>
                <span className="text-[11px] text-emerald-400 font-semibold">Ready for WhatsApp / In-App</span>
              </div>

              {generatedPoster ? (
                <div className="bg-gradient-to-br from-orange-950 via-slate-900 to-amber-950 border-2 border-orange-500/40 rounded-3xl p-6 text-center shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl" />
                  
                  {/* Restaurant badge */}
                  <div className="inline-block px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30 text-[11px] font-black uppercase tracking-wider mb-4">
                    {currentRestaurant.displayName}
                  </div>

                  <h2 className="text-2xl font-black text-white tracking-tight leading-tight">
                    {generatedPoster.headline}
                  </h2>
                  <p className="text-xs text-orange-200 mt-1 max-w-sm mx-auto">
                    {generatedPoster.subheadline}
                  </p>

                  {/* Highlight Banner */}
                  <div className="my-6 py-3 px-4 bg-orange-600 text-white rounded-2xl shadow-lg shadow-orange-600/30">
                    <span className="text-base font-black tracking-wide block">{generatedPoster.offerBadge}</span>
                  </div>

                  {/* Personalized Dish pair */}
                  <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800 text-xs space-y-2 text-left mb-4">
                    <div className="flex items-center gap-2 text-slate-200">
                      <span className="w-2 h-2 rounded-full bg-orange-500" />
                      <span>{generatedPoster.usualDish}</span>
                    </div>
                    <div className="flex items-center gap-2 text-amber-300 font-semibold">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      <span>{generatedPoster.newLaunchDish}</span>
                    </div>
                  </div>

                  <span className="text-[10px] text-slate-400 block font-medium">
                    {generatedPoster.validity}
                  </span>
                </div>
              ) : (
                <div className="h-72 border-2 border-dashed border-slate-800 rounded-3xl flex flex-col items-center justify-center p-6 text-center text-slate-500">
                  <ImageIcon className="w-10 h-10 mb-2 opacity-50 text-orange-500" />
                  <p className="text-xs">Click "Generate Branded AI Campaign Poster" to craft personalized marketing creative.</p>
                </div>
              )}
            </div>

            {generatedPoster && (
              <div className="mt-5 pt-4 border-t border-slate-800 flex gap-2">
                <button
                  onClick={() => alert(`Campaign poster dispatched to ${selectedCustomer.fullName} via WhatsApp Business API`)}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send via WhatsApp API</span>
                </button>
                <button
                  onClick={() => alert('Downloaded campaign poster high-res PNG')}
                  className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold border border-slate-700"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
