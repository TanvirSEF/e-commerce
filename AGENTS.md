<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Senior Developer Guidelines: Huipper CodeCanyon Tech Stack Standard

## 1. Core Principles & Philosophy
- **Huipper Locked Baseline**: Next.js 16 + TypeScript + Node.js 24/26 + PostgreSQL 16 + Drizzle ORM + Better Auth + Tailwind CSS 4 + shadcn/ui + Radix UI + Lucide + Zod + React Hook Form.
- **Fidelity First**: Zero visual drift. Match the Active eCommerce CMS UI (colors, typography, spacing, component layout, and behavior) 1:1.
- **Clean & Human-Written Code**: Write idiomatic, self-documenting TypeScript and React code. Avoid over-engineering, deeply nested callbacks, or unnecessary abstractions.
- **Strict Component Size Limit**: Every component file **must not exceed 300–400 lines**. If a component exceeds 300 lines, immediately decompose it into focused subcomponents under that feature's `_components/` directory.

## 2. Rendering Strategy (SSR vs CSR)
- **Server Components (RSC) by Default**:
  - Keep page routes (`src/app/**/page.tsx`) and static layout containers as Server Components.
  - Fetch database data via Drizzle ORM services (`src/services/`) directly in Server Components or Server Actions for SEO and performance.
- **Client Components (`"use client"`)**:
  - Confine `"use client"` strictly to interactive leaves (modals, dropdowns, cart state, filter inputs, quantity counters, checkout forms).
  - Never mark an entire page as `"use client"` unless the entire route is purely an interactive client-driven application.

## 3. Directory & File Organization (Huipper Standard)
```plaintext
src/
├── app/
│   ├── (shop)/
│   │   ├── page.tsx                  # Root Home Page (SSR)
│   │   └── _components/              # Homepage-specific subcomponents (< 350 lines)
│   ├── (auth)/
│   │   ├── login/page.tsx            # Login view
│   │   └── register/page.tsx         # Registration view
│   ├── (dashboard)/
│   │   └── dashboard/                # Customer account portal
│   ├── products/                     # Product catalog & filters
│   ├── product/[slug]/               # Product details page (SSR)
│   ├── cart/page.tsx                 # Cart view
│   ├── checkout/page.tsx             # Multi-step checkout view
│   ├── track-order/page.tsx          # Order tracking view
│   ├── api/
│   │   ├── auth/[...all]/route.ts    # Better Auth route handler
│   │   ├── products/route.ts
│   │   ├── products/[slug]/route.ts
│   │   ├── categories/route.ts
│   │   ├── brands/route.ts
│   │   └── orders/route.ts
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                           # Reusable shadcn & base UI primitives
│   ├── layout/                       # Global TopBar, Header, Nav, Footer
│   ├── product/                      # Shared product cards, ratings, badges
│   └── cart/                         # Shared cart drawer, floating buttons
├── db/
│   ├── index.ts                      # PostgreSQL pool + Drizzle client singleton
│   ├── schema/                       # Drizzle schema (auth, products, orders, settings)
│   ├── migrations/                   # Drizzle migration files
│   └── seed/                         # Canonical seed data
├── lib/
│   ├── auth/                         # Better Auth server instance & client
│   ├── context/                      # Cart & Auth React contexts
│   └── utils.ts                      # Formatting, currency, cn helper
├── services/                         # Drizzle service layer (product, order, category, etc.)
└── config/                           # site.ts site settings
scripts/
├── setup.ts                          # Customer installer (pnpm run setup)
└── seed.ts                           # Database seeder
```

## 4. Database Rules (PostgreSQL + Drizzle ORM)
- Always use the singleton connection pool pattern in `src/db/index.ts`.
- Local development database runs in Docker via `docker-compose.yml` (`postgres:16-alpine` on port 5432).
- Use `drizzle-kit push` or `pnpm run setup` for database schema migration and seeding.
- Keep credentials in `.env.local` via `DATABASE_URL`.

## 5. Automated Customer Installer
- Any buyer can set up the project with a single command:
  ```bash
  pnpm run setup
  ```
  This automatically tests the database, applies schemas, seeds settings, catalog, and admin credentials.

## 6. Project Roadmap Tracking
Refer to [PRD.md](file:///Users/macminim2/Desktop/Huipper/e-commerce/PRD.md) for milestone checklists and detailed technical requirements.
