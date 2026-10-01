"use client"

import React, { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { UploadCloud, CheckCircle2, AlertCircle } from "lucide-react"
import { installAddonAction } from "@/app/actions/addon-actions"

export function AdminAddonsCreateView() {
  const router = useRouter()
  const [domainPurchaseCode, setDomainPurchaseCode] = useState("")
  const [purchaseCode, setPurchaseCode] = useState("")
  const [zipFile, setZipFile] = useState<File | null>(null)
  const [error, setError] = useState("")
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!domainPurchaseCode.trim()) {
      setError("Main item purchase code is required.")
      return
    }
    if (!purchaseCode.trim()) {
      setError("Addon purchase code is required.")
      return
    }
    if (!zipFile) {
      setError("Please select an addon .zip file.")
      return
    }

    startTransition(async () => {
      try {
        const formData = new FormData()
        formData.set("domain_purchase_code", domainPurchaseCode.trim())
        formData.set("purchase_code", purchaseCode.trim())
        formData.set("addon_zip", zipFile)

        const res = await installAddonAction(formData)
        if (res.success) {
          router.push("/admin/addons")
        } else {
          setError(res.error || "Installation failed.")
        }
      } catch {
        setError("Network or server error during addon installation.")
      }
    })
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
        {/* 1:1 Active eCommerce Card Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h5 className="text-sm font-semibold text-gray-800">
            Install/Update Addon
          </h5>
          <Link
            href="/admin/addons"
            className="text-xs text-gray-500 hover:text-gray-800"
          >
            Back to list
          </Link>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded text-xs text-red-600">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Main item purchase code */}
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2">
              <label
                htmlFor="domain_purchase_code"
                className="text-xs font-medium text-gray-700 sm:col-span-1"
              >
                Main item purchase code <span className="text-red-500">*</span>
              </label>
              <div className="sm:col-span-3">
                <input
                  type="text"
                  id="domain_purchase_code"
                  value={domainPurchaseCode}
                  onChange={(e) => setDomainPurchaseCode(e.target.value)}
                  placeholder="e.g. 1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d"
                  className="w-full text-xs border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
                  required
                />
              </div>
            </div>

            {/* Addon purchase code */}
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2">
              <label
                htmlFor="purchase_code"
                className="text-xs font-medium text-gray-700 sm:col-span-1"
              >
                Addon purchase code <span className="text-red-500">*</span>
              </label>
              <div className="sm:col-span-3">
                <input
                  type="text"
                  id="purchase_code"
                  value={purchaseCode}
                  onChange={(e) => setPurchaseCode(e.target.value)}
                  placeholder="e.g. 9z8y7x6w-5v4u-3t2s-1r0q-9p8o7n6m5l4k"
                  className="w-full text-xs border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
                  required
                />
              </div>
            </div>

            {/* Zip File Input */}
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2">
              <label
                htmlFor="addon_zip"
                className="text-xs font-medium text-gray-700 sm:col-span-1"
              >
                Zip File <span className="text-red-500">*</span>
              </label>
              <div className="sm:col-span-3">
                <div className="relative border border-gray-300 rounded px-3 py-2 bg-gray-50/50 flex items-center justify-between cursor-pointer hover:bg-gray-50">
                  <span className="text-xs text-gray-600 truncate">
                    {zipFile ? zipFile.name : "Choose file (e.g. addon.zip)"}
                  </span>
                  <UploadCloud className="w-4 h-4 text-gray-400 shrink-0 ml-2" />
                  <input
                    type="file"
                    id="addon_zip"
                    accept=".zip,application/zip"
                    onChange={(e) => setZipFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Form Submit Footer */}
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-2 bg-gray-50/50">
            <Link
              href="/admin/addons"
              className="px-4 py-2 text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isPending}
              className="px-5 py-2 text-xs font-semibold bg-[#1d3557] hover:bg-[#16304d] text-white rounded disabled:opacity-60 transition-colors shadow-xs"
            >
              {isPending ? "Installing..." : "Install/Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
