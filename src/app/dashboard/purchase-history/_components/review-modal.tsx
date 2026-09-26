"use client"

import React, { useState } from "react"
import { X, Star, Upload, CheckCircle2 } from "lucide-react"

interface ReviewModalProps {
  isOpen: boolean
  onClose: () => void
  product: {
    id: string
    name: string
    thumbnail: string
    orderCode: string
  } | null
}

export function ReviewModal({ isOpen, onClose, product }: ReviewModalProps) {
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState("")
  const [submitted, setSubmitted] = useState(false)

  if (!isOpen || !product) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setComment("")
      onClose()
    }, 1500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-lg bg-white shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h3 className="text-base font-bold text-gray-900">Write a Review</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        {submitted ? (
          <div className="p-8 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500 mb-3" />
            <h4 className="text-base font-bold text-gray-900">Review Submitted!</h4>
            <p className="text-xs text-gray-500 mt-1">
              Thank you for reviewing {product.name}. Your feedback helps other shoppers.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Product Meta */}
            <div className="flex items-center gap-3 rounded bg-gray-50 p-3">
              <img
                src={product.thumbnail || "/assets/img/placeholder.jpg"}
                alt={product.name}
                className="h-12 w-12 rounded object-cover border border-gray-200"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-gray-900 truncate">{product.name}</p>
                <p className="text-[11px] text-gray-400">Order: {product.orderCode}</p>
              </div>
            </div>

            {/* Rating Stars */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Rating <span className="text-[#d43533]">*</span>
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        (hoverRating || rating) >= star
                          ? "fill-amber-400 text-amber-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-xs font-semibold text-gray-600">
                  {rating === 5 ? "Excellent" : rating === 4 ? "Good" : rating === 3 ? "Average" : rating === 2 ? "Poor" : "Terrible"}
                </span>
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Your Review <span className="text-[#d43533]">*</span>
              </label>
              <textarea
                rows={4}
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with this item. Did it meet your expectations?"
                className="w-full rounded border border-gray-300 p-2.5 text-xs text-gray-800 placeholder-gray-400 focus:border-[#d43533] focus:outline-none"
              />
            </div>

            {/* Photos upload preview */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Add Photos (Optional)
              </label>
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded p-4 cursor-pointer hover:border-[#d43533]/50 transition-colors">
                <Upload className="h-5 w-5 text-gray-400 mb-1" />
                <span className="text-[11px] text-gray-500 font-medium">Click to upload photos</span>
                <input type="file" multiple accept="image/*" className="hidden" />
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="rounded border border-gray-300 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded bg-[#d43533] px-5 py-2 text-xs font-bold text-white hover:bg-[#b82a28] shadow-sm transition-colors"
              >
                Submit Review
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
