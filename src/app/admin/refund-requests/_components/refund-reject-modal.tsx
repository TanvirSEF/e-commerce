"use client"

import React, { useState } from "react"
import { X, Ban, AlertTriangle } from "lucide-react"
import type { RefundRequestItem } from "@/services/refund-service"

interface RefundRejectModalProps {
  refund: RefundRequestItem | null
  reasons: string[]
  isProcessing: boolean
  onClose: () => void
  onConfirmReject: (refundId: string, rejectReason: string, adminNote: string) => Promise<void>
}

export function RefundRejectModal({
  refund,
  reasons,
  isProcessing,
  onClose,
  onConfirmReject,
}: RefundRejectModalProps) {
  const [selectedReason, setSelectedReason] = useState(reasons[0] || "Product does not meet return policy criteria")
  const [adminNote, setAdminNote] = useState("")

  if (!refund) return null

  const handleReject = async () => {
    await onConfirmReject(refund.id, selectedReason, adminNote)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-red-50/50">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-bold">
              <Ban className="w-4 h-4" />
            </span>
            <h3 className="font-bold text-slate-800 text-sm">Reject Refund Request</h3>
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
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Order Code:</span>
              <span className="font-bold text-slate-900">{refund.orderCode}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Customer:</span>
              <span className="font-bold text-slate-900">{refund.customerName}</span>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Select Rejection Reason
            </label>
            <select
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-md focus:border-red-500 focus:ring-1 focus:ring-red-500/20 focus:outline-none bg-white font-medium"
            >
              {reasons.map((r, i) => (
                <option key={i} value={r}>
                  {r}
                </option>
              ))}
              <option value="Other">Other / Custom Reason</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Explanation & Feedback to Customer
            </label>
            <textarea
              rows={3}
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-md focus:border-red-500 focus:ring-1 focus:ring-red-500/20 focus:outline-none"
              placeholder="State the detailed reason why this refund request was rejected..."
            />
          </div>

          <div className="p-3 bg-red-50 border border-red-200/60 rounded-lg text-red-800 flex items-start gap-2 text-[11px] leading-relaxed">
            <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <span>
              This will update the request status to <strong>Rejected</strong> and notify the customer of the decision.
            </span>
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
            onClick={handleReject}
            className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-xs font-bold transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            {isProcessing ? (
              <span>Rejecting...</span>
            ) : (
              <>
                <Ban className="w-4 h-4" />
                <span>Confirm Rejection</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
