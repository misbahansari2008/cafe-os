import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DeliveryConnection } from '../types';
import { 
  Share2, CheckCircle2, AlertCircle, RefreshCw, 
  Power, TrendingUp, DollarSign, ExternalLink, ShieldCheck 
} from 'lucide-react';

export const DeliveryHub: React.FC = () => {
  const { connections, orders } = useApp();
  const [syncingProvider, setSyncingProvider] = useState<string | null>(null);

  // Compute platform-wise channel statistics
  const getPlatformStats = (provider: string) => {
    const channelOrders = orders.filter(o => o.channel === provider);
    const orderCount = channelOrders.length;
    const grossValue = channelOrders.reduce((sum, o) => sum + o.grandTotal, 0);
    const commissions = channelOrders.reduce((sum, o) => sum + o.platformCommission, 0);
    const netReceivable = grossValue - commissions;

    return { orderCount, grossValue, commissions, netReceivable };
  };

  const handleSync = (provider: string) => {
    setSyncingProvider(provider);
    setTimeout(() => {
      setSyncingProvider(null);
      alert(`Synchronized catalog and order webhook status with ${provider.toUpperCase()}`);
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Share2 className="w-6 h-6 text-orange-500" />
              <h1 className="text-2xl font-black text-white">Delivery Platform & Channel Hub</h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Authorized API connectors for Zomato, Swiggy, POS endpoints, and payment gateways.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-300">Authorized OAuth & Secret Key Isolation Active</span>
          </div>
        </div>

        {/* Financial principle reminder alert */}
        <div className="mt-5 p-3.5 bg-amber-950/40 border border-amber-500/20 rounded-xl flex items-start gap-2.5 text-xs text-amber-200">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong>Core Financial Accounting Rule:</strong> Gross Order Value ≠ Restaurant Recognized Revenue ≠ Cash Received ≠ Net Bank Settlement. All delivery aggregator fees, commission taxes (GST on commission), and rider deductions are tracked separately.
          </div>
        </div>
      </div>

      {/* Connectors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {connections.map(conn => {
          const stats = getPlatformStats(conn.provider);
          const isSyncing = syncingProvider === conn.provider;

          return (
            <div 
              key={conn.id} 
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${conn.status === 'connected' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                    <h3 className="font-extrabold text-white text-lg uppercase tracking-tight">{conn.provider}</h3>
                  </div>

                  <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                    conn.status === 'connected' 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                  }`}>
                    {conn.status}
                  </span>
                </div>

                <div className="text-xs text-slate-400 space-y-1 mb-4">
                  <div className="flex justify-between">
                    <span>Store Identifier:</span>
                    <strong className="text-slate-200">{conn.storeIdentifier}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Agreed Commission Rate:</span>
                    <strong className="text-orange-400">{conn.commissionRatePct}%</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Heartbeat:</span>
                    <span className="text-slate-300">
                      {conn.lastSyncAt ? new Date(conn.lastSyncAt).toLocaleTimeString() : 'Just now'}
                    </span>
                  </div>
                </div>

                {/* Metrics */}
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Today's Channel Orders:</span>
                    <strong className="text-white">{stats.orderCount}</strong>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Gross Order Value:</span>
                    <strong className="text-white">₹{stats.grossValue.toFixed(2)}</strong>
                  </div>
                  <div className="flex justify-between text-rose-400">
                    <span>Commissions Incurred:</span>
                    <strong>-₹{stats.commissions.toFixed(2)}</strong>
                  </div>
                  <div className="flex justify-between text-emerald-400 font-bold pt-1.5 border-t border-slate-800">
                    <span>Net Expected Settlement:</span>
                    <strong>₹{stats.netReceivable.toFixed(2)}</strong>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-4 border-t border-slate-800 flex items-center gap-2">
                <button
                  onClick={() => handleSync(conn.provider)}
                  disabled={isSyncing}
                  className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-slate-700"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-orange-400' : ''}`} />
                  <span>{isSyncing ? 'Syncing...' : 'Sync Catalog'}</span>
                </button>

                <button
                  onClick={() => alert(`Toggled ordering availability for ${conn.provider.toUpperCase()}`)}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700"
                  title="Pause or Resume Channel"
                >
                  <Power className="w-3.5 h-3.5 text-amber-400" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
