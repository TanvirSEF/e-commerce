"use client"

import React, { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { createCustomerPackageAction, updateCustomerPackageAction } from "@/app/actions/customer-package-actions"
import type { CustomerPackageItem } from "@/types/customer-package"
import { MediaPickerModal } from "@/components/ui/media-picker-modal"
import { Image as ImageIcon } from "lucide-react"

interface Props {
  initialData?: CustomerPackageItem
}

export function PackageForm({ initialData }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [name, setName] = useState(initialData?.name ?? "")
  const [amount, setAmount] = useState(String(initialData?.amount ?? ""))
  const [productUpload, setProductUpload] = useState(String(initialData?.productUpload ?? ""))
  const [logo, setLogo] = useState(initialData?.logo ?? "")
  const [error, setError] = useState("")

  const [showMediaPicker, setShowMediaPicker] = useState(false)

  const isEdit = !!initialData

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!name.trim()) { setError("Package name is required."); return }
    if (amount === "" || isNaN(Number(amount))) { setError("Amount is required (0 for free)."); return }
    if (!productUpload || isNaN(Number(productUpload))) { setError("Product upload limit is required."); return }

    startTransition(async () => {
      try {
        const data = {
          name: name.trim(),
          amount: parseFloat(amount),
          productUpload: parseInt(productUpload),
          logo: logo || undefined,
        }

        if (isEdit && initialData) {
          await updateCustomerPackageAction(initialData.id, data)
        } else {
          await createCustomerPackageAction(data)
        }

        router.push("/admin/customer-packages")
      } catch {
        setError("Something went wrong. Please try again.")
      }
    })
  }

  return (
    <div className="max-w-lg">
      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded shadow-sm">
        <div className="px-5 py-4 border-b border-gray-100">
          <h5 className="text-sm font-semibold text-gray-800">
            {isEdit ? "Edit Package" : "Add New Package"}
          </h5>
        </div>

        <div className="p-5 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Package Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Basic Package"
              className="w-full text-xs border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Amount (৳) <span className="text-red-500">*</span>
              <span className="ml-1 text-gray-400 font-normal">(0 = Free)</span>
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="w-full text-xs border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
            />
          </div>

          {/* Product Upload Limit */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Product Upload Limit <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              step="1"
              value={productUpload}
              onChange={(e) => setProductUpload(e.target.value)}
              placeholder="e.g. 10"
              className="w-full text-xs border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
            />
          </div>

          {/* Logo */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Package Logo</label>
            <div className="flex items-center gap-3">
              {logo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logo} alt="Package logo" className="h-12 w-12 object-contain border rounded" />
              )}
              <button
                type="button"
                onClick={() => setShowMediaPicker(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border border-gray-300 rounded hover:bg-gray-50 text-gray-600"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                {logo ? "Change Logo" : "Select Logo"}
              </button>
              {logo && (
                <button type="button" onClick={() => setLogo("")} className="text-xs text-red-500 hover:underline">Remove</button>
              )}
            </div>
          </div>

          <MediaPickerModal
            isOpen={showMediaPicker}
            onClose={() => setShowMediaPicker(false)}
            onSelect={(urls) => { setLogo(urls[0] || ""); setShowMediaPicker(false) }}
            type="image"
          />

          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-100 flex items-center gap-3">
          <button
            type="submit"
            disabled={isPending}
            className="px-5 py-2 text-xs font-semibold bg-[#d43533] text-white rounded hover:bg-[#c12e2c] disabled:opacity-60 transition-colors"
          >
            {isPending ? "Saving..." : isEdit ? "Update Package" : "Save Package"}
          </button>
          <a
            href="/admin/customer-packages"
            className="px-5 py-2 text-xs font-semibold bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
          >
            Cancel
          </a>
        </div>
      </form>
    </div>
  )
}
