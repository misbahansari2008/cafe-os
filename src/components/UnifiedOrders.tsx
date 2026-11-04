import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Order, OrderStatus } from '../types';
import { 
  ClipboardList, Search, Filter, Clock, Check, X, 
  Eye, DollarSign, Store, Smartphone, AlertCircle 
} from 'lucide-react';

export const UnifiedOrders: React.FC = () => {
  const { orders, updateOrderStatus, currentBranch } = useApp();
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedChannel, setSelectedChannel] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalOrder, setActiveModalOrder] = useState<Order | null>(null);

  const statuses: { key: string; label: string }[] = [
    { key: 'all', label: 'All Orders' },
    { key: 'new', label: 'New' },
    { key: 'preparing', label: 'Preparing' },
    { key: 'ready', label: 'Ready' },
    { key: 'served', label: 'Served' },
    { key: 'completed', label: 'Completed' },
    { key: 'cancelled', label: 'Cancelled' },
  ];

  const channels: { key: string; label: string }[] = [
    { key: 'all', label: 'All Channels' },
    { key: 'dine_in_qr', label: 'QR Dine-In' },
    { key: 'pos_counter', label: 'Counter POS' },
    { key: 'zomato', label: 'Zomato' },
    { key: 'swiggy', label: 'Swiggy' },
  ];

  const filteredOrders = orders.filter(o => {
    const matchesStatus = selectedStatus === 'all' || o.orderStatus === selectedStatus;
    const matchesChannel = selectedChannel === 'all' || o.channel === selectedChannel;
    const matchesSearch = o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (o.customerName && o.customerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (o.tableName && o.tableName.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (o.externalOrderId && o.externalOrderId.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesChannel && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto pb-16">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <ClipboardList className="w-6 h-6 text-orange-500" />
              <h1 className="text-2xl font-black text-white">Unified Omnichannel Order Workspace</h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Realtime central queue aggregating Dine-In QR, Counter POS, Zomato, and Swiggy for {currentBranch.branchName}.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800 text-xs">
              <span className="text-slate-400 block">Total Orders</span>
              <strong className="text-white text-base">{orders.length}</strong>
            </div>
            <div className="bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800 text-xs">
              <span className="text-slate-400 block">Pending Action</span>
              <strong className="text-orange-400 text-base">
                {orders.filter(o => o.orderStatus === 'new' || o.orderStatus === 'preparing').length}
              </strong>
            </div>
          </div>
        </div>

        {/* Filter controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-5 border-t border-slate-800">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by order #, guest, or table..."
              className="w-full bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs pl-9 pr-3 py-2.5 rounded-xl focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Status selector */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl px-3 py-1">
            <span className="text-xs text-slate-400 mr-2">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-transparent text-xs text-white font-semibold focus:outline-none cursor-pointer"
            >
              {statuses.map(s => (
                <option key={s.key} value={s.key} className="bg-slate-900 text-white">
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* Channel selector */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl px-3 py-1">
            <span className="text-xs text-slate-400 mr-2">Channel:</span>
            <select
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(e.target.value)}
              className="w-full bg-transparent text-xs text-white font-semibold focus:outline-none cursor-pointer"
            >
              {channels.map(c => (
                <option key={c.key} value={c.key} className="bg-slate-900 text-white">
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Order ID & Source</th>
                <th className="py-3.5 px-4">Customer / Table</th>
                <th className="py-3.5 px-4">Items Summary</th>
                <th className="py-3.5 px-4">Financials</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4 text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-slate-800/40 transition-colors">
                    {/* Order ID & Source */}
                    <td className="py-3 px-4">
                      <div className="font-extrabold text-white text-sm">#{order.orderNumber}</div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          order.channel === 'zomato' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                          order.channel === 'swiggy' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                          order.channel === 'pos_counter' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                          'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        }`}>
                          {order.channel.replace(/_/g, ' ')}
                        </span>
                        {order.externalOrderId && (
                          <span className="text-[10px] text-slate-400">{order.externalOrderId}</span>
                        )}
                      </div>
                    </td>

                    {/* Customer & Table */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-200">{order.customerName || 'Guest'}</div>
                      <div className="text-xs text-orange-400 font-medium">
                        {order.tableName || 'Takeaway'}
                      </div>
                    </td>

                    {/* Items */}
                    <td className="py-3 px-4 max-w-xs">
                      <div className="text-slate-300 font-medium line-clamp-1">
                        {order.items.map(i => `${i.quantity}x ${i.itemName}`).join(', ')}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {order.items.length} items • {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>

                    {/* Financials (Gross vs Net) */}
                    <td className="py-3 px-4">
                      <div className="font-extrabold text-white text-sm">₹{order.grandTotal.toFixed(2)}</div>
                      {order.platformCommission > 0 && (
                        <div className="text-[10px] text-rose-400">
                          -₹{order.platformCommission.toFixed(2)} comm (Net: ₹{order.netReceivable.toFixed(2)})
                        </div>
                      )}
                    </td>

                    {/* Order Status */}
                    <td className="py-3 px-4">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                        className={`text-[11px] font-bold uppercase rounded-lg px-2.5 py-1 border focus:outline-none cursor-pointer ${
                          order.orderStatus === 'new' ? 'bg-blue-500/20 text-blue-300 border-blue-500/40' :
                          order.orderStatus === 'preparing' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                          order.orderStatus === 'ready' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' :
                          order.orderStatus === 'served' ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' :
                          order.orderStatus === 'completed' ? 'bg-slate-800 text-slate-300 border-slate-700' :
                          'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        }`}
                      >
                        <option value="new" className="bg-slate-900 text-white">NEW</option>
                        <option value="accepted" className="bg-slate-900 text-white">ACCEPTED</option>
                        <option value="preparing" className="bg-slate-900 text-white">PREPARING</option>
                        <option value="ready" className="bg-slate-900 text-white">READY</option>
                        <option value="served" className="bg-slate-900 text-white">SERVED</option>
                        <option value="completed" className="bg-slate-900 text-white">COMPLETED</option>
                        <option value="cancelled" className="bg-slate-900 text-white">CANCELLED</option>
                      </select>
                    </td>

                    {/* Payment status */}
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        order.paymentStatus === 'paid' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                        'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      }`}>
                        {order.paymentStatus} ({order.paymentMethod})
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setActiveModalOrder(order)}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-700 transition-colors"
                        title="View Full Order Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL MODAL */}
      {activeModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">Order Details #{activeModalOrder.orderNumber}</h3>
                <span className="text-xs text-slate-400">{activeModalOrder.tableName} • {activeModalOrder.channel}</span>
              </div>
              <button 
                onClick={() => setActiveModalOrder(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 mb-4">
              <div className="text-xs uppercase font-bold text-slate-400">Order Items</div>
              {activeModalOrder.items.map(item => (
                <div key={item.id} className="flex justify-between items-center text-xs bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <div>
                    <span className="font-bold text-white">{item.quantity}x {item.itemName}</span>
                    {item.selectedVariant && <span className="text-orange-400 ml-1.5">({item.selectedVariant})</span>}
                    {item.itemNotes && <div className="text-slate-400 italic">Note: {item.itemNotes}</div>}
                  </div>
                  <span className="font-bold text-slate-200">₹{item.itemTotal.toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 text-xs space-y-1.5">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span>₹{activeModalOrder.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>GST (5%)</span>
                <span>₹{activeModalOrder.taxAmount.toFixed(2)}</span>
              </div>
              {activeModalOrder.packagingCharge > 0 && (
                <div className="flex justify-between text-slate-400">
                  <span>Packaging Charge</span>
                  <span>₹{activeModalOrder.packagingCharge.toFixed(2)}</span>
                </div>
              )}
              {activeModalOrder.platformCommission > 0 && (
                <div className="flex justify-between text-rose-400">
                  <span>Platform Commission (Zomato/Swiggy)</span>
                  <span>-₹{activeModalOrder.platformCommission.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-slate-800">
                <span>Grand Total</span>
                <span className="text-orange-400">₹{activeModalOrder.grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-5 flex gap-2">
              <button
                onClick={() => {
                  updateOrderStatus(activeModalOrder.id, 'completed');
                  setActiveModalOrder(null);
                }}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Mark as Completed
              </button>
              <button
                onClick={() => {
                  updateOrderStatus(activeModalOrder.id, 'cancelled');
                  setActiveModalOrder(null);
                }}
                className="py-2.5 px-4 bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-800/40 rounded-xl text-xs font-bold transition-colors"
              >
                Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
