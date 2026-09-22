"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, ChevronDown, ShoppingBag } from "lucide-react"
import { useCart } from "@/lib/context/cart-context"

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Flash Sale", href: "/flash-deals" },
  { label: "Blogs", href: "/blogs" },
  { label: "All Brands", href: "/brands" },
  { label: "All Categories", href: "/categories" },
  { label: "Coupons", href: "/coupons" },
]

const SAMPLE_CATEGORIES = [
  { name: "Women Clothing & Fashion", slug: "women-clothing-fashion", icon: "👗" },
  { name: "Men Clothing & Fashion", slug: "men-clothing-fashion", icon: "👔" },
  { name: "Computer & Accessories", slug: "computer-accessories", icon: "💻" },
  { name: "Cellphones & Tabs", slug: "cellphones-tabs", icon: "📱" },
  { name: "Consumer Electronics", slug: "consumer-electronics", icon: "🎧" },
  { name: "Beauty, Health & Hair", slug: "beauty-health-hair", icon: "💄" },
  { name: "Sports & Outdoor", slug: "sports-outdoor", icon: "⚽" },
  { name: "Home & Garden", slug: "home-garden", icon: "🏡" },
]

export function BottomNavbar() {
  const pathname = usePathname()
  const { totalCount, subtotal, toggleCart } = useCart()
  const [categoriesOpen, setCategoriesOpen] = useState(false)

  return (
    <div className="relative z-20 hidden bg-[#00002e] text-white lg:block">
      <div className="mx-auto flex h-[50px] max-w-[1240px] items-center justify-between px-4">
        {/* Left: All Categories Button & Dropdown */}
        <div className="relative h-full">
          <button
            type="button"
            onClick={() => setCategoriesOpen(!categoriesOpen)}
            className="flex h-full w-[260px] items-center justify-between bg-black/25 px-4 font-semibold text-white transition-colors hover:bg-black/35"
          >
            <div className="flex items-center gap-2.5">
              <Menu className="h-4 w-4" />
              <span className="text-sm">Categories</span>
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${categoriesOpen ? "rotate-180" : ""}`} />
          </button>

          {/* Categories Dropdown Menu */}
          {categoriesOpen && (
            <div
              onMouseLeave={() => setCategoriesOpen(false)}
              className="absolute top-full left-0 z-50 w-[260px] border-t border-gray-100 bg-white py-1 shadow-2xl"
            >
              {SAMPLE_CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/products?category=${cat.slug}`}
                  onClick={() => setCategoriesOpen(false)}
                  className="flex items-center justify-between px-4 py-2.5 text-xs font-medium text-[#292933] transition-colors hover:bg-red-50 hover:text-[#d43533]"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{cat.icon}</span>
                    <span>{cat.name}</span>
                  </div>
                  <span className="text-gray-300">›</span>
                </Link>
              ))}
              <div className="border-t border-gray-100 p-2 text-center">
                <Link
                  href="/categories"
                  onClick={() => setCategoriesOpen(false)}
                  className="text-xs font-semibold text-[#3490f3] hover:underline"
                >
                  See All Categories →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Center: Main Nav Links */}
        <nav className="flex items-center gap-1 pl-4">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3.5 py-3 text-xs font-semibold tracking-wide transition-colors ${
                  isActive ? "text-[#ffc519]" : "text-white/90 hover:text-white"
                }`}
              >
                <span>{link.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-3.5 right-3.5 h-[3px] bg-[#ffc519]" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Right: Cart Button Widget */}
        <button
          type="button"
          onClick={toggleCart}
          className="group flex h-full items-center gap-3 bg-black/25 px-4 transition-colors hover:bg-black/35"
        >
          <div className="relative">
            <ShoppingBag className="h-5 w-5 text-[#ffc519]" />
            <span
              suppressHydrationWarning
              className="absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#d43533] text-[10px] font-bold text-white"
            >
              {totalCount}
            </span>
          </div>
          <div className="text-left text-xs">
            <div className="text-[10px] text-white/70">Cart</div>
            <div suppressHydrationWarning className="font-semibold text-white">
              ৳{subtotal.toLocaleString("en-BD")}
            </div>
          </div>
        </button>
      </div>
    </div>
  )
}

export default BottomNavbar
