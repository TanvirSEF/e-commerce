import React from "react"
import { notFound } from "next/navigation"
import { getAuctionProductBySlug, getAuctionBidsByProduct } from "@/services/auction-service"
import { AuctionProductDetailView } from "./_components/auction-product-detail-view"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const product = await getAuctionProductBySlug(slug)
  if (!product) return { title: "Auction Product Not Found" }
  return {
    title: `${product.name} | Live Auction Bidding`,
    description: `Current high bid $${product.currentBid}. Place your bid before closing.`,
  }
}

export default async function AuctionProductPage({ params }: PageProps) {
  const { slug } = await params
  const product = await getAuctionProductBySlug(slug)

  if (!product) {
    notFound()
  }

  const bids = await getAuctionBidsByProduct(product.id)

  return <AuctionProductDetailView product={product} initialBids={bids} />
}
