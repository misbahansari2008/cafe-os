import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { Header } from './components/Header';
import { CustomerMenu } from './components/CustomerMenu';
import { KitchenDisplay } from './components/KitchenDisplay';
import { UnifiedOrders } from './components/UnifiedOrders';
import { FloorPlan } from './components/FloorPlan';
import { MenuManagement } from './components/MenuManagement';
import { BillingPOS } from './components/BillingPOS';
import { DeliveryHub } from './components/DeliveryHub';
import { Reconciliation } from './components/Reconciliation';
import { InventoryRecipes } from './components/InventoryRecipes';
import { AIAssistant } from './components/AIAssistant';
import { LoyaltyMarketing } from './components/LoyaltyMarketing';
import { SurplusDeals } from './components/SurplusDeals';
import { SuperAdmin } from './components/SuperAdmin';
import { OwnerOverview } from './components/OwnerOverview';
import { 
  LayoutDashboard, ShoppingBag, ChefHat, LayoutGrid, 
  Menu as MenuIcon, CreditCard, Share2, Scale, 
  Package, Bot, Heart, Tag, ShieldAlert, Store, UtensilsCrossed 
} from 'lucide-react';

export const App: React.FC = () => {
  const { currentRole, currentRestaurant } = useApp();
  const [currentTab, setCurrentTab] = useState<string>('overview');

  // Navigation Items by persona
  const navItems = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" />, roles: ['owner', 'manager', 'accountant'] },
    { id: 'orders', label: 'Orders Hub', icon: <ShoppingBag className="w-4 h-4" />, roles: ['owner', 'manager', 'cashier', 'waiter'] },
    { id: 'kds', label: 'Kitchen KDS', icon: <ChefHat className="w-4 h-4" />, roles: ['owner', 'kitchen', 'manager'] },
    { id: 'tables', label: 'Floor Plan', icon: <LayoutGrid className="w-4 h-4" />, roles: ['owner', 'manager', 'waiter', 'cashier'] },
    { id: 'menu', label: 'Digital Menu', icon: <MenuIcon className="w-4 h-4" />, roles: ['owner', 'manager', 'customer'] },
    { id: 'pos', label: 'Counter POS', icon: <CreditCard className="w-4 h-4" />, roles: ['owner', 'cashier', 'manager'] },
    { id: 'delivery', label: 'Delivery Hub', icon: <Share2 className="w-4 h-4" />, roles: ['owner', 'manager'] },
    { id: 'reconciliation', label: 'Reconciliation', icon: <Scale className="w-4 h-4" />, roles: ['owner', 'accountant'] },
    { id: 'inventory', label: 'Inventory & Recipes', icon: <Package className="w-4 h-4" />, roles: ['owner', 'manager', 'kitchen'] },
    { id: 'ai', label: 'AI Business Assistant', icon: <Bot className="w-4 h-4" />, roles: ['owner', 'accountant'] },
    { id: 'loyalty', label: 'Loyalty & Posters', icon: <Heart className="w-4 h-4" />, roles: ['owner', 'manager'] },
    { id: 'surplus', label: 'Surplus Deals', icon: <Tag className="w-4 h-4" />, roles: ['owner', 'manager', 'customer'] },
    { id: 'superadmin', label: 'Super Admin', icon: <ShieldAlert className="w-4 h-4" />, roles: ['super_admin'] },
  ];

  // Filter accessible tabs by current role
  const accessibleNav = navItems.filter(item => item.roles.includes(currentRole));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-orange-600 selection:text-white">
      {/* Sticky Global Top Header */}
      <Header currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Navigation Sub-bar (for staff and owner personas) */}
      {currentRole !== 'customer' && (
        <nav className="bg-slate-900/60 border-b border-slate-800/80 sticky top-16 z-40 backdrop-blur-md overflow-x-auto scrollbar-none">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1.5 py-2.5">
            {accessibleNav.map(item => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-orange-600 text-white shadow-md shadow-orange-600/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      )}

      {/* Main Body View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {currentRole === 'customer' ? (
          <CustomerMenu />
        ) : (
          <>
            {currentTab === 'overview' && <OwnerOverview />}
            {currentTab === 'orders' && <UnifiedOrders />}
            {currentTab === 'kds' && <KitchenDisplay />}
            {currentTab === 'tables' && <FloorPlan />}
            {currentTab === 'menu' && <MenuManagement />}
            {currentTab === 'pos' && <BillingPOS />}
            {currentTab === 'delivery' && <DeliveryHub />}
            {currentTab === 'reconciliation' && <Reconciliation />}
            {currentTab === 'inventory' && <InventoryRecipes />}
            {currentTab === 'ai' && <AIAssistant />}
            {currentTab === 'loyalty' && <LoyaltyMarketing />}
            {currentTab === 'surplus' && <SurplusDeals />}
            {currentTab === 'superadmin' && <SuperAdmin />}
          </>
        )}
      </main>

      {/* Bottom Global Status Bar */}
      <footer className="border-t border-slate-850 bg-slate-950 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-300">CafeOS v1.0 Enterprise</span>
            <span>•</span>
            <span>Multi-Tenant Operating System & Financial Control</span>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span>Kerala Multi-Branch Cloud</span>
            <span>•</span>
            <span className="text-emerald-400">PostgreSQL RLS Active</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
export default App;
