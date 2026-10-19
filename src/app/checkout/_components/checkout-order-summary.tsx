"use client"

import React, { useState } from "react"
import { useCart } from "@/lib/context/cart-context"
import { formatPrice } from "@/lib/utils"
import { Tag, Check, X, Loader2 } from "lucide-react"
import type { AddressData } from "./shipping-step"

interface CheckoutOrderSummaryProps {
  selectedAddress?: AddressData
}

export function CheckoutOrderSummary({ selectedAddress }: CheckoutOrderSummaryProps) {
  const {
    selectedCount,
    selectedSubtotal,
    shippingTotal,
    taxTotal,
    couponDiscount,
    grandTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useCart()

  const [couponCode, setCouponCode] = useState("")
  const [applying, setApplying] = useState(false)
  const [couponFeedback, setCouponFeedback] = useState<{
    success: boolean
    message: string
  } | null>(null)

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault()
    const clean = couponCode.trim()
    if (!clean) return

    setApplying(true)
    setCouponFeedback(null)
    try {
      const res = await applyCoupon(clean)
      setCouponFeedback({
        success: res.success,
        message: res.message,
      })
      if (res.success) {
        setCouponCode("")
      }
    } finally {
      setApplying(false)
    }
  }

  const handleRemoveCoupon = () => {
    removeCoupon()
    setCouponFeedback(null)
  }

  return (
    <div className="rounded border border-gray-200 bg-white p-5 shadow-sm space-y-4">
      <h4 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
        Order Summary
      </h4>

      {/* Coupon Application Box (Active eCommerce 1:1) */}
      <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50/70 p-3">
        {appliedCoupon ? (
          <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-3 py-2 rounded-md font-medium">
            <div className="flex items-center gap-1.5 truncate">
              <Check className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>
                Code <strong className="font-mono">{appliedCoupon.code}</strong> applied
              </span>
            </div>
            <button
              type="button"
              onClick={handleRemoveCoupon}
              className="text-gray-400 hover:text-red-600 transition-colors ml-2"
              title="Remove coupon"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleApplyCoupon} className="space-y-2">
            <label className="text-[11px] font-bold text-gray-700 flex items-center gap-1.5 uppercase tracking-wider">
              <Tag className="h-3 w-3 text-[#d43533]" /> Have a promo coupon?
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="w-full uppercase font-mono tracking-wider rounded border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-900 focus:border-[#d43533] focus:outline-hidden"
              />
              <button
                type="submit"
                disabled={applying || !couponCode.trim()}
                className="inline-flex items-center justify-center rounded bg-[#d43533] px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-[#9d1b1a] disabled:opacity-50 shrink-0"
              >
                {applying ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Apply"}
              </button>
            </div>
            {couponFeedback && (
              <p
                className={`text-[11px] font-medium mt-1 ${
                  couponFeedback.success ? "text-emerald-700" : "text-red-600"
                }`}
              >
                {couponFeedback.message}
              </p>
            )}
          </form>
        )}
      </div>

      {/* Financial Line Items */}
      <div className="divide-y divide-gray-100 text-sm">
        <div className="flex justify-between py-2 text-gray-600">
          <span>Subtotal ({selectedCount} items)</span>
          <span className="font-semibold text-gray-900">{formatPrice(selectedSubtotal)}</span>
        </div>
        <div className="flex justify-between py-2 text-gray-600">
          <span>Shipping</span>
          <span className="font-semibold text-gray-900">{formatPrice(shippingTotal)}</span>
        </div>
        <div className="flex justify-between py-2 text-gray-600">
          <span>Tax</span>
          <span className="font-semibold text-gray-900">{formatPrice(taxTotal)}</span>
        </div>
        {couponDiscount > 0 && (
          <div className="flex justify-between py-2 text-emerald-600">
            <span>Coupon Discount</span>
            <span className="font-bold">-{formatPrice(couponDiscount)}</span>
          </div>
        )}
        <div className="flex items-baseline justify-between pt-3 pb-1">
          <span className="text-sm font-bold uppercase text-gray-900">Total</span>
          <span className="text-xl font-extrabold text-[#d43533]">{formatPrice(grandTotal)}</span>
        </div>
      </div>

      {/* Delivery To pill */}
      {selectedAddress && (
        <div className="rounded bg-gray-50 p-3 text-xs text-gray-600 border border-gray-100">
          <div className="font-bold text-gray-800 mb-0.5">Shipping to:</div>
          <div className="line-clamp-2">
            {selectedAddress.name}, {selectedAddress.address}, {selectedAddress.city}
          </div>
        </div>
      )}
    </div>
  )
}
