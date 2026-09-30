"use client"

import React, { useState } from "react"
import { X } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import { paySellerDirectAction } from "@/app/actions/ecommerce-actions"

export interface PaySellerTarget {
  id: string
  name: string
  dueToSeller: number
}

interface PaySellerModalProps {
  seller: PaySellerTarget | null
  onClose: () => void
  onSuccess: (sellerId: string, amount: number) => void
}

export function PaySellerModal({ seller, onClose, onSuccess }: PaySellerModalProps) {
  const [payAmount, setPayAmount] = useState("")
  const [payMethod, setPayMethod] = useState("bKash")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paySuccess, setPaySuccess] = useState(false)

  if (!seller) return null

  const handlePaySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!payAmount) return
    const amt = parseFloat(payAmount)
    if (isNaN(amt) || amt <= 0) return

    setIsSubmitting(true)
    try {
      const numericId = parseInt(seller.id.replace(/\D/g, "")) || 1
      await paySellerDirectAction({
        shopId: numericId,
        amount: amt,
        paymentMethod: payMethod,
      })
      setPaySuccess(true)
      onSuccess(seller.id, amt)
      setTimeout(() => {
        setPaySuccess(false)
        onClose()
      }, 1500)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-5 relative animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
        >
          <X className="w-4 h-4" />
        </button>
        <h3 className="text-base font-bold text-slate-800 mb-1">
          Pay Seller: {seller.name}
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Current Due Balance:{" "}
          <span className="font-bold text-[#d43533]">
            {formatPrice(seller.dueToSeller)}
          </span>
        </p>

        {paySuccess ? (
          <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-center text-xs font-semibold">
            Payment recorded successfully!
          </div>
        ) : (
          <form onSubmit={handlePaySubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Amount to Pay (৳)
              </label>
              <input
                type="number"
                required
                min="1"
                max={seller.dueToSeller}
                placeholder="Enter amount"
                value={payAmount}
                onChange={(e) => setPayAmount(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Payment Method
              </label>
              <select
                value={payMethod}
                onChange={(e) => setPayMethod(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533]"
              >
                <option value="bKash">bKash Merchant</option>
                <option value="Nagad">Nagad</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cash">Cash in Hand</option>
              </select>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-3 py-1.5 border border-slate-300 text-slate-600 rounded text-xs font-medium hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-1.5 bg-[#d43533] hover:bg-[#b82a28] text-white rounded text-xs font-semibold transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Recording..." : "Confirm Payout"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
