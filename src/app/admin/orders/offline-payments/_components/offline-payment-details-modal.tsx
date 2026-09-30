"use client"

import React, { useState } from "react"
import { X, Check, ExternalLink, Loader2, CreditCard } from "lucide-react"
import { AdminOrderListItem } from "@/services/admin-orders-service"

interface OfflinePaymentDetailsModalProps {
  order: AdminOrderListItem | null
  isOpen: boolean
  onClose: () => void
  onApprove: (orderId: number) => Promise<void>
}

export function OfflinePaymentDetailsModal({
  order,
  isOpen,
  onClose,
  onApprove,
}: OfflinePaymentDetailsModalProps) {
  const [approving, setApproving] = useState(false)

  if (!isOpen || !order) return null

  const manual = order.manualPaymentData || {}
  const isPaid = order.paymentStatus.toLowerCase() === "paid"

  const handleApprove = async () => {
    setApproving(true)
    try {
      await onApprove(order.id)
      onClose()
    } finally {
      setApproving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-lg max-w-md w-full p-6 shadow-2xl border border-slate-200 z-10 text-slate-800">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1 rounded"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 border-b border-slate-200 pb-4 mb-4">
          <div className="w-10 h-10 rounded-full bg-blue-50 text-[#1492e6] flex items-center justify-center shrink-0">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Offline Payment Details
            </h3>
            <p className="text-xs text-slate-500 font-mono">Order: #{order.code}</p>
          </div>
        </div>

        {/* Payment Info List */}
        <div className="space-y-3 text-xs mb-6">
          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="font-semibold text-slate-500">Method Name:</span>
            <span className="font-bold text-slate-900">{manual.name || "Offline / Bank Transfer"}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="font-semibold text-slate-500">Transaction ID (TrxID):</span>
            <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
              {manual.trx_id || "N/A"}
            </span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="font-semibold text-slate-500">Amount Paid:</span>
            <span className="font-bold text-sm text-[#d43533]">
              ৳{(manual.amount || order.grandTotal).toLocaleString("en-BD", { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="font-semibold text-slate-500">Customer:</span>
            <span className="font-medium text-slate-800">{order.customerName}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="font-semibold text-slate-500">Payment Status:</span>
            <span
              className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                isPaid ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
              }`}
            >
              {order.paymentStatus}
            </span>
          </div>

          {/* Receipt Photo */}
          {manual.photo && (
            <div className="pt-2">
              <span className="font-semibold text-slate-500 block mb-1.5">Payment Slip / Receipt:</span>
              <div className="relative group border border-slate-200 rounded p-1 inline-block">
                <img
                  src={manual.photo}
                  alt="Payment Receipt"
                  className="w-32 h-20 object-cover rounded"
                />
                <a
                  href={manual.photo}
                  target="_blank"
                  rel="noreferrer"
                  className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1 rounded text-[11px] font-semibold transition-opacity"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>View</span>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            disabled={approving}
            className="px-4 py-2 border border-slate-300 rounded text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Close
          </button>
          {!isPaid && (
            <button
              type="button"
              onClick={handleApprove}
              disabled={approving}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
            >
              {approving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Check className="w-3.5 h-3.5" />
              )}
              <span>Approve Payment</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
