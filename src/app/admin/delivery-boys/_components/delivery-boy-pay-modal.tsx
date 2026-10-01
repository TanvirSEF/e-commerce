"use client"

import React, { useState } from "react"
import { X, DollarSign } from "lucide-react"
import type { DeliveryBoy } from "@/db/schema/delivery-boy"

interface DeliveryBoyPayModalProps {
  boy: DeliveryBoy | null
  onClose: () => void
  onPay: (data: {
    deliveryBoyId: number
    amount: string
    paymentMethod: string
    txnCode?: string
    notes?: string
  }) => Promise<void>
}

export function DeliveryBoyPayModal({
  boy,
  onClose,
  onPay,
}: DeliveryBoyPayModalProps) {
  if (!boy) return null

  const [amount, setAmount] = useState(boy.totalEarnings || "0.00")
  const [paymentMethod, setPaymentMethod] = useState("Cash")
  const [txnCode, setTxnCode] = useState("")
  const [notes, setNotes] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const numAmount = parseFloat(amount)
    if (isNaN(numAmount) || numAmount <= 0) {
      setError("Please enter a valid disbursement amount.")
      return
    }

    if (numAmount > parseFloat(boy.totalEarnings || "0")) {
      setError("Payment amount cannot exceed the courier's earned balance.")
      return
    }

    setSubmitting(true)
    try {
      await onPay({
        deliveryBoyId: boy.id,
        amount: numAmount.toFixed(2),
        paymentMethod,
        txnCode: txnCode.trim() || undefined,
        notes: notes.trim() || undefined,
      })
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment disbursement failed.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Pay Delivery Boy</h3>
              <p className="text-xs text-slate-500">{boy.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 font-medium">
              {error}
            </div>
          )}

          <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-lg flex items-center justify-between">
            <span className="text-emerald-800 font-medium">Due Remuneration Earnings:</span>
            <span className="font-bold text-base text-emerald-700">${boy.totalEarnings}</span>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700">Amount to Disburse ($) *</label>
            <input
              type="number"
              step="0.01"
              required
              max={boy.totalEarnings}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#d43533]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700">Payment Gateway / Mode</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#d43533] bg-white"
            >
              <option value="Cash">Cash in Hand</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="bKash Agent">bKash / Mobile Wallet</option>
              <option value="PayPal">PayPal</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700">Transaction ID / Bank Reference</label>
            <input
              type="text"
              placeholder="e.g. TXN-894102 or Bank Ref"
              value={txnCode}
              onChange={(e) => setTxnCode(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#d43533]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700">Payment Notes / Memo</label>
            <textarea
              rows={2}
              placeholder="Internal record / payment voucher notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#d43533]"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-lg transition-colors shadow-sm disabled:opacity-60"
            >
              {submitting ? "Disbursing..." : "Confirm & Pay Earnings"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
