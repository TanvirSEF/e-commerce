"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Star,
  Search,
  Trash2,
  ToggleLeft,
  ToggleRight,
  ExternalLink,
  MessageSquare,
  CheckCircle,
} from "lucide-react"
import { toggleReviewStatusAction, deleteReviewAction } from "@/app/actions/ecommerce-actions"
import type { ReviewItem } from "@/services/review-service"

interface ReviewsAdminViewProps {
  initialReviews: ReviewItem[]
}

export function ReviewsAdminView({ initialReviews }: ReviewsAdminViewProps) {
  const [reviews, setReviews] = useState<ReviewItem[]>(initialReviews)
  const [searchTerm, setSearchTerm] = useState("")
  const [ratingFilter, setRatingFilter] = useState("all")

  const filtered = reviews.filter((r) => {
    const matchesSearch =
      r.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.comment.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRating = ratingFilter === "all" || r.rating === parseInt(ratingFilter)
    return matchesSearch && matchesRating
  })

  const handleToggle = async (review: ReviewItem) => {
    const newStatus = !review.status
    const numericId = parseInt(review.id.replace(/\D/g, "")) || 1
    await toggleReviewStatusAction(numericId, newStatus)
    setReviews((prev) =>
      prev.map((r) => (r.id === review.id ? { ...r, status: newStatus } : r))
    )
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this customer review?")) return
    const numericId = parseInt(id.replace(/\D/g, "")) || 1
    await deleteReviewAction(numericId)
    setReviews((prev) => prev.filter((r) => r.id !== id))
  }

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
      : "5.0"
  const publishedCount = reviews.filter((r) => r.status).length

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Product Reviews & Ratings</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Moderate, publish, or remove customer reviews and product testimonials
          </p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-50 text-[#ffc519] flex items-center justify-center">
            <Star className="w-5 h-5 fill-[#ffc519]" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Average Rating</div>
            <div className="text-xl font-bold text-slate-800">{avgRating} / 5.0</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Total Reviews</div>
            <div className="text-xl font-bold text-slate-800">{reviews.length}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Published Live</div>
            <div className="text-xl font-bold text-slate-800">{publishedCount}</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by product, customer, or comment..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533]"
          />
        </div>

        <select
          value={ratingFilter}
          onChange={(e) => setRatingFilter(e.target.value)}
          className="px-3 py-1.5 border border-slate-300 rounded text-xs text-slate-700 bg-white focus:outline-none focus:border-[#d43533]"
        >
          <option value="all">All Star Ratings</option>
          <option value="5">5 Stars Only</option>
          <option value="4">4 Stars Only</option>
          <option value="3">3 Stars Only</option>
          <option value="2">2 Stars Only</option>
          <option value="1">1 Star Only</option>
        </select>
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[11px] tracking-wider">
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4">Comment</th>
                <th className="py-3 px-4">Published</th>
                <th className="py-3 px-4 text-right">Options</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((review, idx) => (
                <tr key={review.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-medium text-slate-500">{idx + 1}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded border border-slate-200 overflow-hidden shrink-0 bg-slate-100">
                        <Image
                          src={review.productThumbnail}
                          alt={review.productName}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="max-w-[180px]">
                        <div className="font-bold text-slate-800 line-clamp-1">
                          {review.productName}
                        </div>
                        {review.productSlug && (
                          <Link
                            href={`/product/${review.productSlug}`}
                            target="_blank"
                            className="text-[11px] text-[#d43533] hover:underline inline-flex items-center gap-0.5"
                          >
                            View Product <ExternalLink className="w-2.5 h-2.5" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800">{review.userName}</div>
                    <div className="text-[11px] text-slate-400">{review.date}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < review.rating
                              ? "text-[#ffc519] fill-[#ffc519]"
                              : "text-slate-200"
                          }`}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 max-w-xs">
                    <p className="text-slate-700 line-clamp-2">{review.comment}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => handleToggle(review)}
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-colors ${
                        review.status
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-slate-100 text-slate-500 border border-slate-200"
                      }`}
                    >
                      {review.status ? (
                        <ToggleRight className="w-3.5 h-3.5" />
                      ) : (
                        <ToggleLeft className="w-3.5 h-3.5" />
                      )}
                      {review.status ? "Published" : "Hidden"}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors"
                      title="Delete Review"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400 text-sm">
                    No customer reviews found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
