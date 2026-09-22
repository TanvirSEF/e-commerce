"use client"

import React, { useState } from "react"
import { Star, MessageSquare } from "lucide-react"

interface ProductTabsProps {
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
  description,
  specifications = [],
  reviews = [],
  rating,
  reviewCount,
}: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "reviews">("description")

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
              <div className="flex-1">
                <p className="text-xs text-gray-500">
                  Reviews are submitted by verified buyers who completed a purchase of this product.
                </p>
              </div>
            </div>

            {/* Customer Review List */}
            {reviews.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center text-gray-400">
                <MessageSquare className="h-8 w-8 text-gray-300" />
                <p className="mt-2 text-xs">There are no reviews for this product yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {reviews.map((rev) => (
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
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductTabs
