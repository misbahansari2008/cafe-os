# CafeOS — Grandmaster Enterprise Restaurant Operating System

> **One restaurant. One unified operating system. One reliable view of the entire business.**

CafeOS is a mobile-first, multi-tenant restaurant operating system and growth platform built for restaurants, cafes, bakeries, cloud kitchens, and multi-branch operations in Kerala and across India.

---

## 🚀 Key Modules Built & Operational

1. **Multi-Tenant Foundation & RBAC (`/supabase/schema.sql`, `src/types/index.ts`)**
   - 58 core relational database entities with PostgreSQL Row-Level Security (RLS).
   - Strict tenant, restaurant, and branch scoping (`tenant_id`, `restaurant_id`, `branch_id`).
   - 8 Persona Roles: Super Admin, Restaurant Owner, Branch Manager, Cashier, Waiter, Kitchen Staff, Accountant, and Customer.

2. **Customer Experience & Dine-In QR Menu (`src/components/CustomerMenu.tsx`)**
   - Mobile-first, responsive digital menu with English, Malayalam, and Hindi dish names.
   - Table identification (e.g. Table T-01, Garden Courtyard).
   - Live order customization, variant pricing, 5% Kerala GST calculation, and packaging charges.
   - Interactive live kitchen order tracker (Received → In Kitchen → Prepared → Served).
   - Late-Night Surplus Deals (45% discount to eliminate edible food waste).

3. **Live Kitchen Display System - KDS (`src/components/KitchenDisplay.tsx`)**
   - Live preparation queues with station routing (Hot Kitchen, Cold Kitchen, Drinks & Sulaimani, Bakery).
   - Prep timers with delayed-order warning (>15 minutes alert).
   - Item-level and whole-ticket status controls with audible chimes.

4. **Omnichannel Order Hub (`src/components/UnifiedOrders.tsx`)**
   - Unified workspace merging QR Dine-in, Waiter POS, Counter Takeaway, Zomato, and Swiggy.
   - Realtime status transitions, rider attribution, customer notes, and itemized receipts.

5. **Visual Floor Plan & Table Management (`src/components/FloorPlan.tsx`)**
   - Floor layouts across dining sections (Garden Courtyard, AC Hall, Family Mezzanine).
   - Table status cycles: Available, Occupied, Ordering, Reserved, Cleaning.
   - Table QR code generation and tabletop tent card print preview.

6. **Counter Billing & Touch POS (`src/components/BillingPOS.tsx`)**
   - Fast counter touch billing with Dine-in vs Takeaway modes.
   - Split bill calculator (1 to 4 ways).
   - GST Tax Invoice generator with legal entity details, FSSAI number, CGST 2.5%, SGST 2.5%, and thermal print formatting.

7. **Delivery Integrations Hub (`src/components/DeliveryHub.tsx`)**
   - Official connector architecture for Zomato, Swiggy, POS endpoints, and payment gateways.
   - Channel telemetry enforcing the core financial principle:
     `Gross Order Value ≠ Restaurant Revenue ≠ Cash Received ≠ Net Settlement`.

8. **Settlement & Payout Reconciliation Engine (`src/components/Reconciliation.tsx`)**
   - Deep reconciliation comparing internal orders against platform statements and bank deposits.
   - Flagging of discrepancies (e.g. unauthorized rider penalty deductions on on-time orders).

9. **Inventory & Recipe Food Cost Management (`src/components/InventoryRecipes.tsx`)**
   - Independent restaurant stock tracking with low-inventory alerts.
   - Recipe yield and portion cost calculation (targeting ~35% food cost ratio).
   - Wastage and spoilage logging with audit trails.

10. **AI Business Intelligence Assistant (`src/components/AIAssistant.tsx`)**
    - Deterministic BI querying real sales, recipe costs, and settlement audits.
    - Answering questions on daily revenue, Zomato settlement shortfalls, and price elasticity simulation.

11. **Consent-Based Loyalty & Automated AI Promotional Posters (`src/components/LoyaltyMarketing.tsx`)**
    - Customer profile recognition with visit count and spend history.
    - Automated branded marketing poster generator pairing favorite meals with new launches.

12. **Zero-Waste Surplus Deals (`src/components/SurplusDeals.tsx`)**
    - Evening discounted surplus food recovery.
    - Mandatory human chef safety verification rule before publishing deals.

13. **Super Admin Console (`src/components/SuperAdmin.tsx`)**
    - Multi-tenant governance with subscription matrix.
    - Configurable plans: Starter (₹5,599/mo), Growth (₹8,999/mo), Pro (₹14,999/mo), Enterprise (₹29,999/mo).

---

## 🛠️ Running the Application

Double-click `start.bat` or run:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.
Switch between all roles (Customer, Owner, Kitchen KDS, Cashier, Waiter, Super Admin) directly from the top navigation bar.
