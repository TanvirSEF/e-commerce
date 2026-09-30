"use client"

import React, { useState, useEffect, useTransition } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import { fetchProductReviewsAdminAction } from "@/app/actions/review-actions"
import type {
  ReviewedProductsResponse,
} from "@/services/review-service"
import { ReviewsFilterBar } from "./reviews-filter-bar"
import { ReviewsTable } from "./reviews-table"

interface ReviewsAdminViewProps {
  initialData: ReviewedProductsResponse
  sellers: { id: string; name: string }[]
}

export function ReviewsAdminView({
  initialData,
  sellers,
}: ReviewsAdminViewProps) {
  const [data, setData] = useState<ReviewedProductsResponse>(initialData)
  const [search, setSearch] = useState<string>("")
  const [sellerId, setSellerId] = useState<string>("all")
  const [ratingSort, setRatingSort] = useState<string>("")
  const [, startTransition] = useTransition()

  // Reload data from PostgreSQL
  const reloadData = (page = 1) => {
    startTransition(async () => {
      try {
        const res = await fetchProductReviewsAdminAction({
          search: search.trim() || undefined,
          sellerId: sellerId || undefined,
          rating: ratingSort || undefined,
          page,
          limit: 15,
        })
        setData(res)
      } catch (err) {
        console.error("Error fetching product reviews:", err)
      }
    })
  }

  // Debounced search & filter trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      reloadData(1)
    }, 400)
    return () => clearTimeout(timer)
  }, [search, sellerId, ratingSort])

  return (
    <div className="space-y-4">
      {/* Top Title Bar */}
      <div className="flex items-center justify-between pb-1">
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">
          All Rating &amp; Reviews
        </h1>

        <Link
          href="/admin/custom-review/create"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white rounded bg-[#299395] hover:bg-[#237d7f] transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Add Custom Reviews</span>
        </Link>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        {/* Filter Bar */}
        <ReviewsFilterBar
          sellers={sellers}
          sellerId={sellerId}
          onSellerChange={setSellerId}
          ratingSort={ratingSort}
          onRatingSortChange={setRatingSort}
          search={search}
          onSearchChange={setSearch}
        />

        {/* Reviews Table */}
        <ReviewsTable
          products={data.products}
          totalCount={data.totalCount}
          currentPage={data.currentPage}
          totalPages={data.totalPages}
          perPage={data.perPage}
          onPageChange={(page) => reloadData(page)}
        />
      </div>
    </div>
  )
}
