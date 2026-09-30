"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import { X, Search, Check } from "lucide-react"
import {
  searchProductsForPromotionalAction,
  updatePromotionalProductsAction,
} from "@/app/actions/promotional-product-actions"
import type { SearchProductForPromotionalItem } from "@/services/promotional-product-service"

interface PromotionalProductsOffcanvasProps {
  isOpen: boolean
  categories: { id: number; name: string }[]
  onClose: () => void
  onSuccess: () => void
  showNotification: (type: "success" | "danger", message: string) => void
}

export function PromotionalProductsOffcanvas({
  isOpen,
  categories,
  onClose,
  onSuccess,
  showNotification,
}: PromotionalProductsOffcanvasProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [searchKey, setSearchKey] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [productsList, setProductsList] = useState<SearchProductForPromotionalItem[]>([])
  const [selectedIds, setSelectedIds] = useState<number[]>([])

  // Load products when drawer opens or filter changes
  useEffect(() => {
    if (!isOpen) return

    let isMounted = true
    setLoading(true)

    const timer = setTimeout(async () => {
      try {
        const results = await searchProductsForPromotionalAction({
          categoryId: selectedCategory ? Number(selectedCategory) : undefined,
          searchKey: searchKey.trim() || undefined,
        })
        if (isMounted) {
          setProductsList(results)
          // Pre-populate selectedIds with those already promotional
          setSelectedIds(results.filter((p) => p.promotional).map((p) => p.id))
        }
      } catch (err) {
        console.error("Error searching products:", err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }, 300)

    return () => {
      isMounted = false
      clearTimeout(timer)
    }
  }, [isOpen, selectedCategory, searchKey])

  // ESC key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleToggleProduct = (id: number, isAlreadyPromotional: boolean) => {
    if (isAlreadyPromotional) return
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleSave = async () => {
    if (productsList.length === 0) {
      showNotification("danger", "No products found to update")
      return
    }

    setSubmitting(true)
    try {
      const allIds = productsList.map((p) => p.id)
      const checkedIds = selectedIds

      const ok = await updatePromotionalProductsAction(allIds, checkedIds)
      if (ok) {
        showNotification("success", "Promotional products updated successfully")
        onSuccess()
        onClose()
      } else {
        showNotification("danger", "Failed to update promotional products")
      }
    } catch (err) {
      console.error("Error updating promotional products:", err)
      showNotification("danger", "Something went wrong")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[1045] overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-xl bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
            <h2 className="text-base font-bold text-slate-800">
              Add Product In Promotional
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {/* Filters Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full h-10 px-3 text-xs bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:border-blue-600 font-medium text-slate-700"
                >
                  <option value="">Choose Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by Product Name"
                  value={searchKey}
                  onChange={(e) => setSearchKey(e.target.value)}
                  className="w-full h-10 pl-9 pr-3 text-xs bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:border-blue-600 font-medium text-slate-700"
                />
              </div>
            </div>

            {/* Products Table */}
            <div className="border border-slate-200 rounded-md overflow-hidden min-h-[300px]">
              {loading ? (
                <div className="flex items-center justify-center h-48 text-sm text-slate-500">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2" />
                  Loading products...
                </div>
              ) : productsList.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-center p-6 text-slate-400">
                  <p className="font-semibold text-sm">No products found</p>
                  <p className="text-xs mt-1">Try another category or search keyword.</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse text-xs">
                  <tbody className="divide-y divide-slate-100">
                    {productsList.map((product) => {
                      const isChecked = selectedIds.includes(product.id)
                      const isPrePromotional = product.promotional

                      return (
                        <tr
                          key={product.id}
                          onClick={() => handleToggleProduct(product.id, isPrePromotional)}
                          className={`cursor-pointer transition-colors ${
                            isPrePromotional
                              ? "bg-blue-50/40 text-slate-700"
                              : isChecked
                              ? "bg-slate-50"
                              : "hover:bg-slate-50/60"
                          }`}
                        >
                          <td className="w-12 px-3 py-2.5 text-center">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              disabled={isPrePromotional}
                              onChange={() =>
                                handleToggleProduct(product.id, isPrePromotional)
                              }
                              className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-0 cursor-pointer disabled:opacity-50"
                            />
                          </td>
                          <td className="w-14 px-2 py-2.5">
                            <div className="w-10 h-10 rounded border border-slate-200 overflow-hidden relative shrink-0 bg-white">
                              <Image
                                src={product.thumbnailImg}
                                alt={product.name}
                                fill
                                sizes="40px"
                                className="object-cover"
                              />
                            </div>
                          </td>
                          <td className="px-3 py-2.5">
                            <div className="font-medium text-slate-800 line-clamp-1">
                              {product.name}
                            </div>
                            {isPrePromotional && (
                              <span className="inline-block mt-0.5 text-[10px] text-blue-600 font-semibold bg-blue-100/60 px-1.5 py-0.5 rounded">
                                Already Promotional
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-2.5 text-right font-bold text-slate-900 whitespace-nowrap">
                            ৳{product.unitPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-slate-200 px-6 py-4 bg-slate-50 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-5 py-2 text-xs font-semibold text-slate-600 border border-slate-300 rounded hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={submitting || productsList.length === 0}
              className="px-6 py-2 text-xs font-bold text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
            >
              {submitting ? "Saving..." : "Add"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
