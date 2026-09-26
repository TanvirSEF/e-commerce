"use client"

import React, { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Clock, ArrowLeft, Save, AlertCircle } from "lucide-react"
import { createPreorderProductAction } from "@/app/actions/ecommerce-actions"

export function AdminPreorderCreateView() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [sku, setSku] = useState("")
  const [price, setPrice] = useState("99.00")
  const [prepaymentAmount, setPrepaymentAmount] = useState("20.00")
  const [releaseDate, setReleaseDate] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  )
  const [preorderBatchLimit, setPreorderBatchLimit] = useState(100)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError("Product Name is required")
      return
    }

    startTransition(async () => {
      try {
        await createPreorderProductAction({
          name: name.trim(),
          sku: sku.trim(),
          price: String(price),
          prepaymentAmount: String(prepaymentAmount),
          releaseDate: new Date(releaseDate),
          preorderBatchLimit: Number(preorderBatchLimit),
        })
        router.push("/admin/preorder/products")
        router.refresh()
      } catch (err) {
        setError("Failed to create pre-order product")
      }
    })
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/preorder/products"
          className="p-2 rounded-lg border border-gray-200 bg-white text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#d43533]" />
            Add New Pre-Order Product
          </h1>
          <p className="text-xs text-gray-500">Configure advance booking deposit and target launch delivery date</p>
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
            Product Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Next-Gen Gaming Handheld Pro"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3.5 py-2 text-xs text-gray-900 focus:border-[#d43533] focus:outline-hidden"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              SKU (Stock Keeping Unit)
            </label>
            <input
              type="text"
              placeholder="e.g. PO-HH-2026"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2 text-xs font-mono text-gray-900 focus:border-[#d43533] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Target Release / Delivery Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              required
              value={releaseDate}
              onChange={(e) => setReleaseDate(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2 text-xs text-gray-900 focus:border-[#d43533] focus:outline-hidden"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Full Retail Price ($) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="1"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2 text-xs text-gray-900 focus:border-[#d43533] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Prepayment Deposit ($) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              required
              value={prepaymentAmount}
              onChange={(e) => setPrepaymentAmount(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2 text-xs text-gray-900 focus:border-[#d43533] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Pre-Order Batch Cap <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              required
              value={preorderBatchLimit}
              onChange={(e) => setPreorderBatchLimit(Number(e.target.value))}
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2 text-xs text-gray-900 focus:border-[#d43533] focus:outline-hidden"
            />
          </div>
        </div>

        <div className="pt-2 flex items-center justify-end gap-3">
          <Link
            href="/admin/preorder/products"
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
            {isPending ? "Creating..." : "Save Pre-Order Product"}
          </button>
        </div>
      </form>
    </div>
  )
}
