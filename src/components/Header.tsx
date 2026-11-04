import React from 'react';
import { useApp } from '../context/AppContext';
import { RoleType } from '../types';
import { 
  UtensilsCrossed, ShieldAlert, Store, ChefHat, 
  CreditCard, UserCheck, Calculator, Smartphone,
  CheckCircle, Database, ChevronDown
} from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, setCurrentTab }) => {
  const { 
    currentRole, setCurrentRole, 
    currentRestaurant, currentBranch, 
    branches, switchBranch,
    isDemoMode, setIsDemoMode 
  } = useApp();

  const roleOptions: { role: RoleType; label: string; icon: React.ReactNode }[] = [
    { role: 'owner', label: 'Restaurant Owner', icon: <Store className="w-4 h-4 text-orange-400" /> },
    { role: 'kitchen', label: 'Kitchen (KDS)', icon: <ChefHat className="w-4 h-4 text-amber-400" /> },
    { role: 'cashier', label: 'Cashier / Billing', icon: <CreditCard className="w-4 h-4 text-emerald-400" /> },
    { role: 'waiter', label: 'Waiter / Service', icon: <UserCheck className="w-4 h-4 text-blue-400" /> },
    { role: 'accountant', label: 'Accountant', icon: <Calculator className="w-4 h-4 text-purple-400" /> },
    { role: 'customer', label: 'Customer (QR Menu)', icon: <Smartphone className="w-4 h-4 text-rose-400" /> },
    { role: 'super_admin', label: 'Super Admin', icon: <ShieldAlert className="w-4 h-4 text-red-500" /> },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <UtensilsCrossed className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-white">Cafe<span className="text-orange-500">OS</span></span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
                  Kerala Enterprise
                </span>
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-1.5 truncate max-w-[200px] sm:max-w-none">
                <span className="font-medium text-slate-200">{currentRestaurant.displayName}</span>
                <span>•</span>
                <span className="text-slate-400">{currentBranch.branchName}</span>
              </div>
            </div>
          </div>

          {/* Center: Branch Selector & Demo Mode Indicator */}
          <div className="hidden md:flex items-center gap-3">
            {/* Branch switcher */}
            {currentRole !== 'super_admin' && currentRole !== 'customer' && (
              <div className="flex items-center bg-slate-800/80 border border-slate-700 rounded-lg px-2.5 py-1 text-xs">
                <span className="text-slate-400 mr-1.5">Branch:</span>
                <select 
                  value={currentBranch.id} 
                  onChange={(e) => switchBranch(e.target.value)}
                  className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
                >
                  {branches.map(b => (
                    <option key={b.id} value={b.id} className="bg-slate-900 text-white">
                      {b.branchName}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Live vs Demo Data Toggle */}
            <button 
              onClick={() => setIsDemoMode(!isDemoMode)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                isDemoMode 
                  ? 'bg-amber-500/10 text-amber-300 border-amber-500/30' 
                  : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
              }`}
              title="Click to toggle between Demo Dataset and Live Production data"
            >
              <Database className="w-3.5 h-3.5" />
              <span>{isDemoMode ? 'Demo Data Active' : 'Live Data Verified'}</span>
            </button>
          </div>

          {/* Right: Active Role Switcher */}
          <div className="flex items-center gap-2">
            <div className="relative flex items-center bg-slate-800 border border-slate-700/80 rounded-xl p-1 shadow-sm">
              <span className="hidden sm:inline-block text-xs font-medium text-slate-400 px-2">Role:</span>
              <div className="relative">
                <select
                  value={currentRole}
                  onChange={(e) => {
                    const newRole = e.target.value as RoleType;
                    setCurrentRole(newRole);
                    if (newRole === 'customer') setCurrentTab('menu');
                    else if (newRole === 'kitchen') setCurrentTab('kds');
                    else if (newRole === 'cashier') setCurrentTab('pos');
                    else if (newRole === 'super_admin') setCurrentTab('superadmin');
                    else setCurrentTab('overview');
                  }}
                  className="bg-slate-900 text-white font-semibold text-xs sm:text-sm pl-2.5 pr-8 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none cursor-pointer"
                >
                  {roleOptions.map(opt => (
                    <option key={opt.role} value={opt.role} className="bg-slate-900 py-1">
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
