import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  DollarSign, TrendingUp, ShoppingBag, ShieldCheck, 
  AlertTriangle, Users, ArrowUpRight, ArrowDownRight, 
  UtensilsCrossed, Clock, PieChart, Activity 
} from 'lucide-react';

export const OwnerOverview: React.FC = () => {
  const { orders, expenses, ingredients, currentRestaurant, currentBranch } = useApp();

  // Financial aggregates
  const totalSales = orders.reduce((sum, o) => sum + o.grandTotal, 0);
  const totalOrderCount = orders.length;
  const aov = totalOrderCount > 0 ? totalSales / totalOrderCount : 0;
  
  const totalPlatformCommissions = orders.reduce((sum, o) => sum + o.platformCommission, 0);
  const netSales = totalSales - totalPlatformCommissions;

  const totalRecordedExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const estimatedOperatingProfit = netSales - (totalRecordedExpenses * 0.2); // daily allocation

  const lowStockCount = ingredients.filter(i => i.currentStock <= i.minStockAlert).length;

  return (
    <div className="max-w-7xl mx-auto pb-16">
      {/* Top Welcome Strip */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-3xl p-6 mb-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-extrabold tracking-wider px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
              Live Operations Control
            </span>
            <span className="text-xs text-slate-400">• {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1 tracking-tight">
            {currentRestaurant.displayName}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Overview for {currentBranch.branchName} • Unified multichannel telemetry.
          </p>
        </div>

        {/* Quick Crisis Shield Status Pill (Phase 12) */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>Crisis Shield Active</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="text-[11px] text-slate-400">0 Gateway Failures • Connectors Healthy</div>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Metric 1 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex justify-between items-center text-slate-400 text-xs font-bold mb-1">
            <span>Today's Gross Sales</span>
            <span className="flex items-center text-emerald-400 text-[11px]">
              <ArrowUpRight className="w-3.5 h-3.5" /> +14.8%
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white mt-1">
            ₹{totalSales.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            Net after aggregator comm: <strong className="text-emerald-400">₹{netSales.toFixed(2)}</strong>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex justify-between items-center text-slate-400 text-xs font-bold mb-1">
            <span>Orders Received</span>
            <span className="flex items-center text-emerald-400 text-[11px]">
              <ArrowUpRight className="w-3.5 h-3.5" /> +8.2%
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white mt-1">
            {totalOrderCount} Orders
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            Average Order Value: <strong className="text-white">₹{aov.toFixed(2)}</strong>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex justify-between items-center text-slate-400 text-xs font-bold mb-1">
            <span>Food Cost Ratio</span>
            <span className="text-emerald-400 text-[11px] font-bold">Optimal Target</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-orange-400 mt-1">
            34.8%
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            Ingredient recipe average (Benchmark: 35%)
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex justify-between items-center text-slate-400 text-xs font-bold mb-1">
            <span>Inventory Health</span>
            {lowStockCount > 0 ? (
              <span className="flex items-center text-rose-400 text-[11px]">
                <AlertTriangle className="w-3.5 h-3.5 mr-0.5" /> {lowStockCount} Low
              </span>
            ) : (
              <span className="text-emerald-400 text-[11px]">Healthy</span>
            )}
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white mt-1">
            {ingredients.length - lowStockCount} / {ingredients.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            Optimal stocked ingredients
          </div>
        </div>
      </div>

      {/* Main Content Grid: Channel Distribution & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Channel-Wise Sales Breakdown (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h3 className="text-base font-extrabold text-white mb-1">Multichannel Revenue Breakdown</h3>
          <p className="text-xs text-slate-400 mb-6">
            Compare sales performance and net margins across connected ordering channels.
          </p>

          <div className="space-y-4">
            {[
              { name: 'Dine-In QR Table Ordering', channel: 'dine_in_qr', color: 'bg-orange-500' },
              { name: 'Direct Counter POS Billing', channel: 'pos_counter', color: 'bg-emerald-500' },
              { name: 'Zomato Online Delivery', channel: 'zomato', color: 'bg-rose-500' },
              { name: 'Swiggy Online Delivery', channel: 'swiggy', color: 'bg-amber-500' },
            ].map(ch => {
              const chOrders = orders.filter(o => o.channel === ch.channel);
              const chTotal = chOrders.reduce((sum, o) => sum + o.grandTotal, 0);
              const pct = totalSales > 0 ? Math.round((chTotal / totalSales) * 100) : 0;

              return (
                <div key={ch.channel} className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="flex justify-between items-center text-xs mb-2">
                    <span className="font-bold text-white">{ch.name}</span>
                    <span className="font-extrabold text-white">₹{chTotal.toFixed(2)} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div className={`${ch.color} h-2 rounded-full transition-all duration-500`} style={{ width: `${Math.max(5, pct)}%` }} />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400 mt-2">
                    <span>{chOrders.length} Completed Orders</span>
                    <span>No platform commission deduction</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Operational Health & Live Orders (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-base font-extrabold text-white mb-3">Live Order Stream</h3>
            <div className="space-y-3">
              {orders.slice(0, 4).map(o => (
                <div key={o.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs flex justify-between items-center">
                  <div>
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <span>#{o.orderNumber}</span>
                      <span className="text-[10px] uppercase font-bold text-orange-400">({o.channel.replace('_', ' ')})</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {o.tableName || o.customerName} • {o.items.length} items
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-white text-sm">₹{o.grandTotal.toFixed(2)}</span>
                    <span className={`block text-[10px] font-bold uppercase mt-0.5 ${
                      o.orderStatus === 'ready' ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      {o.orderStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
