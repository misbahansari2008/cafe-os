import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MenuItem, OrderItem, Order } from '../types';
import { 
  ShoppingBag, Search, Sparkles, Clock, Check, 
  Leaf, AlertCircle, ArrowRight, QrCode, Heart, Plus, Minus, X, Tag
} from 'lucide-react';

export const CustomerMenu: React.FC = () => {
  const { 
    menuItems, categories, tables, placeOrder, 
    surplusOffers, claimSurplusOffer, currentRestaurant 
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTable, setSelectedTable] = useState<string>('tbl-1');
  const [cart, setCart] = useState<{ item: MenuItem; quantity: number; variant?: string }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [specialNote, setSpecialNote] = useState<string>('');
  const [paymentChoice, setPaymentChoice] = useState<'cash' | 'upi'>('upi');
  const [activeTab, setActiveTab] = useState<'menu' | 'surplus' | 'tracking'>('menu');
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);

  // Filtered menu
  const filteredItems = menuItems.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.categoryId === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (item.nameMalayalam && item.nameMalayalam.includes(searchQuery)) ||
                          (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const addToCart = (item: MenuItem, variantName?: string) => {
    setCart(prev => {
      const existing = prev.find(i => i.item.id === item.id && i.variant === variantName);
      if (existing) {
        return prev.map(i => i.item.id === item.id && i.variant === variantName ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { item, quantity: 1, variant: variantName }];
    });
  };

  const updateQuantity = (itemId: string, delta: number, variant?: string) => {
    setCart(prev => prev.map(i => {
      if (i.item.id === itemId && i.variant === variant) {
        return { ...i, quantity: Math.max(0, i.quantity + delta) };
      }
      return i;
    }).filter(i => i.quantity > 0));
  };

  // Cart financial calculations (Server-side model)
  const cartSubtotal = cart.reduce((sum, item) => {
    const price = item.item.variants && item.variant 
      ? item.item.variants.find(v => v.name === item.variant)?.price || item.item.basePrice
      : item.item.basePrice;
    return sum + (price * item.quantity);
  }, 0);

  const cartGst = +(cartSubtotal * 0.05).toFixed(2); // 5% GST
  const cartTotal = +(cartSubtotal + cartGst).toFixed(2);
  const totalItemCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const chosenTable = tables.find(t => t.id === selectedTable);

    const orderItems: OrderItem[] = cart.map(c => {
      const price = c.item.variants && c.variant 
        ? c.item.variants.find(v => v.name === c.variant)?.price || c.item.basePrice
        : c.item.basePrice;

      return {
        id: `oi-${Date.now()}-${Math.random()}`,
        orderId: '',
        menuItemId: c.item.id,
        itemName: c.item.name,
        quantity: c.quantity,
        unitPrice: price,
        selectedVariant: c.variant,
        itemTotal: price * c.quantity,
        gstRate: 5.0,
        kdsStation: c.item.station,
        kdsStatus: 'pending'
      };
    });

    const placed = placeOrder({
      channel: 'dine_in_qr',
      tableId: selectedTable,
      tableName: chosenTable ? `${chosenTable.tableNumber} (${chosenTable.section})` : 'Table',
      customerName: customerName || 'Guest Patron',
      customerPhone: customerPhone || '+91 98000 00000',
      paymentMethod: paymentChoice,
      paymentStatus: paymentChoice === 'upi' ? 'paid' : 'pending',
      subtotal: cartSubtotal,
      taxAmount: cartGst,
      grandTotal: cartTotal,
      specialInstructions: specialNote,
      items: orderItems,
    });

    setLastPlacedOrder(placed);
    setCart([]);
    setIsCartOpen(false);
    setActiveTab('tracking');
  };

  return (
    <div className="max-w-4xl mx-auto pb-24">
      {/* Top Banner / Table badge */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 rounded-3xl p-6 mb-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-6 -mr-6 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/20 text-xs font-semibold backdrop-blur-md mb-2">
              <QrCode className="w-3.5 h-3.5 text-orange-200" />
              <span>Dine-In QR Order • {currentRestaurant.displayName}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Authentic Kerala Heritage Menu</h1>
            <p className="text-orange-100 text-sm mt-1">Freshly prepared to order with Malabar spices and traditional recipes.</p>
          </div>

          <div className="bg-white/15 backdrop-blur-md rounded-2xl p-3 border border-white/20 sm:w-56">
            <span className="text-[11px] uppercase tracking-wider text-orange-200 block font-semibold">Your Table</span>
            <select
              value={selectedTable}
              onChange={(e) => setSelectedTable(e.target.value)}
              className="mt-1 w-full bg-slate-900/90 text-white text-sm font-bold rounded-lg px-2.5 py-1.5 border border-white/20 focus:outline-none"
            >
              {tables.map(tbl => (
                <option key={tbl.id} value={tbl.id}>
                  {tbl.tableNumber} — {tbl.section}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* View Switcher Tabs: Menu vs Surplus Deals vs Live Status */}
        <div className="flex gap-2 mt-6">
          <button
            onClick={() => setActiveTab('menu')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'menu' ? 'bg-white text-orange-700 shadow-md' : 'bg-black/20 text-white hover:bg-black/30'
            }`}
          >
            Digital Menu
          </button>
          <button
            onClick={() => setActiveTab('surplus')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'surplus' ? 'bg-white text-orange-700 shadow-md' : 'bg-black/20 text-white hover:bg-black/30'
            }`}
          >
            <Tag className="w-4 h-4 text-emerald-400" />
            <span>Surplus Food Deals (45% OFF)</span>
          </button>
          {lastPlacedOrder && (
            <button
              onClick={() => setActiveTab('tracking')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'tracking' ? 'bg-white text-orange-700 shadow-md' : 'bg-black/20 text-white hover:bg-black/30'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Track Order ({lastPlacedOrder.orderNumber})</span>
            </button>
          )}
        </div>
      </div>

      {/* VIEW: ORDER TRACKING */}
      {activeTab === 'tracking' && lastPlacedOrder && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 mb-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
            <div>
              <span className="text-xs uppercase font-bold text-orange-400 tracking-wider">Live Kitchen Tracker</span>
              <h2 className="text-2xl font-black text-white mt-1">Order #{lastPlacedOrder.orderNumber}</h2>
              <p className="text-xs text-slate-400">Placed at {new Date(lastPlacedOrder.createdAt).toLocaleTimeString()} • {lastPlacedOrder.tableName}</p>
            </div>
            <div className="text-right">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-500/10 text-orange-400 border border-orange-500/30">
                {lastPlacedOrder.orderStatus}
              </span>
              <p className="text-sm font-bold text-slate-200 mt-1">₹{lastPlacedOrder.grandTotal.toFixed(2)}</p>
            </div>
          </div>

          {/* Stepper */}
          <div className="grid grid-cols-4 gap-2 text-center py-4">
            {[
              { key: 'new', label: 'Received' },
              { key: 'preparing', label: 'In Kitchen' },
              { key: 'ready', label: 'Prepared' },
              { key: 'served', label: 'Served' }
            ].map((step, idx) => {
              const stages = ['new', 'accepted', 'preparing', 'ready', 'served', 'completed'];
              const currentIdx = stages.indexOf(lastPlacedOrder.orderStatus);
              const stepIdx = stages.indexOf(step.key);
              const isPast = currentIdx >= stepIdx;

              return (
                <div key={step.key} className="flex flex-col items-center">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs mb-2 transition-all ${
                    isPast ? 'bg-orange-600 text-white ring-4 ring-orange-500/20' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {isPast ? <Check className="w-4 h-4" /> : idx + 1}
                  </div>
                  <span className={`text-xs font-semibold ${isPast ? 'text-white' : 'text-slate-500'}`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Ordered items list */}
          <div className="mt-6 bg-slate-950/60 rounded-2xl p-4 border border-slate-800/80">
            <h4 className="text-xs font-bold uppercase text-slate-400 mb-3">Your Items</h4>
            <div className="space-y-2">
              {lastPlacedOrder.items.map(item => (
                <div key={item.id} className="flex items-center justify-between text-sm py-1.5 border-b border-slate-800/40 last:border-0">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded bg-slate-800 text-xs font-bold flex items-center justify-center text-orange-400">
                      {item.quantity}x
                    </span>
                    <span className="text-slate-200 font-medium">{item.itemName}</span>
                    {item.selectedVariant && (
                      <span className="text-xs text-slate-400">({item.selectedVariant})</span>
                    )}
                  </div>
                  <span className="font-semibold text-slate-300">₹{item.itemTotal.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-between items-center pt-2">
            <button
              onClick={() => setActiveTab('menu')}
              className="text-orange-400 hover:text-orange-300 text-sm font-semibold flex items-center gap-1"
            >
              Order more items &rarr;
            </button>
            <div className="text-xs text-slate-400">
              Need assistance? Wave to your server or inform the counter.
            </div>
          </div>
        </div>
      )}

      {/* VIEW: SURPLUS FOOD OFFERS (Phase 11) */}
      {activeTab === 'surplus' && (
        <div className="mb-8">
          <div className="bg-emerald-950/40 border border-emerald-500/20 rounded-2xl p-5 mb-6">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-1">
              <Sparkles className="w-4 h-4" />
              <span>CafeOS Zero Food-Waste Initiative</span>
            </div>
            <p className="text-xs text-slate-300">
              Freshly prepared culinary dishes from our evening batches, offered at up to 50% discount to ensure zero safe edible food is wasted. Available during designated pickup windows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {surplusOffers.map(offer => {
              const remaining = offer.quantityAvailable - offer.quantityReserved;
              const isAvailable = remaining > 0 && offer.status === 'active';

              return (
                <div key={offer.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {Math.round(((offer.originalPrice - offer.discountedPrice) / offer.originalPrice) * 100)}% OFF
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>Pickup: {offer.pickupWindowStart} - {offer.pickupWindowEnd}</span>
                      </span>
                    </div>

                    <h3 className="font-bold text-white text-base mt-1">{offer.title}</h3>
                    
                    <div className="flex items-baseline gap-2 mt-3">
                      <span className="text-xl font-black text-emerald-400">₹{offer.discountedPrice}</span>
                      <span className="text-sm line-through text-slate-500">₹{offer.originalPrice}</span>
                    </div>

                    <p className="text-xs text-slate-400 mt-2">
                      Available: <strong className="text-slate-200">{remaining} portions remaining</strong>
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-800">
                    <button
                      disabled={!isAvailable}
                      onClick={() => {
                        const success = claimSurplusOffer(offer.id, 1);
                        if (success) {
                          alert(`Claimed 1 portion of ${offer.title}! Please present at counter during pickup window.`);
                        }
                      }}
                      className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors ${
                        isAvailable 
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white' 
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      {isAvailable ? 'Reserve Surplus Deal Now' : 'Sold Out / Claimed'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW: MAIN DIGITAL MENU */}
      {activeTab === 'menu' && (
        <>
          {/* Search & Category Filter Bar */}
          <div className="space-y-4 mb-6">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dishes (e.g. Thalassery Biryani, Sulaimani, നെയ്പ്പത്തിരി)..."
                className="w-full bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm pl-10 pr-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Category horizontal scroll pills */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                  activeCategory === 'all'
                    ? 'bg-orange-600 text-white'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                All Specialities
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                    activeCategory === cat.id
                      ? 'bg-orange-600 text-white'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Menu Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredItems.map(item => (
              <div 
                key={item.id}
                className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700 transition-all shadow-md group"
              >
                <div>
                  {/* Image & Tags */}
                  <div className="relative h-44 w-full rounded-xl overflow-hidden mb-3 bg-slate-950">
                    <img 
                      src={item.imageUrl} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 flex gap-1.5">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${
                        item.dietaryType === 'veg' 
                          ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30' 
                          : 'bg-rose-950/80 text-rose-400 border border-rose-500/30'
                      }`}>
                        {item.dietaryType}
                      </span>
                      {item.isChefSpecial && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-500/90 text-slate-950 font-black">
                          Chef's Special
                        </span>
                      )}
                    </div>
                    <div className="absolute bottom-2 right-2 bg-slate-900/80 backdrop-blur-md px-2 py-1 rounded-lg text-[11px] font-medium text-slate-300 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-orange-400" />
                      <span>{item.prepTimeMinutes}m</span>
                    </div>
                  </div>

                  {/* Title & Multilingual names */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-white text-base leading-tight">{item.name}</h3>
                      {item.nameMalayalam && (
                        <span className="text-xs text-orange-400/90 font-medium block mt-0.5">{item.nameMalayalam}</span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Bottom: Price & Add to Cart button */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400">Price</span>
                    <div className="text-lg font-black text-white">₹{item.basePrice}</div>
                  </div>

                  {item.variants && item.variants.length > 0 ? (
                    <div className="flex gap-1.5">
                      {item.variants.map(v => (
                        <button
                          key={v.id}
                          onClick={() => addToCart(item, v.name)}
                          className="px-2.5 py-1.5 bg-orange-600/20 hover:bg-orange-600 text-orange-300 hover:text-white rounded-lg text-xs font-bold border border-orange-500/30 transition-colors"
                        >
                          + {v.name} (₹{v.price})
                        </button>
                      ))}
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(item)}
                      className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-orange-600/20 transition-all active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add to Order</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* FLOATING CART BAR (Mobile friendly) */}
      {cart.length > 0 && !isCartOpen && (
        <div className="fixed bottom-6 left-4 right-4 max-w-md mx-auto z-40">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-gradient-to-r from-orange-600 to-amber-600 text-white font-extrabold px-5 py-4 rounded-2xl shadow-2xl flex items-center justify-between border border-orange-400/30 active:scale-98 transition-transform"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-black/30 flex items-center justify-center text-xs">
                {totalItemCount}
              </div>
              <div className="text-left">
                <div className="text-sm">View Current Order</div>
                <div className="text-[11px] text-orange-200">Table {tables.find(t => t.id === selectedTable)?.tableNumber}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-base font-black">₹{cartTotal.toFixed(2)}</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      )}

      {/* CART MODAL DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col justify-between p-6 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-orange-500" />
                  <h3 className="text-lg font-bold text-white">Your Table Order</h3>
                </div>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Items List */}
              <div className="space-y-3 mb-6">
                {cart.map((c, idx) => {
                  const price = c.item.variants && c.variant
                    ? c.item.variants.find(v => v.name === c.variant)?.price || c.item.basePrice
                    : c.item.basePrice;
                  
                  return (
                    <div key={`${c.item.id}-${idx}`} className="flex items-center justify-between bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                      <div>
                        <h4 className="text-sm font-bold text-white">{c.item.name}</h4>
                        {c.variant && <span className="text-xs text-orange-400 font-medium">{c.variant}</span>}
                        <div className="text-xs text-slate-400 mt-0.5">₹{price} each</div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center bg-slate-800 rounded-lg border border-slate-700">
                          <button 
                            onClick={() => updateQuantity(c.item.id, -1, c.variant)}
                            className="p-1.5 text-slate-300 hover:text-white"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2 text-xs font-bold text-white">{c.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(c.item.id, 1, c.variant)}
                            className="p-1.5 text-slate-300 hover:text-white"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="text-sm font-bold text-white w-14 text-right">
                          ₹{(price * c.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Customer details & Notes */}
              <div className="space-y-3 mb-6 bg-slate-950/40 p-3.5 rounded-xl border border-slate-800">
                <div className="text-xs font-bold uppercase text-slate-400">Patron Information</div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Your Name (Optional)"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="bg-slate-900 border border-slate-800 text-xs text-white px-3 py-2 rounded-lg focus:outline-none focus:border-orange-500"
                  />
                  <input
                    type="tel"
                    placeholder="Phone (For Loyalty)"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="bg-slate-900 border border-slate-800 text-xs text-white px-3 py-2 rounded-lg focus:outline-none focus:border-orange-500"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Special cooking notes (e.g. less spice, no sugar)..."
                  value={specialNote}
                  onChange={(e) => setSpecialNote(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-xs text-white px-3 py-2 rounded-lg focus:outline-none focus:border-orange-500"
                />

                {/* Payment Option */}
                <div className="pt-2">
                  <span className="text-[11px] text-slate-400 block mb-1 font-semibold">Payment Method:</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setPaymentChoice('upi')}
                      className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                        paymentChoice === 'upi'
                          ? 'bg-orange-600 text-white border-orange-500'
                          : 'bg-slate-900 text-slate-300 border-slate-800'
                      }`}
                    >
                      UPI Instant Pay
                    </button>
                    <button
                      onClick={() => setPaymentChoice('cash')}
                      className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                        paymentChoice === 'cash'
                          ? 'bg-orange-600 text-white border-orange-500'
                          : 'bg-slate-900 text-slate-300 border-slate-800'
                      }`}
                    >
                      Pay at Counter
                    </button>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs border-t border-slate-800 pt-3">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span>₹{cartSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>GST (CGST 2.5% + SGST 2.5%)</span>
                  <span>₹{cartGst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-black text-white pt-2 border-t border-slate-800">
                  <span>Total Payable</span>
                  <span className="text-orange-400">₹{cartTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Confirm Button */}
            <div className="pt-4 border-t border-slate-800">
              <button
                onClick={handleCheckout}
                className="w-full bg-orange-600 hover:bg-orange-500 active:scale-98 text-white font-black py-3.5 rounded-xl shadow-lg shadow-orange-600/30 transition-all text-sm flex items-center justify-center gap-2"
              >
                <span>Confirm & Send to Kitchen</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
