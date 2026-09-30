import React from "react"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import { getProductDetailReviews } from "@/services/review-service"
import { DetailReviewsView } from "./_components/detail-reviews-view"

export const metadata: Metadata = {
  title: "Detail Reviews | Active eCommerce CMS",
  description: "View and moderate product customer reviews and custom feedback",
}

export const dynamic = "force-dynamic"

interface DetailReviewsPageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ review_type?: string; page?: string }>
}

export default async function DetailReviewsPage({
  params,
  searchParams,
}: DetailReviewsPageProps) {
  const { id } = await params
  const { review_type, page } = await searchParams

  const productId = parseInt(id, 10)
  if (!productId || isNaN(productId)) {
    notFound()
  }

  const activeReviewType = review_type === "custom" ? "custom" : "real"
  const currentPage = parseInt(page || "1", 10) || 1

  const detailData = await getProductDetailReviews(
    productId,
    activeReviewType,
    currentPage,
    15
  )

  if (!detailData) {
    notFound()
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <DetailReviewsView
        product={detailData.product}
        initialReviews={detailData.reviews}
        realCount={detailData.realCount}
        customCount={detailData.customCount}
        totalCount={detailData.totalCount}
        currentPage={detailData.currentPage}
        totalPages={detailData.totalPages}
        reviewType={activeReviewType}
      />
    </div>
  )
}
