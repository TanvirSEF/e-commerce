"use client"

import React, { useState, useTransition } from "react"
import { updatePreorderBusinessSettingAction } from "@/app/actions/preorder-actions"

interface PreorderInstructionsCardProps {
  initialRequestInstruction: string
  initialPaymentInstruction: string
  initialPaymentQrcode: string
  onFeedback: (type: "success" | "error", text: string) => void
}

export function PreorderInstructionsCard({
  initialRequestInstruction,
  initialPaymentInstruction,
  initialPaymentQrcode,
  onFeedback,
}: PreorderInstructionsCardProps) {
  const [preorderRequestInstruction, setPreorderRequestInstruction] = useState(
    initialRequestInstruction
  )
  const [prePaymentInstruction, setPrePaymentInstruction] = useState(
    initialPaymentInstruction
  )
  const [imageForPaymentQrcode, setImageForPaymentQrcode] = useState(
    initialPaymentQrcode
  )

  const [isPendingRequest, startTransitionRequest] = useTransition()
  const [isPendingPayment, startTransitionPayment] = useTransition()

  const handleUpdateRequestInstructions = (e: React.FormEvent) => {
    e.preventDefault()
    startTransitionRequest(async () => {
      try {
        await updatePreorderBusinessSettingAction(
          "preorder_request_instruction",
          preorderRequestInstruction
        )
        onFeedback("success", "Preorder Request Instructions updated successfully")
      } catch (err: any) {
        onFeedback("error", err?.message || "Failed to update instructions")
      }
    })
  }

  const handleUpdatePaymentInstructions = (e: React.FormEvent) => {
    e.preventDefault()
    startTransitionPayment(async () => {
      try {
        await Promise.all([
          updatePreorderBusinessSettingAction(
            "image_for_payment_qrcode",
            imageForPaymentQrcode
          ),
          updatePreorderBusinessSettingAction(
            "pre_payment_instruction",
            prePaymentInstruction
          ),
        ])
        onFeedback("success", "Payment Instructions updated successfully")
      } catch (err: any) {
        onFeedback("error", err?.message || "Failed to update payment instructions")
      }
    })
  }

  return (
    <div className="space-y-5">
      {/* Card 3: Preorder Request Instructions */}
      <div className="card rounded-2 border border-gray-200 bg-white shadow-xs overflow-hidden">
        <div className="card-header px-4 py-3 border-b border-gray-100 bg-[#f8f9fb]">
          <h6 className="font-semibold text-sm text-gray-800 mb-0">Preorder Instructions</h6>
        </div>
        <form onSubmit={handleUpdateRequestInstructions} className="card-body p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
            <label className="md:col-span-4 text-xs font-semibold text-gray-700 pt-2">
              Preorder Request Instructions
            </label>
            <div className="md:col-span-8">
              <textarea
                rows={4}
                value={preorderRequestInstruction}
                onChange={(e) => setPreorderRequestInstruction(e.target.value)}
                placeholder="Enter pre-order instructions for customers..."
                className="w-full rounded border border-gray-200 p-3 text-xs text-gray-900 focus:border-[#d43533] focus:outline-hidden"
              />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isPendingRequest}
              className="w-full sm:w-56 py-2 px-4 rounded text-xs font-bold text-white bg-[#28a745] hover:bg-[#218838] shadow-sm transition-colors disabled:opacity-50"
            >
              {isPendingRequest ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>

      {/* Card 4: Payment Instructions */}
      <div className="card rounded-2 border border-gray-200 bg-white shadow-xs overflow-hidden">
        <div className="card-header px-4 py-3 border-b border-gray-100 bg-[#f8f9fb]">
          <h6 className="font-semibold text-sm text-gray-800 mb-0">Payment Instructions</h6>
        </div>
        <form onSubmit={handleUpdatePaymentInstructions} className="card-body p-5 space-y-4">
          {/* Image For Payment QR Code */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            <label className="md:col-span-4 text-xs font-semibold text-gray-700">
              Image For Payment QR Code
            </label>
            <div className="md:col-span-8">
              <div className="flex rounded border border-gray-200 overflow-hidden bg-white">
                <span className="px-3 py-2 bg-gray-100 text-xs font-medium text-gray-600 border-r border-gray-200 shrink-0">
                  Browse
                </span>
                <input
                  type="text"
                  placeholder="QR code image URL"
                  value={imageForPaymentQrcode}
                  onChange={(e) => setImageForPaymentQrcode(e.target.value)}
                  className="w-full px-3 py-2 text-xs text-gray-900 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Payment Instructions */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
            <label className="md:col-span-4 text-xs font-semibold text-gray-700 pt-2">
              Payment Instructions
            </label>
            <div className="md:col-span-8">
              <textarea
                rows={4}
                value={prePaymentInstruction}
                onChange={(e) => setPrePaymentInstruction(e.target.value)}
                placeholder="Enter deposit payment instructions..."
                className="w-full rounded border border-gray-200 p-3 text-xs text-gray-900 focus:border-[#d43533] focus:outline-hidden"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isPendingPayment}
              className="w-full sm:w-56 py-2 px-4 rounded text-xs font-bold text-white bg-[#28a745] hover:bg-[#218838] shadow-sm transition-colors disabled:opacity-50"
            >
              {isPendingPayment ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
