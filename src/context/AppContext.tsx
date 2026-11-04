import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  RoleType, Tenant, Restaurant, Branch, RestaurantSettings, 
  MenuItem, MenuCategory, DiningTable, Order, OrderStatus,
  Ingredient, Recipe, DeliveryConnection, SettlementBatch, 
  CustomerProfile, SurplusOffer, Expense, SubscriptionPlan, Subscription 
} from '../types';
import { 
  INITIAL_TENANTS, INITIAL_RESTAURANTS, INITIAL_BRANCHES, INITIAL_SETTINGS,
  INITIAL_CATEGORIES, INITIAL_MENU_ITEMS, INITIAL_TABLES, INITIAL_ORDERS,
  INITIAL_INGREDIENTS, INITIAL_RECIPES, INITIAL_CONNECTIONS, INITIAL_SETTLEMENTS,
  INITIAL_CUSTOMERS, INITIAL_SURPLUS_OFFERS, INITIAL_EXPENSES, INITIAL_PLANS, INITIAL_SUBSCRIPTION 
} from '../lib/mockData';

interface AppContextType {
  // Role & Tenancy
  currentRole: RoleType;
  setCurrentRole: (role: RoleType) => void;
  currentTenant: Tenant;
  currentRestaurant: Restaurant;
  currentBranch: Branch;
  settings: RestaurantSettings;
  tenants: Tenant[];
  restaurants: Restaurant[];
  branches: Branch[];
  switchRestaurant: (restaurantId: string) => void;
  switchBranch: (branchId: string) => void;
  updateSettings: (newSettings: Partial<RestaurantSettings>) => void;

  // Data Stores
  categories: MenuCategory[];
  menuItems: MenuItem[];
  tables: DiningTable[];
  orders: Order[];
  ingredients: Ingredient[];
  recipes: Recipe[];
  connections: DeliveryConnection[];
  settlements: SettlementBatch[];
  customers: CustomerProfile[];
  surplusOffers: SurplusOffer[];
  expenses: Expense[];
  plans: SubscriptionPlan[];
  subscription: Subscription;

  // Actions
  placeOrder: (order: Partial<Order>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updateOrderItemKds: (orderId: string, itemId: string, status: 'pending' | 'preparing' | 'ready' | 'served') => void;
  toggleItemAvailability: (itemId: string) => void;
  updateMenuItem: (item: MenuItem) => void;
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  updateTableStatus: (tableId: string, status: DiningTable['currentStatus']) => void;
  adjustIngredientStock: (ingredientId: string, amount: number, type: 'purchase_in' | 'waste_loss' | 'audit_adjustment', reason?: string) => void;
  recordWastage: (ingredientName: string, quantity: number, unit: string, costLoss: number, reason: string) => void;
  createSurplusOffer: (offer: Omit<SurplusOffer, 'id' | 'createdAt'>) => void;
  claimSurplusOffer: (offerId: string, quantity: number) => boolean;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  reconcileSettlement: (settlementId: string, status: 'matched' | 'discrepancy', notes?: string) => void;
  updatePlanPrice: (planId: string, monthly: number, annual: number) => void;
  
  // Real vs Demo indicator
  isDemoMode: boolean;
  setIsDemoMode: (val: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Role & Multi-tenancy State
  const [currentRole, setCurrentRole] = useState<RoleType>('owner');
  const [tenants] = useState<Tenant[]>(INITIAL_TENANTS);
  const [restaurants] = useState<Restaurant[]>(INITIAL_RESTAURANTS);
  const [branches] = useState<Branch[]>(INITIAL_BRANCHES);
  
  const [currentTenant] = useState<Tenant>(INITIAL_TENANTS[0]);
  const [currentRestaurant, setCurrentRestaurant] = useState<Restaurant>(INITIAL_RESTAURANTS[0]);
  const [currentBranch, setCurrentBranch] = useState<Branch>(INITIAL_BRANCHES[0]);
  const [settings, setSettings] = useState<RestaurantSettings>(INITIAL_SETTINGS);

  // Entities State
  const [categories, setCategories] = useState<MenuCategory[]>(INITIAL_CATEGORIES);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  const [tables, setTables] = useState<DiningTable[]>(INITIAL_TABLES);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [ingredients, setIngredients] = useState<Ingredient[]>(INITIAL_INGREDIENTS);
  const [recipes] = useState<Recipe[]>(INITIAL_RECIPES);
  const [connections] = useState<DeliveryConnection[]>(INITIAL_CONNECTIONS);
  const [settlements, setSettlements] = useState<SettlementBatch[]>(INITIAL_SETTLEMENTS);
  const [customers, setCustomers] = useState<CustomerProfile[]>(INITIAL_CUSTOMERS);
  const [surplusOffers, setSurplusOffers] = useState<SurplusOffer[]>(INITIAL_SURPLUS_OFFERS);
  const [expenses, setExpenses] = useState<Expense[]>(INITIAL_EXPENSES);
  const [plans, setPlans] = useState<SubscriptionPlan[]>(INITIAL_PLANS);
  const [subscription] = useState<Subscription>(INITIAL_SUBSCRIPTION);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);

  // Switch Restaurant
  const switchRestaurant = (restaurantId: string) => {
    const found = restaurants.find(r => r.id === restaurantId);
    if (found) {
      setCurrentRestaurant(found);
      const firstBranch = branches.find(b => b.restaurantId === restaurantId);
      if (firstBranch) setCurrentBranch(firstBranch);
    }
  };

  // Switch Branch
  const switchBranch = (branchId: string) => {
    const found = branches.find(b => b.id === branchId);
    if (found) setCurrentBranch(found);
  };

  // Update Settings
  const updateSettings = (newSettings: Partial<RestaurantSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  // Place Order
  const placeOrder = (orderData: Partial<Order>): Order => {
    const newOrderNumber = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      tenantId: currentTenant.id,
      restaurantId: currentRestaurant.id,
      branchId: currentBranch.id,
      orderNumber: newOrderNumber,
      channel: orderData.channel || 'dine_in_qr',
      tableId: orderData.tableId,
      tableName: orderData.tableName,
      customerName: orderData.customerName || 'Guest Patron',
      customerPhone: orderData.customerPhone,
      orderStatus: 'new',
      paymentStatus: orderData.paymentStatus || 'pending',
      paymentMethod: orderData.paymentMethod || 'cash',
      subtotal: orderData.subtotal || 0,
      taxAmount: orderData.taxAmount || 0,
      serviceCharge: orderData.serviceCharge || 0,
      packagingCharge: orderData.packagingCharge || 0,
      discountAmount: orderData.discountAmount || 0,
      grandTotal: orderData.grandTotal || 0,
      platformCommission: orderData.platformCommission || 0,
      netReceivable: (orderData.grandTotal || 0) - (orderData.platformCommission || 0),
      specialInstructions: orderData.specialInstructions,
      items: orderData.items || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setOrders(prev => [newOrder, ...prev]);

    // Update table status if dine-in
    if (newOrder.tableId) {
      setTables(prev => prev.map(t => 
        t.id === newOrder.tableId 
          ? { ...t, currentStatus: 'occupied', currentOrderId: newOrder.id }
          : t
      ));
    }

    return newOrder;
  };

  // Update Order Status
  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(order => {
      if (order.id !== orderId) return order;
      
      // If completed or cancelled and has table, mark table available
      if ((status === 'completed' || status === 'cancelled') && order.tableId) {
        setTables(tbls => tbls.map(t => t.id === order.tableId ? { ...t, currentStatus: 'available', currentOrderId: undefined } : t));
      }

      return {
        ...order,
        orderStatus: status,
        updatedAt: new Date().toISOString(),
      };
    }));
  };

  // Update Order Item KDS status
  const updateOrderItemKds = (orderId: string, itemId: string, status: 'pending' | 'preparing' | 'ready' | 'served') => {
    setOrders(prev => prev.map(ord => {
      if (ord.id !== orderId) return ord;
      const updatedItems = ord.items.map(item => 
        item.id === itemId ? { ...item, kdsStatus: status } : item
      );
      
      // Auto-update order status if all ready
      const allReady = updatedItems.every(i => i.kdsStatus === 'ready' || i.kdsStatus === 'served');
      const anyPreparing = updatedItems.some(i => i.kdsStatus === 'preparing');
      
      let nextStatus = ord.orderStatus;
      if (allReady && ord.orderStatus !== 'served' && ord.orderStatus !== 'completed') {
        nextStatus = 'ready';
      } else if (anyPreparing && ord.orderStatus === 'new') {
        nextStatus = 'preparing';
      }

      return {
        ...ord,
        orderStatus: nextStatus,
        items: updatedItems,
        updatedAt: new Date().toISOString(),
      };
    }));
  };

  // Toggle Menu Item Availability
  const toggleItemAvailability = (itemId: string) => {
    setMenuItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, isAvailable: !item.isAvailable } : item
    ));
  };

  // Update Menu Item
  const updateMenuItem = (item: MenuItem) => {
    setMenuItems(prev => prev.map(m => m.id === item.id ? item : m));
  };

  // Add Menu Item
  const addMenuItem = (itemData: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = {
      ...itemData,
      id: `item-${Date.now()}`
    };
    setMenuItems(prev => [...prev, newItem]);
  };

  // Update Table Status
  const updateTableStatus = (tableId: string, status: DiningTable['currentStatus']) => {
    setTables(prev => prev.map(tbl => tbl.id === tableId ? { ...tbl, currentStatus: status } : tbl));
  };

  // Adjust Stock
  const adjustIngredientStock = (ingredientId: string, amount: number, type: 'purchase_in' | 'waste_loss' | 'audit_adjustment', reason?: string) => {
    setIngredients(prev => prev.map(ing => {
      if (ing.id !== ingredientId) return ing;
      const newStock = Math.max(0, ing.currentStock + amount);
      return {
        ...ing,
        currentStock: newStock,
        lastRestockedAt: amount > 0 ? new Date().toISOString().split('T')[0] : ing.lastRestockedAt
      };
    }));
  };

  // Record Wastage
  const recordWastage = (ingredientName: string, quantity: number, unit: string, costLoss: number, reason: string) => {
    // Also deduct stock if found
    const target = ingredients.find(i => i.name.toLowerCase() === ingredientName.toLowerCase());
    if (target) {
      adjustIngredientStock(target.id, -quantity, 'waste_loss', reason);
    }
  };

  // Create Surplus Offer
  const createSurplusOffer = (offerData: Omit<SurplusOffer, 'id' | 'createdAt'>) => {
    const newOffer: SurplusOffer = {
      ...offerData,
      id: `surp-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setSurplusOffers(prev => [newOffer, ...prev]);
  };

  // Claim Surplus Offer
  const claimSurplusOffer = (offerId: string, quantity: number): boolean => {
    let success = false;
    setSurplusOffers(prev => prev.map(offer => {
      if (offer.id !== offerId) return offer;
      if (offer.quantityAvailable - offer.quantityReserved >= quantity) {
        success = true;
        const newReserved = offer.quantityReserved + quantity;
        return {
          ...offer,
          quantityReserved: newReserved,
          status: newReserved >= offer.quantityAvailable ? 'sold_out' : 'active'
        };
      }
      return offer;
    }));
    return success;
  };

  // Add Expense
  const addExpense = (expenseData: Omit<Expense, 'id'>) => {
    const newExp: Expense = {
      ...expenseData,
      id: `exp-${Date.now()}`
    };
    setExpenses(prev => [newExp, ...prev]);
  };

  // Reconcile Settlement
  const reconcileSettlement = (settlementId: string, status: 'matched' | 'discrepancy', notes?: string) => {
    setSettlements(prev => prev.map(s => {
      if (s.id !== settlementId) return s;
      return {
        ...s,
        reconciliationStatus: status,
        notes: notes || s.notes,
        discrepancyAmount: status === 'matched' ? 0 : s.discrepancyAmount
      };
    }));
  };

  // Update Plan Price (Super Admin)
  const updatePlanPrice = (planId: string, monthly: number, annual: number) => {
    setPlans(prev => prev.map(p => p.id === planId ? { ...p, monthlyPrice: monthly, annualPrice: annual } : p));
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        currentTenant,
        currentRestaurant,
        currentBranch,
        settings,
        tenants,
        restaurants,
        branches,
        switchRestaurant,
        switchBranch,
        updateSettings,
        categories,
        menuItems,
        tables,
        orders,
        ingredients,
        recipes,
        connections,
        settlements,
        customers,
        surplusOffers,
        expenses,
        plans,
        subscription,
        placeOrder,
        updateOrderStatus,
        updateOrderItemKds,
        toggleItemAvailability,
        updateMenuItem,
        addMenuItem,
        updateTableStatus,
        adjustIngredientStock,
        recordWastage,
        createSurplusOffer,
        claimSurplusOffer,
        addExpense,
        reconcileSettlement,
        updatePlanPrice,
        isDemoMode,
        setIsDemoMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
