"use client"

import React, { useState } from "react"
import { X, Copy, Check, Loader2 } from "lucide-react"
import { AdminOrderListItem } from "@/services/admin-orders-service"

interface QuickOrderManageModalProps {
  order: AdminOrderListItem | null
  isOpen: boolean
  onClose: () => void
  onSave: (orderId: number, data: { deliveryStatus: string; paymentStatus: string }) => Promise<void>
}

export function QuickOrderManageModal({
  order,
  isOpen,
  onClose,
  onSave,
}: QuickOrderManageModalProps) {
  const [deliveryStatus, setDeliveryStatus] = useState(order?.deliveryStatus || "pending")
  const [paymentStatus, setPaymentStatus] = useState(order?.paymentStatus || "unpaid")
  const [copied, setCopied] = useState(false)
  const [saving, setSaving] = useState(false)

  // Sync state whenever selected order changes
  React.useEffect(() => {
    if (order) {
      setDeliveryStatus(order.deliveryStatus)
      setPaymentStatus(order.paymentStatus)
      setCopied(false)
    }
  }, [order])

  if (!isOpen || !order) return null

  const handleCopyTracking = () => {
    if (order.trackingCode) {
      navigator.clipboard.writeText(order.trackingCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleConfirm = async () => {
    setSaving(true)
    try {
      await onSave(order.id, { deliveryStatus, paymentStatus })
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop Overlay */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Right Offcanvas Container */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Offcanvas Header */}
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-800 tracking-tight">
              #{order.code}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Offcanvas Body */}
          <div className="p-6 space-y-5 flex-1 overflow-y-auto">
            {/* Payment Status */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                Payment Status
              </label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                className="w-full h-10 px-3 border border-slate-300 rounded text-sm text-slate-800 bg-white focus:outline-none focus:border-[#d43533] focus:ring-1 focus:ring-[#d43533]"
              >
                <option value="unpaid">Unpaid</option>
                <option value="paid">Paid</option>
              </select>
            </div>

            {/* Delivery Status */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                Delivery Status
              </label>
              <select
                value={deliveryStatus}
                onChange={(e) => setDeliveryStatus(e.target.value)}
                className="w-full h-10 px-3 border border-slate-300 rounded text-sm text-slate-800 bg-white capitalize focus:outline-none focus:border-[#d43533] focus:ring-1 focus:ring-[#d43533]"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="picked_up">Picked Up</option>
                <option value="on_the_way">On The Way</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancel</option>
              </select>
            </div>

            {/* Tracking Code */}
            {order.trackingCode && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                  Tracking Code
                </label>
                <div className="flex rounded border border-slate-300 overflow-hidden">
                  <input
                    type="text"
                    readOnly
                    value={order.trackingCode}
                    className="flex-1 px-3 py-2 text-sm bg-slate-50 text-slate-700 select-all focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleCopyTracking}
                    className="px-3.5 bg-slate-100 hover:bg-slate-200 border-l border-slate-300 text-slate-600 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Summary details */}
            <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
              <div className="flex justify-between py-1">
                <span className="text-slate-400 font-medium">Customer:</span>
                <span className="font-semibold text-slate-700">{order.customerName}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400 font-medium">Grand Total:</span>
                <span className="font-bold text-slate-900">৳{order.grandTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400 font-medium">Payment Method:</span>
                <span className="font-medium text-slate-700 capitalize">
                  {order.paymentType.replace(/_/g, " ")}
                </span>
              </div>
            </div>
          </div>

          {/* Offcanvas Footer */}
          <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2 border border-slate-300 rounded text-xs font-bold text-slate-700 hover:bg-white hover:border-slate-400 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={saving}
              className="px-5 py-2 bg-[#d43533] hover:bg-[#b82a28] text-white rounded text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
            >
              {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Confirm</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
