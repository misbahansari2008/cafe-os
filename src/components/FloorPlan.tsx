import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DiningTable } from '../types';
import { 
  LayoutGrid, Users, QrCode, CheckCircle2, 
  Clock, Sparkles, AlertCircle, RefreshCw, X 
} from 'lucide-react';

export const FloorPlan: React.FC = () => {
  const { tables, orders, updateTableStatus, currentBranch } = useApp();
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [qrModalTable, setQrModalTable] = useState<DiningTable | null>(null);

  const sections = ['all', 'Garden Courtyard', 'Main Air-Conditioned Hall', 'Family Mezzanine'];

  const filteredTables = tables.filter(t => 
    selectedSection === 'all' || t.section === selectedSection
  );

  const statusColors = {
    available: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    occupied: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
    ordering: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    reserved: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    cleaning: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  };

  return (
    <div className="max-w-7xl mx-auto pb-16">
      {/* Floor Plan Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <LayoutGrid className="w-6 h-6 text-orange-500" />
            <h1 className="text-2xl font-black text-white">Visual Floor Plan & Table Management</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Realtime dining floor layout, seating allocation, and active table QR tokens for {currentBranch.branchName}.
          </p>
        </div>

        {/* Section Filters */}
        <div className="flex flex-wrap gap-2">
          {sections.map(sec => (
            <button
              key={sec}
              onClick={() => setSelectedSection(sec)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedSection === sec
                  ? 'bg-orange-600 text-white shadow-md shadow-orange-600/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              {sec === 'all' ? 'All Dining Sections' : sec}
            </button>
          ))}
        </div>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {filteredTables.map(table => {
          // Check if table has an active order
          const activeOrder = orders.find(o => o.tableId === table.id && o.orderStatus !== 'completed' && o.orderStatus !== 'cancelled');

          return (
            <div 
              key={table.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between hover:border-slate-700 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xl font-black text-white">{table.tableNumber}</span>
                  <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${statusColors[table.currentStatus]}`}>
                    {table.currentStatus}
                  </span>
                </div>

                <div className="text-xs text-slate-400 mb-2 flex items-center justify-between">
                  <span>{table.section}</span>
                  <span className="flex items-center gap-1 text-slate-300 font-semibold">
                    <Users className="w-3.5 h-3.5 text-orange-400" />
                    <span>{table.seatingCapacity} Seats</span>
                  </span>
                </div>

                {/* Active Order snippet if occupied */}
                {activeOrder ? (
                  <div className="mt-3 bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-white">Order #{activeOrder.orderNumber}</span>
                      <span className="font-extrabold text-orange-400">₹{activeOrder.grandTotal.toFixed(2)}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1 truncate">
                      {activeOrder.items.length} items • {activeOrder.orderStatus}
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 py-3 text-center text-xs text-slate-500 italic bg-slate-950/30 rounded-xl border border-slate-900">
                    No active bill on table
                  </div>
                )}
              </div>

              {/* Action Toolbar */}
              <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <select
                  value={table.currentStatus}
                  onChange={(e) => updateTableStatus(table.id, e.target.value as DiningTable['currentStatus'])}
                  className="bg-slate-950 text-white text-xs font-semibold rounded-lg px-2.5 py-1.5 border border-slate-800 focus:outline-none cursor-pointer flex-1"
                >
                  <option value="available">Mark Available</option>
                  <option value="occupied">Mark Occupied</option>
                  <option value="ordering">Mark Ordering</option>
                  <option value="reserved">Mark Reserved</option>
                  <option value="cleaning">Mark Cleaning</option>
                </select>

                <button
                  onClick={() => setQrModalTable(table)}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-700 transition-colors"
                  title="View Table QR Code"
                >
                  <QrCode className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* QR Code Presentation Modal */}
      {qrModalTable && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs uppercase font-extrabold text-orange-400 tracking-wider">Digital Menu Access</span>
              <button onClick={() => setQrModalTable(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-white p-6 rounded-2xl mx-auto w-48 h-48 flex items-center justify-center shadow-inner">
              {/* Simulated QR Code SVG */}
              <div className="grid grid-cols-6 gap-1 w-36 h-36">
                {Array.from({ length: 36 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`rounded-xs ${
                      (i % 2 === 0 || i % 7 === 0 || i < 6 || i > 30) ? 'bg-slate-950' : 'bg-orange-600'
                    }`} 
                  />
                ))}
              </div>
            </div>

            <h3 className="text-xl font-black text-white mt-4">{qrModalTable.tableNumber}</h3>
            <p className="text-xs text-slate-400 mt-1">{qrModalTable.section} • {currentBranch.branchName}</p>
            <div className="mt-3 text-[11px] font-mono bg-slate-950 p-2 rounded-lg text-slate-300 break-all border border-slate-800">
              token: {qrModalTable.qrCodeToken}
            </div>

            <div className="mt-6 flex gap-2">
              <button
                onClick={() => {
                  alert(`Printing tabletop tent card for ${qrModalTable.tableNumber}`);
                  setQrModalTable(null);
                }}
                className="w-full py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Print Table Tent Card
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
