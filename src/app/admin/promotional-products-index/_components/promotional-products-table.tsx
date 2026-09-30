"use client"

import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Star, MoreVertical, Trash2, Frown, ChevronLeft, ChevronRight } from "lucide-react"
import type { PromotionalProductItem } from "@/services/promotional-product-service"

interface PromotionalProductsTableProps {
  products: PromotionalProductItem[]
  totalCount: number
  currentPage: number
  totalPages: number
  selectedIds: number[]
  onSelectProduct: (id: number) => void
  onSelectAll: (checked: boolean) => void
  onPageChange: (page: number) => void
  onToggleTodaysDeal: (productId: number, status: boolean) => void
  onOpenSingleRemoveModal: (productId: number) => void
}

export function PromotionalProductsTable({
  products,
  totalCount,
  currentPage,
  totalPages,
  selectedIds,
  onSelectProduct,
  onSelectAll,
  onPageChange,
  onToggleTodaysDeal,
  onOpenSingleRemoveModal,
}: PromotionalProductsTableProps) {
  const [activeDropdownId, setActiveDropdownId] = useState<number | null>(null)

  const isAllSelected =
    products.length > 0 && products.every((p) => selectedIds.includes(p.id))

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center text-amber-400">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3 h-3 ${
              star <= Math.round(rating)
                ? "fill-amber-400 text-amber-400"
                : "text-slate-200 fill-slate-100"
            }`}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto min-h-[350px]">
      <table className="w-full text-left border-collapse">
        <thead className="border-b border-slate-200 bg-white">
          <tr className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <th className="py-3 px-4 w-10">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={(e) => onSelectAll(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-0 cursor-pointer"
              />
            </th>
            <th className="py-3 px-3 w-20">Thumb</th>
            <th className="py-3 px-3 min-w-[220px]">Name / Brand</th>
            <th className="py-3 px-3 min-w-[150px]">Owner / Category</th>
            <th className="py-3 px-3 min-w-[130px]">Ratings</th>
            <th className="py-3 px-3 min-w-[130px]">Price Details</th>
            <th className="py-3 px-3 min-w-[110px] text-center">Todays Deal</th>
            <th className="py-3 px-4 w-16 text-right">Options</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100 bg-white text-xs text-slate-700">
          {products.length === 0 ? (
            <tr>
              <td colSpan={8} className="py-16 text-center">
                <div className="flex flex-col items-center justify-center text-slate-400">
                  <Frown className="w-12 h-12 text-slate-300 mb-2 stroke-[1.5]" />
                  <h4 className="text-base font-semibold text-slate-600">No Products found!</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    No promotional products match your current filters.
                  </p>
                </div>
              </td>
            </tr>
          ) : (
            products.map((product) => {
              const isSelected = selectedIds.includes(product.id)
              const hasDiscount = product.discount > 0

              return (
                <tr
                  key={product.id}
                  className={`hover:bg-slate-50/70 transition-colors ${
                    isSelected ? "bg-blue-50/20" : ""
                  }`}
                >
                  {/* Checkbox */}
                  <td className="py-3 px-4 align-middle">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onSelectProduct(product.id)}
                      className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-0 cursor-pointer"
                    />
                  </td>

                  {/* Thumbnail */}
                  <td className="py-3 px-3 align-middle">
                    <div className="w-14 h-14 rounded-md border border-slate-200 overflow-hidden relative bg-slate-50 shrink-0">
                      <Image
                        src={product.thumbnailImg}
                        alt={product.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                  </td>

                  {/* Name / Brand */}
                  <td className="py-3 px-3 align-middle">
                    <span className="font-normal text-slate-800 line-clamp-2 leading-tight">
                      {product.name}
                    </span>
                    <div className="mt-1">
                      {product.brand ? (
                        <span className="font-semibold text-slate-900 text-xs hover:text-blue-600 transition-colors">
                          {product.brand.name}
                        </span>
                      ) : (
                        <span className="font-semibold text-slate-400 text-xs">No Brand</span>
                      )}
                    </div>
                  </td>

                  {/* Owner / Category */}
                  <td className="py-3 px-3 align-middle">
                    <div className="font-bold text-slate-800 text-xs">
                      {product.shop ? product.shop.name : "Inhouse"}
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium block mt-1">
                      Main Category
                    </span>
                    <p className="font-semibold text-slate-800 text-xs m-0">
                      {product.category?.name || "General"}
                    </p>
                  </td>

                  {/* Ratings */}
                  <td className="py-3 px-3 align-middle">
                    <div className="flex items-center gap-1.5">
                      {renderStars(product.rating)}
                    </div>
                    <p className="text-xs text-slate-700 font-medium mt-1">
                      <span className="font-bold">{product.rating.toFixed(1)}</span> out of 5.0
                    </p>
                    <p className="text-[11px] text-slate-400 font-normal">
                      {product.numOfReviews} Reviews
                    </p>
                  </td>

                  {/* Price Details */}
                  <td className="py-3 px-3 align-middle">
                    <div className="border-l-[3px] border-blue-600 pl-2 py-0.5">
                      <span className="text-[10px] text-slate-500 font-normal block leading-none">
                        Price
                      </span>
                      <p className="text-xs font-bold text-slate-900 mt-0.5 leading-none">
                        ৳{product.unitPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    {hasDiscount && (
                      <div className="border-l-[3px] border-red-500 pl-2 py-0.5 mt-1.5">
                        <p className="text-[11px] font-medium text-slate-600 leading-none">
                          Discount{" "}
                          <span className="text-red-500 font-bold">
                            {product.discountType === "percent"
                              ? `${product.discount}%`
                              : `৳${product.discount}`}
                          </span>
                        </p>
                      </div>
                    )}
                  </td>

                  {/* Todays Deal Switch */}
                  <td className="py-3 px-3 align-middle text-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={product.todaysDeal}
                        onChange={(e) => onToggleTodaysDeal(product.id, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </td>

                  {/* Options */}
                  <td className="py-3 px-4 align-middle text-right relative">
                    <div className="relative inline-block text-left">
                      <button
                        type="button"
                        onClick={() =>
                          setActiveDropdownId(activeDropdownId === product.id ? null : product.id)
                        }
                        className="p-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {activeDropdownId === product.id && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setActiveDropdownId(null)}
                          />
                          <div className="absolute right-0 mt-1 w-32 rounded-md bg-white shadow-lg ring-1 ring-black/5 z-20 py-1">
                            <button
                              type="button"
                              onClick={() => {
                                setActiveDropdownId(null)
                                onOpenSingleRemoveModal(product.id)
                              }}
                              className="flex items-center w-full px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors gap-2"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-red-600" />
                              <span>Remove</span>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })
          )}
        </tbody>
      </table>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 bg-white text-xs text-slate-500">
          <div>
            Showing Page <span className="font-bold text-slate-700">{currentPage}</span> of{" "}
            <span className="font-bold text-slate-700">{totalPages}</span> ({totalCount} items)
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="p-1.5 rounded border border-slate-200 hover:bg-slate-50 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i + 1}
                onClick={() => onPageChange(i + 1)}
                className={`w-7 h-7 rounded text-xs font-bold transition-colors ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white"
                    : "border border-slate-200 hover:bg-slate-50 text-slate-600"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="p-1.5 rounded border border-slate-200 hover:bg-slate-50 disabled:opacity-40 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
