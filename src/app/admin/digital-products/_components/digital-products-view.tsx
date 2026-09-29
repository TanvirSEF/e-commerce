"use client"

import React, { useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { type DigitalProductItem } from "@/services/product-service"
import {
  deleteDigitalProductAction,
  toggleProductPublishedAction,
  toggleProductFeaturedAction,
  toggleProductTodaysDealAction,
} from "@/app/actions/ecommerce-actions"
import { formatPrice } from "@/lib/utils"
import {
  Plus,
  Search,
  Trash2,
  Download,
  ExternalLink,
  Edit,
  FileCode,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"

interface DigitalProductsViewProps {
  initialProducts: DigitalProductItem[]
}

export function DigitalProductsView({ initialProducts }: DigitalProductsViewProps) {
  const router = useRouter()
  const [productsList, setProductsList] = useState<DigitalProductItem[]>(initialProducts)
  const [search, setSearch] = useState("")
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [, startTransition] = useTransition()

  const showToast = (type: "success" | "error", text: string) => {
    setFeedback({ type, text })
    setTimeout(() => setFeedback(null), 3000)
  }

  const filtered = productsList.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.categoryName.toLowerCase().includes(search.toLowerCase())
  )

  const handleTogglePublished = async (id: number, currentStatus: boolean) => {
    const nextStatus = !currentStatus
    setProductsList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, published: nextStatus } : p))
    )
    startTransition(async () => {
      const res = await toggleProductPublishedAction(id, nextStatus)
      if (res.success) {
        showToast("success", `Digital product ${nextStatus ? "published" : "unpublished"} successfully`)
      } else {
        showToast("error", "Failed to update published status")
      }
    })
  }

  const handleToggleTodaysDeal = async (id: number, currentStatus: boolean) => {
    const nextStatus = !currentStatus
    setProductsList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, todaysDeal: nextStatus } : p))
    )
    startTransition(async () => {
      const res = await toggleProductTodaysDealAction(id, nextStatus)
      if (res.success) {
        showToast("success", `Today's Deal ${nextStatus ? "activated" : "deactivated"}`)
      } else {
        showToast("error", "Failed to update Today's Deal")
      }
    })
  }

  const handleToggleFeatured = async (id: number, currentStatus: boolean) => {
    const nextStatus = !currentStatus
    setProductsList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, featured: nextStatus } : p))
    )
    startTransition(async () => {
      const res = await toggleProductFeaturedAction(id, nextStatus)
      if (res.success) {
        showToast("success", `Product ${nextStatus ? "marked as featured" : "removed from featured"}`)
      }
    })
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    try {
      await deleteDigitalProductAction(deleteId)
      setProductsList((prev) => prev.filter((p) => p.id !== deleteId))
      showToast("success", "Digital product deleted successfully")
      setDeleteId(null)
      router.refresh()
    } catch {
      showToast("error", "Failed to delete digital product")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Digital Products</h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage downloadable software, source code, eBooks, and digital licenses (Laravel 1:1)
          </p>
        </div>
        <Link
          href="/admin/digital-products/create"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#d43533] hover:bg-[#b82d2b] text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add New Digital Product
        </Link>
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

      {/* Main Card */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {/* Toolbar Header */}
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#fafbfc]">
          <h2 className="text-sm font-semibold text-gray-800">
            All Digital Products ({filtered.length})
          </h2>
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search digital products..."
              className="text-xs pl-8 pr-3 py-1.5 border border-gray-300 rounded-lg outline-none w-56 sm:w-64 focus:border-[#d43533]"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f8f9fa] border-b border-gray-200 text-gray-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Base Price</th>
                <th className="py-3 px-4 text-center">Today&apos;s Deal</th>
                <th className="py-3 px-4 text-center">Published</th>
                <th className="py-3 px-4 text-center">Featured</th>
                <th className="py-3 px-4 text-right">Options</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-400">
                    No digital products found. Click &quot;Add New Digital Product&quot; to create one.
                  </td>
                </tr>
              ) : (
                filtered.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3.5 px-4 text-center text-gray-400 font-medium">{index + 1}</td>
                    <td className="py-3.5 px-4 font-semibold text-gray-800">
                      <div className="flex items-center gap-3">
                        {item.thumbnailImg ? (
                          <img
                            src={item.thumbnailImg}
                            alt={item.name}
                            className="w-10 h-10 object-cover rounded-lg border border-gray-200 shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 shrink-0">
                            <FileCode className="w-5 h-5" />
                          </div>
                        )}
                        <div>
                          <p className="line-clamp-1">{item.name}</p>
                          <p className="text-[10px] text-gray-400 font-mono">slug: {item.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-gray-600">
                      <span className="px-2 py-0.5 bg-gray-100 rounded text-gray-700 text-[11px]">
                        {item.categoryName}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-gray-900 font-mono">
                      {formatPrice(item.unitPrice)}
                    </td>

                    {/* Today's Deal Switch Toggle */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleTodaysDeal(item.id, item.todaysDeal)}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                          item.todaysDeal ? "bg-[#d43533]" : "bg-gray-200"
                        }`}
                        title="Toggle Today's Deal"
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                            item.todaysDeal ? "translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </td>

                    {/* Published Switch Toggle */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleTogglePublished(item.id, item.published)}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                          item.published ? "bg-emerald-500" : "bg-gray-200"
                        }`}
                        title="Toggle Published Status"
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                            item.published ? "translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </td>

                    {/* Featured Toggle Button */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(item.id, item.featured)}
                        className="cursor-pointer p-1"
                        title="Toggle Featured Status"
                      >
                        {item.featured ? (
                          <span className="inline-block w-3.5 h-3.5 rounded-full bg-amber-400 shadow-xs ring-2 ring-amber-100" />
                        ) : (
                          <span className="inline-block w-3.5 h-3.5 rounded-full bg-slate-200" />
                        )}
                      </button>
                    </td>

                    {/* Options */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {item.digitalFile && (
                          <a
                            href={item.digitalFile}
                            target="_blank"
                            rel="noreferrer"
                            title="Download delivery asset"
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                        )}
                        <Link
                          href={`/product/${item.slug}`}
                          target="_blank"
                          title="View on storefront"
                          className="p-1.5 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/digital-products/create?edit=${item.id}`}
                          title="Edit digital product"
                          className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeleteId(item.id)}
                          title="Delete digital product"
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Delete Digital Product?</h3>
              <p className="text-xs text-gray-500 mt-1">
                Are you sure you want to remove this digital product from the catalog? Download links will be revoked.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                disabled={isDeleting}
                className="px-4 py-2 border border-gray-300 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg cursor-pointer"
              >
                {isDeleting ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
