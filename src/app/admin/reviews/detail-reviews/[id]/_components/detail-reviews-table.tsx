"use client"

import React from "react"
import Image from "next/image"
import { Star, Trash2, Frown, ChevronLeft, ChevronRight } from "lucide-react"
import type { SingleReviewItem } from "@/services/review-service"

interface DetailReviewsTableProps {
  reviews: SingleReviewItem[]
  reviewType: "real" | "custom"
  totalCount: number
  currentPage: number
  totalPages: number
  perPage: number
  onToggleStatus: (reviewId: number, status: boolean) => void
  onDeleteReview: (reviewId: number) => void
  onPageChange: (page: number) => void
}

export function DetailReviewsTable({
  reviews,
  reviewType,
  totalCount,
  currentPage,
  totalPages,
  perPage,
  onToggleStatus,
  onDeleteReview,
  onPageChange,
}: DetailReviewsTableProps) {
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
    <div className="overflow-x-auto min-h-[300px]">
      <table className="w-full text-left border-collapse">
        <thead className="border-b border-slate-200 bg-white">
          <tr className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <th className="py-3 px-4 w-12 text-slate-400">#</th>
            <th className="py-3 px-3 min-w-[160px]">Customer</th>
            <th className="py-3 px-3 min-w-[110px]">Rating</th>
            <th className="py-3 px-3 min-w-[280px]">Comment</th>
            <th className="py-3 px-3 w-28 text-center">Published</th>
            {reviewType === "custom" && (
              <th className="py-3 px-4 w-20 text-right">Options</th>
            )}
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100 bg-white text-xs text-slate-700">
          {reviews.length === 0 ? (
            <tr>
              <td
                colSpan={reviewType === "custom" ? 6 : 5}
                className="py-16 text-center"
              >
                <div className="flex flex-col items-center justify-center text-slate-400">
                  <Frown className="w-12 h-12 text-slate-300 mb-2 stroke-[1.5]" />
                  <h4 className="text-base font-semibold text-slate-600">Nothing found</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    No {reviewType} reviews found for this product.
                  </p>
                </div>
              </td>
            </tr>
          ) : (
            reviews.map((review, idx) => {
              const rowNumber = (currentPage - 1) * perPage + idx + 1

              return (
                <tr
                  key={review.id}
                  className="hover:bg-slate-50/60 transition-colors"
                >
                  {/* # */}
                  <td className="py-3 px-4 align-middle text-slate-400 font-medium">
                    {rowNumber}
                  </td>

                  {/* Customer */}
                  <td className="py-3 px-3 align-middle">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-100 relative shrink-0 border border-slate-200">
                        <Image
                          src={review.userAvatar}
                          alt={review.userName}
                          fill
                          sizes="32px"
                          className="object-cover"
                        />
                      </div>
                      <span className="font-semibold text-slate-800 text-xs">
                        {review.userName}
                      </span>
                    </div>
                  </td>

                  {/* Rating */}
                  <td className="py-3 px-3 align-middle">
                    {renderStars(review.rating)}
                  </td>

                  {/* Comment */}
                  <td className="py-3 px-3 align-middle text-slate-600 leading-relaxed font-normal">
                    {review.comment}
                  </td>

                  {/* Published Toggle */}
                  <td className="py-3 px-3 align-middle text-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={review.status}
                        onChange={(e) => onToggleStatus(review.id, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </td>

                  {/* Options (Custom Reviews Only) */}
                  {reviewType === "custom" && (
                    <td className="py-3 px-4 align-middle text-right">
                      <button
                        type="button"
                        onClick={() => onDeleteReview(review.id)}
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                        title="Delete custom review"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  )}
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
