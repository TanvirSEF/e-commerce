"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Plus, ChevronRight, Package, Edit3, Trash2, X } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import {
  toggleCustomerProductStatusAction,
  deleteCustomerProductAction,
} from "@/app/actions/customer-product-actions"
import type { ClassifiedProductItem } from "@/services/customer-product-service"

interface CustomerProductsListViewProps {
  initialProducts?: ClassifiedProductItem[]
}

export function CustomerProductsListView({ initialProducts = [] }: CustomerProductsListViewProps) {
  const [products, setProducts] = useState<ClassifiedProductItem[]>(initialProducts ?? [])
  const [productToDelete, setProductToDelete] = useState<ClassifiedProductItem | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [togglingId, setTogglingId] = useState<number | null>(null)

  const handleToggleStatus = async (item: ClassifiedProductItem) => {
    const isCurrentlyActive = item.status === "1" || item.status === "approved"
    const nextStatus = !isCurrentlyActive
    const nextStatusVal = nextStatus ? "1" : "0"

    // Optimistic UI update
    setProducts((prev) =>
      prev.map((p) => (p.id === item.id ? { ...p, status: nextStatusVal } : p))
    )
    setTogglingId(item.id)

    try {
      await toggleCustomerProductStatusAction(item.id, nextStatus)
    } catch {
      // revert on error
      setProducts((prev) =>
        prev.map((p) => (p.id === item.id ? { ...p, status: item.status } : p))
      )
    } finally {
      setTogglingId(null)
    }
  }

  const handleConfirmDelete = async () => {
    if (!productToDelete) return
    setIsDeleting(true)
    try {
      await deleteCustomerProductAction(productToDelete.id)
      setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id))
      setProductToDelete(null)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* 1:1 Active eCommerce CMS Titlebar */}
      <div>
        <h1 className="text-lg sm:text-xl font-bold text-gray-900">Classified Products</h1>
      </div>

      {/* 3 Top Cards Matching products.blade.php 1:1 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Remaining Uploads (Dark Background matching Laravel 1:1) */}
        <div className="bg-[#1b1b28] text-white text-center p-5 rounded border border-gray-900 flex flex-col items-center justify-center min-h-[140px]">
          {/* Active eCommerce Upload SVG */}
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 32 32" className="fill-current mb-2">
            <g transform="translate(-1364 -447)">
              <rect width="2" height="22" rx="1" transform="translate(1379 449)" fill="#fff" />
              <rect width="2" height="12" rx="1" transform="translate(1380 447) rotate(45)" fill="#fff" />
              <rect width="12" height="2" rx="1" transform="translate(1380 447) rotate(45)" fill="#fff" />
              <rect width="32" height="2" rx="1" transform="translate(1364 477)" fill="#fff" />
            </g>
          </svg>
          <div className="text-xs text-gray-300">Remaining Uploads</div>
          <div className="text-2xl sm:text-3xl font-bold mt-1">10</div>
        </div>

        {/* Card 2: Add New Product */}
        <Link
          href="/dashboard/customer-products/create"
          className="bg-gray-50/80 hover:bg-gray-100 text-center p-5 rounded border border-gray-200 transition-colors flex flex-col items-center justify-center min-h-[140px] group"
        >
          <span className="w-12 h-12 rounded-full bg-gray-900 group-hover:bg-[#d43533] text-white flex items-center justify-center mb-2 transition-colors shadow-2xs">
            <Plus className="w-6 h-6" />
          </span>
          <span className="text-xs sm:text-sm font-bold text-gray-900">Add New Product</span>
        </Link>

        {/* Card 3: Current Package */}
        <div className="bg-gray-50/80 text-center p-5 rounded border border-gray-200 flex flex-col items-center justify-center min-h-[140px]">
          <div className="w-10 h-10 rounded-full bg-blue-50 text-[#3490f3] flex items-center justify-center mb-2">
            <Package className="w-5 h-5" />
          </div>
          <div className="text-xs font-semibold text-gray-800">Current Package: Free Package</div>
          <Link
            href="/dashboard/customer-packages"
            className="text-xs font-bold text-[#3490f3] hover:text-[#d43533] mt-1.5 inline-flex items-center gap-0.5 transition-colors"
          >
            Upgrade Package <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="rounded border border-gray-200 bg-white shadow-2xs overflow-hidden">
        {/* Card Header */}
        <div className="border-b border-gray-100 p-4 bg-white flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-gray-900">All Products</h2>
          <span className="text-xs text-gray-500 font-medium">
            {products.length} {products.length === 1 ? "ad" : "ads"} listed
          </span>
        </div>

        {/* Body */}
        {products.length === 0 ? (
          <div className="p-12 text-center">
            <div className="relative mx-auto w-40 h-32 mb-4">
              <Image
                src="/assets/img/nothing.svg"
                alt="No products"
                fill
                className="object-contain"
                priority
              />
            </div>
            <h3 className="text-base font-bold text-gray-800">There isn&apos;t anything added yet</h3>
            <p className="mt-1 text-xs text-gray-500 max-w-sm mx-auto">
              You haven&apos;t posted any classified advertisements yet.
            </p>
            <div className="mt-5">
              <Link
                href="/dashboard/customer-products/create"
                className="inline-flex items-center gap-1.5 rounded bg-[#d43533] px-5 py-2 text-xs font-bold text-white hover:bg-[#9d1b1a] transition-colors shadow-2xs"
              >
                Post an Advertisement
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-gray-200 bg-gray-50/60 text-gray-500 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Available Status</th>
                  <th className="py-3 px-4">Admin Status</th>
                  <th className="py-3 px-4 text-right">Options</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {products.map((item, idx) => {
                  const isActive = item.status === "1" || item.status === "approved"
                  return (
                    <tr key={item.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-gray-400 align-middle">
                        {String(idx + 1).padStart(2, "0")}
                      </td>
                      <td className="py-3.5 px-4 align-middle">
                        <div className="flex items-center gap-3">
                          <div className="relative h-14 w-14 rounded border border-gray-200 overflow-hidden bg-gray-50 shrink-0">
                            <Image
                              src={item.thumbnailImg || "/assets/img/placeholder.jpg"}
                              alt={item.name}
                              fill
                              className="object-cover"
                              onError={(e) => {
                                const target = e.currentTarget
                                if (!target.src.includes("placeholder.jpg")) {
                                  target.src = "/assets/img/placeholder.jpg"
                                }
                              }}
                            />
                          </div>
                          <div>
                            <Link
                              href={`/customer-product/${item.slug}`}
                              className="font-semibold text-gray-900 hover:text-[#d43533] line-clamp-1 transition-colors text-xs sm:text-sm"
                            >
                              {item.name}
                            </Link>
                            <span className="text-[11px] text-gray-500 block mt-0.5">
                              {item.category} • {item.condition}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-gray-900 align-middle whitespace-nowrap">
                        {formatPrice(item.unitPrice)}
                      </td>
                      <td className="py-3.5 px-4 align-middle whitespace-nowrap">
                        {/* Live Toggle Switch Matching Laravel aiz-switch 1:1 */}
                        <button
                          type="button"
                          role="switch"
                          aria-checked={isActive}
                          disabled={togglingId === item.id}
                          onClick={() => handleToggleStatus(item)}
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            isActive ? "bg-emerald-500" : "bg-gray-300"
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              isActive ? "translate-x-4" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </td>
                      <td className="py-3.5 px-4 align-middle whitespace-nowrap">
                        {item.published ? (
                          <span className="inline-block rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 border border-emerald-200">
                            Published
                          </span>
                        ) : (
                          <span className="inline-block rounded-full bg-sky-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-sky-700 border border-sky-200">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right align-middle whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <Link
                            href={`/dashboard/customer-products/${item.id}/edit`}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white transition-colors shadow-2xs"
                            title="Edit Product"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => setProductToDelete(item)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-rose-50 text-[#d43533] hover:bg-[#d43533] hover:text-white transition-colors shadow-2xs"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
          <div className="relative w-full max-w-sm rounded bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-sm font-bold text-gray-900">Delete Confirmation</h3>
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="rounded p-1 text-gray-400 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-gray-600">
              Are you sure you want to delete <strong className="text-gray-900">&quot;{productToDelete.name}&quot;</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                disabled={isDeleting}
                className="rounded border border-gray-300 px-4 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="rounded bg-[#d43533] px-4 py-1.5 text-xs font-bold text-white hover:bg-red-700 transition-colors"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
