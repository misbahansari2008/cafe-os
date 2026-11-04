import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { OrderStatus } from '../types';
import { 
  ChefHat, Clock, AlertTriangle, CheckCircle, Flame, 
  Coffee, Utensils, BellRing, Filter, Volume2, VolumeX 
} from 'lucide-react';

export const KitchenDisplay: React.FC = () => {
  const { orders, updateOrderStatus, updateOrderItemKds, currentBranch } = useApp();
  const [stationFilter, setStationFilter] = useState<string>('all');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Active kitchen orders (excluding completed and cancelled)
  const activeOrders = orders.filter(o => 
    o.orderStatus !== 'completed' && o.orderStatus !== 'cancelled' && o.orderStatus !== 'rejected'
  );

  const stations = [
    { id: 'all', label: 'All Stations', icon: <ChefHat className="w-4 h-4" /> },
    { id: 'hot_kitchen', label: 'Hot Kitchen & Biryani', icon: <Flame className="w-4 h-4" /> },
    { id: 'drinks', label: 'Drinks & Sulaimani', icon: <Coffee className="w-4 h-4" /> },
    { id: 'bakery', label: 'Bakery & Snacks', icon: <Utensils className="w-4 h-4" /> },
    { id: 'cold_kitchen', label: 'Cold Kitchen & Desserts', icon: <Utensils className="w-4 h-4" /> },
  ];

  // Helper to calculate minutes elapsed
  const getElapsedMinutes = (createdAt: string) => {
    const diff = Date.now() - new Date(createdAt).getTime();
    return Math.floor(diff / (1000 * 60));
  };

  return (
    <div className="max-w-7xl mx-auto pb-16">
      {/* KDS Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 mb-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
            <ChefHat className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">Kitchen Display System (KDS)</h1>
              <span className="animate-pulse flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </div>
            <p className="text-xs text-slate-400">
              Live Preparation Queues • {currentBranch.branchName} • {activeOrders.length} Active Tickets
            </p>
          </div>
        </div>

        {/* Station Filters & Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {stations.map(st => (
            <button
              key={st.id}
              onClick={() => setStationFilter(st.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                stationFilter === st.id
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              {st.icon}
              <span>{st.label}</span>
            </button>
          ))}

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl text-xs font-bold border transition-colors ${
              soundEnabled ? 'bg-slate-800 text-amber-400 border-slate-700' : 'bg-slate-800/50 text-slate-500 border-slate-800'
            }`}
            title="Toggle Kitchen Sound Chimes"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Orders Grid */}
      {activeOrders.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center">
          <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">All Kitchen Queues Clear!</h3>
          <p className="text-xs text-slate-400 mt-1">New incoming orders from Dine-In, Zomato, Swiggy, and POS will appear here instantly.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {activeOrders.map(order => {
            const elapsed = getElapsedMinutes(order.createdAt);
            const isDelayed = elapsed >= 15;
            const itemsForStation = order.items.filter(i => stationFilter === 'all' || i.kdsStation === stationFilter);

            if (itemsForStation.length === 0) return null;

            return (
              <div 
                key={order.id}
                className={`bg-slate-900 rounded-2xl border transition-all flex flex-col justify-between overflow-hidden shadow-lg ${
                  isDelayed ? 'border-rose-500/60 ring-2 ring-rose-500/20' : 'border-slate-800'
                }`}
              >
                {/* Ticket Top Banner */}
                <div className={`p-4 border-b ${
                  order.channel === 'zomato' 
                    ? 'bg-rose-950/40 border-rose-900/50' 
                    : order.channel === 'swiggy' 
                      ? 'bg-orange-950/40 border-orange-900/50' 
                      : 'bg-slate-800/60 border-slate-700/60'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-black text-white">#{order.orderNumber}</span>
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        order.channel === 'zomato' ? 'bg-rose-600 text-white' :
                        order.channel === 'swiggy' ? 'bg-orange-600 text-white' :
                        'bg-blue-600 text-white'
                      }`}>
                        {order.channel.replace('_', ' ')}
                      </span>
                    </div>

                    {/* Timer indicator */}
                    <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${
                      isDelayed 
                        ? 'bg-rose-500 text-white animate-pulse' 
                        : elapsed >= 10 
                          ? 'bg-amber-500/20 text-amber-300' 
                          : 'bg-slate-800 text-slate-300'
                    }`}>
                      <Clock className="w-3.5 h-3.5" />
                      <span>{elapsed}m elapsed</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-300 mt-2">
                    <span className="font-semibold text-orange-400">
                      {order.tableName || (order.channel.includes('takeaway') ? 'Direct Takeaway' : 'Delivery Rider')}
                    </span>
                    <span className="text-slate-400 truncate max-w-[140px]">{order.customerName}</span>
                  </div>

                  {order.specialInstructions && (
                    <div className="mt-2 text-xs bg-amber-950/60 border border-amber-500/30 text-amber-200 p-2 rounded-lg flex items-start gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span><strong>Kitchen Note:</strong> {order.specialInstructions}</span>
                    </div>
                  )}
                </div>

                {/* Ticket Items List */}
                <div className="p-4 space-y-3 flex-1">
                  {itemsForStation.map(item => (
                    <div 
                      key={item.id} 
                      className={`p-2.5 rounded-xl border flex items-center justify-between transition-colors ${
                        item.kdsStatus === 'ready' 
                          ? 'bg-emerald-950/30 border-emerald-500/30' 
                          : item.kdsStatus === 'preparing'
                            ? 'bg-amber-950/30 border-amber-500/30'
                            : 'bg-slate-950/60 border-slate-800'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-slate-800 text-xs font-black text-amber-400 flex items-center justify-center">
                            {item.quantity}x
                          </span>
                          <span className={`text-sm font-bold ${item.kdsStatus === 'ready' ? 'line-through text-slate-400' : 'text-white'}`}>
                            {item.itemName}
                          </span>
                        </div>
                        {item.selectedVariant && (
                          <div className="text-xs text-orange-400 ml-8 font-medium">{item.selectedVariant}</div>
                        )}
                        {item.itemNotes && (
                          <div className="text-xs text-amber-300 ml-8 italic">Note: {item.itemNotes}</div>
                        )}
                      </div>

                      {/* Item state toggle */}
                      <button
                        onClick={() => {
                          const next = item.kdsStatus === 'pending' ? 'preparing' : item.kdsStatus === 'preparing' ? 'ready' : 'served';
                          updateOrderItemKds(order.id, item.id, next);
                        }}
                        className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg border transition-all ${
                          item.kdsStatus === 'ready'
                            ? 'bg-emerald-600 text-white border-emerald-500'
                            : item.kdsStatus === 'preparing'
                              ? 'bg-amber-500 text-slate-950 border-amber-400'
                              : 'bg-slate-800 text-slate-300 hover:text-white border-slate-700'
                        }`}
                      >
                        {item.kdsStatus}
                      </button>
                    </div>
                  ))}
                </div>

                {/* Ticket Bottom Actions */}
                <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center gap-2">
                  <button
                    onClick={() => updateOrderStatus(order.id, 'preparing')}
                    className="flex-1 py-2 bg-amber-600/20 hover:bg-amber-600 text-amber-300 hover:text-white rounded-xl text-xs font-bold border border-amber-500/30 transition-colors"
                  >
                    Start Prep
                  </button>
                  <button
                    onClick={() => updateOrderStatus(order.id, 'ready')}
                    className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors shadow-md shadow-emerald-600/20"
                  >
                    Mark Ready
                  </button>
                  <button
                    onClick={() => updateOrderStatus(order.id, 'served')}
                    className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-colors"
                    title="Dispatch or mark served"
                  >
                    Served
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
