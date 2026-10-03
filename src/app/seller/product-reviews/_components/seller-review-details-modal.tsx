"use client"

import React from "react"
import Image from "next/image"
import { Star, X } from "lucide-react"
import type { SellerProductReviewDetail } from "@/services/seller-panel-service"

interface SellerReviewDetailsModalProps {
  product: {
    id: number
    name: string
    thumbnailImg: string | null
    rating: number
  }
  reviews: SellerProductReviewDetail[]
  onClose: () => void
}

export function SellerReviewDetailsModal({
  product,
  reviews,
  onClose,
}: SellerReviewDetailsModalProps) {
  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString)
      return d.toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    } catch {
      return isoString
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-sm border border-gray-200 shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
          <h4 className="text-sm font-semibold text-gray-900">Detail Reviews</h4>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Product Overview Summary */}
        <div className="p-4 bg-gray-50/70 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 relative rounded border border-gray-200 overflow-hidden bg-white shrink-0">
              <Image
                src={product.thumbnailImg || "/assets/img/placeholder.jpg"}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h5 className="text-xs font-semibold text-gray-900 line-clamp-2">{product.name}</h5>
              <div className="text-[11px] text-gray-500 mt-0.5">
                {reviews.length} {reviews.length === 1 ? "Review" : "Reviews"}
              </div>
            </div>
          </div>

          <div className="text-right sm:border-l sm:pl-4 border-gray-200 shrink-0">
            <div className="text-[10px] font-semibold uppercase text-gray-400">Rating</div>
            <div className="text-base font-extrabold text-gray-900">{product.rating.toFixed(1)}</div>
            <div className="flex items-center justify-end gap-0.5 mt-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-3 h-3 ${
                    star <= Math.round(product.rating)
                      ? "text-amber-400 fill-amber-400"
                      : "text-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Reviews Table */}
        <div className="overflow-y-auto flex-1 p-0">
          {reviews.length > 0 ? (
            <table className="w-full text-left text-xs text-gray-700">
              <thead className="bg-[#f9fafb] text-gray-600 uppercase font-semibold border-b border-gray-200 text-[11px]">
                <tr>
                  <th className="py-2.5 px-3 w-10 text-center">#</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3 text-center">Rating</th>
                  <th className="py-2.5 px-3 w-1/2">Comment</th>
                  <th className="py-2.5 px-3 text-right">Published</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reviews.map((rev, idx) => (
                  <tr key={rev.id} className="hover:bg-gray-50/60">
                    <td className="py-3 px-3 text-center text-gray-400 font-mono">{idx + 1}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 relative rounded-full overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                          <Image
                            src={rev.customerAvatar || "/assets/img/avatar-placeholder.png"}
                            alt={rev.customerName}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="font-semibold text-gray-800 text-xs">
                          {rev.customerName}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-gray-900">{rev.rating}</td>
                    <td className="py-3 px-3 text-gray-600 leading-relaxed">
                      <div>{rev.comment}</div>
                      {rev.photos && rev.photos.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {rev.photos.map((p, pIdx) => (
                            <a
                              key={pIdx}
                              href={p}
                              target="_blank"
                              rel="noreferrer"
                              className="w-10 h-10 relative rounded border overflow-hidden block"
                            >
                              <Image src={p} alt="Review attachment" fill className="object-cover" />
                            </a>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="text-[11px] text-gray-400">{formatDate(rev.createdAt)}</div>
                      <div className="mt-1">
                        {rev.status ? (
                          <span className="inline-block px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 rounded border border-emerald-200">
                            Published
                          </span>
                        ) : (
                          <span className="inline-block px-1.5 py-0.5 text-[10px] font-semibold text-red-700 bg-red-50 rounded border border-red-200">
                            Unpublished
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center text-gray-400 text-xs">
              No detailed reviews available for this product.
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-gray-200 bg-gray-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-medium rounded transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
