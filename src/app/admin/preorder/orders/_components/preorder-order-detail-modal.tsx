"use client"

import React, { useState, useTransition } from "react"
import { X, User, Package, CreditCard, MapPin, Calendar, Clock } from "lucide-react"
import type { PreorderOrder } from "@/db/schema"
import { updatePreorderOrderStatusAction } from "@/app/actions/preorder-actions"

interface PreorderOrderDetailModalProps {
  order: PreorderOrder | null
  onClose: () => void
  onOrderUpdated: (updated: PreorderOrder) => void
}

export function PreorderOrderDetailModal({
  order,
  onClose,
  onOrderUpdated,
}: PreorderOrderDetailModalProps) {
  const [selectedStatus, setSelectedStatus] = useState(order?.preorderStatus || "requested")
  const [isPending, startTransition] = useTransition()
  const [feedback, setFeedback] = useState<string | null>(null)

  if (!order) return null

  const handleStatusSave = () => {
    startTransition(async () => {
      const ok = await updatePreorderOrderStatusAction(order.id, selectedStatus)
      if (ok) {
        setFeedback("Status updated successfully!")
        onOrderUpdated({ ...order, preorderStatus: selectedStatus })
        setTimeout(() => setFeedback(null), 2500)
      } else {
        setFeedback("Failed to update status")
      }
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50">
          <div>
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#d43533]" />
              Pre-Order Details: {order.orderCode}
            </h3>
            <p className="text-[11px] text-gray-500">
              Placed on {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs text-gray-700">
          {feedback && (
            <div className="p-2.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-medium">
              {feedback}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Customer Info */}
            <div className="p-3.5 rounded-lg border border-gray-100 bg-gray-50/50 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-800 border-b border-gray-200 pb-1.5">
                <User className="w-3.5 h-3.5 text-[#d43533]" />
                Customer Information
              </div>
              <p><span className="text-gray-500">Name:</span> <strong className="text-gray-900">{order.customerName}</strong></p>
              <p><span className="text-gray-500">Email:</span> {order.customerEmail}</p>
              <p><span className="text-gray-500">Phone:</span> {order.customerPhone || "N/A"}</p>
              <p className="flex items-start gap-1">
                <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                <span>{order.shippingAddress || "Standard delivery address provided during final confirmation."}</span>
              </p>
            </div>

            {/* Product & Seller */}
            <div className="p-3.5 rounded-lg border border-gray-100 bg-gray-50/50 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-800 border-b border-gray-200 pb-1.5">
                <Package className="w-3.5 h-3.5 text-[#d43533]" />
                Product & Seller
              </div>
              <p><span className="text-gray-500">Product:</span> <strong className="text-gray-900">{order.productName}</strong></p>
              <p><span className="text-gray-500">Quantity:</span> {order.quantity} Unit(s)</p>
              <p><span className="text-gray-500">Seller:</span> {order.sellerName || "Inhouse"}</p>
              <p><span className="text-gray-500">Refundable:</span> {order.isRefundable ? "Yes (Within Policy)" : "No Refund"}</p>
            </div>
          </div>

          {/* Pricing & Deposit Breakdown */}
          <div className="p-3.5 rounded-lg border border-gray-100 bg-gray-50/50 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-800 border-b border-gray-200 pb-1.5">
              <CreditCard className="w-3.5 h-3.5 text-[#d43533]" />
              Payment & Balance Ledger
            </div>
            <div className="grid grid-cols-3 gap-2 text-center pt-1">
              <div className="bg-white p-2 rounded border border-gray-200">
                <span className="text-[10px] text-gray-500 uppercase block">Total Price</span>
                <strong className="text-sm font-bold text-gray-900">৳{order.totalPrice}</strong>
              </div>
              <div className="bg-emerald-50 p-2 rounded border border-emerald-200">
                <span className="text-[10px] text-emerald-700 uppercase block">Deposit Paid</span>
                <strong className="text-sm font-bold text-emerald-700">৳{order.prepaymentPaid}</strong>
              </div>
              <div className="bg-amber-50 p-2 rounded border border-amber-200">
                <span className="text-[10px] text-amber-700 uppercase block">Balance Due</span>
                <strong className="text-sm font-bold text-amber-700">৳{order.remainingDue}</strong>
              </div>
            </div>
            <p className="text-[11px] text-gray-500 pt-1">
              Method: <span className="font-semibold text-gray-700">{order.paymentMethod || "bKash / MFS"}</span>
            </p>
          </div>

          {/* Status Update */}
          <div className="p-3.5 rounded-lg border border-gray-200 bg-white space-y-2">
            <label className="block text-xs font-semibold text-gray-800">
              Update Pre-Order Lifecycle Status
            </label>
            <div className="flex items-center gap-2">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="flex-1 rounded border border-gray-300 px-3 py-2 text-xs text-gray-800 bg-white focus:outline-hidden"
              >
                <option value="requested">Preorder Requested</option>
                <option value="accepted_requests">Preorder Request Accepted</option>
                <option value="prepayment_requests">Prepayment Requested</option>
                <option value="confirmed_prepayments">Prepayment Accepted (Deposit Confirmed)</option>
                <option value="final_preorders">Final Order Requested</option>
                <option value="in_shipping">In Shipping</option>
                <option value="delivered">Delivered</option>
                <option value="refund">Refunded</option>
              </select>
              <button
                type="button"
                onClick={handleStatusSave}
                disabled={isPending || selectedStatus === order.preorderStatus}
                className="px-4 py-2 bg-[#28a745] hover:bg-[#218838] disabled:opacity-50 text-white rounded text-xs font-semibold transition-colors"
              >
                {isPending ? "Updating..." : "Update Status"}
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded text-xs font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
