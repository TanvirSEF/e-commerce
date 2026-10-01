"use client"

import React, { useState } from "react"
import { X, HandCoins } from "lucide-react"
import type { DeliveryBoy } from "@/db/schema/delivery-boy"

interface DeliveryBoyCollectModalProps {
  boy: DeliveryBoy | null
  onClose: () => void
  onCollect: (data: {
    deliveryBoyId: number
    amount: string
    orderCode?: string
    notes?: string
  }) => Promise<void>
}

export function DeliveryBoyCollectModal({
  boy,
  onClose,
  onCollect,
}: DeliveryBoyCollectModalProps) {
  if (!boy) return null

  const [amount, setAmount] = useState(boy.totalCollection || "0.00")
  const [orderCode, setOrderCode] = useState("")
  const [notes, setNotes] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const numAmount = parseFloat(amount)
    if (isNaN(numAmount) || numAmount <= 0) {
      setError("Please enter a valid collection amount.")
      return
    }

    if (numAmount > parseFloat(boy.totalCollection || "0")) {
      setError("Collection amount cannot exceed the courier's cash in hand.")
      return
    }

    setSubmitting(true)
    try {
      await onCollect({
        deliveryBoyId: boy.id,
        amount: numAmount.toFixed(2),
        orderCode: orderCode.trim() || undefined,
        notes: notes.trim() || undefined,
      })
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Cash collection failed.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-red-50 text-[#d43533] flex items-center justify-center shrink-0">
              <HandCoins className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Collect Cash from Courier</h3>
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

          <div className="p-3 bg-red-50/60 border border-red-200 rounded-lg flex items-center justify-between">
            <span className="text-red-900 font-medium">Current COD Cash In Hand:</span>
            <span className="font-bold text-base text-[#d43533]">${boy.totalCollection}</span>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700">Amount to Collect ($) *</label>
            <input
              type="number"
              step="0.01"
              required
              max={boy.totalCollection}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#d43533]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700">Associated Order Code (Optional)</label>
            <input
              type="text"
              placeholder="e.g. ORD-202609-1002"
              value={orderCode}
              onChange={(e) => setOrderCode(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#d43533]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700">Collection Notes / Memo</label>
            <textarea
              rows={2}
              placeholder="Deposit slip / cash handover confirmation..."
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
              className="px-5 py-2 bg-[#d43533] hover:bg-red-700 text-white font-medium text-xs rounded-lg transition-colors shadow-sm disabled:opacity-60"
            >
              {submitting ? "Collecting..." : "Confirm & Record Collection"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
