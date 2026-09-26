"use client"

import React, { useState } from "react"
import Image from "next/image"
import { Star, Search, Filter, MessageSquare } from "lucide-react"

interface ReviewItem {
  id: string
  productName: string
  productImage: string
  customerName: string
  rating: number
  comment: string
  date: string
  status: "approved" | "pending"
}

const SAMPLE_SELLER_REVIEWS: ReviewItem[] = [
  {
    id: "rev-101",
    productName: "Classic Men's Casual Shirt - Slim Fit 100% Pure Cotton",
    productImage: "/assets/img/placeholder.jpg",
    customerName: "Tanvir Ahmed",
    rating: 5,
    comment: "Excellent fabric quality and perfect fitting. Highly recommended for daily office wear!",
    date: "24 Sep 2026",
    status: "approved",
  },
  {
    id: "rev-102",
    productName: "Men Regular Fit Denim Jeans Stretchable Blue Trouser",
    productImage: "/assets/img/placeholder.jpg",
    customerName: "Rashidul Islam",
    rating: 5,
    comment: "Very fast delivery in Dhaka, nicely packed, and color exactly matches the photo.",
    date: "22 Sep 2026",
    status: "approved",
  },
  {
    id: "rev-103",
    productName: "Pure Cotton Casual Polo T-Shirt Solid Color for Men",
    productImage: "/assets/img/placeholder.jpg",
    customerName: "Mahmudul Hasan",
    rating: 4,
    comment: "Comfortable material, size is slightly relaxed but overall good value for money.",
    date: "19 Sep 2026",
    status: "approved",
  },
]

export function SellerReviewsView() {
  const [search, setSearch] = useState("")
  const [ratingFilter, setRatingFilter] = useState("all")

  const filtered = SAMPLE_SELLER_REVIEWS.filter((item) => {
    const matchesSearch =
      item.productName.toLowerCase().includes(search.toLowerCase()) ||
      item.customerName.toLowerCase().includes(search.toLowerCase())
    const matchesRating =
      ratingFilter === "all" || item.rating === parseInt(ratingFilter, 10)
    return matchesSearch && matchesRating
  })

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900">Product Reviews & Ratings</h1>
        <p className="text-xs text-slate-500 mt-1">
          Monitor and inspect buyer ratings and feedback submitted on your storefront products.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search product or customer..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-hidden focus:border-[#d43533]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-slate-400 shrink-0" />
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="w-full sm:w-44 px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white focus:outline-hidden focus:border-[#d43533]"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Product</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Rating</th>
                <th className="py-3.5 px-4">Feedback</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-40" />
                    No reviews found matching your search criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md border border-slate-200 bg-slate-100">
                          <Image
                            src={item.productImage}
                            alt={item.productName}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="font-semibold text-slate-800 line-clamp-1 max-w-[220px]">
                          {item.productName}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700">
                      {item.customerName}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 text-[#ffc519]">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < item.rating
                                ? "fill-[#ffc519] text-[#ffc519]"
                                : "fill-slate-200 text-slate-200"
                            }`}
                          />
                        ))}
                        <span className="ml-1 text-[11px] font-bold text-slate-700">
                          {item.rating}.0
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 max-w-[280px]">
                      <p className="line-clamp-2">{item.comment}</p>
                    </td>
                    <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                      {item.date}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                        Published
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
