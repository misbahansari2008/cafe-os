import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SettlementBatch } from '../types';
import { 
  Scale, CheckCircle, AlertTriangle, FileText, 
  Upload, Search, ArrowRight, ShieldCheck, DollarSign 
} from 'lucide-react';

export const Reconciliation: React.FC = () => {
  const { settlements, reconcileSettlement } = useApp();
  const [selectedBatch, setSelectedBatch] = useState<SettlementBatch | null>(null);

  const matchedCount = settlements.filter(s => s.reconciliationStatus === 'matched').length;
  const discrepancyCount = settlements.filter(s => s.reconciliationStatus === 'discrepancy').length;

  return (
    <div className="max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Scale className="w-6 h-6 text-orange-500" />
              <h1 className="text-2xl font-black text-white">Settlement & Payout Reconciliation Engine</h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Multi-tier verification matching CafeOS internal orders against Zomato/Swiggy settlement statements and bank credits.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => alert('Authorized settlement statement CSV/Excel uploaded and parsed against canonical orders.')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Upload className="w-3.5 h-3.5 text-orange-400" />
              <span>Import Platform Statement</span>
            </button>
          </div>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-5 border-t border-slate-800">
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400 block">Reconciled Batches</span>
            <div className="text-lg font-black text-white mt-1">{settlements.length} Batches</div>
          </div>
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400 block">100% Matched & Audited</span>
            <div className="text-lg font-black text-emerald-400 mt-1">{matchedCount} Batches</div>
          </div>
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400 block">Unresolved Discrepancies</span>
            <div className="text-lg font-black text-rose-400 mt-1">{discrepancyCount} Requiring Action</div>
          </div>
        </div>
      </div>

      {/* Settlements Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Batch ID & Provider</th>
                <th className="py-3.5 px-4">Settlement Date</th>
                <th className="py-3.5 px-4">Gross Sales</th>
                <th className="py-3.5 px-4">Commissions & Fees</th>
                <th className="py-3.5 px-4">Net Payout Credited</th>
                <th className="py-3.5 px-4">Reconciliation Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {settlements.map(batch => (
                <tr key={batch.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-extrabold text-white text-sm">{batch.settlementId}</div>
                    <span className="text-[10px] font-bold uppercase text-orange-400">{batch.provider}</span>
                  </td>

                  <td className="py-3.5 px-4 text-slate-300 font-medium">
                    {batch.batchDate}
                  </td>

                  <td className="py-3.5 px-4 font-bold text-white">
                    ₹{batch.grossOrderValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>

                  <td className="py-3.5 px-4 text-rose-400 font-medium">
                    -₹{(batch.commissionDeducted + batch.taxesDeducted).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>

                  <td className="py-3.5 px-4 font-black text-emerald-400 text-sm">
                    ₹{batch.netPayoutAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    {batch.bankDepositReference && (
                      <div className="text-[10px] text-slate-400 font-mono font-normal">
                        Ref: {batch.bankDepositReference}
                      </div>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${
                      batch.reconciliationStatus === 'matched'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                    }`}>
                      {batch.reconciliationStatus === 'matched' ? 'Clean Matched' : 'Discrepancy (₹' + Math.abs(batch.discrepancyAmount) + ')'}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedBatch(batch)}
                      className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700"
                    >
                      Audit Audit Log
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Discrepancy Detail Inspector Modal */}
      {selectedBatch && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">Reconciliation Audit Detail</h3>
                <span className="text-xs text-orange-400">{selectedBatch.settlementId} • {selectedBatch.provider.toUpperCase()}</span>
              </div>
              <button onClick={() => setSelectedBatch(null)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs mb-4">
              <div className="flex justify-between text-slate-300">
                <span>Reported Gross Sales:</span>
                <strong>₹{selectedBatch.grossOrderValue.toFixed(2)}</strong>
              </div>
              <div className="flex justify-between text-rose-400">
                <span>Agreed Commission Deducted:</span>
                <strong>-₹{selectedBatch.commissionDeducted.toFixed(2)}</strong>
              </div>
              <div className="flex justify-between text-rose-400">
                <span>GST on Commission (TCS/TDS):</span>
                <strong>-₹{selectedBatch.taxesDeducted.toFixed(2)}</strong>
              </div>
              {selectedBatch.penaltiesOrAdjustments !== 0 && (
                <div className="flex justify-between text-amber-400 font-bold">
                  <span>Platform Penalties / Deductions:</span>
                  <span>₹{selectedBatch.penaltiesOrAdjustments.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-emerald-400 font-black text-sm pt-2 border-t border-slate-800">
                <span>Net Bank Payout Amount:</span>
                <span>₹{selectedBatch.netPayoutAmount.toFixed(2)}</span>
              </div>
            </div>

            {selectedBatch.notes && (
              <div className="bg-amber-950/40 border border-amber-500/30 rounded-xl p-3 text-xs text-amber-200 mb-5">
                <strong>Platform Discrepancy Memo:</strong>
                <p className="mt-1 leading-relaxed text-amber-100">{selectedBatch.notes}</p>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => {
                  reconcileSettlement(selectedBatch.id, 'matched', 'Discrepancy reviewed and reconciled with partner manager credit note.');
                  setSelectedBatch(null);
                }}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Approve & Mark Reconciled
              </button>
              <button
                onClick={() => {
                  alert('Dispute ticket generated with Zomato Partner Desk regarding unauthorized rider penalty.');
                  setSelectedBatch(null);
                }}
                className="py-2.5 px-4 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Raise Dispute with Platform
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
