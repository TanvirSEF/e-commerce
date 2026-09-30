"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { X, ExternalLink, Package, User, Check, Ban } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import type { RefundRequestItem } from "@/services/refund-service"

interface RefundDetailModalProps {
  refund: RefundRequestItem | null
  onClose: () => void
  onOpenApproveModal: (refund: RefundRequestItem) => void
  onOpenRejectModal: (refund: RefundRequestItem) => void
}

export function RefundDetailModal({
  refund,
  onClose,
  onOpenApproveModal,
  onOpenRejectModal,
}: RefundDetailModalProps) {
  if (!refund) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <h3 className="font-bold text-slate-800 text-sm">
              Refund Request Details
            </h3>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                refund.status === "approved"
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                  : refund.status === "rejected"
                  ? "bg-red-100 text-red-800 border border-red-200"
                  : "bg-amber-100 text-amber-800 border border-amber-200"
              }`}
            >
              {refund.status === "approved"
                ? "Approved"
                : refund.status === "rejected"
                ? "Rejected"
                : "Pending"}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 rounded p-1 hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 text-xs overflow-y-auto custom-scrollbar">
          {/* Order & Amount Meta Card */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Order Code</div>
              <Link
                href="/admin/orders"
                className="font-bold text-[#d43533] hover:underline flex items-center gap-1 mt-0.5"
              >
                {refund.orderCode}
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Refund Amount</div>
              <div className="font-bold text-slate-900 text-sm mt-0.5">
                {formatPrice(refund.amount)}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Customer</div>
              <div className="font-medium text-slate-700 mt-0.5 truncate">
                {refund.customerName}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Request Date</div>
              <div className="font-medium text-slate-700 mt-0.5">{refund.date}</div>
            </div>
          </div>

          {/* Product Info */}
          <div className="p-3 bg-white border border-slate-200 rounded-lg">
            <div className="text-[10px] uppercase font-bold text-slate-400 mb-2">Requested Product</div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded bg-slate-100 border border-slate-200 flex-shrink-0 overflow-hidden flex items-center justify-center text-slate-400">
                {refund.attachment ? (
                  <Image
                    src={refund.attachment}
                    alt={refund.productName}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Package className="w-6 h-6 text-slate-400" />
                )}
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-xs">{refund.productName}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Seller / Store: <span className="font-medium text-slate-700">{refund.shopName}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Return Reason */}
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Return Reason</div>
            <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-lg text-slate-800 font-medium">
              {refund.reason}
            </div>
          </div>

          {/* Customer Explanation */}
          {refund.details && (
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">
                Customer&apos;s Detailed Explanation
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 leading-relaxed whitespace-pre-wrap">
                {refund.details}
              </div>
            </div>
          )}

          {/* Attachment Preview */}
          {refund.attachment && (
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Customer Attachment</div>
              <div className="w-32 h-32 rounded-lg border border-slate-200 overflow-hidden bg-slate-50">
                <Image
                  src={refund.attachment}
                  alt="Customer attachment"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Admin Note if already processed */}
          {refund.adminNote && (
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Admin Audit Note</div>
              <div className="p-3 bg-slate-100/70 border border-slate-200 rounded-lg text-slate-800 font-medium italic">
                {refund.adminNote}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-md text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Close
          </button>

          {refund.status === "pending" && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onClose()
                  onOpenRejectModal(refund)
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <Ban className="w-3.5 h-3.5" />
                Reject Request
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose()
                  onOpenApproveModal(refund)
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                Approve & Pay
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
