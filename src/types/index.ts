// ==============================================================================
// CAFEOS MASTER TYPESCRIPT DEFINITIONS
// Covers all Phase 16 Database Entities and Master Build Architecture
// ==========================================

export type RoleType = 
  | 'super_admin'
  | 'owner'
  | 'manager'
  | 'cashier'
  | 'waiter'
  | 'kitchen'
  | 'accountant'
  | 'customer';

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  avatarUrl?: string;
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  status: 'active' | 'suspended' | 'trial' | 'closed';
  contactEmail: string;
  contactPhone?: string;
  country: string;
  createdAt: string;
}

export interface Restaurant {
  id: string;
  tenantId: string;
  legalName: string;
  displayName: string;
  restaurantType: 'dine_in_cafe' | 'bakery' | 'cloud_kitchen' | 'quick_service' | 'fine_dining' | 'multi_chain';
  logoUrl?: string;
  bannerUrl?: string;
  primaryColor: string;
  gstin?: string;
  fssaiLicense?: string;
  currency: string;
  currencySymbol: string;
  timezone: string;
  isActive: boolean;
  branchesCount?: number;
}

export interface Branch {
  id: string;
  tenantId: string;
  restaurantId: string;
  branchName: string;
  branchCode: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email?: string;
  isActive: boolean;
}

export interface RestaurantSettings {
  id: string;
  restaurantId: string;
  dineInEnabled: boolean;
  takeawayEnabled: boolean;
  qrOrderingEnabled: boolean;
  serviceChargePct: number;
  packagingChargeTakeaway: number;
  autoAcceptOrders: boolean;
  soundAlertsEnabled: boolean;
  kdsSoundEnabled: boolean;
  taxInclusivePricing: boolean;
  defaultGstRate: number;
  loyaltyEnabled: boolean;
  surplusDealsEnabled: boolean;
}

export interface MenuCategory {
  id: string;
  restaurantId: string;
  name: string;
  description?: string;
  displayOrder: number;
  imageUrl?: string;
  isActive: boolean;
}

export interface MenuVariant {
  id: string;
  name: string;
  price: number;
  isDefault?: boolean;
}

export interface ItemModifier {
  id: string;
  groupName: string;
  name: string;
  priceDelta: number;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  categoryId: string;
  name: string;
  nameMalayalam?: string;
  nameHindi?: string;
  description?: string;
  basePrice: number;
  imageUrl?: string;
  dietaryType: 'veg' | 'non_veg' | 'egg' | 'vegan';
  prepTimeMinutes: number;
  isAvailable: boolean;
  isPopular?: boolean;
  isChefSpecial?: boolean;
  gstRate: number;
  station: 'hot_kitchen' | 'cold_kitchen' | 'drinks' | 'bakery' | 'tandoor';
  variants?: MenuVariant[];
  modifiers?: ItemModifier[];
}

export interface DiningTable {
  id: string;
  restaurantId: string;
  branchId: string;
  tableNumber: string;
  section: string;
  seatingCapacity: number;
  currentStatus: 'available' | 'occupied' | 'reserved' | 'ordering' | 'cleaning';
  qrCodeToken: string;
  currentOrderId?: string;
  isActive: boolean;
}

export type OrderChannel = 
  | 'dine_in_qr'
  | 'dine_in_waiter'
  | 'pos_counter'
  | 'direct_takeaway'
  | 'direct_web'
  | 'zomato'
  | 'swiggy'
  | 'other_aggregator';

export type OrderStatus = 
  | 'new'
  | 'accepted'
  | 'preparing'
  | 'ready'
  | 'served'
  | 'dispatched'
  | 'completed'
  | 'cancelled'
  | 'rejected';

export type PaymentStatus = 'pending' | 'paid' | 'partially_paid' | 'refunded' | 'credit';
export type PaymentMethod = 'cash' | 'upi' | 'card' | 'online_gateway' | 'credit_bill' | 'split';

export interface OrderItem {
  id: string;
  orderId: string;
  menuItemId: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  selectedVariant?: string;
  selectedModifiers?: string[];
  itemTotal: number;
  gstRate: number;
  kdsStation: string;
  kdsStatus: 'pending' | 'preparing' | 'ready' | 'served' | 'cancelled';
  itemNotes?: string;
}

export interface Order {
  id: string;
  tenantId: string;
  restaurantId: string;
  branchId: string;
  orderNumber: string;
  channel: OrderChannel;
  externalOrderId?: string;
  tableId?: string;
  tableName?: string;
  customerName?: string;
  customerPhone?: string;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  subtotal: number;
  taxAmount: number;
  serviceCharge: number;
  packagingCharge: number;
  discountAmount: number;
  grandTotal: number;
  platformCommission: number;
  netReceivable: number;
  specialInstructions?: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface Ingredient {
  id: string;
  restaurantId: string;
  branchId?: string;
  name: string;
  category: string;
  unit: string; // 'kg', 'ltr', 'pcs', 'grams'
  currentStock: number;
  minStockAlert: number;
  costPerUnit: number;
  supplierName?: string;
  lastRestockedAt?: string;
}

export interface RecipeIngredient {
  ingredientId: string;
  ingredientName: string;
  quantityRequired: number;
  unit: string;
  costContribution: number;
}

export interface Recipe {
  id: string;
  menuItemId: string;
  menuItemName: string;
  restaurantId: string;
  servingYield: number;
  prepLossPercentage: number;
  estimatedCostPerServing: number;
  ingredients: RecipeIngredient[];
}

export interface StockMovement {
  id: string;
  restaurantId: string;
  ingredientId: string;
  ingredientName: string;
  movementType: 'purchase_in' | 'order_consumption' | 'waste_loss' | 'audit_adjustment' | 'transfer';
  quantity: number;
  resultingStock: number;
  reason?: string;
  actorName?: string;
  createdAt: string;
}

export interface WastageRecord {
  id: string;
  restaurantId: string;
  ingredientName: string;
  quantity: number;
  unit: string;
  estimatedCostLoss: number;
  reason: 'spoilage' | 'expired' | 'burnt_dish' | 'customer_return' | 'prep_trimming';
  reportedBy: string;
  createdAt: string;
}

export interface DeliveryConnection {
  id: string;
  restaurantId: string;
  provider: 'zomato' | 'swiggy' | 'razorpay' | 'phonepe' | 'posist' | 'petpooja';
  status: 'connected' | 'disconnected' | 'pending_approval' | 'error';
  storeIdentifier: string;
  commissionRatePct: number;
  lastSyncAt?: string;
  errorMessage?: string;
}

export interface SettlementBatch {
  id: string;
  restaurantId: string;
  provider: 'zomato' | 'swiggy' | 'razorpay';
  settlementId: string;
  batchDate: string;
  grossOrderValue: number;
  commissionDeducted: number;
  taxesDeducted: number;
  penaltiesOrAdjustments: number;
  netPayoutAmount: number;
  bankDepositReference?: string;
  reconciliationStatus: 'matched' | 'partially_matched' | 'discrepancy' | 'pending';
  discrepancyAmount: number;
  notes?: string;
}

export interface CustomerProfile {
  id: string;
  restaurantId: string;
  phone: string;
  fullName: string;
  email?: string;
  totalVisits: number;
  totalSpend: number;
  loyaltyPoints: number;
  marketingConsent: boolean;
  favoriteItems?: string[];
  createdAt: string;
}

export interface SurplusOffer {
  id: string;
  restaurantId: string;
  branchId: string;
  menuItemId: string;
  title: string;
  quantityAvailable: number;
  quantityReserved: number;
  originalPrice: number;
  discountedPrice: number;
  pickupWindowStart: string;
  pickupWindowEnd: string;
  status: 'active' | 'sold_out' | 'expired' | 'closed';
  createdAt: string;
}

export interface Expense {
  id: string;
  restaurantId: string;
  category: 'ingredients' | 'rent' | 'utilities' | 'salaries' | 'packaging' | 'marketing' | 'maintenance' | 'other';
  title: string;
  amount: number;
  vendorName?: string;
  invoiceRef?: string;
  expenseDate: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  setupFee: number;
  maxBranches: number;
  maxUsers: number;
  aiQuotaMonthly: number;
  features: {
    kds: boolean;
    qrMenu: boolean;
    billing: boolean;
    deliveryHub: boolean;
    aiAssistant: boolean;
    surplusDeals: boolean;
    financialReconciliation: boolean;
    recipeCosting: boolean;
    crisisShield: boolean;
  };
}

export interface Subscription {
  id: string;
  tenantId: string;
  planId: string;
  planName: string;
  status: 'trialing' | 'active' | 'past_due' | 'canceled' | 'grace_period';
  billingInterval: 'monthly' | 'annual';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  trialEnd: string;
}
