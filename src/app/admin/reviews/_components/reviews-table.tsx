"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Frown } from "lucide-react"
import type { ReviewedProductSummary } from "@/services/review-service"

interface ReviewsTableProps {
  products: ReviewedProductSummary[]
  totalCount: number
  currentPage: number
  totalPages: number
  perPage: number
  onPageChange: (page: number) => void
}

export function ReviewsTable({
  products,
  totalCount,
  currentPage,
  totalPages,
  perPage,
  onPageChange,
}: ReviewsTableProps) {
  return (
    <div className="overflow-x-auto min-h-[350px]">
      <table className="w-full text-left border-collapse">
        <thead className="border-b border-slate-200 bg-white">
          <tr className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <th className="py-3 px-4 w-12 text-slate-400">#</th>
            <th className="py-3 px-3 w-[40%] min-w-[240px]">Product Name</th>
            <th className="py-3 px-3 min-w-[140px]">Product Owner</th>
            <th className="py-3 px-3 min-w-[100px]">Rating</th>
            <th className="py-3 px-3 min-w-[110px]">Reviews</th>
            <th className="py-3 px-3 min-w-[120px]">Custom Reviews</th>
            <th className="py-3 px-4 w-28 text-right">Options</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100 bg-white text-xs text-slate-700">
          {products.length === 0 ? (
            <tr>
              <td colSpan={7} className="py-16 text-center">
                <div className="flex flex-col items-center justify-center text-slate-400">
                  <Frown className="w-12 h-12 text-slate-300 mb-2 stroke-[1.5]" />
                  <h4 className="text-base font-semibold text-slate-600">Nothing found</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    No product review records match your selected criteria.
                  </p>
                </div>
              </td>
            </tr>
          ) : (
            products.map((product, idx) => {
              const rowNumber = (currentPage - 1) * perPage + idx + 1

              return (
                <tr
                  key={product.id}
                  className="hover:bg-slate-50/60 transition-colors"
                >
                  {/* Row # */}
                  <td className="py-3 px-4 align-middle text-slate-400 font-medium">
                    {rowNumber}
                  </td>

                  {/* Product Name */}
                  <td className="py-3 px-3 align-middle">
                    <div className="flex items-center gap-3">
                      <div className="w-[50px] h-[50px] rounded border border-slate-200 overflow-hidden relative shrink-0 bg-slate-50">
                        <Image
                          src={product.thumbnailImg}
                          alt={product.name}
                          fill
                          sizes="50px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-slate-600 line-clamp-2 text-xs font-normal leading-snug">
                          {product.name}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Product Owner */}
                  <td className="py-3 px-3 align-middle font-medium text-slate-700 text-xs">
                    {product.ownerName}
                  </td>

                  {/* Rating */}
                  <td className="py-3 px-3 align-middle font-bold text-slate-800 text-xs">
                    {product.rating.toFixed(1)}
                  </td>

                  {/* Reviews */}
                  <td className="py-3 px-3 align-middle text-xs">
                    <span className="font-semibold text-slate-800 mr-1.5">
                      {product.reviewCount}
                    </span>
                    {product.hasNewReview && (
                      <span className="inline-block px-1.5 py-0.5 text-[10px] font-bold text-white bg-red-500 rounded uppercase tracking-wide">
                        new
                      </span>
                    )}
                  </td>

                  {/* Custom Reviews */}
                  <td className="py-3 px-3 align-middle font-semibold text-slate-700 text-xs">
                    {product.customReviewCount}
                  </td>

                  {/* Options */}
                  <td className="py-3 px-4 align-middle text-right">
                    <Link
                      href={`/admin/reviews/detail-reviews/${product.id}`}
                      className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors shadow-xs"
                    >
                      View Reviews
                    </Link>
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
