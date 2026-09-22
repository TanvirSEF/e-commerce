"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Zap,
  Users,
  Settings,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Search,
  Store,
  LifeBuoy,
  BarChart3,
  BookOpen,
} from "lucide-react"

interface NavItem {
  title: string
  href?: string
  icon: React.ElementType
  badge?: string
  children?: { title: string; href: string }[]
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Products",
    icon: Package,
    children: [
      { title: "All Products", href: "/admin/products" },
      { title: "Add New Product", href: "/admin/products/create" },
      { title: "Categories", href: "/admin/categories" },
      { title: "Brands", href: "/admin/brands" },
    ],
  },
  {
    title: "Sales",
    icon: ShoppingBag,
    children: [
      { title: "All Orders", href: "/admin/orders" },
    ],
  },
  {
    title: "Sellers",
    icon: Store,
    children: [
      { title: "All Sellers", href: "/admin/sellers" },
      { title: "Payout Requests", href: "/admin/sellers/payout-requests" },
    ],
  },
  {
    title: "Marketing",
    icon: Zap,
    children: [
      { title: "Flash Deals", href: "/admin/flash-deals" },
      { title: "Coupons", href: "/admin/coupons" },
    ],
  },
  {
    title: "Reports",
    icon: BarChart3,
    children: [
      { title: "Sales Report", href: "/admin/reports/sales" },
      { title: "Stock Alert", href: "/admin/reports/stock" },
    ],
  },
  {
    title: "Support Tickets",
    href: "/admin/support-tickets",
    icon: LifeBuoy,
  },
  {
    title: "Blog System",
    href: "/admin/blogs",
    icon: BookOpen,
  },
  {
    title: "Customers",
    href: "/admin/customers",
    icon: Users,
  },
  {
    title: "Website Settings",
    href: "/admin/settings",
    icon: Settings,
  },
]

interface AdminSidebarProps {
  isOpen: boolean
  onClose?: () => void
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname()
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    Products: true,
    Sales: true,
  })
  const [searchQuery, setSearchQuery] = useState("")

  const toggleGroup = (title: string) => {
    setOpenGroups((prev) => ({ ...prev, [title]: !prev[title] }))
  }

  const filteredNav = navItems.filter((item) => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    if (item.title.toLowerCase().includes(q)) return true
    if (item.children?.some((c) => c.title.toLowerCase().includes(q))) return true
    return false
  })

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-[#1e293b] text-slate-300 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand / Logo Section */}
        <div className="h-16 flex items-center justify-between px-6 bg-[#0f172a] border-b border-slate-800">
          <Link href="/admin" className="flex items-center space-x-2">
            <span className="w-8 h-8 rounded bg-[#d43533] text-white font-black flex items-center justify-center text-lg">
              A
            </span>
            <div className="leading-tight">
              <span className="font-bold text-white text-base tracking-wide">ACTIVE</span>
              <span className="text-[10px] text-red-400 block font-semibold uppercase tracking-widest">
                ADMIN CMS
              </span>
            </div>
          </Link>
          <Link
            href="/"
            target="_blank"
            title="Browse Website"
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>

        {/* Menu Search (Active eCommerce style) */}
        <div className="p-4 border-b border-slate-800">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search in menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded text-xs pl-8 pr-3 py-1.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-slate-500"
            />
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
          {filteredNav.map((item) => {
            const Icon = item.icon
            const hasChildren = item.children && item.children.length > 0
            const isGroupOpen = !!openGroups[item.title]
            const isActive = item.href ? pathname === item.href : false
            const isChildActive = item.children?.some((c) => pathname === c.href)

            if (hasChildren) {
              return (
                <div key={item.title} className="space-y-0.5">
                  <button
                    type="button"
                    onClick={() => toggleGroup(item.title)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-md transition-colors ${
                      isChildActive
                        ? "text-white bg-slate-800/80"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-4 h-4 text-slate-400" />
                      <span>{item.title}</span>
                    </div>
                    {isGroupOpen ? (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                    )}
                  </button>

                  {isGroupOpen && (
                    <div className="pl-9 pr-2 space-y-0.5 pt-0.5">
                      {item.children?.map((sub) => {
                        const isSubActive = pathname === sub.href
                        return (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            onClick={onClose}
                            className={`block py-1.5 px-3 text-xs rounded transition-colors ${
                              isSubActive
                                ? "bg-[#d43533] text-white font-bold"
                                : "text-slate-400 hover:text-white hover:bg-slate-800/40"
                            }`}
                          >
                            {sub.title}
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            }

            return (
              <Link
                key={item.title}
                href={item.href || "#"}
                onClick={onClose}
                className={`flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-md transition-colors ${
                  isActive
                    ? "bg-[#d43533] text-white"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-4 h-4 text-slate-400" />
                  <span>{item.title}</span>
                </div>
              </Link>
            )
          })}
        </nav>

        {/* Admin Footer / Version info */}
        <div className="p-4 bg-[#0f172a] border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Active eCommerce v11.0</span>
          <span className="text-emerald-400 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Online
          </span>
        </div>
      </aside>
    </>
  )
}
