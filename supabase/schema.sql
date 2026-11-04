-- ==============================================================================
-- CAFEOS ENTERPRISE MASTER DATABASE SCHEMA (POSTGRESQL / SUPABASE)
-- Multi-Tenant Restaurant Operating System, Omnichannel Engine, Financial Control,
-- KDS, Inventory, Recipe Costing, Consent-Based Loyalty & Business Intelligence
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. PLATFORM AND MULTI-TENANCY FOUNDATION
-- ==========================================

CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'trial', 'closed')),
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(50),
    country VARCHAR(10) DEFAULT 'IN',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS restaurants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    legal_name VARCHAR(255) NOT NULL,
    display_name VARCHAR(255) NOT NULL,
    restaurant_type VARCHAR(100) DEFAULT 'dine_in_cafe' CHECK (restaurant_type IN ('dine_in_cafe', 'bakery', 'cloud_kitchen', 'quick_service', 'fine_dining', 'multi_chain')),
    logo_url TEXT,
    banner_url TEXT,
    primary_color VARCHAR(20) DEFAULT '#ea580c',
    gstin VARCHAR(30),
    fssai_license VARCHAR(50),
    currency VARCHAR(10) DEFAULT 'INR',
    currency_symbol VARCHAR(5) DEFAULT '₹',
    timezone VARCHAR(50) DEFAULT 'Asia/Kolkata',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS branches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    branch_name VARCHAR(255) NOT NULL,
    branch_code VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(20) NOT NULL,
    phone VARCHAR(50),
    email VARCHAR(255),
    geo_latitude DECIMAL(10, 8),
    geo_longitude DECIMAL(11, 8),
    operating_hours JSONB DEFAULT '{"monday": {"open": "09:00", "close": "23:00"}}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(restaurant_id, branch_code)
);

CREATE TABLE IF NOT EXISTS restaurant_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE UNIQUE,
    dine_in_enabled BOOLEAN DEFAULT TRUE,
    takeaway_enabled BOOLEAN DEFAULT TRUE,
    qr_ordering_enabled BOOLEAN DEFAULT TRUE,
    service_charge_pct DECIMAL(5, 2) DEFAULT 0.00,
    packaging_charge_takeaway DECIMAL(10, 2) DEFAULT 0.00,
    auto_accept_orders BOOLEAN DEFAULT FALSE,
    sound_alerts_enabled BOOLEAN DEFAULT TRUE,
    kds_sound_enabled BOOLEAN DEFAULT TRUE,
    tax_inclusive_pricing BOOLEAN DEFAULT TRUE,
    default_gst_rate DECIMAL(5, 2) DEFAULT 5.00,
    loyalty_enabled BOOLEAN DEFAULT TRUE,
    surplus_deals_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS roles (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    system_role BOOLEAN DEFAULT TRUE
);

INSERT INTO roles (id, name, description) VALUES
('super_admin', 'Super Admin', 'Platform operator with aggregate oversight'),
('owner', 'Restaurant Owner', 'Full control over restaurant, financials, menu, staff'),
('manager', 'Branch Manager', 'Operations, staff shifts, inventory, day-to-day oversight'),
('cashier', 'Cashier / Billing Staff', 'Point of sale, receipts, counter collections, shift closing'),
('waiter', 'Waiter / Service Staff', 'Table ordering, table status, guest requests'),
('kitchen', 'Kitchen Staff', 'Kitchen display system, queue statuses, prep tracking'),
('accountant', 'Accountant / Finance Staff', 'Financial reports, reconciliation, tax reports, P&L'),
('customer', 'Customer', 'QR ordering, self-service cart, loyalty account')
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS memberships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
    role_id VARCHAR(50) NOT NULL REFERENCES roles(id),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'invited')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, restaurant_id, role_id)
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100),
    changes JSONB,
    ip_address VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 2. MENU, TABLES AND ORDERING
-- ==========================================

CREATE TABLE IF NOT EXISTS menu_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    display_order INT DEFAULT 0,
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS menu_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES menu_categories(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    name_malayalam VARCHAR(255),
    name_hindi VARCHAR(255),
    description TEXT,
    base_price DECIMAL(10, 2) NOT NULL CHECK (base_price >= 0),
    image_url TEXT,
    dietary_type VARCHAR(50) DEFAULT 'non_veg' CHECK (dietary_type IN ('veg', 'non_veg', 'egg', 'vegan')),
    prep_time_minutes INT DEFAULT 15,
    is_available BOOLEAN DEFAULT TRUE,
    is_popular BOOLEAN DEFAULT FALSE,
    is_chef_special BOOLEAN DEFAULT FALSE,
    gst_rate DECIMAL(5, 2) DEFAULT 5.00,
    station VARCHAR(50) DEFAULT 'hot_kitchen' CHECK (station IN ('hot_kitchen', 'cold_kitchen', 'drinks', 'bakery', 'tandoor')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS menu_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    menu_item_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
    variant_name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    is_default BOOLEAN DEFAULT FALSE,
    is_available BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS item_modifiers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    menu_item_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
    group_name VARCHAR(100) NOT NULL,
    modifier_name VARCHAR(100) NOT NULL,
    price_delta DECIMAL(10, 2) DEFAULT 0.00,
    is_available BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS tables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    table_number VARCHAR(50) NOT NULL,
    section VARCHAR(100) DEFAULT 'Main Dining',
    seating_capacity INT DEFAULT 4,
    current_status VARCHAR(50) DEFAULT 'available' CHECK (current_status IN ('available', 'occupied', 'reserved', 'ordering', 'cleaning')),
    qr_code_token VARCHAR(100) UNIQUE,
    current_order_id UUID,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(branch_id, table_number)
);

CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    order_number VARCHAR(50) NOT NULL,
    channel VARCHAR(50) NOT NULL CHECK (channel IN ('dine_in_qr', 'dine_in_waiter', 'pos_counter', 'direct_takeaway', 'direct_web', 'zomato', 'swiggy', 'other_aggregator')),
    external_order_id VARCHAR(100),
    table_id UUID REFERENCES tables(id) ON DELETE SET NULL,
    customer_name VARCHAR(255),
    customer_phone VARCHAR(50),
    order_status VARCHAR(50) DEFAULT 'new' CHECK (order_status IN ('new', 'accepted', 'preparing', 'ready', 'served', 'dispatched', 'completed', 'cancelled', 'rejected')),
    payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'partially_paid', 'refunded', 'credit')),
    payment_method VARCHAR(50) DEFAULT 'cash' CHECK (payment_method IN ('cash', 'upi', 'card', 'online_gateway', 'credit_bill', 'split')),
    subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    tax_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    service_charge DECIMAL(10, 2) DEFAULT 0.00,
    packaging_charge DECIMAL(10, 2) DEFAULT 0.00,
    discount_amount DECIMAL(10, 2) DEFAULT 0.00,
    discount_type VARCHAR(50),
    grand_total DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    platform_commission DECIMAL(10, 2) DEFAULT 0.00,
    net_receivable DECIMAL(10, 2) DEFAULT 0.00,
    special_instructions TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id UUID NOT NULL REFERENCES menu_items(id),
    item_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL,
    selected_variant VARCHAR(100),
    selected_modifiers JSONB DEFAULT '[]'::jsonb,
    item_total DECIMAL(10, 2) NOT NULL,
    gst_rate DECIMAL(5, 2) DEFAULT 5.00,
    kds_station VARCHAR(50) DEFAULT 'hot_kitchen',
    kds_status VARCHAR(50) DEFAULT 'pending' CHECK (kds_status IN ('pending', 'preparing', 'ready', 'served', 'cancelled')),
    item_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    payment_method VARCHAR(50) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL CHECK (amount >= 0),
    transaction_reference VARCHAR(150),
    status VARCHAR(50) DEFAULT 'successful' CHECK (status IN ('successful', 'failed', 'refunded', 'pending')),
    collected_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE UNIQUE,
    invoice_number VARCHAR(100) NOT NULL UNIQUE,
    customer_name VARCHAR(255),
    customer_gstin VARCHAR(30),
    subtotal DECIMAL(10, 2) NOT NULL,
    cgst DECIMAL(10, 2) DEFAULT 0.00,
    sgst DECIMAL(10, 2) DEFAULT 0.00,
    igst DECIMAL(10, 2) DEFAULT 0.00,
    discount_amount DECIMAL(10, 2) DEFAULT 0.00,
    round_off DECIMAL(5, 2) DEFAULT 0.00,
    grand_total DECIMAL(10, 2) NOT NULL,
    issued_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 3. INVENTORY, RECIPES & FOOD COSTING
-- ==========================================

CREATE TABLE IF NOT EXISTS ingredients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) DEFAULT 'general',
    unit VARCHAR(50) NOT NULL, -- 'kg', 'ltr', 'pcs', 'grams'
    current_stock DECIMAL(12, 3) NOT NULL DEFAULT 0.000 CHECK (current_stock >= 0),
    min_stock_alert DECIMAL(12, 3) DEFAULT 5.000,
    cost_per_unit DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    supplier_name VARCHAR(255),
    last_restocked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS recipes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    menu_item_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE UNIQUE,
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    serving_yield INT DEFAULT 1,
    prep_loss_percentage DECIMAL(5, 2) DEFAULT 0.00,
    estimated_cost_per_serving DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS recipe_ingredients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    ingredient_id UUID NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
    quantity_required DECIMAL(12, 4) NOT NULL CHECK (quantity_required > 0),
    unit VARCHAR(50) NOT NULL,
    cost_contribution DECIMAL(10, 2) DEFAULT 0.00
);

CREATE TABLE IF NOT EXISTS stock_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    ingredient_id UUID NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
    movement_type VARCHAR(50) NOT NULL CHECK (movement_type IN ('purchase_in', 'order_consumption', 'waste_loss', 'audit_adjustment', 'transfer')),
    quantity DECIMAL(12, 3) NOT NULL,
    resulting_stock DECIMAL(12, 3) NOT NULL,
    reason TEXT,
    actor_id UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wastage_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    ingredient_id UUID REFERENCES ingredients(id) ON DELETE SET NULL,
    quantity DECIMAL(12, 3) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    estimated_cost_loss DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    reason VARCHAR(100) NOT NULL CHECK (reason IN ('spoilage', 'expired', 'burnt_dish', 'customer_return', 'prep_trimming')),
    reported_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 4. DELIVERY PLATFORMS & RECONCILIATION
-- ==========================================

CREATE TABLE IF NOT EXISTS integration_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL CHECK (provider IN ('zomato', 'swiggy', 'razorpay', 'phonepe', 'posist', 'petpooja')),
    status VARCHAR(50) DEFAULT 'connected' CHECK (status IN ('connected', 'disconnected', 'pending_approval', 'error')),
    store_identifier VARCHAR(150),
    commission_rate_pct DECIMAL(5, 2) DEFAULT 22.00,
    last_sync_at TIMESTAMPTZ,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(restaurant_id, provider)
);

CREATE TABLE IF NOT EXISTS settlement_batches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL,
    settlement_id VARCHAR(100) NOT NULL,
    batch_date DATE NOT NULL,
    gross_order_value DECIMAL(12, 2) NOT NULL,
    commission_deducted DECIMAL(10, 2) NOT NULL,
    taxes_deducted DECIMAL(10, 2) NOT NULL,
    penalties_or_adjustments DECIMAL(10, 2) DEFAULT 0.00,
    net_payout_amount DECIMAL(12, 2) NOT NULL,
    bank_deposit_reference VARCHAR(100),
    reconciliation_status VARCHAR(50) DEFAULT 'matched' CHECK (reconciliation_status IN ('matched', 'partially_matched', 'discrepancy', 'pending')),
    discrepancy_amount DECIMAL(10, 2) DEFAULT 0.00,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 5. LOYALTY, CAMPAIGNS & SURPLUS FOOD
-- ==========================================

CREATE TABLE IF NOT EXISTS customer_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    phone VARCHAR(50) NOT NULL,
    full_name VARCHAR(255),
    email VARCHAR(255),
    total_visits INT DEFAULT 1,
    total_spend DECIMAL(12, 2) DEFAULT 0.00,
    loyalty_points INT DEFAULT 0,
    marketing_consent BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(restaurant_id, phone)
);

CREATE TABLE IF NOT EXISTS loyalty_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customer_profiles(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    points_delta INT NOT NULL,
    balance_after INT NOT NULL,
    transaction_type VARCHAR(50) NOT NULL CHECK (transaction_type IN ('earned_purchase', 'redeemed_order', 'bonus_visit', 'adjusted')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS surplus_offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    menu_item_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    quantity_available INT NOT NULL CHECK (quantity_available >= 0),
    quantity_reserved INT DEFAULT 0,
    original_price DECIMAL(10, 2) NOT NULL,
    discounted_price DECIMAL(10, 2) NOT NULL CHECK (discounted_price < original_price),
    pickup_window_start TIMESTAMPTZ NOT NULL,
    pickup_window_end TIMESTAMPTZ NOT NULL,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'sold_out', 'expired', 'closed')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
    category VARCHAR(100) NOT NULL CHECK (category IN ('ingredients', 'rent', 'utilities', 'salaries', 'packaging', 'marketing', 'maintenance', 'other')),
    title VARCHAR(255) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
    vendor_name VARCHAR(255),
    invoice_ref VARCHAR(100),
    expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 6. SUBSCRIPTIONS & SUPER ADMIN MATRIX
-- ==========================================

CREATE TABLE IF NOT EXISTS subscription_plans (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    monthly_price DECIMAL(10, 2) NOT NULL,
    annual_price DECIMAL(10, 2) NOT NULL,
    setup_fee DECIMAL(10, 2) NOT NULL,
    max_branches INT NOT NULL,
    max_users INT NOT NULL,
    ai_quota_monthly INT NOT NULL,
    features JSONB NOT NULL
);

INSERT INTO subscription_plans (id, name, monthly_price, annual_price, setup_fee, max_branches, max_users, ai_quota_monthly, features) VALUES
('starter', 'Starter', 5599.00, 55990.00, 2999.00, 1, 5, 200, '{"kds": true, "qr_menu": true, "billing": true, "delivery_hub": false, "ai_assistant": false}'::jsonb),
('growth', 'Growth', 8999.00, 89990.00, 7999.00, 3, 15, 1000, '{"kds": true, "qr_menu": true, "billing": true, "delivery_hub": true, "ai_assistant": true, "surplus_deals": true}'::jsonb),
('pro', 'Pro (Recommended)', 14999.00, 129990.00, 19999.00, 10, 50, 5000, '{"kds": true, "qr_menu": true, "billing": true, "delivery_hub": true, "ai_assistant": true, "surplus_deals": true, "financial_reconciliation": true, "recipe_costing": true, "crisis_shield": true}'::jsonb),
('enterprise', 'Enterprise Custom', 29999.00, 299990.00, 39999.00, 999, 999, 50000, '{"all": true}'::jsonb)
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE UNIQUE,
    plan_id VARCHAR(50) NOT NULL REFERENCES subscription_plans(id),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('trialing', 'active', 'past_due', 'canceled', 'grace_period')),
    billing_interval VARCHAR(20) DEFAULT 'monthly' CHECK (billing_interval IN ('monthly', 'annual')),
    current_period_start TIMESTAMPTZ DEFAULT NOW(),
    current_period_end TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),
    trial_end TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days')
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES EXAMPLE
-- ==========================================

ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE settlement_batches ENABLE ROW LEVEL SECURITY;

-- Only users belonging to restaurant or super admin can access
-- CREATE POLICY tenant_isolation_policy ON orders FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::uuid);
