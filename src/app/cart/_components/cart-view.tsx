"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useCart } from "@/lib/context/cart-context"
import { CartItemRow } from "./cart-item-row"
import { CartSummaryBox } from "./cart-summary-box"
import { ShoppingBag, ChevronRight, Copy, Check } from "lucide-react"

export function CartView() {
  const {
    items,
    totalCount,
    toggleSelectAll,
    toggleSellerItems,
  } = useCart()

  const [copied, setCopied] = useState(false)

  const allSelected = items.length > 0 && items.every((i) => i.selected)

  const handleCopyCoupon = () => {
    navigator.clipboard.writeText("WELCOME10")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Group items by seller
  const groupedSellers = items.reduce<Record<string, typeof items>>((acc, item) => {
    const seller = item.sellerName || "Inhouse Products"
    if (!acc[seller]) acc[seller] = []
    acc[seller].push(item)
    return acc
  }, {})

  return (
    <div className="bg-[#f8f9fa] min-h-[70vh] py-6 sm:py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Breadcrumb */}
        <nav className="mb-4 flex items-center gap-1.5 text-xs text-gray-500">
          <Link href="/" className="hover:text-[#d43533] transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3 w-3 text-gray-400" />
          <span className="font-semibold text-gray-800">Shopping Cart</span>
        </nav>

        {items.length === 0 ? (
          <div className="rounded border border-gray-200 bg-white p-8 sm:p-12 text-center shadow-sm max-w-2xl mx-auto my-8">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-[#d43533] mb-4">
              <ShoppingBag className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Your Cart is empty</h3>
            <p className="mt-2 text-sm text-gray-500">
              Explore our wide variety of products and add your favorites to the cart!
            </p>
            <div className="mt-6">
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded bg-[#d43533] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#9d1b1a]"
              >
                Return to Shop
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Welcome Coupon Alert */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded border border-[#3490F3] bg-blue-50/50 p-4">
              <div className="text-xs sm:text-sm text-[#1967d2]">
                Welcome Coupon <strong>10%</strong> Discount on your Purchase Within{" "}
                <strong>30</strong> days of Registration (Code: <strong>WELCOME10</strong>)
              </div>
              <button
                type="button"
                onClick={handleCopyCoupon}
                className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-full bg-[#3490F3] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-600 transition-colors shadow-sm"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied!" : "Copy Coupon Code"}
              </button>
            </div>

            {/* Cart Layout: Left Products Table + Right Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column (8 cols) */}
              <div className="lg:col-span-8 rounded border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
                {/* Select All Checkbox */}
                <div className="border-b border-gray-100 pb-3 mb-3">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={(e) => toggleSelectAll(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-[#d43533] focus:ring-[#d43533] cursor-pointer"
                    />
                    <span className="text-sm font-semibold text-gray-700">
                      Select All ({totalCount} items)
                    </span>
                  </label>
                </div>

                {/* Seller Grouped Items */}
                <div className="space-y-6">
                  {Object.entries(groupedSellers).map(([sellerName, sellerItems]) => {
                    const allSellerSelected = sellerItems.every((i) => i.selected)
                    return (
                      <div key={sellerName} className="space-y-2">
                        {/* Seller Header */}
                        <div className="flex items-center gap-2.5 border-b border-dashed border-gray-200 pb-2">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={allSellerSelected}
                              onChange={(e) => toggleSellerItems(sellerName, e.target.checked)}
                              className="h-4 w-4 rounded border-gray-300 text-[#d43533] focus:ring-[#d43533] cursor-pointer"
                            />
                            <span className="text-sm font-bold text-gray-900">
                              {sellerName} ({sellerItems.length})
                            </span>
                          </label>
                        </div>

                        {/* Product Rows */}
                        <div className="divide-y divide-gray-100">
                          {sellerItems.map((item) => (
                            <CartItemRow key={item.id} item={item} />
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Right Column (4 cols) */}
              <div className="lg:col-span-4">
                <CartSummaryBox />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
