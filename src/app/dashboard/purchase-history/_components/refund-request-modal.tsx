"use client"

import React, { useState } from "react"
import Image from "next/image"
import { X, AlertCircle, CheckCircle2, Loader2, RotateCcw } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import { createRefundAction } from "@/app/actions/ecommerce-actions"

const DEFAULT_REASONS = [
  "Defective or damaged product",
  "Received wrong item",
  "Product does not match description",
  "Quality not as expected",
  "Missing parts or accessories",
  "Changed mind / No longer needed",
  "Other",
]

export interface RefundModalItem {
  id: string | number
  productId?: number
  name: string
  thumbnail: string
  price: number
  quantity: number
}

interface RefundRequestModalProps {
  isOpen: boolean
  onClose: () => void
  orderCode: string
  orderId?: number
  shopName?: string
  item: RefundModalItem | null
  onSuccess?: () => void
}

export function RefundRequestModal({
  isOpen,
  onClose,
  orderCode,
  orderId,
  shopName,
  item,
  onSuccess,
}: RefundRequestModalProps) {
  const [reason, setReason] = useState(DEFAULT_REASONS[0])
  const [details, setDetails] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  if (!isOpen || !item) return null

  const refundAmount = item.price * (item.quantity || 1)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reason.trim()) {
      setErrorMsg("Please select a refund reason.")
      return
    }

    setSubmitting(true)
    setErrorMsg("")

    try {
      const res = await createRefundAction({
        orderCode,
        orderId,
        productName: item.name,
        shopName: shopName || "Active eCommerce Store",
        amount: refundAmount,
        reason,
        details: details.trim() || undefined,
      })

      if (res && res.success) {
        setSubmitted(true)
        onSuccess?.()
        setTimeout(() => {
          setSubmitted(false)
          setDetails("")
          setSubmitting(false)
          onClose()
        }, 1500)
      } else {
        setErrorMsg(res?.error || "Failed to submit refund request. Please try again.")
        setSubmitting(false)
      }
    } catch {
      setErrorMsg("An unexpected error occurred. Please try again.")
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-lg bg-white shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 bg-gray-50/50">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-50 text-[#d43533]">
              <RotateCcw className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Request Product Refund</h3>
              <p className="text-[11px] text-gray-400">Order #{orderCode}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body */}
        {submitted ? (
          <div className="p-8 text-center space-y-2">
            <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500 mb-2" />
            <h4 className="text-base font-bold text-gray-900">Refund Request Submitted!</h4>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Your refund request for <strong>{item.name}</strong> has been submitted. The admin and seller will review your request.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {errorMsg && (
              <div className="flex items-center gap-2 p-3 text-xs bg-red-50 border border-red-200 text-red-700 rounded">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Product Summary */}
            <div className="flex items-center gap-3 rounded border border-gray-100 bg-gray-50/60 p-3">
              <div className="relative h-12 w-12 rounded border border-gray-200 overflow-hidden bg-white shrink-0">
                <Image
                  src={item.thumbnail || "/assets/img/placeholder.jpg"}
                  alt={item.name}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    const target = e.currentTarget
                    if (!target.src.includes("placeholder.jpg")) {
                      target.src = "/assets/img/placeholder.jpg"
                    }
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-gray-900 truncate">{item.name}</p>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Qty: {item.quantity} × {formatPrice(item.price)}
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[10px] text-gray-400 block uppercase font-medium">Refund Amount</span>
                <span className="text-sm font-bold text-[#d43533]">{formatPrice(refundAmount)}</span>
              </div>
            </div>

            {/* Reason Selection */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Refund Reason <span className="text-red-500">*</span>
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 text-xs text-gray-800 bg-white focus:border-[#d43533] focus:outline-none"
              >
                {DEFAULT_REASONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            {/* Details / Explanation */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Detailed Explanation (Optional)
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={3}
                placeholder="Explain the reason for refund or issue with the product..."
                className="w-full rounded border border-gray-300 p-3 text-xs text-gray-800 placeholder-gray-400 focus:border-[#d43533] focus:outline-none"
              />
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="rounded border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-1.5 rounded bg-[#d43533] px-5 py-2 text-xs font-bold text-white hover:bg-[#b82a28] disabled:opacity-60 transition-colors shadow-2xs"
              >
                {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {submitting ? "Submitting..." : "Send Request"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
