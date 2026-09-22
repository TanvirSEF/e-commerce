import React from "react"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getFlashDeals } from "@/services/settings-service"
import { getProducts } from "@/services/product-service"
import { FlashDealDetailsView } from "./_components/flash-deal-details-view"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const deals = await getFlashDeals()
  const deal = deals.find((d) => d.slug === slug)
  if (!deal) return { title: "Flash Deal Not Found" }

  return {
    title: `${deal.title} | Active eCommerce`,
    description: `Shop the hottest discounted items in ${deal.title}`,
  }
}

export default async function FlashDealDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const deals = await getFlashDeals()
  const deal = deals.find((d) => d.slug === slug)

  if (!deal) {
    notFound()
  }

  // Fetch products with active discounts for this deal
  const { data: dealProducts } = await getProducts({ limit: 12, sort: "newest" })

  return (
    <FlashDealDetailsView
      deal={{
        title: deal.title,
        slug: deal.slug,
        banner: deal.banner || "/assets/img/placeholder-rect.jpg",
        endDate: deal.endDate,
      }}
      products={dealProducts.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        originalPrice: p.originalPrice,
        discountPercent: p.discountPercent,
        rating: p.rating,
        reviewCount: p.reviewCount,
        thumbnail: p.thumbnail,
      }))}
    />
  )
}
