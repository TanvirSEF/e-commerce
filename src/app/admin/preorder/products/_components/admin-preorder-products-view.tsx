"use client"

import React, { useState, useTransition } from "react"
import Link from "next/link"
import Image from "next/image"
import { Clock, Plus, Search, Calendar, CheckCircle2, AlertCircle } from "lucide-react"
import {
  togglePreorderPublishedAction,
  togglePreorderFeaturedAction,
} from "@/app/actions/ecommerce-actions"
import type { PreorderProduct } from "@/db/schema"

interface AdminPreorderProductsViewProps {
  initialProducts: PreorderProduct[]
}

export function AdminPreorderProductsView({ initialProducts }: AdminPreorderProductsViewProps) {
  const [products, setProducts] = useState<PreorderProduct[]>(initialProducts)
  const [search, setSearch] = useState("")
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleTogglePublished = (id: number, current: boolean) => {
    startTransition(async () => {
      const ok = await togglePreorderPublishedAction(id, !current)
      if (ok) {
        setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, status: !current } : p)))
        setFeedback({ type: "success", text: "Pre-order product status updated" })
      } else {
        setFeedback({ type: "error", text: "Failed to update status" })
      }
      setTimeout(() => setFeedback(null), 3000)
    })
  }

  const handleToggleFeatured = (id: number, current: boolean) => {
    startTransition(async () => {
      const ok = await togglePreorderFeaturedAction(id, !current)
      if (ok) {
        setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, featured: !current } : p)))
        setFeedback({ type: "success", text: "Pre-order featured flag updated" })
      } else {
        setFeedback({ type: "error", text: "Failed to update featured flag" })
      }
      setTimeout(() => setFeedback(null), 3000)
    })
  }

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.sku && p.sku.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#d43533]" />
            Pre-Order Products Catalog
          </h1>
          <p className="text-xs text-gray-500">Upcoming product launches with advance deposit bookings and quota management</p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/preorder/orders"
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 shadow-xs hover:bg-gray-50 transition-colors"
          >
            Pre-Order Bookings
          </Link>
          <Link
            href="/admin/preorder/settings"
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 shadow-xs hover:bg-gray-50 transition-colors"
          >
            Pre-Order Settings
          </Link>
          <Link
            href="/admin/preorder/products/create"
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#d43533] px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#b82a28] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Pre-Order Product
          </Link>
        </div>
      </div>

      {feedback && (
        <div
          className={`flex items-center gap-2 p-3 text-xs rounded-lg border ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Filter pre-order products by name or SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-gray-200 bg-white focus:border-[#d43533] focus:outline-hidden"
        />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-xs">
        <div className="border-b border-gray-200 px-5 py-3 bg-gray-50/50 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-700">Pre-Order Catalog</span>
          <span className="text-xs font-mono text-gray-400">{filtered.length} products</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50 text-gray-700 uppercase font-semibold border-b border-gray-200">
              <tr>
                <th className="py-3 px-4 w-12">#</th>
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">Total Price</th>
                <th className="py-3 px-4">Prepayment Deposit</th>
                <th className="py-3 px-4">Release Date</th>
                <th className="py-3 px-4">Batch Limit & Filled</th>
                <th className="py-3 px-4 text-center">Featured</th>
                <th className="py-3 px-4 text-center">Published</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((item, idx) => {
                const filledPercent = Math.min(
                  100,
                  Math.round((item.currentPreorders / item.preorderBatchLimit) * 100)
                )
                return (
                  <tr key={item.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono text-gray-400">{idx + 1}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 shrink-0 rounded-lg overflow-hidden border border-gray-100 bg-gray-50">
                          <Image src={item.thumbnail} alt={item.name} fill className="object-cover" />
                        </div>
                        <div>
                          <span className="font-semibold text-gray-900 block">{item.name}</span>
                          <span className="text-[11px] font-mono text-gray-400">{item.sku}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-bold text-gray-900">${item.price}</td>
                    <td className="py-3 px-4 font-bold text-emerald-700">${item.prepaymentAmount}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
                        <Calendar className="w-3 h-3 text-gray-500" />
                        {new Date(item.releaseDate).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-3 px-4 min-w-[140px]">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <span className="font-semibold text-gray-800">{item.currentPreorders} reserved</span>
                          <span className="text-gray-400">/ {item.preorderBatchLimit} max</span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-600 rounded-full"
                            style={{ width: `${filledPercent}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(item.id, item.featured)}
                        disabled={isPending}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                          item.featured ? "bg-amber-500" : "bg-gray-200"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                            item.featured ? "translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleTogglePublished(item.id, item.status)}
                        disabled={isPending}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                          item.status ? "bg-emerald-500" : "bg-gray-200"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                            item.status ? "translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
