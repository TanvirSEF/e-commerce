"use client"

import React, { useState, useTransition } from "react"
import Link from "next/link"
import Image from "next/image"
import { Clock, Plus, Search, Calendar, Trash2, CheckCircle2, AlertCircle, X } from "lucide-react"
import type { PreorderProduct } from "@/db/schema"
import {
  togglePreorderPublishedAction,
  togglePreorderFeaturedAction,
  deletePreorderProductAction,
  createPreorderProductAction,
} from "@/app/actions/ecommerce-actions"

interface SellerPreorderProductsViewProps {
  initialProducts: PreorderProduct[]
  sellerSlug: string
}

export function SellerPreorderProductsView({ initialProducts, sellerSlug }: SellerPreorderProductsViewProps) {
  const [products, setProducts] = useState<PreorderProduct[]>(initialProducts)
  const [search, setSearch] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null)
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  // Form state
  const [formName, setFormName] = useState("")
  const [formSku, setFormSku] = useState("")
  const [formPrice, setFormPrice] = useState("499.00")
  const [formPrepayment, setFormPrepayment] = useState("99.00")
  const [formReleaseDate, setFormReleaseDate] = useState(
    new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0]
  )
  const [formBatchLimit, setFormBatchLimit] = useState(100)

  const showToast = (type: "success" | "error", text: string) => {
    setFeedback({ type, text })
    setTimeout(() => setFeedback(null), 3000)
  }

  const handleToggleStatus = (id: number, currentStatus: boolean) => {
    startTransition(async () => {
      const next = !currentStatus
      const ok = await togglePreorderPublishedAction(id, next)
      if (ok) {
        setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, status: next } : p)))
        showToast("success", `Pre-order status updated to ${next ? "published" : "unpublished"}`)
      } else {
        showToast("error", "Failed to update status")
      }
    })
  }

  const handleToggleFeatured = (id: number, currentFeatured: boolean) => {
    startTransition(async () => {
      const next = !currentFeatured
      const ok = await togglePreorderFeaturedAction(id, next)
      if (ok) {
        setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, featured: next } : p)))
        showToast("success", `Featured status updated to ${next ? "featured" : "regular"}`)
      } else {
        showToast("error", "Failed to update featured status")
      }
    })
  }

  const handleDelete = () => {
    if (!deleteTargetId) return
    startTransition(async () => {
      const ok = await deletePreorderProductAction(deleteTargetId)
      if (ok) {
        setProducts((prev) => prev.filter((p) => p.id !== deleteTargetId))
        showToast("success", "Pre-order product deleted successfully")
        setDeleteTargetId(null)
      } else {
        showToast("error", "Failed to delete product")
      }
    })
  }

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formName.trim()) return

    startTransition(async () => {
      const created = await createPreorderProductAction({
        name: formName.trim(),
        sku: formSku.trim() || `PO-${Date.now().toString().slice(-6)}`,
        price: formPrice,
        prepaymentAmount: formPrepayment,
        releaseDate: new Date(formReleaseDate),
        preorderBatchLimit: formBatchLimit,
        sellerSlug,
      })
      if (created) {
        setProducts((prev) => [created, ...prev])
        showToast("success", "Pre-order item listed successfully!")
        setIsModalOpen(false)
        setFormName("")
        setFormSku("")
      } else {
        showToast("error", "Failed to create pre-order product")
      }
    })
  }

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="space-y-4">
      {feedback && (
        <div
          className={`flex items-center gap-2 p-3 text-sm rounded border ${
            feedback.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          {feedback.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {feedback.text}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#d43533]" />
            Vendor Pre-Order Catalog
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage upcoming releases and pre-booked batches</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/seller/preorder/orders"
            className="rounded border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 shadow-xs transition-colors"
          >
            Customer Bookings
          </Link>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded bg-[#d43533] hover:bg-[#b82a28] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Pre-Order
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="rounded border border-gray-200 bg-white shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border-b border-gray-100">
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search pre-order products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded border border-gray-300 text-xs text-gray-800 focus:outline-none focus:border-[#d43533]"
            />
          </div>
          <span className="text-xs font-medium text-gray-400">{filtered.length} products</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-[#f8f9fa] border-b border-gray-200 text-gray-600 font-bold uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4 w-10">#</th>
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">Retail Price</th>
                <th className="py-3 px-4">Deposit Amount</th>
                <th className="py-3 px-4">Release Date</th>
                <th className="py-3 px-4">Batch Progress</th>
                <th className="py-3 px-4 text-center">Published</th>
                <th className="py-3 px-4 text-center">Featured</th>
                <th className="py-3 px-4 text-right">Options</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-gray-400">
                    No pre-order products listed
                  </td>
                </tr>
              ) : (
                filtered.map((item, idx) => {
                  const filledPercent = Math.min(
                    100,
                    Math.round((item.currentPreorders / item.preorderBatchLimit) * 100)
                  )
                  return (
                    <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono text-gray-400">{idx + 1}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-9 w-9 shrink-0 rounded overflow-hidden border border-gray-200 bg-gray-50">
                            <Image src={item.thumbnail || "/assets/img/placeholder.jpg"} alt={item.name} fill className="object-cover" />
                          </div>
                          <div>
                            <span className="font-semibold text-gray-900 block">{item.name}</span>
                            <span className="text-[10px] font-mono text-gray-400">{item.sku}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-bold text-gray-900">${item.price}</td>
                      <td className="py-3 px-4 font-bold text-emerald-600">${item.prepaymentAmount}</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          {new Date(item.releaseDate).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="py-3 px-4 min-w-[130px]">
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px]">
                            <span className="font-semibold text-gray-800">{item.currentPreorders}</span>
                            <span className="text-gray-400">/ {item.preorderBatchLimit} max</span>
                          </div>
                          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${filledPercent}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={item.status}
                          onChange={() => handleToggleStatus(item.id, item.status)}
                          className="rounded border-gray-300 text-[#d43533] focus:ring-[#d43533] cursor-pointer"
                        />
                      </td>
                      <td className="py-3 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={item.featured}
                          onChange={() => handleToggleFeatured(item.id, item.featured)}
                          className="rounded border-gray-300 text-amber-500 focus:ring-amber-500 cursor-pointer"
                        />
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => setDeleteTargetId(item.id)}
                          className="w-7 h-7 rounded-full bg-red-50 text-red-600 hover:bg-red-100 inline-flex items-center justify-center transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-lg bg-white shadow-xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-800">Add Pre-Order Product</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateProduct} className="p-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Next-Gen Gaming Tablet 12-inch"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full rounded border border-gray-300 p-2 text-xs text-gray-800 focus:outline-none focus:border-[#d43533]"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">SKU</label>
                  <input
                    type="text"
                    placeholder="e.g. NGT-12-PRO"
                    value={formSku}
                    onChange={(e) => setFormSku(e.target.value)}
                    className="w-full rounded border border-gray-300 p-2 text-xs text-gray-800 focus:outline-none focus:border-[#d43533]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Batch Limit</label>
                  <input
                    type="number"
                    min={1}
                    value={formBatchLimit}
                    onChange={(e) => setFormBatchLimit(Number(e.target.value))}
                    className="w-full rounded border border-gray-300 p-2 text-xs text-gray-800 focus:outline-none focus:border-[#d43533]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Full Price ($) *</label>
                  <input
                    type="text"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full rounded border border-gray-300 p-2 text-xs text-gray-800 focus:outline-none focus:border-[#d43533]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Prepayment ($) *</label>
                  <input
                    type="text"
                    required
                    value={formPrepayment}
                    onChange={(e) => setFormPrepayment(e.target.value)}
                    className="w-full rounded border border-gray-300 p-2 text-xs text-gray-800 focus:outline-none focus:border-[#d43533]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Release Date *</label>
                <input
                  type="date"
                  required
                  value={formReleaseDate}
                  onChange={(e) => setFormReleaseDate(e.target.value)}
                  className="w-full rounded border border-gray-300 p-2 text-xs text-gray-800 focus:outline-none focus:border-[#d43533]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-[#d43533] hover:bg-[#b82a28] rounded disabled:opacity-50"
                >
                  {isPending ? "Creating..." : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteTargetId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-lg bg-white p-5 shadow-xl">
            <h4 className="text-sm font-bold text-gray-900">Delete Confirmation</h4>
            <p className="text-xs text-gray-500 mt-2">Are you sure you want to remove this pre-order product?</p>
            <div className="flex justify-end gap-2 mt-5">
              <button type="button" onClick={() => setDeleteTargetId(null)} className="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded">
                Cancel
              </button>
              <button type="button" onClick={handleDelete} disabled={isPending} className="px-4 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded disabled:opacity-50">
                {isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
