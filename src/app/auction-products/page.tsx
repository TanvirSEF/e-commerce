import React from "react"
import { getAllAuctionProducts } from "@/services/auction-service"
import { AuctionShowcaseView } from "./_components/auction-showcase-view"

export const metadata = {
  title: "Live Auction Marketplace | Bid on Luxury & Rare Collectibles",
  description: "Participate in real-time verified auctions for vintage watches, rare electronics, and luxury merchandise.",
}

export default async function AuctionShowcasePage() {
  const products = await getAllAuctionProducts()
  return <AuctionShowcaseView products={products} />
}
