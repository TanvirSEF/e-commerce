"use client"

import React, { useState, useTransition } from "react"
import { updatePreorderBusinessSettingAction } from "@/app/actions/preorder-actions"

interface PreorderCommissionCardProps {
  initialSellerToggle: string
  initialCommission: string
  onFeedback: (type: "success" | "error", text: string) => void
}

export function PreorderCommissionCard({
  initialSellerToggle,
  initialCommission,
  onFeedback,
}: PreorderCommissionCardProps) {
  const [sellerPreorderProduct, setSellerPreorderProduct] = useState(
    initialSellerToggle === "1"
  )
  const [preorderSellerCommission, setPreorderSellerCommission] = useState(
    initialCommission
  )
  const [isPending, startTransition] = useTransition()

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      try {
        await Promise.all([
          updatePreorderBusinessSettingAction(
            "seller_preorder_product",
            sellerPreorderProduct ? "1" : "0"
          ),
          updatePreorderBusinessSettingAction(
            "preorder_seller_commission",
            preorderSellerCommission
          ),
        ])
        onFeedback("success", "Preorder Seller Commission settings updated successfully")
      } catch (err: any) {
        onFeedback("error", err?.message || "Failed to update commission settings")
      }
    })
  }

  return (
    <div className="card rounded-2 border border-gray-200 bg-white shadow-xs overflow-hidden">
      <div className="card-header px-4 py-3 border-b border-gray-100 bg-[#f8f9fb]">
        <h6 className="font-semibold text-sm text-gray-800 mb-0">Preorder Seller Commission</h6>
      </div>
      <form onSubmit={handleUpdate} className="card-body p-5 space-y-4">
        {/* Preorder Product for Seller */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <label className="md:col-span-4 text-xs font-semibold text-gray-700">
            Preorder Product for Seller
          </label>
          <div className="md:col-span-8">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={sellerPreorderProduct}
                onChange={(e) => setSellerPreorderProduct(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>
        </div>

        {/* Preorder Seller Commission */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <label className="md:col-span-4 text-xs font-semibold text-gray-700">
            Preorder Seller Commission
          </label>
          <div className="md:col-span-8">
            <div className="flex rounded border border-gray-200 overflow-hidden bg-white max-w-sm">
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="Preorder Seller Commission"
                value={preorderSellerCommission}
                onChange={(e) => setPreorderSellerCommission(e.target.value)}
                className="w-full px-3 py-2 text-xs text-gray-900 focus:outline-hidden"
              />
              <span className="px-3 py-2 bg-gray-100 text-xs font-semibold text-gray-600 border-l border-gray-200">
                %
              </span>
            </div>
          </div>
        </div>

        {/* 1:1 Update button */}
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
