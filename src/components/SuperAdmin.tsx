import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SubscriptionPlan } from '../types';
import { 
  ShieldAlert, Building2, CreditCard, Activity, 
  Settings, CheckCircle, Edit3, DollarSign, Users, Database 
} from 'lucide-react';

export const SuperAdmin: React.FC = () => {
  const { tenants, plans, updatePlanPrice } = useApp();
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [newMonthly, setNewMonthly] = useState<number>(0);
  const [newAnnual, setNewAnnual] = useState<number>(0);

  const totalBranches = tenants.length * 2; // sample aggregate
  const totalPlatformMRR = tenants.length * 14999; // Pro plan benchmark

  const handleSavePrice = () => {
    if (editingPlan) {
      updatePlanPrice(editingPlan.id, Number(newMonthly), Number(newAnnual));
      setEditingPlan(null);
      alert(`Updated pricing for ${editingPlan.name} tier in live database matrix.`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-red-500" />
            <h1 className="text-2xl font-black text-white">CafeOS Platform Super Admin Console</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Global multi-tenant governance, subscription matrices, and system health oversight.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-red-950/40 border border-red-500/30 px-3.5 py-2 rounded-xl text-xs text-red-300">
          <ShieldAlert className="w-4 h-4 text-red-400" />
          <span>Strict Tenant Isolation & Audited Support Access</span>
        </div>
      </div>

      {/* Aggregate Platform Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <span className="text-xs font-bold text-slate-400 block">Total Active Tenants</span>
          <div className="text-2xl font-black text-white mt-1">{tenants.length} Groups</div>
          <span className="text-[11px] text-emerald-400 mt-1 block">100% Onboarding verified</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <span className="text-xs font-bold text-slate-400 block">Active Branches Powered</span>
          <div className="text-2xl font-black text-orange-400 mt-1">{totalBranches} Outlets</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Across Kerala & Bangalore</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <span className="text-xs font-bold text-slate-400 block">Platform MRR</span>
          <div className="text-2xl font-black text-emerald-400 mt-1">₹{totalPlatformMRR.toLocaleString('en-IN')}</div>
          <span className="text-[11px] text-slate-400 mt-1 block">SaaS Subscription Revenue</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <span className="text-xs font-bold text-slate-400 block">Platform Uptime</span>
          <div className="text-2xl font-black text-blue-400 mt-1">99.98%</div>
          <span className="text-[11px] text-emerald-400 mt-1 block">PostgreSQL / Supabase RLS healthy</span>
        </div>
      </div>

      {/* SECTION 1: Registered Tenants */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl mb-8">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-orange-500" />
          <span>Registered Restaurant Tenants</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Hospitality Tenant</th>
                <th className="py-3 px-4">Slug Identifier</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Country</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {tenants.map(t => (
                <tr key={t.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-extrabold text-white text-sm">{t.name}</td>
                  <td className="py-3 px-4 text-orange-400 font-mono">{t.slug}</td>
                  <td className="py-3 px-4 text-slate-300">{t.contactEmail}</td>
                  <td className="py-3 px-4 text-slate-300">{t.country}</td>
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      {t.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => alert(`Audited tenant management console opened for ${t.name}`)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700"
                    >
                      Manage Tenant
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 2: Configurable Subscription Matrix (Phase 14) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-orange-500" />
              <span>Configurable Subscription Tiers & Feature Matrix</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Administer pricing, one-time setup fees, and branch quotas live without deployment.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {plans.map(p => (
            <div key={p.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-extrabold text-white text-base">{p.name}</h3>
                  {p.id === 'pro' && (
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-orange-600 text-white">
                      Recommended
                    </span>
                  )}
                </div>

                <div className="my-3">
                  <div className="text-2xl font-black text-white">₹{p.monthlyPrice.toLocaleString('en-IN')}<span className="text-xs text-slate-400 font-normal">/mo</span></div>
                  <div className="text-xs text-slate-400 mt-0.5">₹{p.annualPrice.toLocaleString('en-IN')}/year • Setup: ₹{p.setupFee}</div>
                </div>

                <div className="text-xs text-slate-300 space-y-1.5 pt-3 border-t border-slate-800 mb-4">
                  <div className="flex justify-between">
                    <span>Max Branches:</span>
                    <strong className="text-white">{p.maxBranches}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>User Accounts:</span>
                    <strong className="text-white">{p.maxUsers}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>AI Quota:</span>
                    <strong className="text-orange-400">{p.aiQuotaMonthly} queries/mo</strong>
                  </div>
                </div>

                <div className="space-y-1 text-[11px] text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className={`w-3.5 h-3.5 ${p.features.kds ? 'text-emerald-400' : 'text-slate-600'}`} />
                    <span>Kitchen Display (KDS)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className={`w-3.5 h-3.5 ${p.features.deliveryHub ? 'text-emerald-400' : 'text-slate-600'}`} />
                    <span>Zomato & Swiggy Hub</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className={`w-3.5 h-3.5 ${p.features.aiAssistant ? 'text-emerald-400' : 'text-slate-600'}`} />
                    <span>AI Business Intelligence</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className={`w-3.5 h-3.5 ${p.features.recipeCosting ? 'text-emerald-400' : 'text-slate-600'}`} />
                    <span>Recipe Yield & Costing</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800">
                <button
                  onClick={() => {
                    setEditingPlan(p);
                    setNewMonthly(p.monthlyPrice);
                    setNewAnnual(p.annualPrice);
                  }}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Configure Pricing</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Pricing Modal */}
      {editingPlan && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-1">Edit {editingPlan.name} Plan Pricing</h3>
            <p className="text-xs text-slate-400 mb-4">Changes update the commercial database matrix immediately.</p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Monthly Price (₹)</label>
                <input
                  type="number"
                  value={newMonthly}
                  onChange={(e) => setNewMonthly(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Annual Price (₹)</label>
                <input
                  type="number"
                  value={newAnnual}
                  onChange={(e) => setNewAnnual(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded-xl focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-800 flex gap-2">
              <button
                onClick={handleSavePrice}
                className="flex-1 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Save Live Price
              </button>
              <button
                onClick={() => setEditingPlan(null)}
                className="py-2.5 px-4 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
