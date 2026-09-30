"use client"

import React, { useState, useTransition } from "react"
import Link from "next/link"
import Image from "next/image"
import { Star, Plus, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react"
import {
  toggleReviewPublishedAction,
  deleteReviewAction,
} from "@/app/actions/review-actions"
import type { SingleReviewItem } from "@/services/review-service"
import { DetailReviewsTable } from "./detail-reviews-table"

interface DetailReviewsViewProps {
  product: {
    id: number
    name: string
    thumbnailImg: string
    rating: number
  }
  initialReviews: SingleReviewItem[]
  realCount: number
  customCount: number
  totalCount: number
  currentPage: number
  totalPages: number
  reviewType: "real" | "custom"
}

export function DetailReviewsView({
  product,
  initialReviews,
  realCount,
  customCount,
  totalCount,
  currentPage,
  totalPages,
  reviewType: initialReviewType,
}: DetailReviewsViewProps) {
  const [reviews, setReviews] = useState<SingleReviewItem[]>(initialReviews)
  const [reviewType, setReviewType] = useState<"real" | "custom">(initialReviewType)
  const [notification, setNotification] = useState<{
    type: "success" | "danger"
    message: string
  } | null>(null)
  const [, startTransition] = useTransition()

  const showNotification = (type: "success" | "danger", message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 3000)
  }

  // Toggle Published
  const handleToggleStatus = async (reviewId: number, status: boolean) => {
    // Optimistic UI update
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, status } : r))
    )

    try {
      const ok = await toggleReviewPublishedAction(reviewId, status, product.id)
      if (ok) {
        showNotification("success", "Review status updated successfully")
      } else {
        showNotification("danger", "Failed to update review status")
      }
    } catch {
      showNotification("danger", "Something went wrong")
    }
  }

  // Delete Custom Review
  const handleDeleteReview = async (reviewId: number) => {
    if (!confirm("Are you sure you want to delete this custom review?")) return

    try {
      const ok = await deleteReviewAction(reviewId, product.id)
      if (ok) {
        setReviews((prev) => prev.filter((r) => r.id !== reviewId))
        showNotification("success", "Review deleted successfully")
      } else {
        showNotification("danger", "Failed to delete review")
      }
    } catch {
      showNotification("danger", "Something went wrong")
    }
  }

  return (
    <div className="space-y-4">
      {/* Toast Alert */}
      {notification && (
        <div
          className={`fixed top-5 right-5 z-[1060] flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-sm font-semibold animate-in fade-in slide-in-from-top-3 ${
            notification.type === "success"
              ? "bg-emerald-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Title Bar */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-2">
          <Link
            href="/admin/reviews"
            className="p-1.5 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">
            Detail Reviews
          </h1>
        </div>

        <Link
          href={`/admin/custom-review/create?product_id=${product.id}`}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white rounded bg-[#299395] hover:bg-[#237d7f] transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Add Custom Reviews</span>
        </Link>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        {/* Product Info Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 gap-4 border-b border-slate-100">
          <div className="flex items-center gap-4 max-w-xl">
            <div className="w-20 h-20 rounded border border-slate-200 overflow-hidden relative shrink-0 bg-slate-50">
              <Image
                src={product.thumbnailImg}
                alt={product.name}
                fill
                sizes="80px"
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-800 line-clamp-2 leading-relaxed">
                {product.name}
              </h2>
            </div>
          </div>

          <div className="text-left sm:text-right shrink-0">
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-0.5">
              Rating
            </p>
            <p className="text-lg font-black text-slate-900 leading-tight">
              {product.rating.toFixed(1)}
            </p>
            <div className="flex items-center sm:justify-end gap-1 mt-1 text-amber-400">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-3.5 h-3.5 ${
                    star <= Math.round(product.rating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-slate-200 fill-slate-100"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Subtabs for Reviews (Real vs Custom) */}
        <div className="px-5 pt-4 pb-2 border-b border-slate-100 flex items-center gap-3">
          <Link
            href={`/admin/reviews/detail-reviews/${product.id}?review_type=real`}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              reviewType === "real"
                ? "bg-blue-50 text-blue-600 border border-blue-200"
                : "text-slate-500 hover:text-slate-800 border border-transparent"
            }`}
          >
            Reviews ({realCount})
          </Link>
          <Link
            href={`/admin/reviews/detail-reviews/${product.id}?review_type=custom`}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              reviewType === "custom"
                ? "bg-blue-50 text-blue-600 border border-blue-200"
                : "text-slate-500 hover:text-slate-800 border border-transparent"
            }`}
          >
            Custom Reviews ({customCount})
          </Link>
        </div>

        {/* Reviews Table */}
        <DetailReviewsTable
          reviews={reviews}
          reviewType={reviewType}
          totalCount={totalCount}
          currentPage={currentPage}
          totalPages={totalPages}
          perPage={15}
          onToggleStatus={handleToggleStatus}
          onDeleteReview={handleDeleteReview}
          onPageChange={() => {}}
        />
      </div>
    </div>
  )
}
