import React from "react"
import { notFound } from "next/navigation"
import { getAllAuctionProducts, getAuctionBidsByProduct } from "@/services/auction-service"
import { SellerAuctionBidsView } from "./_components/seller-auction-bids-view"

export const metadata = {
  title: "Auction Bids | Seller Panel",
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function SellerAuctionBidsPage({ params }: PageProps) {
  const { id } = await params
  const prodId = parseInt(id, 10)
  const products = await getAllAuctionProducts()
  const product = products.find((p) => p.id === prodId)

  if (!product) {
    notFound()
  }

  const bids = await getAuctionBidsByProduct(prodId)

  return <SellerAuctionBidsView product={product} bids={bids} />
}
