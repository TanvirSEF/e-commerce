"use client"

import React from "react"
import Link from "next/link"
import { Plus } from "lucide-react"

interface AuctionProductsNavTabsProps {
  activeType: "all" | "inhouse" | "seller"
  counts?: {
    all?: number
    inhouse?: number
    seller?: number
  }
}

export function AuctionProductsNavTabs({
  activeType,
  counts = { all: 0, inhouse: 0, seller: 0 },
}: AuctionProductsNavTabsProps) {
  const tabs = [
    { type: "all", label: "All Products", count: counts?.all ?? 0, href: "/admin/auction/all-products" },
    { type: "inhouse", label: "Inhouse Products", count: counts?.inhouse ?? 0, href: "/admin/auction/inhouse-products" },
    { type: "seller", label: "Seller Products", count: counts?.seller ?? 0, href: "/admin/auction/seller-products" },
  ]

  return (
    <div className="flex items-center justify-between flex-wrap border-b border-gray-200 px-5 pt-3 pb-0 gap-3">
      {/* Tabs */}
      <div className="flex items-center gap-6 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = activeType === tab.type
          return (
            <Link
              key={tab.type}
              href={tab.href}
              className={`pb-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors ${
                isActive
                  ? "border-[#d43533] text-[#d43533]"
                  : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
            >
              {tab.label} <span className="opacity-70 font-normal">({tab.count})</span>
            </Link>
          )
        })}
      </div>

      {/* Right: Add New Button matching Active eCommerce */}
      <div className="pb-2">
        <Link
          href="/admin/auction/products/create"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-white bg-[#d43533] hover:bg-[#b82a28] shadow-xs transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Product</span>
        </Link>
      </div>
    </div>
  )
}
