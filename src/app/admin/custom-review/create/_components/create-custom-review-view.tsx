"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Star, ArrowLeft } from "lucide-react"
import { createCustomReviewAction } from "@/app/actions/review-actions"

interface CreateCustomReviewViewProps {
  products: { id: number; name: string; thumbnailImg: string }[]
  preselectedProduct: { id: number; name: string; thumbnailImg: string } | null
}

export function CreateCustomReviewView({
  products,
  preselectedProduct,
}: CreateCustomReviewViewProps) {
  const router = useRouter()
  const [reviewerName, setReviewerName] = useState("")
  const [reviewerImage, setReviewerImage] = useState("")
  const [selectedProductId, setSelectedProductId] = useState<number>(
    preselectedProduct ? preselectedProduct.id : products[0]?.id || 0
  )
  const [rating, setRating] = useState<number>(5)
  const [comment, setComment] = useState("")
  const [hoverRating, setHoverRating] = useState<number>(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reviewerName.trim()) {
      setErrorMsg("Custom Reviewer Name is required")
      return
    }
    if (!selectedProductId) {
      setErrorMsg("Please select a product")
      return
    }
    if (!comment.trim()) {
      setErrorMsg("Comment is required")
      return
    }

    setIsSubmitting(true)
    setErrorMsg(null)

    try {
      const ok = await createCustomReviewAction({
        productId: selectedProductId,
        reviewerName: reviewerName.trim(),
        reviewerImage: reviewerImage.trim() || undefined,
        rating,
        comment: comment.trim(),
      })

      if (ok) {
        router.push(`/admin/reviews/detail-reviews/${selectedProductId}?review_type=custom`)
      } else {
        setErrorMsg("Failed to save custom review. Please try again.")
      }
    } catch {
      setErrorMsg("Something went wrong.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Back & Title */}
      <div className="flex items-center gap-2 pb-1">
        <Link
          href="/admin/reviews"
          className="p-1.5 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">
          Add New Custom Review
        </h1>
      </div>

      {/* Card Form */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
        {errorMsg && (
          <div className="mb-4 p-3 rounded bg-red-50 text-red-600 text-xs font-semibold border border-red-200">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Reviewer Name */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Custom Reviewer Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
              placeholder="e.g. John Doe"
              className="w-full h-9 px-3 text-xs bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-blue-600 font-medium text-slate-800"
            />
          </div>

          {/* Reviewer Image */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Custom Reviewer Avatar URL (Optional)
            </label>
            <input
              type="text"
              value={reviewerImage}
              onChange={(e) => setReviewerImage(e.target.value)}
              placeholder="https://... or /assets/img/avatar.png"
              className="w-full h-9 px-3 text-xs bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-blue-600 font-medium text-slate-800"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              If left blank, the default user avatar will be shown.
            </p>
          </div>

          {/* Product Selection */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Product <span className="text-red-500">*</span>
            </label>
            {preselectedProduct ? (
              <div className="flex items-center gap-3 p-2.5 bg-slate-50 border border-slate-200 rounded">
                <div className="w-10 h-10 rounded border border-slate-200 overflow-hidden relative shrink-0 bg-white">
                  <Image
                    src={preselectedProduct.thumbnailImg}
                    alt={preselectedProduct.name}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
                <span className="font-semibold text-slate-800 line-clamp-1">
                  {preselectedProduct.name}
                </span>
              </div>
            ) : (
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(Number(e.target.value))}
                className="w-full h-9 px-3 text-xs bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-blue-600 font-medium text-slate-800 cursor-pointer"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Rating */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Rating <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-1.5 py-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1 cursor-pointer focus:outline-none"
                >
                  <Star
                    className={`w-5 h-5 ${
                      star <= (hoverRating || rating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-200 fill-slate-100"
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 font-bold text-slate-700">{rating} out of 5</span>
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Comment <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write the customer review comment here..."
              className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-blue-600 font-medium text-slate-800"
            />
          </div>

          {/* Submit */}
          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 text-xs font-bold text-white rounded bg-[#299395] hover:bg-[#237d7f] transition-colors shadow-xs disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
