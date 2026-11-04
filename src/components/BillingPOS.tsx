import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MenuItem, OrderItem, PaymentMethod } from '../types';
import { 
  CreditCard, Search, Plus, Minus, Trash2, Printer, 
  Check, ArrowRight, Banknote, QrCode, Calculator, Split 
} from 'lucide-react';

export const BillingPOS: React.FC = () => {
  const { menuItems, categories, tables, placeOrder, currentRestaurant, currentBranch } = useApp();
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [posCart, setPosCart] = useState<{ item: MenuItem; quantity: number }[]>([]);
  const [orderType, setOrderType] = useState<'dine_in' | 'takeaway'>('dine_in');
  const [selectedTable, setSelectedTable] = useState<string>(tables[0]?.id || '');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [splitCount, setSplitCount] = useState<number>(1);
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [lastInvoice, setLastInvoice] = useState<any | null>(null);

  const filteredItems = menuItems.filter(item => {
    const matchesCat = selectedCat === 'all' || item.categoryId === selectedCat;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const addToCart = (item: MenuItem) => {
    setPosCart(prev => {
      const exists = prev.find(i => i.item.id === item.id);
      if (exists) {
        return prev.map(i => i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setPosCart(prev => prev.map(i => {
      if (i.item.id === itemId) return { ...i, quantity: Math.max(0, i.quantity + delta) };
      return i;
    }).filter(i => i.quantity > 0));
  };

  // Financial arithmetic
  const subtotal = posCart.reduce((acc, curr) => acc + (curr.item.basePrice * curr.quantity), 0);
  const packagingCharge = orderType === 'takeaway' ? 25.00 : 0.00;
  const taxableAmount = subtotal + packagingCharge;
  const cgst = +(taxableAmount * 0.025).toFixed(2); // 2.5%
  const sgst = +(taxableAmount * 0.025).toFixed(2); // 2.5%
  const totalTax = cgst + sgst;
  const grandTotal = +(taxableAmount + totalTax).toFixed(2);
  const splitAmount = +(grandTotal / splitCount).toFixed(2);

  const handleCompleteSale = () => {
    if (posCart.length === 0) return;

    const chosenTable = tables.find(t => t.id === selectedTable);
    const orderItems: OrderItem[] = posCart.map(c => ({
      id: `oi-${Date.now()}-${Math.random()}`,
      orderId: '',
      menuItemId: c.item.id,
      itemName: c.item.name,
      quantity: c.quantity,
      unitPrice: c.item.basePrice,
      itemTotal: c.item.basePrice * c.quantity,
      gstRate: 5.0,
      kdsStation: c.item.station,
      kdsStatus: 'preparing'
    }));

    const order = placeOrder({
      channel: orderType === 'dine_in' ? 'pos_counter' : 'direct_takeaway',
      tableId: orderType === 'dine_in' ? selectedTable : undefined,
      tableName: orderType === 'dine_in' ? chosenTable?.tableNumber : 'Takeaway Counter',
      customerName: customerPhone ? `Customer (${customerPhone})` : 'Walk-in Patron',
      customerPhone: customerPhone || undefined,
      paymentMethod,
      paymentStatus: 'paid',
      subtotal,
      packagingCharge,
      taxAmount: totalTax,
      grandTotal,
      items: orderItems,
    });

    // Create printable invoice representation
    setLastInvoice({
      invoiceNo: `INV-${Date.now().toString().slice(-6)}`,
      orderNumber: order.orderNumber,
      date: new Date().toLocaleString(),
      items: posCart,
      subtotal,
      cgst,
      sgst,
      grandTotal,
      paymentMethod,
      splitCount,
      splitAmount,
    });

    setPosCart([]);
  };

  return (
    <div className="max-w-7xl mx-auto pb-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Menu Selector (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Top category tabs */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
            <div className="relative mb-3">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search quick billing item..."
                className="w-full bg-slate-950 border border-slate-800 text-xs text-white pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1">
              <button
                onClick={() => setSelectedCat('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                  selectedCat === 'all' ? 'bg-orange-600 text-white' : 'bg-slate-950 text-slate-300 hover:bg-slate-800'
                }`}
              >
                All
              </button>
              {categories.map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCat(c.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                    selectedCat === c.id ? 'bg-orange-600 text-white' : 'bg-slate-950 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Quick touch grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filteredItems.map(item => (
              <button
                key={item.id}
                onClick={() => addToCart(item)}
                className="bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-orange-500/50 rounded-2xl p-3.5 text-left transition-all active:scale-95 shadow-md flex flex-col justify-between h-28"
              >
                <div>
                  <div className="font-bold text-white text-xs leading-snug line-clamp-2">{item.name}</div>
                  {item.nameMalayalam && (
                    <span className="text-[10px] text-orange-400 font-medium">{item.nameMalayalam}</span>
                  )}
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/60">
                  <span className="text-xs font-black text-white">₹{item.basePrice}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                    + Add
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: POS Cart, GST Bill & Payment Tender (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
            <div>
              {/* POS Type & Table selection */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
                  <button
                    onClick={() => setOrderType('dine_in')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      orderType === 'dine_in' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Dine-In
                  </button>
                  <button
                    onClick={() => setOrderType('takeaway')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      orderType === 'takeaway' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Takeaway
                  </button>
                </div>

                {orderType === 'dine_in' && (
                  <select
                    value={selectedTable}
                    onChange={(e) => setSelectedTable(e.target.value)}
                    className="bg-slate-950 text-white text-xs font-bold px-2.5 py-1.5 rounded-xl border border-slate-800 focus:outline-none"
                  >
                    {tables.map(t => (
                      <option key={t.id} value={t.id}>{t.tableNumber} ({t.section})</option>
                    ))}
                  </select>
                )}
              </div>

              {/* Items in ticket */}
              <div className="max-h-56 overflow-y-auto space-y-2 mb-4 pr-1">
                {posCart.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-500 italic">
                    Tap dishes on the left to add items to the counter invoice.
                  </div>
                ) : (
                  posCart.map(c => (
                    <div key={c.item.id} className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs">
                      <div className="flex-1 pr-2">
                        <div className="font-bold text-white leading-tight">{c.item.name}</div>
                        <div className="text-[11px] text-slate-400">₹{c.item.basePrice} each</div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center bg-slate-900 rounded-lg border border-slate-700">
                          <button onClick={() => updateQuantity(c.item.id, -1)} className="px-2 py-1 text-slate-300">
                            -
                          </button>
                          <span className="font-bold text-white px-1">{c.quantity}</span>
                          <button onClick={() => updateQuantity(c.item.id, 1)} className="px-2 py-1 text-slate-300">
                            +
                          </button>
                        </div>
                        <span className="font-bold text-white w-14 text-right">
                          ₹{(c.item.basePrice * c.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Bill Details & GST */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs space-y-1.5 mb-4">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                {orderType === 'takeaway' && (
                  <div className="flex justify-between text-slate-400">
                    <span>Takeaway Packaging</span>
                    <span>₹{packagingCharge.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-400">
                  <span>CGST (2.5%)</span>
                  <span>₹{cgst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>SGST (2.5%)</span>
                  <span>₹{sgst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-black text-white pt-2 border-t border-slate-800">
                  <span>Total Amount</span>
                  <span className="text-orange-400">₹{grandTotal.toFixed(2)}</span>
                </div>

                {/* Split bill options */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Split className="w-3.5 h-3.5" />
                    <span>Split Bill (Ways):</span>
                  </span>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4].map(num => (
                      <button
                        key={num}
                        onClick={() => setSplitCount(num)}
                        className={`w-6 h-6 rounded text-xs font-bold ${
                          splitCount === num ? 'bg-orange-600 text-white' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                    {splitCount > 1 && (
                      <span className="text-xs font-bold text-emerald-400 ml-1">₹{splitAmount}/person</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Tender Selection */}
              <div className="space-y-2 mb-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Payment Method</span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'upi', label: 'UPI QR', icon: <QrCode className="w-3.5 h-3.5" /> },
                    { id: 'cash', label: 'Cash Drawer', icon: <Banknote className="w-3.5 h-3.5" /> },
                    { id: 'card', label: 'Card POS', icon: <CreditCard className="w-3.5 h-3.5" /> },
                  ].map(m => (
                    <button
                      key={m.id}
                      onClick={() => setPaymentMethod(m.id as PaymentMethod)}
                      className={`py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                        paymentMethod === m.id
                          ? 'bg-orange-600 text-white border-orange-500 shadow-md'
                          : 'bg-slate-950 text-slate-300 border-slate-800'
                      }`}
                    >
                      {m.icon}
                      <span>{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Action complete */}
            <button
              disabled={posCart.length === 0}
              onClick={handleCompleteSale}
              className={`w-full py-3.5 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                posCart.length > 0 
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 active:scale-98' 
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>Complete Payment & Generate Invoice</span>
            </button>
          </div>

          {/* Last Printed Receipt Preview */}
          {lastInvoice && (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 font-mono text-xs text-slate-300">
              <div className="flex justify-between items-center border-b border-dashed border-slate-800 pb-2 mb-2">
                <span className="font-bold text-white">TAX INVOICE</span>
                <span className="text-orange-400">{lastInvoice.invoiceNo}</span>
              </div>
              <div className="text-[11px] text-slate-400 leading-tight mb-2">
                <div>{currentRestaurant.legalName}</div>
                <div>GSTIN: {currentRestaurant.gstin} • FSSAI: {currentRestaurant.fssaiLicense}</div>
                <div>{lastInvoice.date}</div>
              </div>

              <div className="border-t border-b border-dashed border-slate-800 py-2 space-y-1">
                {lastInvoice.items.map((i: any) => (
                  <div key={i.item.id} className="flex justify-between">
                    <span>{i.quantity}x {i.item.name}</span>
                    <span>₹{(i.item.basePrice * i.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 space-y-0.5 text-[11px]">
                <div className="flex justify-between">
                  <span>CGST 2.5%: ₹{lastInvoice.cgst.toFixed(2)}</span>
                  <span>SGST 2.5%: ₹{lastInvoice.sgst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-1">
                  <span>TOTAL PAID ({lastInvoice.paymentMethod.toUpperCase()}):</span>
                  <span>₹{lastInvoice.grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <button 
                onClick={() => alert('Sending print stream to thermal receipt printer via ESC/POS')}
                className="w-full mt-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Thermal Receipt</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
