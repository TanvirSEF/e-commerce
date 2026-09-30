"use client"

import React, { useState, useTransition } from "react"
import { X, Trophy, User, Package, CreditCard, Truck } from "lucide-react"
import type { AuctionOrder } from "@/db/schema/auction"
import { updateAuctionOrderStatusAction } from "@/app/actions/auction-actions"

interface AuctionOrderDetailModalProps {
  order: AuctionOrder | null
  onClose: () => void
  onOrderUpdated: (updated: AuctionOrder) => void
}

export function AuctionOrderDetailModal({
  order,
  onClose,
  onOrderUpdated,
}: AuctionOrderDetailModalProps) {
  const [paymentStatus, setPaymentStatus] = useState(order?.paymentStatus || "paid")
  const [deliveryStatus, setDeliveryStatus] = useState(order?.deliveryStatus || "pending")
  const [isPending, startTransition] = useTransition()
  const [feedback, setFeedback] = useState<string | null>(null)

  if (!order) return null

  const handleSave = () => {
    startTransition(async () => {
      const ok = await updateAuctionOrderStatusAction(order.id, {
        paymentStatus,
        deliveryStatus,
      })
      if (ok) {
        setFeedback("Order status updated successfully!")
        onOrderUpdated({ ...order, paymentStatus, deliveryStatus })
        setTimeout(() => setFeedback(null), 2500)
      } else {
        setFeedback("Failed to update status")
      }
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            Auction Order: {order.orderCode}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs text-gray-700">
          {feedback && (
            <div className="p-2.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium">
              {feedback}
            </div>
          )}

          <div className="p-3.5 rounded-lg border border-gray-100 bg-gray-50/50 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-gray-800 border-b border-gray-200 pb-1.5">
              <User className="w-3.5 h-3.5 text-[#d43533]" />
              Winning Bidder Information
            </div>
            <p><span className="text-gray-500">Name:</span> <strong className="text-gray-900">{order.customerName}</strong></p>
            <p><span className="text-gray-500">Email:</span> {order.customerEmail}</p>
          </div>

          <div className="p-3.5 rounded-lg border border-gray-100 bg-gray-50/50 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-gray-800 border-b border-gray-200 pb-1.5">
              <Package className="w-3.5 h-3.5 text-[#d43533]" />
              Item & Winning Bid
            </div>
            <p><span className="text-gray-500">Item:</span> <strong className="text-gray-900">{order.productName}</strong></p>
            <p><span className="text-gray-500">Hammer Price (Winning Bid):</span> <strong className="text-sm text-[#d43533]">${order.winningBid}</strong></p>
          </div>

          {/* Status Selectors */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-gray-700 flex items-center gap-1">
                <CreditCard className="w-3 h-3 text-gray-400" />
                Payment Status
              </label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                className="w-full rounded border border-gray-300 px-2.5 py-1.5 text-xs text-gray-800 bg-white focus:outline-hidden"
              >
                <option value="paid">Paid</option>
                <option value="unpaid">Unpaid</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-gray-700 flex items-center gap-1">
                <Truck className="w-3 h-3 text-gray-400" />
                Fulfillment Status
              </label>
              <select
                value={deliveryStatus}
                onChange={(e) => setDeliveryStatus(e.target.value)}
                className="w-full rounded border border-gray-300 px-2.5 py-1.5 text-xs text-gray-800 bg-white focus:outline-hidden"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="on_delivery">On Delivery</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded text-xs font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 transition-colors"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className="px-4 py-2 bg-[#28a745] hover:bg-[#218838] disabled:opacity-50 text-white rounded text-xs font-semibold transition-colors"
          >
            {isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  )
}
