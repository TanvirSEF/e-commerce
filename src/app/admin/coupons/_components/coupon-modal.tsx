"use client"

import React, { useState } from "react"
import { X } from "lucide-react"
import { SeedCoupon } from "@/db/seed/data"
import { createCouponAction } from "@/app/actions/ecommerce-actions"

interface CouponModalProps {
  isOpen: boolean
  onClose: () => void
  onCreated: (coupon: SeedCoupon) => void
}

export function CouponModal({ isOpen, onClose, onCreated }: CouponModalProps) {
  const [code, setCode] = useState("")
  const [type, setType] = useState<"cart_base" | "product_base">("cart_base")
  const [discount, setDiscount] = useState<number | "">("")
  const [discountType, setDiscountType] = useState<"percent" | "amount">("percent")
  const [minBuy, setMinBuy] = useState<number | "">("")
  const [maxDiscount, setMaxDiscount] = useState<number | "">("")
  const [startDateStr, setStartDateStr] = useState("")
  const [endDateStr, setEndDateStr] = useState("")
  const [submitting, setSubmitting] = useState(false)

  if (!isOpen) return null

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code || !discount || !startDateStr || !endDateStr) return

    setSubmitting(true)
    try {
      const start = new Date(startDateStr).getTime()
      const end = new Date(endDateStr).getTime()

      const res = await createCouponAction({
        code: code.trim().toUpperCase(),
        type,
        discount: Number(discount),
        discountType,
        minBuy: Number(minBuy || 0),
        maxDiscount: Number(maxDiscount || 0),
        startDate: start,
        endDate: end,
      })

      if (res.coupon) {
        onCreated(res.coupon)
      }
      onClose()
      setCode("")
      setDiscount("")
      setMinBuy("")
      setMaxDiscount("")
      setStartDateStr("")
      setEndDateStr("")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-sm font-bold text-gray-900">Create New Coupon</h2>
          <button
            onClick={onClose}
            className="p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={handleCreateCoupon} className="p-4 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Coupon Code *</label>
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. SUMMER50"
              className="w-full px-3 py-2 border border-gray-200 rounded focus:border-primary uppercase font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Coupon Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-200 rounded focus:border-primary"
              >
                <option value="cart_base">Cart Base</option>
                <option value="product_base">Product Base</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Discount Type</label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-200 rounded focus:border-primary"
              >
                <option value="percent">Percentage (%)</option>
                <option value="amount">Flat Amount (৳)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Discount *</label>
              <input
                type="number"
                required
                min={1}
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
                placeholder="Amount"
                className="w-full px-3 py-2 border border-gray-200 rounded focus:border-primary"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Min Spend (৳)</label>
              <input
                type="number"
                min={0}
                value={minBuy}
                onChange={(e) => setMinBuy(Number(e.target.value))}
                placeholder="Min spend"
                className="w-full px-3 py-2 border border-gray-200 rounded focus:border-primary"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Max Disc (৳)</label>
              <input
                type="number"
                min={0}
                value={maxDiscount}
                onChange={(e) => setMaxDiscount(Number(e.target.value))}
                placeholder="Max cap"
                className="w-full px-3 py-2 border border-gray-200 rounded focus:border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Start Date *</label>
              <input
                type="date"
                required
                value={startDateStr}
                onChange={(e) => setStartDateStr(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded focus:border-primary"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">End Date *</label>
              <input
                type="date"
                required
                value={endDateStr}
                onChange={(e) => setEndDateStr(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded focus:border-primary"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-200 rounded text-gray-600 hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded font-bold transition-colors disabled:opacity-50 cursor-pointer"
            >
              {submitting ? "Saving..." : "Create Coupon"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
