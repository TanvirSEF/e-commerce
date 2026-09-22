# Active eCommerce — Next.js 16 & MongoDB Migration

A complete, high-fidelity migration of **Active eCommerce CMS** to **Next.js 16 (App Router) + React 19 + Tailwind CSS + shadcn UI + MongoDB**.

## 🚀 Key Features

- **1:1 Visual Fidelity**: Pixel-perfect replication of Active eCommerce CMS Classic Theme layout, colors, and styling.
- **Modern Full-Stack Architecture**: Next.js 16 with Turbopack, React 19 Server Components (SSR) for optimal performance and SEO.
- **Strict Component Sizing**: Modular components decomposed into subcomponents strictly under 300–400 lines.
- **Database**: MongoDB Atlas with singleton Mongoose client and structured schemas (Products, Categories, Orders, Users, Carts, Flash Deals, etc.).
- **Shopping Flow**:
  - Live Flash Deals section with dynamic countdown timer.
  - Interactive Search with instant popular search recommendations.
  - Offcanvas Shopping Cart Drawer with real-time quantity adjustments and subtotal calculation.
  - Responsive multi-device navigation (Top Bar, Middle Header, Bottom Categories Bar, Mobile Sidebar Drawer, and Sticky Bottom Navigation).

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Library**: [React 19](https://react.dev/)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4 & CSS Variables
- **UI Primitives**: [shadcn UI](https://ui.shadcn.com/) & Radix UI
- **Database / ORM**: MongoDB Atlas & Mongoose
- **Icons**: Line Awesome & Lucide React

## 📦 Getting Started

### 1. Clone the repository
```bash
git clone git@github.com:TanvirSEF/e-commerce.git
cd e-commerce
```

### 2. Install dependencies
```bash
pnpm install
```

### 3. Setup environment variables
Copy `.env.example` to `.env.local` and configure your MongoDB connection string:
```bash
cp .env.example .env.local
```

### 4. Run development server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📋 Project Documentation
- Refer to [PRD.md](./PRD.md) for milestone tracking, architecture guidelines, and roadmap details.
- Refer to [AGENTS.md](./AGENTS.md) for coding conventions and component constraints.
