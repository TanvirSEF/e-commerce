"use client"

import React, { useState } from "react"
import { X, Building, Smartphone, CreditCard } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import type { SellerWithdrawItem } from "@/services/seller-service"

interface PayoutProcessModalProps {
  request: SellerWithdrawItem | null
  processing: boolean
  onClose: () => void
  onConfirm: (
    status: "paid" | "rejected",
    data: { paymentMethod: string; transactionId?: string; adminNote?: string }
  ) => Promise<void>
}

export function PayoutProcessModal({
  request,
  processing,
  onClose,
  onConfirm,
}: PayoutProcessModalProps) {
  const [payMethod, setPayMethod] = useState(request?.paymentMethod || "bKash")
  const [txId, setTxId] = useState("")
  const [adminNote, setAdminNote] = useState("")

  if (!request) return null

  const handleApprove = () => {
    onConfirm("paid", {
      paymentMethod: payMethod,
      transactionId: txId || undefined,
      adminNote: adminNote || undefined,
    })
  }

  const handleReject = () => {
    onConfirm("rejected", {
      paymentMethod: payMethod,
      transactionId: txId || undefined,
      adminNote: adminNote || undefined,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-5 relative animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
        >
          <X className="w-4 h-4" />
        </button>

        <h3 className="text-base font-bold text-slate-800 mb-1">
          Process Payout Request #{request.id}
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Review request details, record bank or merchant transfer reference, and disburse
        </p>

        <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 mb-4 space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-500">Shop / Vendor:</span>
            <span className="font-semibold text-slate-800">{request.shopName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Owner Name:</span>
            <span className="font-medium text-slate-700">{request.sellerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Requested Amount:</span>
            <span className="font-bold text-lg text-[#d43533]">
              {formatPrice(request.amount)}
            </span>
          </div>
          {request.message && (
            <div className="pt-2 border-t border-slate-200">
              <span className="text-slate-500 block mb-0.5">Seller Message / Bank Info:</span>
              <p className="font-medium text-slate-700 bg-white p-2 rounded border border-slate-200">
                {request.message}
              </p>
            </div>
          )}
        </div>

        <div className="space-y-3 mb-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Disbursement Method
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPayMethod("bKash")}
                className={`py-2 px-2.5 rounded border text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
                  payMethod === "bKash"
                    ? "border-[#d43533] bg-red-50/50 text-[#d43533]"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                bKash
              </button>
              <button
                type="button"
                onClick={() => setPayMethod("Bank Transfer")}
                className={`py-2 px-2.5 rounded border text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
                  payMethod === "Bank Transfer"
                    ? "border-[#d43533] bg-red-50/50 text-[#d43533]"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Building className="w-3.5 h-3.5" />
                Bank Transfer
              </button>
              <button
                type="button"
                onClick={() => setPayMethod("Cash")}
                className={`py-2 px-2.5 rounded border text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
                  payMethod === "Cash"
                    ? "border-[#d43533] bg-red-50/50 text-[#d43533]"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                Cash / Others
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Transaction ID / Bank Ref No.
            </label>
            <input
              type="text"
              placeholder="e.g. TXN-CITY-891024 or bKash TrxID"
              value={txId}
              onChange={(e) => setTxId(e.target.value)}
              className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs text-slate-800 focus:outline-hidden focus:border-[#d43533]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Admin Remarks / Internal Note
            </label>
            <textarea
              rows={2}
              placeholder="Add optional note or confirmation details..."
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs text-slate-800 focus:outline-hidden focus:border-[#d43533]"
            />
          </div>
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={handleReject}
            disabled={processing}
            className="px-3.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 border border-red-200 rounded transition-colors disabled:opacity-50"
          >
            Reject Request
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={processing}
              className="px-3 py-1.5 border border-slate-300 text-slate-600 rounded text-xs font-medium hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApprove}
              disabled={processing}
              className="px-4 py-1.5 bg-[#d43533] hover:bg-[#b82a28] text-white rounded text-xs font-semibold transition-colors disabled:opacity-50"
            >
              {processing ? "Processing..." : "Approve & Mark Paid"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
