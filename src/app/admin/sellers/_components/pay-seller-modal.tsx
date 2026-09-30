"use client"

import React, { useState } from "react"
import { X, Building2 } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import { paySellerDirectAction } from "@/app/actions/ecommerce-actions"

export interface PaySellerTarget {
  id: string
  name: string
  dueToSeller: number
  bankName?: string
  bankAccName?: string
  bankAccNo?: string
  bankRoutingNo?: string
}

interface PaySellerModalProps {
  seller: PaySellerTarget | null
  onClose: () => void
  onSuccess: (sellerId: string, amount: number) => void
}

export function PaySellerModal({ seller, onClose, onSuccess }: PaySellerModalProps) {
  const [payAmount, setPayAmount] = useState("")
  const [payMethod, setPayMethod] = useState("bank_payment")
  const [txnCode, setTxnCode] = useState("")
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
        paymentMethod: payMethod === "bank_payment" ? `Bank Transfer (Txn: ${txnCode})` : payMethod,
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
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-5 relative animate-in fade-in zoom-in-95 text-xs">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
        >
          <X className="w-4 h-4" />
        </button>
        <h3 className="text-base font-bold text-slate-800 mb-1">
          Pay to Seller: {seller.name}
        </h3>
        <p className="text-slate-500 mb-3">
          Process direct merchant payment disbursement
        </p>

        {/* Bank & Due Details Table (1:1 with Laravel payment_modal.blade.php) */}
        <div className="border border-slate-200 rounded-md overflow-hidden mb-3">
          <table className="w-full text-left">
            <tbody className="divide-y divide-slate-100">
              <tr className="bg-slate-50">
                <td className="py-2 px-3 text-slate-500 font-medium">Due to Seller</td>
                <td className="py-2 px-3 font-bold text-[#d43533]">{formatPrice(seller.dueToSeller)}</td>
              </tr>
              {seller.bankName && (
                <tr>
                  <td className="py-1.5 px-3 text-slate-500 font-medium">Bank Name</td>
                  <td className="py-1.5 px-3 text-slate-800 font-semibold">{seller.bankName}</td>
                </tr>
              )}
              {seller.bankAccName && (
                <tr>
                  <td className="py-1.5 px-3 text-slate-500 font-medium">Account Name</td>
                  <td className="py-1.5 px-3 text-slate-800">{seller.bankAccName}</td>
                </tr>
              )}
              {seller.bankAccNo && (
                <tr>
                  <td className="py-1.5 px-3 text-slate-500 font-medium">Account No.</td>
                  <td className="py-1.5 px-3 font-mono text-slate-800">{seller.bankAccNo}</td>
                </tr>
              )}
              {seller.bankRoutingNo && (
                <tr>
                  <td className="py-1.5 px-3 text-slate-500 font-medium">Routing No.</td>
                  <td className="py-1.5 px-3 font-mono text-slate-800">{seller.bankRoutingNo}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {paySuccess ? (
          <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-center text-xs font-semibold">
            Payment recorded successfully!
          </div>
        ) : (
          <form onSubmit={handlePaySubmit} className="space-y-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Amount to Pay (৳) *
              </label>
              <input
                type="number"
                required
                min="1"
                step="0.01"
                placeholder={String(seller.dueToSeller || 0)}
                value={payAmount}
                onChange={(e) => setPayAmount(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded text-slate-800 focus:outline-hidden focus:border-[#d43533]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Payment Option *
              </label>
              <select
                value={payMethod}
                onChange={(e) => setPayMethod(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded text-slate-800 bg-white focus:outline-hidden focus:border-[#d43533]"
              >
                <option value="bank_payment">Bank Payment</option>
                <option value="cash">Cash in Hand</option>
                <option value="bKash">bKash</option>
                <option value="Nagad">Nagad</option>
              </select>
            </div>

            {payMethod === "bank_payment" && (
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Transaction Code / Reference ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. TXN-109283719"
                  value={txnCode}
                  onChange={(e) => setTxnCode(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-slate-800 focus:outline-hidden focus:border-[#d43533]"
                />
              </div>
            )}

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-3 py-1.5 border border-slate-300 text-slate-600 rounded font-medium hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-1.5 bg-[#d43533] hover:bg-[#b82a28] text-white rounded font-semibold transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Recording..." : "Pay Seller"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
