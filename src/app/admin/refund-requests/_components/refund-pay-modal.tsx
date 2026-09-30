"use client"

import React, { useState } from "react"
import { X, Check, Wallet, AlertCircle } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import type { RefundRequestItem } from "@/services/refund-service"

interface RefundPayModalProps {
  refund: RefundRequestItem | null
  isProcessing: boolean
  onClose: () => void
  onConfirmPay: (refundId: string, adminNote: string) => Promise<void>
}

export function RefundPayModal({
  refund,
  isProcessing,
  onClose,
  onConfirmPay,
}: RefundPayModalProps) {
  const [adminNote, setAdminNote] = useState("Approved and refunded to customer wallet.")

  if (!refund) return null

  const handlePay = async () => {
    await onConfirmPay(refund.id, adminNote)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-emerald-50/50">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Wallet className="w-4 h-4" />
            </span>
            <h3 className="font-bold text-slate-800 text-sm">Refund Request Pay</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 rounded p-1 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 text-xs">
          <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-lg p-3.5 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Order Code:</span>
              <span className="font-bold text-slate-900">{refund.orderCode}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Customer:</span>
              <span className="font-bold text-slate-900">{refund.customerName}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-emerald-200/60">
              <span className="text-slate-700 font-bold">Total Refund Amount:</span>
              <span className="text-base font-black text-emerald-700">
                {formatPrice(refund.amount)}
              </span>
            </div>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200/60 rounded-lg text-amber-800 flex items-start gap-2 text-[11px] leading-relaxed">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <span>
              Approving this request will mark the refund as <strong>Approved (Paid)</strong> and immediately credit {formatPrice(refund.amount)} to the customer&apos;s wallet balance.
            </span>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Admin Note to Customer
            </label>
            <textarea
              rows={2}
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-md focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 focus:outline-none"
              placeholder="Enter note for customer..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2">
          <button
            type="button"
            disabled={isProcessing}
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-md text-xs font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isProcessing}
            onClick={handlePay}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-bold transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            {isProcessing ? (
              <span>Processing...</span>
            ) : (
              <>
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>Confirm & Refund Money</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
