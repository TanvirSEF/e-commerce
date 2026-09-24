"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  DollarSign,
  Store,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  LifeBuoy,
  Tag,
  MessageSquare,
  ShieldCheck,
  X,
} from "lucide-react"

interface NavItem {
  title: string
  href?: string
  icon: React.ElementType
  children?: { title: string; href: string }[]
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/seller/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Products",
    icon: Package,
    children: [
      { title: "All Products", href: "/seller/products" },
      { title: "Add New Product", href: "/seller/products/create" },
      { title: "Bulk Upload", href: "/seller/product-bulk-upload" },
    ],
  },
  {
    title: "Orders",
    href: "/seller/orders",
    icon: ShoppingBag,
  },
  {
    title: "Custom Labels",
    href: "/seller/custom-labels",
    icon: Tag,
  },
  {
    title: "My Coupons",
    href: "/seller/coupons",
    icon: Tag,
  },
  {
    title: "Commission History",
    href: "/seller/commission-history",
    icon: DollarSign,
  },
  {
    title: "Payout Requests",
    href: "/seller/payouts",
    icon: DollarSign,
  },
  {
    title: "Shop Settings",
    href: "/seller/shop",
    icon: Store,
  },
  {
    title: "Shop Verification",
    href: "/seller/verify",
    icon: ShieldCheck,
  },
  {
    title: "Support Tickets",
    href: "/seller/support",
    icon: LifeBuoy,
  },
  {
    title: "Conversations",
    href: "/seller/conversations",
    icon: MessageSquare,
  },
]

interface SellerSidebarProps {
  isOpen: boolean
  onClose?: () => void
}

export function SellerSidebar({ isOpen, onClose }: SellerSidebarProps) {
  const pathname = usePathname()
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({ Products: true })

  const toggleGroup = (title: string) => {
    setOpenGroups((prev) => ({ ...prev, [title]: !prev[title] }))
  }

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
          <Link href="/seller/dashboard" className="flex items-center space-x-2">
            <span className="w-8 h-8 rounded bg-[#d43533] text-white font-black flex items-center justify-center text-lg">
              S
            </span>
            <div className="leading-tight">
              <span className="font-bold text-white text-base tracking-wide">SELLER</span>
              <span className="text-[10px] text-red-400 block font-semibold uppercase tracking-widest">
                MERCHANT PANEL
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-1">
            <Link
              href="/"
              target="_blank"
              title="Browse Website"
              className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors lg:hidden"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon

            if (!item.children) {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.title}
                  href={item.href!}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors group ${
                    isActive
                      ? "bg-[#d43533] text-white"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {item.title}
                </Link>
              )
            }

            const isGroupActive = item.children.some((c) => pathname === c.href)
            const isOpen = openGroups[item.title] ?? isGroupActive

            return (
              <div key={item.title}>
                <button
                  onClick={() => toggleGroup(item.title)}
                  className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    isGroupActive
                      ? "bg-slate-800 text-white"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    {item.title}
                  </span>
                  {isOpen ? (
                    <ChevronDown className="w-3.5 h-3.5 shrink-0" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="mt-1 ml-7 space-y-0.5">
                    {item.children.map((child) => {
                      const isChildActive = pathname === child.href
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={onClose}
                          className={`block px-3 py-2 rounded text-[13px] transition-colors ${
                            isChildActive
                              ? "bg-[#d43533]/20 text-red-400 font-semibold"
                              : "text-slate-500 hover:text-white hover:bg-slate-800"
                          }`}
                        >
                          {child.title}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        {/* Bottom profile shortcut */}
        <div className="border-t border-slate-800 p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#d43533] flex items-center justify-center text-white font-bold text-sm">
              S
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-white truncate">Active Fashion Outlet</div>
              <div className="text-[10px] text-slate-400 truncate">seller@example.com</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
