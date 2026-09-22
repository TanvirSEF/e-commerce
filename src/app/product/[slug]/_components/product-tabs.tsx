"use client"

import React, { useState } from "react"
import { Star, MessageSquare, PenLine, X, CheckCircle } from "lucide-react"
import { submitReviewAction } from "@/app/actions/ecommerce-actions"

interface ProductTabsProps {
  productId?: number | string
  description: string
  specifications?: { label: string; value: string }[]
  reviews?: {
    id: string
    userName: string
    date: string
    rating: number
    comment: string
  }[]
  rating: number
  reviewCount: number
}

export function ProductTabs({
  productId = 1,
  description,
  specifications = [],
  reviews = [],
  rating,
  reviewCount,
}: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "reviews">("description")
  const [reviewList, setReviewList] = useState(reviews)
  const [showModal, setShowModal] = useState(false)
  const [userRating, setUserRating] = useState(5)
  const [reviewerName, setReviewerName] = useState("")
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim()) return
    setIsSubmitting(true)
    try {
      const numId = typeof productId === "number" ? productId : parseInt(String(productId).replace(/\D/g, "")) || 1
      await submitReviewAction({
        productId: numId,
        userName: reviewerName.trim() || "Verified Buyer",
        rating: userRating,
        comment: comment.trim(),
      })
      const newRev = {
        id: `rev-${Date.now()}`,
        userName: reviewerName.trim() || "Verified Buyer",
        date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
        rating: userRating,
        comment: comment.trim(),
      }
      setReviewList((prev) => [newRev, ...prev])
      setSubmitted(true)
      setTimeout(() => {
        setSubmitted(false)
        setShowModal(false)
        setComment("")
        setReviewerName("")
      }, 1500)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mt-8 rounded-md border border-gray-100 bg-white shadow-sm">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-100 text-xs font-bold text-gray-600 sm:text-sm">
        <button
          type="button"
          onClick={() => setActiveTab("description")}
          className={`px-5 py-3.5 transition-colors ${
            activeTab === "description"
              ? "border-b-2 border-[#d43533] text-[#d43533]"
              : "hover:text-gray-900"
          }`}
        >
          Description
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("specs")}
          className={`px-5 py-3.5 transition-colors ${
            activeTab === "specs"
              ? "border-b-2 border-[#d43533] text-[#d43533]"
              : "hover:text-gray-900"
          }`}
        >
          Specifications
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("reviews")}
          className={`px-5 py-3.5 transition-colors ${
            activeTab === "reviews"
              ? "border-b-2 border-[#d43533] text-[#d43533]"
              : "hover:text-gray-900"
          }`}
        >
          Reviews ({reviewCount})
        </button>
      </div>

      {/* Tab Content Area */}
      <div className="p-5 text-xs text-gray-700 leading-relaxed sm:p-8 sm:text-sm">
        {/* Description Tab */}
        {activeTab === "description" && (
          <div className="prose max-w-none">
            <p>{description}</p>
          </div>
        )}

        {/* Specifications Tab */}
        {activeTab === "specs" && (
          <div className="max-w-xl">
            <table className="w-full border-collapse text-left">
              <tbody>
                {specifications.map((spec, idx) => (
                  <tr
                    key={idx}
                    className={idx % 2 === 0 ? "bg-gray-50/70" : "bg-white"}
                  >
                    <td className="w-1/3 border border-gray-100 px-4 py-2.5 font-semibold text-gray-700">
                      {spec.label}
                    </td>
                    <td className="border border-gray-100 px-4 py-2.5 text-gray-600">
                      {spec.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === "reviews" && (
          <div>
            {/* Rating Summary Box */}
            <div className="mb-6 flex flex-wrap items-center gap-6 rounded-md bg-gray-50 p-4">
              <div className="text-center">
                <div className="text-3xl font-extrabold text-[#d43533]">{rating.toFixed(1)}</div>
                <div className="flex items-center text-[#ffc519]">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${
                        i < Math.floor(rating)
                          ? "fill-[#ffc519] text-[#ffc519]"
                          : "fill-gray-200 text-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[11px] text-gray-400">{reviewCount} Ratings</span>
              </div>
              <div className="h-12 w-px bg-gray-200" />
              <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <p className="text-xs text-gray-500">
                  Reviews are submitted by verified buyers who completed a purchase of this product.
                </p>
                <button
                  type="button"
                  onClick={() => setShowModal(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#d43533] hover:bg-[#b82a28] text-white text-xs font-semibold rounded shrink-0 shadow-sm transition-colors"
                >
                  <PenLine className="w-3.5 h-3.5" />
                  Write a Review
                </button>
              </div>
            </div>

            {/* Customer Review List */}
            {reviewList.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center text-gray-400">
                <MessageSquare className="h-8 w-8 text-gray-300" />
                <p className="mt-2 text-xs">There are no reviews for this product yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {reviewList.map((rev) => (
                  <div key={rev.id} className="py-4">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="font-bold text-gray-800">{rev.userName}</span>
                      <span className="text-[11px] text-gray-400">{rev.date}</span>
                    </div>
                    <div className="mb-2 flex items-center text-[#ffc519]">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < rev.rating
                              ? "fill-[#ffc519] text-[#ffc519]"
                              : "fill-gray-200 text-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-600">{rev.comment}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Write Review Modal */}
            {showModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-5 relative animate-in fade-in zoom-in-95">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <h3 className="text-base font-bold text-slate-800 mb-1">Write a Review</h3>
                  <p className="text-xs text-slate-500 mb-4">
                    Share your experience with other customers
                  </p>

                  {submitted ? (
                    <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-center text-xs font-semibold flex items-center justify-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Review submitted successfully!
                    </div>
                  ) : (
                    <form onSubmit={handleSubmitReview} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Rating
                        </label>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setUserRating(star)}
                              className="p-1 hover:scale-110 transition-transform"
                            >
                              <Star
                                className={`w-6 h-6 ${
                                  star <= userRating
                                    ? "text-[#ffc519] fill-[#ffc519]"
                                    : "text-slate-200"
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Your Name
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Rahim Ahmed"
                          value={reviewerName}
                          onChange={(e) => setReviewerName(e.target.value)}
                          className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:border-[#d43533]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Review Comments *
                        </label>
                        <textarea
                          required
                          rows={4}
                          placeholder="What did you like or dislike about this product?"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:border-[#d43533]"
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setShowModal(false)}
                          className="px-3 py-1.5 border border-slate-300 text-slate-600 rounded text-xs hover:bg-slate-50"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="px-4 py-1.5 bg-[#d43533] hover:bg-[#b82a28] text-white rounded text-xs font-semibold transition-colors"
                        >
                          {isSubmitting ? "Submitting..." : "Submit Review"}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductTabs
