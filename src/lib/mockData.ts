import { 
  Tenant, Restaurant, Branch, RestaurantSettings, MenuItem, MenuCategory, 
  DiningTable, Order, Ingredient, Recipe, DeliveryConnection, 
  SettlementBatch, CustomerProfile, SurplusOffer, Expense, SubscriptionPlan, Subscription
} from '../types';

export const INITIAL_TENANTS: Tenant[] = [
  {
    id: 'tenant-1',
    name: 'Malabar Spice Hospitality Group',
    slug: 'malabar-spice',
    status: 'active',
    contactEmail: 'operations@malabarspice.com',
    contactPhone: '+91 98470 12345',
    country: 'IN',
    createdAt: '2026-01-15T09:00:00Z',
  },
  {
    id: 'tenant-2',
    name: 'Coastal Brews & Roastery',
    slug: 'coastal-brews',
    status: 'active',
    contactEmail: 'accounts@coastalbrews.in',
    contactPhone: '+91 94471 98765',
    country: 'IN',
    createdAt: '2026-02-01T10:30:00Z',
  }
];

export const INITIAL_RESTAURANTS: Restaurant[] = [
  {
    id: 'rest-1',
    tenantId: 'tenant-1',
    legalName: 'Malabar Hospitality Enterprises Pvt Ltd',
    displayName: 'Malabar Heritage Cafe & Kitchen',
    restaurantType: 'dine_in_cafe',
    primaryColor: '#ea580c',
    gstin: '32AABCM1234F1Z8',
    fssaiLicense: '11322001000456',
    currency: 'INR',
    currencySymbol: '₹',
    timezone: 'Asia/Kolkata',
    isActive: true,
    branchesCount: 2,
  },
  {
    id: 'rest-2',
    tenantId: 'tenant-2',
    legalName: 'Coastal Artisan Bakers LLP',
    displayName: 'Coastal Brews & Bakehouse',
    restaurantType: 'bakery',
    primaryColor: '#0284c7',
    gstin: '32AABCB5678G2Z1',
    fssaiLicense: '11323002000892',
    currency: 'INR',
    currencySymbol: '₹',
    timezone: 'Asia/Kolkata',
    isActive: true,
    branchesCount: 1,
  }
];

export const INITIAL_BRANCHES: Branch[] = [
  {
    id: 'branch-1',
    tenantId: 'tenant-1',
    restaurantId: 'rest-1',
    branchName: 'Panampilly Nagar Flagship',
    branchCode: 'PN-01',
    address: 'Plot 42, Main Avenue, Panampilly Nagar',
    city: 'Kochi',
    state: 'Kerala',
    pincode: '682036',
    phone: '+91 484 2314567',
    email: 'panampilly@malabarspice.com',
    isActive: true,
  },
  {
    id: 'branch-2',
    tenantId: 'tenant-1',
    restaurantId: 'rest-1',
    branchName: 'Fort Kochi Waterfront',
    branchCode: 'FK-02',
    address: 'Bazaar Road, Near Dutch Palace, Mattancherry',
    city: 'Kochi',
    state: 'Kerala',
    pincode: '682002',
    phone: '+91 484 2219876',
    email: 'fortkochi@malabarspice.com',
    isActive: true,
  }
];

export const INITIAL_SETTINGS: RestaurantSettings = {
  id: 'set-1',
  restaurantId: 'rest-1',
  dineInEnabled: true,
  takeawayEnabled: true,
  qrOrderingEnabled: true,
  serviceChargePct: 0.0,
  packagingChargeTakeaway: 25.0,
  autoAcceptOrders: false,
  soundAlertsEnabled: true,
  kdsSoundEnabled: true,
  taxInclusivePricing: true,
  defaultGstRate: 5.0,
  loyaltyEnabled: true,
  surplusDealsEnabled: true,
};

export const INITIAL_CATEGORIES: MenuCategory[] = [
  { id: 'cat-1', restaurantId: 'rest-1', name: 'Signature Brews & Chais', displayOrder: 1, isActive: true },
  { id: 'cat-2', restaurantId: 'rest-1', name: 'Malabar Breakfast & Snacks', displayOrder: 2, isActive: true },
  { id: 'cat-3', restaurantId: 'rest-1', name: 'Specialty Biryanis & Mains', displayOrder: 3, isActive: true },
  { id: 'cat-4', restaurantId: 'rest-1', name: 'Artisan Breads & Porotta', displayOrder: 4, isActive: true },
  { id: 'cat-5', restaurantId: 'rest-1', name: 'Desserts & Beverages', displayOrder: 5, isActive: true },
];

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  {
    id: 'item-1',
    restaurantId: 'rest-1',
    categoryId: 'cat-1',
    name: 'Kallumakkaya Sulaimani & Spice Blend',
    nameMalayalam: 'സുലൈമാനി',
    nameHindi: 'सुलेमानी चाय',
    description: 'Black spiced aromatic digestive tea brewed with cardamom, clove, fresh mint, and lemon.',
    basePrice: 65,
    dietaryType: 'veg',
    prepTimeMinutes: 5,
    isAvailable: true,
    isPopular: true,
    isChefSpecial: false,
    gstRate: 5.0,
    station: 'drinks',
    imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=500&q=80',
    variants: [
      { id: 'v-1', name: 'Regular Cup', price: 65, isDefault: true },
      { id: 'v-2', name: 'Pot for Two', price: 110 }
    ]
  },
  {
    id: 'item-2',
    restaurantId: 'rest-1',
    categoryId: 'cat-2',
    name: 'Neypathiri with Roasted Beef Roast',
    nameMalayalam: 'നെയ്പ്പത്തിരി & ബീഫ് റോസ്റ്റ്',
    nameHindi: 'नेयपथीरी और बीफ रोस्ट',
    description: 'Crispy fried rice-flour flatbread flavored with shallots and fennel, paired with slow-roasted Kerala beef.',
    basePrice: 280,
    dietaryType: 'non_veg',
    prepTimeMinutes: 14,
    isAvailable: true,
    isPopular: true,
    isChefSpecial: true,
    gstRate: 5.0,
    station: 'hot_kitchen',
    imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 'item-3',
    restaurantId: 'rest-1',
    categoryId: 'cat-3',
    name: 'Thalassery Chicken Dum Biryani',
    nameMalayalam: 'തലശ്ശേരി ചിക്കൻ ബിരിയാണി',
    nameHindi: 'थलस्सेरी चिकन बिरयानी',
    description: 'Fragrant short-grain Khaima rice slow-cooked on dum with pure Malabar ghee, succulent chicken, raisins and cashew nuts.',
    basePrice: 320,
    dietaryType: 'non_veg',
    prepTimeMinutes: 12,
    isAvailable: true,
    isPopular: true,
    isChefSpecial: true,
    gstRate: 5.0,
    station: 'hot_kitchen',
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=500&q=80',
    variants: [
      { id: 'v-3', name: 'Single Portion', price: 320, isDefault: true },
      { id: 'v-4', name: 'Family Pack (Serves 4)', price: 1180 }
    ]
  },
  {
    id: 'item-4',
    restaurantId: 'rest-1',
    categoryId: 'cat-2',
    name: 'Unnakaya & Pazham Nirachathu Combo',
    nameMalayalam: 'ഉന്നക്കായ & പഴം നിറച്ചത്',
    nameHindi: 'केला स्नैक कॉम्बो',
    description: 'Sweet plantain rolls stuffed with grated coconut, cardamom, jaggery, and crushed dry fruits.',
    basePrice: 140,
    dietaryType: 'veg',
    prepTimeMinutes: 8,
    isAvailable: true,
    isPopular: false,
    isChefSpecial: false,
    gstRate: 5.0,
    station: 'bakery',
    imageUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 'item-5',
    restaurantId: 'rest-1',
    categoryId: 'cat-4',
    name: 'Malabar Flaky Layered Porotta (2 Pcs)',
    nameMalayalam: 'കേരള പൊറോട്ട',
    nameHindi: 'केरल पराठा',
    description: 'Classic handcrafted spiral layered flaky bread made fresh on the hot griddle.',
    basePrice: 50,
    dietaryType: 'veg',
    prepTimeMinutes: 6,
    isAvailable: true,
    isPopular: true,
    isChefSpecial: false,
    gstRate: 5.0,
    station: 'hot_kitchen',
    imageUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 'item-6',
    restaurantId: 'rest-1',
    categoryId: 'cat-5',
    name: 'Tender Coconut Cloud Pudding',
    nameMalayalam: 'കരിക്ക് പുഡ്ഡിംഗ്',
    nameHindi: 'नारियल पुडिंग',
    description: 'Chilled melt-in-mouth dessert prepared from fresh Malabar tender coconut pulp and milk.',
    basePrice: 160,
    dietaryType: 'veg',
    prepTimeMinutes: 4,
    isAvailable: true,
    isPopular: true,
    isChefSpecial: true,
    gstRate: 5.0,
    station: 'cold_kitchen',
    imageUrl: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=500&q=80',
  }
];

export const INITIAL_TABLES: DiningTable[] = [
  { id: 'tbl-1', restaurantId: 'rest-1', branchId: 'branch-1', tableNumber: 'T-01', section: 'Garden Courtyard', seatingCapacity: 4, currentStatus: 'occupied', qrCodeToken: 'qr-t01-panampilly', isActive: true },
  { id: 'tbl-2', restaurantId: 'rest-1', branchId: 'branch-1', tableNumber: 'T-02', section: 'Garden Courtyard', seatingCapacity: 2, currentStatus: 'available', qrCodeToken: 'qr-t02-panampilly', isActive: true },
  { id: 'tbl-3', restaurantId: 'rest-1', branchId: 'branch-1', tableNumber: 'T-03', section: 'Main Air-Conditioned Hall', seatingCapacity: 6, currentStatus: 'ordering', qrCodeToken: 'qr-t03-panampilly', isActive: true },
  { id: 'tbl-4', restaurantId: 'rest-1', branchId: 'branch-1', tableNumber: 'T-04', section: 'Main Air-Conditioned Hall', seatingCapacity: 4, currentStatus: 'cleaning', qrCodeToken: 'qr-t04-panampilly', isActive: true },
  { id: 'tbl-5', restaurantId: 'rest-1', branchId: 'branch-1', tableNumber: 'T-05', section: 'Family Mezzanine', seatingCapacity: 8, currentStatus: 'reserved', qrCodeToken: 'qr-t05-panampilly', isActive: true },
  { id: 'tbl-6', restaurantId: 'rest-1', branchId: 'branch-1', tableNumber: 'T-06', section: 'Family Mezzanine', seatingCapacity: 4, currentStatus: 'available', qrCodeToken: 'qr-t06-panampilly', isActive: true },
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-101',
    tenantId: 'tenant-1',
    restaurantId: 'rest-1',
    branchId: 'branch-1',
    orderNumber: 'ORD-8921',
    channel: 'dine_in_qr',
    tableId: 'tbl-1',
    tableName: 'T-01 (Garden Courtyard)',
    customerName: 'Anand Kumar',
    customerPhone: '+91 98460 33441',
    orderStatus: 'preparing',
    paymentStatus: 'paid',
    paymentMethod: 'upi',
    subtotal: 705.00,
    taxAmount: 35.25,
    serviceCharge: 0.00,
    packagingCharge: 0.00,
    discountAmount: 0.00,
    grandTotal: 740.25,
    platformCommission: 0.00,
    netReceivable: 740.25,
    specialInstructions: 'Less spicy for the biryani please, extra mint in Sulaimani.',
    createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    items: [
      {
        id: 'oi-1',
        orderId: 'ord-101',
        menuItemId: 'item-3',
        itemName: 'Thalassery Chicken Dum Biryani',
        quantity: 2,
        unitPrice: 320,
        selectedVariant: 'Single Portion',
        itemTotal: 640,
        gstRate: 5.0,
        kdsStation: 'hot_kitchen',
        kdsStatus: 'preparing',
        itemNotes: 'Less spicy'
      },
      {
        id: 'oi-2',
        orderId: 'ord-101',
        menuItemId: 'item-1',
        itemName: 'Kallumakkaya Sulaimani & Spice Blend',
        quantity: 1,
        unitPrice: 65,
        selectedVariant: 'Regular Cup',
        itemTotal: 65,
        gstRate: 5.0,
        kdsStation: 'drinks',
        kdsStatus: 'ready',
        itemNotes: 'Extra mint'
      }
    ]
  },
  {
    id: 'ord-102',
    tenantId: 'tenant-1',
    restaurantId: 'rest-1',
    branchId: 'branch-1',
    orderNumber: 'ORD-8922',
    channel: 'zomato',
    externalOrderId: 'ZOM-9028471',
    customerName: 'Deepa Varma',
    customerPhone: '+91 97455 22019',
    orderStatus: 'accepted',
    paymentStatus: 'paid',
    paymentMethod: 'online_gateway',
    subtotal: 560.00,
    taxAmount: 28.00,
    serviceCharge: 0.00,
    packagingCharge: 25.00,
    discountAmount: 40.00,
    grandTotal: 573.00,
    platformCommission: 126.06, // 22% commission
    netReceivable: 446.94,
    createdAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    items: [
      {
        id: 'oi-3',
        orderId: 'ord-102',
        menuItemId: 'item-2',
        itemName: 'Neypathiri with Roasted Beef Roast',
        quantity: 2,
        unitPrice: 280,
        itemTotal: 560,
        gstRate: 5.0,
        kdsStation: 'hot_kitchen',
        kdsStatus: 'pending'
      }
    ]
  },
  {
    id: 'ord-103',
    tenantId: 'tenant-1',
    restaurantId: 'rest-1',
    branchId: 'branch-1',
    orderNumber: 'ORD-8923',
    channel: 'pos_counter',
    customerName: 'Walk-in Guest',
    orderStatus: 'ready',
    paymentStatus: 'paid',
    paymentMethod: 'cash',
    subtotal: 210.00,
    taxAmount: 10.50,
    serviceCharge: 0.00,
    packagingCharge: 15.00,
    discountAmount: 0.00,
    grandTotal: 235.50,
    platformCommission: 0.00,
    netReceivable: 235.50,
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    items: [
      {
        id: 'oi-4',
        orderId: 'ord-103',
        menuItemId: 'item-5',
        itemName: 'Malabar Flaky Layered Porotta (2 Pcs)',
        quantity: 1,
        unitPrice: 50,
        itemTotal: 50,
        gstRate: 5.0,
        kdsStation: 'hot_kitchen',
        kdsStatus: 'ready'
      },
      {
        id: 'oi-5',
        orderId: 'ord-103',
        menuItemId: 'item-6',
        itemName: 'Tender Coconut Cloud Pudding',
        quantity: 1,
        unitPrice: 160,
        itemTotal: 160,
        gstRate: 5.0,
        kdsStation: 'cold_kitchen',
        kdsStatus: 'ready'
      }
    ]
  }
];

export const INITIAL_INGREDIENTS: Ingredient[] = [
  { id: 'ing-1', restaurantId: 'rest-1', name: 'Khaima Biryani Rice (Jeerakasala)', category: 'Grains & Rice', unit: 'kg', currentStock: 85.5, minStockAlert: 25.0, costPerUnit: 140.0, supplierName: 'Wayanad Organic Mills', lastRestockedAt: '2026-11-01' },
  { id: 'ing-2', restaurantId: 'rest-1', name: 'Fresh Farm Chicken', category: 'Poultry', unit: 'kg', currentStock: 42.0, minStockAlert: 20.0, costPerUnit: 195.0, supplierName: 'Periyar Fresh Meats', lastRestockedAt: '2026-11-04' },
  { id: 'ing-3', restaurantId: 'rest-1', name: 'Fresh Prime Beef Cuts', category: 'Meat', unit: 'kg', currentStock: 18.5, minStockAlert: 15.0, costPerUnit: 390.0, supplierName: 'Ernakulam Central Abattoir', lastRestockedAt: '2026-11-03' },
  { id: 'ing-4', restaurantId: 'rest-1', name: 'Pure Malabar Buffalo Ghee', category: 'Dairy', unit: 'ltr', currentStock: 22.0, minStockAlert: 8.0, costPerUnit: 640.0, supplierName: 'Milma Dairy Cooperative', lastRestockedAt: '2026-10-28' },
  { id: 'ing-5', restaurantId: 'rest-1', name: 'Tender Green Coconuts', category: 'Produce', unit: 'pcs', currentStock: 6.0, minStockAlert: 15.0, costPerUnit: 45.0, supplierName: 'Alappuzha Farms', lastRestockedAt: '2026-11-02' }, // Low stock trigger
  { id: 'ing-6', restaurantId: 'rest-1', name: 'Cardamom (Idukki Grade A)', category: 'Spices', unit: 'kg', currentStock: 4.8, minStockAlert: 2.0, costPerUnit: 2200.0, supplierName: 'Spices Board Auction', lastRestockedAt: '2026-10-15' },
];

export const INITIAL_RECIPES: Recipe[] = [
  {
    id: 'rec-1',
    menuItemId: 'item-3',
    menuItemName: 'Thalassery Chicken Dum Biryani',
    restaurantId: 'rest-1',
    servingYield: 1,
    prepLossPercentage: 4.5,
    estimatedCostPerServing: 112.50, // 35.1% food cost
    ingredients: [
      { ingredientId: 'ing-1', ingredientName: 'Khaima Biryani Rice', quantityRequired: 0.22, unit: 'kg', costContribution: 30.80 },
      { ingredientId: 'ing-2', ingredientName: 'Fresh Farm Chicken', quantityRequired: 0.32, unit: 'kg', costContribution: 62.40 },
      { ingredientId: 'ing-4', ingredientName: 'Pure Malabar Buffalo Ghee', quantityRequired: 0.02, unit: 'ltr', costContribution: 12.80 },
      { ingredientId: 'ing-6', ingredientName: 'Cardamom Grade A', quantityRequired: 0.003, unit: 'kg', costContribution: 6.50 },
    ]
  },
  {
    id: 'rec-2',
    menuItemId: 'item-2',
    menuItemName: 'Neypathiri with Roasted Beef Roast',
    restaurantId: 'rest-1',
    servingYield: 1,
    prepLossPercentage: 6.0,
    estimatedCostPerServing: 96.80, // 34.5% food cost
    ingredients: [
      { ingredientId: 'ing-3', ingredientName: 'Fresh Prime Beef Cuts', quantityRequired: 0.20, unit: 'kg', costContribution: 78.00 },
      { ingredientId: 'ing-4', ingredientName: 'Pure Malabar Buffalo Ghee', quantityRequired: 0.015, unit: 'ltr', costContribution: 9.60 },
      { ingredientId: 'ing-6', ingredientName: 'Cardamom Grade A', quantityRequired: 0.002, unit: 'kg', costContribution: 4.40 },
    ]
  }
];

export const INITIAL_CONNECTIONS: DeliveryConnection[] = [
  {
    id: 'conn-1',
    restaurantId: 'rest-1',
    provider: 'zomato',
    status: 'connected',
    storeIdentifier: 'ZOM-KCH-98124',
    commissionRatePct: 22.0,
    lastSyncAt: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
  },
  {
    id: 'conn-2',
    restaurantId: 'rest-1',
    provider: 'swiggy',
    status: 'connected',
    storeIdentifier: 'SWG-KER-44129',
    commissionRatePct: 24.5,
    lastSyncAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
  },
  {
    id: 'conn-3',
    restaurantId: 'rest-1',
    provider: 'razorpay',
    status: 'connected',
    storeIdentifier: 'acc_RzpLiveKerala99',
    commissionRatePct: 1.85,
    lastSyncAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
  }
];

export const INITIAL_SETTLEMENTS: SettlementBatch[] = [
  {
    id: 'set-101',
    restaurantId: 'rest-1',
    provider: 'zomato',
    settlementId: 'SET-ZOM-20261102-09',
    batchDate: '2026-11-02',
    grossOrderValue: 48920.00,
    commissionDeducted: 10762.40,
    taxesDeducted: 978.40,
    penaltiesOrAdjustments: -250.00, // Disputed cancellation penalty
    netPayoutAmount: 36929.20,
    bankDepositReference: 'NEFT-HDFC-9982410',
    reconciliationStatus: 'discrepancy',
    discrepancyAmount: -250.00,
    notes: 'Platform deducted ₹250 penalty for rider delay on Order #ZOM-88192 which was dispatched on time from kitchen.',
  },
  {
    id: 'set-102',
    restaurantId: 'rest-1',
    provider: 'swiggy',
    settlementId: 'SET-SWG-20261101-14',
    batchDate: '2026-11-01',
    grossOrderValue: 62450.00,
    commissionDeducted: 15300.25,
    taxesDeducted: 1249.00,
    penaltiesOrAdjustments: 0.00,
    netPayoutAmount: 45900.75,
    bankDepositReference: 'RTGS-SBI-5541092',
    reconciliationStatus: 'matched',
    discrepancyAmount: 0.00,
  }
];

export const INITIAL_CUSTOMERS: CustomerProfile[] = [
  {
    id: 'cust-1',
    restaurantId: 'rest-1',
    fullName: 'Rahul Menon',
    phone: '+91 98470 55112',
    email: 'rahul.menon@keralaweb.com',
    totalVisits: 14,
    totalSpend: 8940.00,
    loyaltyPoints: 480,
    marketingConsent: true,
    favoriteItems: ['item-3', 'item-1'],
    createdAt: '2026-03-10',
  },
  {
    id: 'cust-2',
    restaurantId: 'rest-1',
    fullName: 'Fathima Nasreen',
    phone: '+91 94461 88990',
    email: 'fathima.n@outlook.com',
    totalVisits: 8,
    totalSpend: 4720.00,
    loyaltyPoints: 260,
    marketingConsent: true,
    favoriteItems: ['item-2', 'item-6'],
    createdAt: '2026-05-18',
  }
];

export const INITIAL_SURPLUS_OFFERS: SurplusOffer[] = [
  {
    id: 'surp-1',
    restaurantId: 'rest-1',
    branchId: 'branch-1',
    menuItemId: 'item-3',
    title: 'Late Evening Thalassery Biryani Pots (Safe & Fresh Dum Pots)',
    quantityAvailable: 6,
    quantityReserved: 2,
    originalPrice: 320.00,
    discountedPrice: 175.00, // 45% discount to prevent waste
    pickupWindowStart: '21:30',
    pickupWindowEnd: '23:00',
    status: 'active',
    createdAt: '2026-11-04T15:00:00Z',
  },
  {
    id: 'surp-2',
    restaurantId: 'rest-1',
    branchId: 'branch-1',
    menuItemId: 'item-4',
    title: 'Evening Batch Pazham Nirachathu Plantain Rolls',
    quantityAvailable: 8,
    quantityReserved: 3,
    originalPrice: 140.00,
    discountedPrice: 75.00,
    pickupWindowStart: '20:00',
    pickupWindowEnd: '22:30',
    status: 'active',
    createdAt: '2026-11-04T16:00:00Z',
  }
];

export const INITIAL_EXPENSES: Expense[] = [
  { id: 'exp-1', restaurantId: 'rest-1', category: 'ingredients', title: 'Periyar Meat & Poultry Delivery Batch', amount: 8400, vendorName: 'Periyar Meats', invoiceRef: 'INV-PM-2026-88', expenseDate: '2026-11-03' },
  { id: 'exp-2', restaurantId: 'rest-1', category: 'utilities', title: 'KSEB Commercial Electricity Bill Oct', amount: 18450, vendorName: 'Kerala State Electricity Board', invoiceRef: 'KSEB-OCT-0912', expenseDate: '2026-11-01' },
  { id: 'exp-3', restaurantId: 'rest-1', category: 'packaging', title: 'Eco Biodegradable Takeaway Containers', amount: 4600, vendorName: 'BioPack Cochin', invoiceRef: 'BP-4410', expenseDate: '2026-10-29' },
];

export const INITIAL_PLANS: SubscriptionPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    monthlyPrice: 5599,
    annualPrice: 55990,
    setupFee: 2999,
    maxBranches: 1,
    maxUsers: 5,
    aiQuotaMonthly: 200,
    features: {
      kds: true,
      qrMenu: true,
      billing: true,
      deliveryHub: false,
      aiAssistant: false,
      surplusDeals: false,
      financialReconciliation: false,
      recipeCosting: false,
      crisisShield: false,
    }
  },
  {
    id: 'growth',
    name: 'Growth',
    monthlyPrice: 8999,
    annualPrice: 89990,
    setupFee: 7999,
    maxBranches: 3,
    maxUsers: 15,
    aiQuotaMonthly: 1000,
    features: {
      kds: true,
      qrMenu: true,
      billing: true,
      deliveryHub: true,
      aiAssistant: true,
      surplusDeals: true,
      financialReconciliation: false,
      recipeCosting: true,
      crisisShield: false,
    }
  },
  {
    id: 'pro',
    name: 'Pro (Recommended)',
    monthlyPrice: 14999,
    annualPrice: 129990,
    setupFee: 19999,
    maxBranches: 10,
    maxUsers: 50,
    aiQuotaMonthly: 5000,
    features: {
      kds: true,
      qrMenu: true,
      billing: true,
      deliveryHub: true,
      aiAssistant: true,
      surplusDeals: true,
      financialReconciliation: true,
      recipeCosting: true,
      crisisShield: true,
    }
  },
  {
    id: 'enterprise',
    name: 'Enterprise Custom',
    monthlyPrice: 29999,
    annualPrice: 299990,
    setupFee: 39999,
    maxBranches: 999,
    maxUsers: 999,
    aiQuotaMonthly: 50000,
    features: {
      kds: true,
      qrMenu: true,
      billing: true,
      deliveryHub: true,
      aiAssistant: true,
      surplusDeals: true,
      financialReconciliation: true,
      recipeCosting: true,
      crisisShield: true,
    }
  }
];

export const INITIAL_SUBSCRIPTION: Subscription = {
  id: 'sub-1',
  tenantId: 'tenant-1',
  planId: 'pro',
  planName: 'Pro (Recommended)',
  status: 'active',
  billingInterval: 'annual',
  currentPeriodStart: '2026-01-15T00:00:00Z',
  currentPeriodEnd: '2027-01-14T23:59:59Z',
  trialEnd: '2026-02-14T00:00:00Z',
};
