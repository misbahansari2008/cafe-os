import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MenuItem } from '../types';
import { 
  Menu as MenuIcon, Plus, Edit2, Check, X, 
  Search, Eye, EyeOff, Sparkles, AlertCircle 
} from 'lucide-react';

export const MenuManagement: React.FC = () => {
  const { menuItems, categories, toggleItemAvailability, addMenuItem, updateMenuItem } = useApp();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // New Item Form State
  const [newItemName, setNewItemName] = useState<string>('');
  const [newItemMalayalam, setNewItemMalayalam] = useState<string>('');
  const [newItemPrice, setNewItemPrice] = useState<number>(150);
  const [newItemCategory, setNewItemCategory] = useState<string>(categories[0]?.id || '');
  const [newItemDietary, setNewItemDietary] = useState<'veg' | 'non_veg' | 'egg' | 'vegan'>('non_veg');
  const [newItemStation, setNewItemStation] = useState<MenuItem['station']>('hot_kitchen');
  const [newItemPrepTime, setNewItemPrepTime] = useState<number>(12);
  const [newItemDesc, setNewItemDesc] = useState<string>('');

  const filteredItems = menuItems.filter(item => {
    const matchesCat = selectedCat === 'all' || item.categoryId === selectedCat;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.nameMalayalam && item.nameMalayalam.includes(searchQuery));
    return matchesCat && matchesSearch;
  });

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName) return;

    addMenuItem({
      restaurantId: 'rest-1',
      categoryId: newItemCategory,
      name: newItemName,
      nameMalayalam: newItemMalayalam || undefined,
      description: newItemDesc || 'Freshly prepared specialty dish.',
      basePrice: Number(newItemPrice),
      dietaryType: newItemDietary,
      prepTimeMinutes: Number(newItemPrepTime),
      isAvailable: true,
      isPopular: false,
      isChefSpecial: false,
      gstRate: 5.0,
      station: newItemStation,
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80',
    });

    setIsAddModalOpen(false);
    // Reset form
    setNewItemName('');
    setNewItemMalayalam('');
    setNewItemPrice(150);
    setNewItemDesc('');
  };

  return (
    <div className="max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <MenuIcon className="w-6 h-6 text-orange-500" />
            <h1 className="text-2xl font-black text-white">Menu Catalog & Availability Control</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Realtime pricing, Malayalam/Hindi localization, and instant 86-list sold-out synchronization.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-orange-600/20 transition-all active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Dish</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search menu catalog..."
            className="w-full bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-orange-500"
          />
        </div>

        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl px-3 py-1 sm:w-64">
          <span className="text-xs text-slate-400 mr-2">Category:</span>
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="w-full bg-transparent text-xs text-white font-semibold focus:outline-none cursor-pointer"
          >
            <option value="all" className="bg-slate-900">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.id} className="bg-slate-900">{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Dishes Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Dish Details</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Station</th>
                <th className="py-3.5 px-4">Base Price</th>
                <th className="py-3.5 px-4">Tax (GST)</th>
                <th className="py-3.5 px-4">Availability</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredItems.map(item => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={item.imageUrl} 
                        alt={item.name} 
                        className="w-10 h-10 rounded-lg object-cover bg-slate-950" 
                      />
                      <div>
                        <div className="font-bold text-white text-sm">{item.name}</div>
                        {item.nameMalayalam && (
                          <div className="text-xs text-orange-400">{item.nameMalayalam}</div>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-slate-300 font-medium">
                    {categories.find(c => c.id === item.categoryId)?.name || 'General'}
                  </td>

                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-slate-800 text-slate-300 border border-slate-700">
                      {item.station.replace('_', ' ')}
                    </span>
                  </td>

                  <td className="py-3 px-4 font-black text-white text-sm">
                    ₹{item.basePrice.toFixed(2)}
                  </td>

                  <td className="py-3 px-4 text-slate-400 font-medium">
                    {item.gstRate}% GST
                  </td>

                  <td className="py-3 px-4">
                    <button
                      onClick={() => toggleItemAvailability(item.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-colors ${
                        item.isAvailable
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      }`}
                    >
                      {item.isAvailable ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      <span>{item.isAvailable ? 'In Stock (Active)' : 'Sold Out (86)'}</span>
                    </button>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => {
                        const newPrice = prompt(`Enter new base price for ${item.name}:`, item.basePrice.toString());
                        if (newPrice && !isNaN(Number(newPrice))) {
                          updateMenuItem({ ...item, basePrice: Number(newPrice) });
                        }
                      }}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold border border-slate-700"
                    >
                      Edit Price
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Dish Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateItem} className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-lg font-bold text-white">Add New Dish to Catalog</h3>
              <button 
                type="button" 
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Dish Name (English)</label>
                <input
                  type="text"
                  required
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="e.g. Kozhikodan Halwa Platter"
                  className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded-xl focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Dish Name in Malayalam (Optional)</label>
                <input
                  type="text"
                  value={newItemMalayalam}
                  onChange={(e) => setNewItemMalayalam(e.target.value)}
                  placeholder="e.g. കോഴിക്കോടൻ ഹൽവ"
                  className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded-xl focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Category</label>
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded-xl focus:outline-none focus:border-orange-500"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Base Price (₹)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded-xl focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Dietary Type</label>
                  <select
                    value={newItemDietary}
                    onChange={(e) => setNewItemDietary(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded-xl focus:outline-none focus:border-orange-500"
                  >
                    <option value="veg">Vegetarian</option>
                    <option value="non_veg">Non-Vegetarian</option>
                    <option value="egg">Contains Egg</option>
                    <option value="vegan">Pure Vegan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Kitchen Station</label>
                  <select
                    value={newItemStation}
                    onChange={(e) => setNewItemStation(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded-xl focus:outline-none focus:border-orange-500"
                  >
                    <option value="hot_kitchen">Hot Kitchen</option>
                    <option value="drinks">Drinks & Sulaimani</option>
                    <option value="bakery">Bakery & Snacks</option>
                    <option value="cold_kitchen">Cold Kitchen</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Description</label>
                <textarea
                  rows={2}
                  value={newItemDesc}
                  onChange={(e) => setNewItemDesc(e.target.value)}
                  placeholder="Describe taste, ingredients, and spices..."
                  className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded-xl focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div className="mt-5 flex gap-2 pt-3 border-t border-slate-800">
              <button
                type="submit"
                className="w-full py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Save & Publish to Menu
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
