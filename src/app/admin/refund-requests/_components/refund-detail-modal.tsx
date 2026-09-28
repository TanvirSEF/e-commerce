"use client"

import React from "react"
import { X, ExternalLink } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import type { RefundRequestItem } from "@/services/refund-service"

interface RefundDetailModalProps {
  refund: RefundRequestItem | null
  actionType: "approve" | "reject" | null
  adminNote: string
  isProcessing: boolean
  onClose: () => void
  onActionTypeChange: (type: "approve" | "reject" | null) => void
  onAdminNoteChange: (note: string) => void
  onProcessAction: () => void
}

export function RefundDetailModal({
  refund,
  actionType,
  adminNote,
  isProcessing,
  onClose,
  onActionTypeChange,
  onAdminNoteChange,
  onProcessAction,
}: RefundDetailModalProps) {
  if (!refund) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-800 text-sm">
              Refund Request Details
            </h3>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                refund.status === "approved"
                  ? "bg-emerald-100 text-emerald-800"
                  : refund.status === "rejected"
                  ? "bg-red-100 text-red-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {refund.status}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 rounded p-1 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded border border-slate-200">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Order Code</div>
              <div className="font-bold text-[#d43533]">{refund.orderCode}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Amount</div>
              <div className="font-bold text-slate-800">{formatPrice(refund.amount)}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Customer</div>
              <div className="font-medium text-slate-700">{refund.customerName}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Requested Date</div>
              <div className="font-medium text-slate-700">{refund.date}</div>
            </div>
          </div>

          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Product</div>
            <div className="font-bold text-slate-900">{refund.productName}</div>
          </div>

          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Return Reason</div>
            <div className="p-2.5 bg-amber-50/60 border border-amber-100 rounded text-slate-800 font-medium">
              {refund.reason}
            </div>
          </div>

          {refund.details && (
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Buyer Explanation</div>
              <div className="p-2.5 bg-slate-50 border border-slate-100 rounded text-slate-700">
                {refund.details}
              </div>
            </div>
          )}

          {actionType && (
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                Admin Note & Explanation to Customer
              </label>
              <textarea
                rows={3}
                value={adminNote}
                onChange={(e) => onAdminNoteChange(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded text-xs focus:border-[#d43533] focus:outline-none"
                placeholder="Enter approval message or reason for rejection..."
              />
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded text-xs font-semibold text-slate-600 hover:bg-slate-100"
          >
            Close
          </button>

          {actionType ? (
            <button
              type="button"
              disabled={isProcessing}
              onClick={onProcessAction}
              className={`px-5 py-2 rounded text-xs font-bold text-white disabled:opacity-50 ${
                actionType === "approve"
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {isProcessing
                ? "Processing..."
                : actionType === "approve"
                ? "Confirm Approval & Credit"
                : "Confirm Rejection"}
            </button>
          ) : refund.status === "pending" ? (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  onActionTypeChange("reject")
                  onAdminNoteChange("Product does not meet return policy criteria.")
                }}
                className="px-4 py-2 bg-red-600 text-white rounded text-xs font-bold hover:bg-red-700"
              >
                Reject
              </button>
              <button
                type="button"
                onClick={() => {
                  onActionTypeChange("approve")
                  onAdminNoteChange("Approved and refunded to customer wallet.")
                }}
                className="px-4 py-2 bg-emerald-600 text-white rounded text-xs font-bold hover:bg-emerald-700"
              >
                Approve
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
