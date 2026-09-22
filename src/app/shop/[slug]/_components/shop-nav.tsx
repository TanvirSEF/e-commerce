"use client"

import Link from "next/link"

interface ShopNavProps {
  shopSlug: string
  activeTab: string
  couponCount: number
}

export function ShopNav({ shopSlug, activeTab, couponCount }: ShopNavProps) {
  const tabs = [
    { key: "home", label: "Store Home", href: `/shop/${shopSlug}` },
    { key: "top-selling", label: "Top Selling", href: `/shop/${shopSlug}?tab=top-selling` },
    {
      key: "coupons",
      label: `Coupons ${couponCount > 0 ? `(${couponCount})` : ""}`,
      href: `/shop/${shopSlug}?tab=coupons`,
    },
    { key: "all-products", label: "All Products", href: `/shop/${shopSlug}?tab=all-products` },
  ]

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-xs">
      <div className="max-w-7xl mx-auto px-4">
        <nav className="flex items-center gap-2 sm:gap-6 overflow-x-auto no-scrollbar py-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key
            return (
              <Link
                key={tab.key}
                href={tab.href}
                className={`py-3.5 px-3 text-xs sm:text-sm font-bold whitespace-nowrap transition-colors border-b-2 ${
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
