"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useCart } from "@/lib/context/cart-context"
import { formatPrice } from "@/lib/utils"
import { Tag, Check, AlertCircle } from "lucide-react"

export function CartSummaryBox() {
  const {
    selectedCount,
    selectedSubtotal,
    taxTotal,
    shippingTotal,
    couponDiscount,
    grandTotal,
    clubPoints,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useCart()

  const [couponCode, setCouponCode] = useState("")
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!couponCode.trim()) return
    const res = await applyCoupon(couponCode)
    if (res.success) {
      setFeedback({ type: "success", text: res.message })
      setCouponCode("")
    } else {
      setFeedback({ type: "error", text: res.message })
    }
  }


  const handleRemoveCoupon = () => {
    removeCoupon()
    setFeedback(null)
  }

  return (
    <div className="sticky top-24 rounded border border-gray-200 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-100 px-5 pt-4 pb-3">
        <h3 className="text-base font-bold text-gray-900">Order Summary</h3>
      </div>

      <div className="p-5">
        {/* Count & Clubpoint badges */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="flex items-center justify-between rounded bg-[#d43533] px-3 py-2 text-white">
            <span className="text-xs">Total Products</span>
            <span className="text-xs font-bold">{String(selectedCount).padStart(2, "0")}</span>
          </div>
          <div className="flex items-center justify-between rounded bg-[#ffc519] px-3 py-2 text-gray-900">
            <span className="text-xs font-medium">Clubpoint</span>
            <span className="text-xs font-bold">+{clubPoints} pts</span>
          </div>
        </div>

        {/* Pricing Table */}
        <div className="divide-y divide-gray-100 text-sm">
          <div className="flex justify-between py-2 text-gray-600">
            <span>Subtotal ({selectedCount} Products)</span>
            <span className="font-semibold text-gray-900">{formatPrice(selectedSubtotal)}</span>
          </div>

          <div className="flex justify-between py-2 text-gray-600">
            <span>Tax</span>
            <span className="font-semibold text-gray-900">{formatPrice(taxTotal)}</span>
          </div>

          <div className="flex justify-between py-2 text-gray-600">
            <span>Total Shipping</span>
            <span className="font-semibold text-gray-900">{formatPrice(shippingTotal)}</span>
          </div>

          {couponDiscount > 0 && (
            <div className="flex justify-between py-2 text-emerald-600">
              <span className="flex items-center gap-1">
                <Tag className="h-3.5 w-3.5" />
                Coupon Discount ({appliedCoupon?.code})
              </span>
              <span className="font-bold">-{formatPrice(couponDiscount)}</span>
            </div>
          )}

          <div className="flex items-baseline justify-between pt-3 pb-1">
            <span className="text-sm font-bold uppercase text-gray-900">Total</span>
            <span className="text-xl font-extrabold text-[#d43533]">{formatPrice(grandTotal)}</span>
          </div>
        </div>

        {/* Coupon Code Input */}
        <div className="mt-5 border-t border-gray-100 pt-4">
          {appliedCoupon ? (
            <div className="flex items-center justify-between rounded border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs">
              <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
                <Check className="h-4 w-4 text-emerald-600" />
                <span>Coupon Applied: <strong>{appliedCoupon.code}</strong></span>
              </div>
              <button
                type="button"
                onClick={handleRemoveCoupon}
                className="text-xs font-bold text-red-600 hover:underline"
              >
                Change
              </button>
            </div>
          ) : (
            <form onSubmit={handleApplyCoupon} className="space-y-2">
              <div className="flex rounded border border-gray-200 overflow-hidden">
                <input
                  type="text"
                  placeholder="Have coupon code? Apply here"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs text-gray-800 placeholder-gray-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-[#d43533] px-4 py-2 text-xs font-bold text-white hover:bg-[#9d1b1a] transition-colors"
                >
                  Apply
                </button>
              </div>

              {feedback && (
                <div
                  className={`flex items-center gap-1 text-[11px] ${
                    feedback.type === "success" ? "text-emerald-600" : "text-red-500"
                  }`}
                >
                  {feedback.type === "success" ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <AlertCircle className="h-3.5 w-3.5" />
                  )}
                  <span>{feedback.text}</span>
                </div>
              )}
            </form>
          )}
        </div>

        {/* Checkout Button */}
        <div className="mt-5">
          {selectedCount > 0 ? (
            <Link
              href="/checkout"
              className="flex w-full items-center justify-center rounded bg-[#d43533] py-3 text-sm font-bold text-white transition-colors hover:bg-[#9d1b1a] shadow-sm"
            >
              Proceed to Checkout ({String(selectedCount).padStart(2, "0")})
            </Link>
          ) : (
            <button
              disabled
              className="flex w-full items-center justify-center rounded bg-gray-200 py-3 text-sm font-bold text-gray-400 cursor-not-allowed"
            >
              Select items to checkout
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
