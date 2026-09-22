# Product Requirements Document (PRD)
## Active eCommerce CMS (Laravel) to Next.js 16 Full-Stack Migration

---

## 1. Executive Summary & Objective

This project is a complete, pixel-perfect, feature-complete migration of **Active eCommerce CMS (v11.0.0, Laravel 10 full-stack)** to **Next.js 16 (App Router) + React 19 + Tailwind CSS + shadcn UI + MongoDB**.

The primary directives are:
1. **1:1 Pixel-Perfect UI Match**: Match the Active eCommerce CMS interface layout, styling, colors, and behavior exactly with zero arbitrary visual redesign.
2. **Component Modularity & Cleanliness**: Maintain clean, human-written, readable code with strict component encapsulation. Every component file must remain between **300 to 400 lines maximum**, splitting into dedicated subcomponents within that page's component folder whenever needed.
3. **SSR & CSR Strategy**: Maintain Server-Side Rendering (SSR) for SEO, initial page renders, and server data fetching. Use Client Components (`"use client"`) strategically for interactive UI widgets (cart drawers, countdown timers, quantity selectors, filter facets, checkout state).
4. **Database Migration to MongoDB**: Transition from relational MySQL (`shop.sql`) to document-based MongoDB (Mongoose models) using the provided MongoDB Atlas cluster.
5. **Phase-wise Execution**: Deliver the frontend UI and user journey with high fidelity first, supported by realistic mock/initial data, and progressively wire up live MongoDB schemas, Server Actions, REST APIs, and third-party integrations (payments & couriers).

---

## 2. Tech Stack & Environment

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 16.3.4 (Turbopack, App Router) |
| **Language** | TypeScript 5 (Strict Mode) |
| **Frontend Core** | React 19.2.8 |
| **Styling** | Tailwind CSS v4 (`@tailwindcss/postcss`) + OKLCH / CSS custom properties |
| **UI Components** | shadcn UI (`radix-nova` style) + Radix UI Primitives |
| **Icons & Assets** | Line Awesome + Lucide React + SVG Icons |
| **State Management** | React Context / Zustand / URL search parameters for filter state |
| **Database** | MongoDB Atlas via Mongoose |
| **Package Manager** | `pnpm` |

---

## 3. Database & Connection Configuration

- **Database**: MongoDB Atlas (`ecommerce` database)
- **Connection URI**: Stored securely in `.env.local` as `MONGODB_URI`
  ```env
  MONGODB_URI=mongodb+srv://huippertechnology_db_user:KJAvHh3YTzZMfRVp@cluster0.dnihrth.mongodb.net/ecommerce?appName=Cluster0
  NEXT_PUBLIC_APP_NAME="Active eCommerce"
  NEXT_PUBLIC_APP_URL="http://localhost:3000"
  ```

### Core MongoDB Schemas (Mapped from Active eCommerce MySQL):
1. **User**: Name, email, phone, password (bcrypt), user_type (`customer`, `admin`, `seller`, `delivery_boy`), avatar, email_verified_at, phone_verified_at, addresses.
2. **Category**: Name, slug, icon, banner, parent_id, order_level, featured, hot_category, commission_rate.
3. **Brand**: Name, logo, slug, meta_title, meta_description.
4. **Product**: Name, slug, sku, category_id, brand_id, photos, thumbnail_img, unit_price, purchase_price, discount, discount_type, current_stock, unit, rating, description, colors, choice_options, variations, featured, todays_deal, published, approved.
5. **FlashDeal**: Title, start_date, end_date, status, featured, background_color, text_color, banner, slug, products (array with discount and discount_type).
6. **Cart**: User ID or Guest Session ID, items array (`product_id`, `variation`, `price`, `tax`, `shipping_cost`, `quantity`).
7. **Order & OrderDetail**: Combined order code, user_id, shipping_address, delivery_status, payment_type, payment_status, grand_total, coupon_discount, items array, tracking_code.
8. **BusinessSetting**: Key-value pairs for site settings, colors, header/footer elements, slider images, social links, currency, languages.
9. **Review**: Product ID, user ID, rating, comment, status, photos.
10. **Coupon**: Type, code, details, discount, discount_type, start_date, end_date, min_buy, max_discount.

---

## 4. UI Architecture & Component Guidelines

### Rule 1: Page-to-Component Hierarchy
Pages in `app/` should be lightweight orchestrators that handle:
- Route params and search params
- Metadata generation (`generateMetadata`)
- SSR data fetching or database queries
- Importing and composing feature components

### Rule 2: 300–400 Line Max per Component File
When a component reaches ~300 lines, decompose it into subcomponents inside a local `components/` subfolder:
```plaintext
app/
├── (shop)/
│   ├── page.tsx                     # Main Home Page (< 150 lines)
│   └── _components/                 # Home-specific components
│       ├── home-slider.tsx          # Carousel banner (< 300 lines)
│       ├── home-category-menu.tsx   # Sidebar category navigation (< 350 lines)
│       ├── flash-deal-section.tsx   # Countdown timer + product grid (< 300 lines)
│       ├── featured-categories.tsx  # Icon grid (< 250 lines)
│       ├── best-selling-section.tsx # Best selling products carousel/grid (< 300 lines)
│       ├── promo-banners.tsx        # Responsive grid banners (< 200 lines)
│       └── home-category-section.tsx# Category banner + products block (< 350 lines)
```

### Rule 3: Rendering Boundary (SSR vs CSR)
- **Server Components (Default)**: Layouts, Static text, Initial product lists, SEO content, Category menus, Footer.
- **Client Components (`"use client"`)**:
  - `Header`: Mobile hamburger toggle, language/currency select dropdowns, search auto-complete popover, user account flyout.
  - `CartDrawer` / `CartDropdown`: Live badge count, real-time total, item removal.
  - `ProductCard`: Hover animations, "Quick View" modal trigger, "Add to Cart" action.
  - `ProductDetails`: Image gallery zoom & thumbnail switcher, variant selector (colors/sizes), quantity stepper.
  - `FilterSidebar`: Collapsible facets, price slider, instant checkbox state.
  - `CheckoutForm`: Step transitions, address selection, payment option selection.

---

## 5. Scope of Customer-Facing Pages & Features

1. **Global Header & Navigation**:
   - Top Bar: Language switcher, Currency switcher, "Become a Seller", Helpline phone.
   - Middle Header: Mobile menu trigger, Brand Logo, Search bar with search suggestions, Compare & Wishlist counters, Notification popover, Login/Registration or User Profile pill.
   - Bottom Nav: All Categories toggle / Megamenu, Main Nav Links (Home, Flash Sale, Blogs, Brands, Categories, Coupons), Cart Dropdown widget.
   - Mobile Sticky Bottom Nav: Home, Categories, Cart (with badge), Wishlist/Notifications, Account.
2. **Homepage**:
   - Hero Banner Carousel + Category Sidebar.
   - Flash Deals section with dynamic countdown timer (Days : Hours : Mins : Secs).
   - Featured Categories card grid.
   - Best Selling Products slider/grid.
   - Banner advertisements (2-column & 3-column promo banners).
   - Dynamic Category Sections (Computers & Accessories, Fashion, Phones, etc.).
   - Top 10 / Best Rated Products list.
3. **Product Catalog & Search Page (`/products`, `/category/[slug]`, `/search`)**:
   - Breadcrumbs navigation.
   - Collapsible filter sidebar: Categories tree, Price Range, Brands, Colors, Attributes, Rating.
   - Top sorting bar: Grid / List view toggle, total count, sort by (Newest, Price: Low to High, Price: High to Low, Rating).
   - Product Grid with pagination.
4. **Product Details Page (`/product/[slug]`)**:
   - High-fidelity image gallery with thumbnail navigation.
   - Title, Rating stars, Review count, Brand, In-stock badge.
   - Price, discount badge, wholesale pricing table (if applicable), club points.
   - Interactive Color swatches & Size/Attribute pills.
   - Quantity selector (+/-) with max stock validation.
   - Action buttons: "Add to Cart", "Buy Now", "Add to Wishlist", "Compare".
   - Seller card & Shop info.
   - Tabs: Description, Specifications, Video, Reviews & Ratings with star breakdown.
   - "Related Products" & "Top Selling From This Seller" carousels.
5. **Cart & Checkout Journey (`/cart`, `/checkout`)**:
   - Cart item list: image, title, variant, unit price, quantity stepper, subtotal, remove button.
   - Cart summary: Subtotal, Estimated Tax, Coupon code input & apply button, Total.
   - Multi-step checkout:
     - Step 1: Shipping Address (Select saved address or add new with modal).
     - Step 2: Delivery & Shipping option.
     - Step 3: Payment Method (UddoktaPay, bKash/Nagad/SSLCommerz, Cash on Delivery, Credit Card).
     - Step 4: Order Confirmation & Receipt.
6. **Order Tracking (`/track-order`)**:
   - Tracking code input.
   - Visual progress timeline: Order Placed -> Confirmed -> Picked -> On the Way -> Delivered.
7. **User Authentication & Dashboard (`/login`, `/register`, `/dashboard`)**:
   - Clean authentication modal / page matching Active eCommerce layout.
   - User Dashboard: Purchase history, Downloadable products, Wishlist, Addresses, Account settings.

---

## 6. Implementation Milestones & Checklist

- [x] **Milestone 1: Project Setup & MongoDB Connection**
  - [x] Add `.env.local` with MongoDB Atlas connection string.
  - [x] Install `mongoose` and core helper packages.
  - [x] Setup singleton MongoDB client in `lib/mongodb.ts`.
  - [x] Define core Mongoose schemas in `lib/models/`.
  - [x] Configure `AGENTS.md` and project conventions.
- [x] **Milestone 2: Design System & Shared Layout**
  - [x] Import Active eCommerce colors & design tokens into `globals.css`.
  - [x] Integrate Line Awesome icon styles & necessary SVG icons.
  - [x] Build TopBar component (`components/layout/top-bar.tsx`).
  - [x] Build MiddleHeader with search bar & actions (`components/layout/middle-header.tsx`).
  - [x] Build BottomNavbar & Category Megamenu (`components/layout/bottom-navbar.tsx`).
  - [x] Build Footer with newsletter, links & payment icons (`components/layout/footer.tsx`).
  - [x] Build Mobile Bottom Navigation (`components/layout/mobile-bottom-nav.tsx`).
  - [x] Build Cart Offcanvas / Flyout drawer (`components/cart/cart-drawer.tsx`).
- [x] **Milestone 3: 1:1 Homepage Conversion**
  - [x] Hero Slider & Categories Sidebar.
  - [x] Flash Deals countdown section.
  - [x] Featured Categories grid.
  - [x] Best Selling products carousel.
  - [x] Promotional banners.
  - [x] Category-specific product blocks.
- [x] **Milestone 4: Product Catalog & Listing Page**
  - [x] Category & search routing (`/products`, `/category/[slug]`).
  - [x] Responsive filter sidebar (Price, Brands, Attributes, Rating).
  - [x] Product Card reusable component (`components/ui/product-card.tsx`).
  - [x] Pagination & sorting controls.
- [x] **Milestone 5: Product Details Page**
  - [x] Dynamic product route (`/product/[slug]`).
  - [x] Gallery component with thumbnails and active preview.
  - [x] Variant options selector (Colors, Sizes).
  - [x] Stock, price calculation & Cart actions.
  - [x] Product tabs (Description, Reviews, Seller info).
  - [x] Related products section.
- [x] **Milestone 6: Cart, Checkout & Order Tracking**
  - [x] Client Cart Store / Context with persistence.
  - [x] Full `/cart` page with quantity updates & coupon support.
  - [x] Multi-step `/checkout` page with address management & payment options.
  - [x] `/order-confirmed/[code]` confirmation view.
  - [x] `/track-order` status tracking view.
- [x] **Milestone 7: Auth & Customer Dashboard**
  - [x] Login & Register pages / dialogs.
  - [x] Customer dashboard layout with sidebar.
  - [x] Purchase history table with order details modal.
  - [x] Wishlist & address management views.
- [x] **Milestone 8: Data Seeding & API Endpoints**
  - [x] Seed script (`scripts/seed.ts` via `pnpm db:seed`) to populate MongoDB Atlas from Active eCommerce defaults.
  - [x] Resilient database service (`lib/data-service.ts`) with MongoDB Mongoose query & fallback.
  - [x] REST API routes (`/api/products`, `/api/products/[slug]`, `/api/categories`, `/api/brands`, `/api/orders`, `/api/auth`).
  - [x] Wired Server Components (`HomePage`, `ProductsPage`, `ProductDetailsPage`, `TrackOrderView`) to live data service.
- [ ] **Milestone 9: Admin Management & Seller Panel**
  - [ ] Admin dashboard layout, KPI metrics, product management, category & brand manager.
  - [ ] Seller portal with shop settings, product upload, and earnings breakdown.
  - [ ] Payment gateway webhooks & live courier status sync.

