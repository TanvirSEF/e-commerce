"use client"

import { useState } from "react"
import Link from "next/link"
import { Tag, Copy, Check, Calendar } from "lucide-react"
import { SeedCoupon } from "@/db/seed/data"

interface CouponsViewProps {
  coupons: SeedCoupon[]
}

export function CouponsView({ coupons }: CouponsViewProps) {
  const [filter, setFilter] = useState<"all" | "cart_base" | "product_base">("all")
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const filteredCoupons = coupons.filter(
    (c) => filter === "all" || c.type === filter
  )

  return (
    <div className="bg-[#f2f3f8] min-h-screen py-6">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">All Coupons</h1>
            <div className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
              <Link href="/" className="hover:text-primary transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-gray-800 font-semibold">&ldquo;All Coupons&rdquo;</span>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 bg-white p-1 rounded-md border border-gray-200 self-start sm:self-auto">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                filter === "all"
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              All Coupons
            </button>
            <button
              onClick={() => setFilter("cart_base")}
              className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                filter === "cart_base"
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Cart Discounts
            </button>
            <button
              onClick={() => setFilter("product_base")}
              className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                filter === "product_base"
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Product Discounts
            </button>
          </div>
        </div>

        {/* Coupons Grid */}
        <div className="bg-white rounded border border-gray-200 p-4 sm:p-6 shadow-xs">
          {filteredCoupons.length === 0 ? (
            <div className="text-center py-16">
              <Tag className="size-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No coupons found for this filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCoupons.map((coupon) => {
                const isCopied = copiedCode === coupon.code
                const endDate = new Date(coupon.endDate).toLocaleDateString("en-GB")

                return (
                  <div
                    key={coupon.id}
                    className="relative bg-white rounded-lg border-2 border-dashed border-red-200 p-5 shadow-xs overflow-hidden flex flex-col justify-between hover:border-primary transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold bg-red-100 text-primary uppercase">
                          {coupon.type === "cart_base" ? "Cart Discount" : "Product Discount"}
                        </span>
                        <div className="text-2xl font-black text-gray-900 mt-2">
                          {coupon.discountType === "percent"
                            ? `${coupon.discount}% OFF`
                            : `৳${coupon.discount} OFF`}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Min Spend:{" "}
                          <span className="font-semibold text-gray-800">৳{coupon.minBuy}</span>
                        </p>
                      </div>

                      <div className="p-2 rounded-full bg-red-50 text-primary">
                        <Tag className="size-6" />
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-dashed border-gray-200 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                        <Calendar className="size-3.5 text-gray-400" />
                        <span>Valid till {endDate}</span>
                      </div>

                      <button
                        onClick={() => handleCopy(coupon.code)}
                        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded text-xs font-bold transition-all shadow-xs ${
                          isCopied
                            ? "bg-green-600 text-white"
                            : "bg-primary hover:bg-primary/90 text-white"
                        }`}
                      >
                        {isCopied ? (
                          <>
                            <Check className="size-3.5" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="size-3.5" />
                            <span>{coupon.code}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
