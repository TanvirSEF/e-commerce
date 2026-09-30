"use client"

import React, { useState, useTransition } from "react"
import { updatePreorderBusinessSettingAction } from "@/app/actions/preorder-actions"

interface PreorderGeneralCardProps {
  initialImage: string
  initialShipping: string
  onFeedback: (type: "success" | "error", text: string) => void
}

export function PreorderGeneralCard({
  initialImage,
  initialShipping,
  onFeedback,
}: PreorderGeneralCardProps) {
  const [imageForFaqAdvertisement, setImageForFaqAdvertisement] = useState(initialImage)
  const [preorderFlatRateShipping, setPreorderFlatRateShipping] = useState(initialShipping)
  const [isPending, startTransition] = useTransition()

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      try {
        await Promise.all([
          updatePreorderBusinessSettingAction(
            "image_for_faq_advertisement",
            imageForFaqAdvertisement
          ),
          updatePreorderBusinessSettingAction(
            "preorder_flat_rate_shipping",
            preorderFlatRateShipping
          ),
        ])
        onFeedback("success", "PreOrder Settings updated successfully")
      } catch (err: any) {
        onFeedback("error", err?.message || "Failed to update preorder settings")
      }
    })
  }

  return (
    <div className="card rounded-2 border border-gray-200 bg-white shadow-xs overflow-hidden">
      <div className="card-header px-4 py-3 border-b border-gray-100 bg-[#f8f9fb]">
        <h6 className="font-semibold text-sm text-gray-800 mb-0">PreOrder Settings</h6>
      </div>
      <form onSubmit={handleUpdate} className="card-body p-5 space-y-4">
        {/* Image For Product Marketing */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <label className="md:col-span-4 text-xs font-semibold text-gray-700">
            Image For Product Marketing
          </label>
          <div className="md:col-span-8">
            <div className="flex rounded border border-gray-200 overflow-hidden bg-white">
              <span className="px-3 py-2 bg-gray-100 text-xs font-medium text-gray-600 border-r border-gray-200 shrink-0">
                Browse
              </span>
              <input
                type="text"
                placeholder="Choose File or URL"
                value={imageForFaqAdvertisement}
                onChange={(e) => setImageForFaqAdvertisement(e.target.value)}
                className="w-full px-3 py-2 text-xs text-gray-900 focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Preorder Flat Rate Shipping */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <label className="md:col-span-4 text-xs font-semibold text-gray-700">
            Preorder Flat Rate Shipping
          </label>
          <div className="md:col-span-8">
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="50"
              value={preorderFlatRateShipping}
              onChange={(e) => setPreorderFlatRateShipping(e.target.value)}
              className="w-full rounded border border-gray-200 px-3 py-2 text-xs text-gray-900 max-w-sm focus:border-[#d43533] focus:outline-hidden"
            />
          </div>
        </div>

        {/* Update button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="w-full sm:w-56 py-2 px-4 rounded text-xs font-bold text-white bg-[#28a745] hover:bg-[#218838] shadow-sm transition-colors disabled:opacity-50"
          >
            {isPending ? "Updating..." : "Update"}
          </button>
        </div>
      </form>
    </div>
  )
}
