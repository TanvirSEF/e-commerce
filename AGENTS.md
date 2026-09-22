<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Senior Developer Guidelines: Active eCommerce Migration

## 1. Core Principles & Philosophy
- **Fidelity First**: Zero visual drift. Match the Active eCommerce CMS UI (colors, typography, spacing, component layout, and behavior) 1:1.
- **Clean & Human-Written Code**: Write idiomatic, self-documenting TypeScript and React code. Avoid over-engineering, deeply nested callbacks, or unnecessary abstractions.
- **Strict Component Size Limit**: Every component file **must not exceed 300–400 lines**. If a component exceeds 300 lines, immediately decompose it into focused subcomponents under that feature's `_components/` directory.

## 2. Rendering Strategy (SSR vs CSR)
- **Server Components (RSC) by Default**:
  - Keep page routes (`app/**/page.tsx`) and static layout containers as Server Components.
  - Fetch database data (MongoDB / Mongoose) directly in Server Components or Server Actions where possible for SEO and performance.
- **Client Components (`"use client"`)**:
  - Confine `"use client"` strictly to interactive leaves (modals, dropdowns, cart state, filter inputs, quantity counters, checkout forms).
  - Never mark an entire page as `"use client"` unless the entire route is purely an interactive client-driven application.

## 3. Directory & File Organization
```plaintext
app/
├── (shop)/
│   ├── page.tsx                      # Root Home Page (SSR)
│   ├── _components/                  # Homepage-specific subcomponents (< 350 lines each)
│   ├── products/
│   │   ├── page.tsx                  # Product catalog & filters (SSR + CSR subcomponents)
│   │   └── _components/
│   ├── product/[slug]/
│   │   ├── page.tsx                  # Product details page (SSR)
│   │   └── _components/
│   ├── cart/page.tsx                 # Cart view
│   ├── checkout/page.tsx             # Multi-step checkout view
│   ├── track-order/page.tsx          # Order tracking view
│   └── dashboard/                    # Customer account portal
components/
├── layout/                           # Global layout components (TopBar, Header, Nav, Footer)
├── ui/                               # Reusable shadcn & base UI primitives (Button, Card, Input)
├── product/                          # Shared product cards, ratings, badges
└── cart/                             # Shared cart drawer, floating buttons
lib/
├── mongodb.ts                        # Singleton Mongoose connection helper
├── models/                           # Mongoose schemas (User, Product, Category, Order, etc.)
└── utils.ts                          # Formatting, currency, cn helper
```

## 4. Database Rules (MongoDB)
- Always use the singleton connection pattern in `lib/mongodb.ts` to prevent connection exhaustion during Next.js hot-reloads in development.
- Maintain schema consistency matching the original Active eCommerce database entities (`shop.sql`).
- Sensitive connection strings and secrets must always remain in `.env.local` and never be hardcoded.

## 5. Project Roadmap Tracking
Refer to [PRD.md](file:///Users/macminim2/Desktop/Huipper/e-commerce/PRD.md) for milestone checklists and detailed technical requirements.
