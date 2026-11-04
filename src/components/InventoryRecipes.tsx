import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Ingredient, Recipe } from '../types';
import { 
  Package, AlertTriangle, Plus, Scale, 
  Trash2, TrendingUp, RefreshCw, ChefHat, Check, X 
} from 'lucide-react';

export const InventoryRecipes: React.FC = () => {
  const { 
    ingredients, recipes, adjustIngredientStock, 
    recordWastage, currentRestaurant, currentBranch 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'stock' | 'recipes' | 'wastage'>('stock');
  const [wasteIngredient, setWasteIngredient] = useState<string>(ingredients[0]?.name || '');
  const [wasteQty, setWasteQty] = useState<number>(1);
  const [wasteCost, setWasteCost] = useState<number>(100);
  const [wasteReason, setWasteReason] = useState<string>('spoilage');
  const [isWastageModalOpen, setIsWastageModalOpen] = useState<boolean>(false);

  const lowStockItems = ingredients.filter(i => i.currentStock <= i.minStockAlert);

  const handleRecordWaste = (e: React.FormEvent) => {
    e.preventDefault();
    recordWastage(wasteIngredient, wasteQty, 'unit', wasteCost, wasteReason);
    setIsWastageModalOpen(false);
    alert(`Recorded wastage of ${wasteQty} for ${wasteIngredient}. Stock adjusted accordingly.`);
  };

  return (
    <div className="max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Package className="w-6 h-6 text-orange-500" />
              <h1 className="text-2xl font-black text-white">Inventory & Recipe Food Cost Management</h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Ingredient tracking, recipe yield costing, stock alerts, and wastage auditing for {currentRestaurant.displayName}.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setIsWastageModalOpen(true)}
              className="px-3.5 py-2 bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-800/40 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Log Wastage / Spoilage</span>
            </button>
          </div>
        </div>

        {/* Tab switchers */}
        <div className="flex gap-2 mt-6 pt-4 border-t border-slate-800">
          <button
            onClick={() => setActiveTab('stock')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'stock' ? 'bg-orange-600 text-white' : 'bg-slate-950 text-slate-400 hover:text-white'
            }`}
          >
            Ingredients & Stock Levels ({ingredients.length})
          </button>
          <button
            onClick={() => setActiveTab('recipes')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'recipes' ? 'bg-orange-600 text-white' : 'bg-slate-950 text-slate-400 hover:text-white'
            }`}
          >
            Recipe Yield & Food Cost % ({recipes.length})
          </button>
        </div>
      </div>

      {/* Low Stock Alerts */}
      {lowStockItems.length > 0 && activeTab === 'stock' && (
        <div className="bg-amber-950/30 border border-amber-500/30 rounded-2xl p-4 mb-6">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <AlertTriangle className="w-4 h-4" />
            <span>Low Inventory Restock Warnings ({lowStockItems.length} Ingredients)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {lowStockItems.map(item => (
              <div key={item.id} className="bg-slate-900/80 p-3 rounded-xl border border-amber-500/20 flex justify-between items-center text-xs">
                <div>
                  <div className="font-bold text-white">{item.name}</div>
                  <div className="text-rose-400 font-semibold mt-0.5">
                    Stock: {item.currentStock} {item.unit} (Alert threshold: {item.minStockAlert} {item.unit})
                  </div>
                </div>
                <button
                  onClick={() => adjustIngredientStock(item.id, 20, 'purchase_in', 'Restock PO')}
                  className="px-2.5 py-1 bg-amber-500 text-slate-950 rounded-lg font-black text-[11px]"
                >
                  + Restock
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW: STOCK LEVELS */}
      {activeTab === 'stock' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Ingredient</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Current Stock</th>
                  <th className="py-3.5 px-4">Cost / Unit</th>
                  <th className="py-3.5 px-4">Primary Supplier</th>
                  <th className="py-3.5 px-4">Stock Health</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {ingredients.map(ing => {
                  const isLow = ing.currentStock <= ing.minStockAlert;

                  return (
                    <tr key={ing.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-bold text-white text-sm">
                        {ing.name}
                      </td>

                      <td className="py-3 px-4 text-slate-300 font-medium">
                        {ing.category}
                      </td>

                      <td className="py-3 px-4 font-extrabold text-white">
                        {ing.currentStock.toFixed(1)} {ing.unit}
                      </td>

                      <td className="py-3 px-4 text-slate-300">
                        ₹{ing.costPerUnit.toFixed(2)} / {ing.unit}
                      </td>

                      <td className="py-3 px-4 text-slate-400">
                        {ing.supplierName || 'Verified Local Vendor'}
                      </td>

                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                          isLow 
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' 
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        }`}>
                          {isLow ? 'Low Stock' : 'Optimal'}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            const add = prompt(`Enter purchase quantity to add to ${ing.name} (${ing.unit}):`, '10');
                            if (add && !isNaN(Number(add))) {
                              adjustIngredientStock(ing.id, Number(add), 'purchase_in', 'Manual receipt');
                            }
                          }}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700"
                        >
                          + Purchase In
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW: RECIPES & FOOD COST % */}
      {activeTab === 'recipes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {recipes.map(recipe => (
            <div key={recipe.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                <div>
                  <h3 className="font-extrabold text-white text-base">{recipe.menuItemName}</h3>
                  <span className="text-xs text-slate-400">Yield: {recipe.servingYield} Portion • Prep Loss: {recipe.prepLossPercentage}%</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Ingredient Cost</span>
                  <strong className="text-emerald-400 text-base">₹{recipe.estimatedCostPerServing.toFixed(2)}</strong>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 block">Ingredient Breakdown</span>
                {recipe.ingredients.map((ing, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs">
                    <div>
                      <span className="font-bold text-white">{ing.ingredientName}</span>
                      <span className="text-slate-400 ml-1.5">({ing.quantityRequired} {ing.unit})</span>
                    </div>
                    <span className="font-semibold text-slate-300">₹{ing.costContribution.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                <span className="text-slate-400">Target Food Cost %:</span>
                <span className="font-black text-white">~35.0% (Healthy Margin)</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Wastage Record Modal */}
      {isWastageModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleRecordWaste} className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-lg font-bold text-white">Record Kitchen Wastage / Spoilage</h3>
              <button type="button" onClick={() => setIsWastageModalOpen(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Ingredient</label>
                <select
                  value={wasteIngredient}
                  onChange={(e) => setWasteIngredient(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded-xl focus:outline-none"
                >
                  {ingredients.map(i => (
                    <option key={i.id} value={i.name}>{i.name} ({i.unit})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Quantity Wasted</label>
                  <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    required
                    value={wasteQty}
                    onChange={(e) => setWasteQty(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Estimated Cost Loss (₹)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={wasteCost}
                    onChange={(e) => setWasteCost(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Wastage Reason</label>
                <select
                  value={wasteReason}
                  onChange={(e) => setWasteReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded-xl focus:outline-none"
                >
                  <option value="spoilage">Natural Spoilage</option>
                  <option value="expired">Date Expired</option>
                  <option value="burnt_dish">Burnt / Preparation Error</option>
                  <option value="customer_return">Customer Return</option>
                  <option value="prep_trimming">Excess Trimming Loss</option>
                </select>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-800 flex gap-2">
              <button
                type="submit"
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Save Wastage Entry & Audit Deduct
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
