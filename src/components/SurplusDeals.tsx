import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SurplusOffer } from '../types';
import { 
  Sparkles, Tag, Clock, Plus, CheckCircle, 
  AlertCircle, ShieldCheck, TrendingUp, X 
} from 'lucide-react';

export const SurplusDeals: React.FC = () => {
  const { surplusOffers, createSurplusOffer, menuItems, currentBranch } = useApp();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Form states
  const [selectedItem, setSelectedItem] = useState<string>(menuItems[0]?.id || '');
  const [title, setTitle] = useState<string>('');
  const [qty, setQty] = useState<number>(5);
  const [origPrice, setOrigPrice] = useState<number>(menuItems[0]?.basePrice || 280);
  const [discountPrice, setDiscountPrice] = useState<number>(140);
  const [windowStart, setWindowStart] = useState<string>('21:00');
  const [windowEnd, setWindowEnd] = useState<string>('23:00');
  const [safetyConfirmed, setSafetyConfirmed] = useState<boolean>(false);

  // Calculate waste avoided & revenue recovered
  const totalRevenueRecovered = surplusOffers.reduce((sum, o) => sum + (o.quantityReserved * o.discountedPrice), 0);
  const totalPortionsSaved = surplusOffers.reduce((sum, o) => sum + o.quantityReserved, 0);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!safetyConfirmed) {
      alert('Safety verification required by chef/staff before publishing food deals.');
      return;
    }

    const menuItem = menuItems.find(m => m.id === selectedItem);

    createSurplusOffer({
      restaurantId: 'rest-1',
      branchId: currentBranch.id,
      menuItemId: selectedItem,
      title: title || `Fresh Evening Surplus Batch: ${menuItem?.name}`,
      quantityAvailable: Number(qty),
      quantityReserved: 0,
      originalPrice: Number(origPrice),
      discountedPrice: Number(discountPrice),
      pickupWindowStart: windowStart,
      pickupWindowEnd: windowEnd,
      status: 'active',
    });

    setIsModalOpen(false);
    setTitle('');
    setSafetyConfirmed(false);
  };

  return (
    <div className="max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Tag className="w-6 h-6 text-emerald-400" />
            <h1 className="text-2xl font-black text-white">Food-Waste Reduction & Surplus Deals Engine</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Turn safe culinary evening surplus into revenue while advancing sustainability and zero-food-waste goals.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Launch Surplus Deal</span>
        </button>
      </div>

      {/* Sustainability Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <span className="text-xs font-bold text-slate-400 block">Surplus Revenue Recovered</span>
          <div className="text-2xl font-black text-emerald-400 mt-1">₹{totalRevenueRecovered.toFixed(2)}</div>
          <span className="text-[11px] text-slate-400 mt-1 block">From evening discounted pickups</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <span className="text-xs font-bold text-slate-400 block">Safe Edible Portions Saved</span>
          <div className="text-2xl font-black text-white mt-1">{totalPortionsSaved} Portions</div>
          <span className="text-[11px] text-emerald-400 mt-1 block">Prevented from organic waste disposal</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <span className="text-xs font-bold text-slate-400 block">Average Discount Given</span>
          <div className="text-2xl font-black text-orange-400 mt-1">45% OFF</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Delighting neighborhood patrons</span>
        </div>
      </div>

      {/* Active Deals List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {surplusOffers.map(deal => {
          const remaining = deal.quantityAvailable - deal.quantityReserved;

          return (
            <div key={deal.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {Math.round(((deal.originalPrice - deal.discountedPrice) / deal.originalPrice) * 100)}% Discounted
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Pickup Window: {deal.pickupWindowStart} - {deal.pickupWindowEnd}</span>
                  </span>
                </div>

                <h3 className="font-extrabold text-white text-base mt-2">{deal.title}</h3>

                <div className="flex items-baseline gap-2.5 mt-3">
                  <span className="text-2xl font-black text-emerald-400">₹{deal.discountedPrice}</span>
                  <span className="text-sm line-through text-slate-500">₹{deal.originalPrice}</span>
                </div>

                <div className="mt-4 bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between text-xs">
                  <span className="text-slate-400">Inventory Status:</span>
                  <strong className="text-white">
                    {deal.quantityReserved} reserved / {deal.quantityAvailable} total ({remaining} available)
                  </strong>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
                <span>Branch: {currentBranch.branchName}</span>
                <span className={`font-bold ${deal.status === 'active' ? 'text-emerald-400' : 'text-slate-500'}`}>
                  ● {deal.status.toUpperCase()}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Surplus Offer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreate} className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-lg font-bold text-white">Create Safe Surplus Food Offer</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Select Menu Dish</label>
                <select
                  value={selectedItem}
                  onChange={(e) => {
                    setSelectedItem(e.target.value);
                    const found = menuItems.find(m => m.id === e.target.value);
                    if (found) {
                      setOrigPrice(found.basePrice);
                      setDiscountPrice(Math.round(found.basePrice * 0.55));
                    }
                  }}
                  className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded-xl focus:outline-none"
                >
                  {menuItems.map(m => (
                    <option key={m.id} value={m.id}>{m.name} (₹{m.basePrice})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Offer Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Evening Dum Pot Special - 50% OFF"
                  className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded-xl focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Portions</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Orig. Price (₹)</label>
                  <input
                    type="number"
                    value={origPrice}
                    readOnly
                    className="w-full bg-slate-950/60 border border-slate-800 text-slate-400 p-2.5 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Deal Price (₹)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={discountPrice}
                    onChange={(e) => setDiscountPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 text-emerald-400 font-bold p-2.5 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Pickup Starts</label>
                  <input
                    type="text"
                    value={windowStart}
                    onChange={(e) => setWindowStart(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Pickup Ends</label>
                  <input
                    type="text"
                    value={windowEnd}
                    onChange={(e) => setWindowEnd(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              {/* Mandatory Food Safety Check (Phase 11 rule: Never allow AI to declare food safe) */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-start gap-2">
                <input
                  type="checkbox"
                  id="safetyCheck"
                  checked={safetyConfirmed}
                  onChange={(e) => setSafetyConfirmed(e.target.checked)}
                  className="mt-1 rounded accent-emerald-500"
                />
                <label htmlFor="safetyCheck" className="text-[11px] text-slate-300 leading-snug cursor-pointer">
                  <strong>Human Chef Verification (Mandatory):</strong> I certify that this food item was prepared fresh today, maintained at food-safe temperatures, and is completely safe and fit for human consumption.
                </label>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-800">
              <button
                type="submit"
                disabled={!safetyConfirmed}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-colors ${
                  safetyConfirmed 
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white' 
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                Publish Surplus Offer
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
