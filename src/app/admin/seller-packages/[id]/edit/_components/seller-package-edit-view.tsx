"use client"

import React, { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { PackageCheck, ArrowLeft, Save, AlertCircle } from "lucide-react"
import { updateSellerPackageAction } from "@/app/actions/ecommerce-actions"
import type { SellerPackage } from "@/db/schema"

interface SellerPackageEditViewProps {
  packageData: SellerPackage
}

export function SellerPackageEditView({ packageData }: SellerPackageEditViewProps) {
  const router = useRouter()
  const [name, setName] = useState(packageData.name)
  const [amount, setAmount] = useState(packageData.amount)
  const [productUploadLimit, setProductUploadLimit] = useState(packageData.productUploadLimit)
  const [duration, setDuration] = useState(packageData.duration)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError("Package name is required")
      return
    }

    startTransition(async () => {
      try {
        await updateSellerPackageAction(packageData.id, {
          name: name.trim(),
          amount: String(amount),
          productUploadLimit: Number(productUploadLimit),
          duration: Number(duration),
        })
        router.push("/admin/seller-packages")
        router.refresh()
      } catch (err) {
        setError("Failed to update package")
      }
    })
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/seller-packages"
          className="p-2 rounded-lg border border-gray-200 bg-white text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <PackageCheck className="w-5 h-5 text-[#d43533]" />
            Edit Seller Package: {packageData.name}
          </h1>
          <p className="text-xs text-gray-500">Update quota and pricing terms</p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 text-xs rounded-lg border bg-red-50 text-red-800 border-red-200">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Package Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3.5 py-2 text-xs text-gray-900 focus:border-[#d43533] focus:outline-hidden"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Amount / Price ($) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2 text-xs text-gray-900 focus:border-[#d43533] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Product Upload Limit <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              required
              value={productUploadLimit}
              onChange={(e) => setProductUploadLimit(Number(e.target.value))}
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2 text-xs text-gray-900 focus:border-[#d43533] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Duration (Days) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              required
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2 text-xs text-gray-900 focus:border-[#d43533] focus:outline-hidden"
            />
          </div>
        </div>

        <div className="pt-2 flex items-center justify-end gap-3">
          <Link
            href="/admin/seller-packages"
            className="px-4 py-2 text-xs font-medium text-gray-600 hover:text-gray-900"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#d43533] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#b82a28] transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isPending ? "Saving..." : "Update Package"}
          </button>
        </div>
      </form>
    </div>
  )
}
