import React from "react"
import { getSellerAuctionProducts } from "@/services/auction-service"
import { SellerAuctionProductsView } from "./_components/seller-auction-products-view"

export const metadata = {
  title: "My Auction Listings | Seller Panel",
}

export default async function SellerAuctionProductsPage() {
  const products = await getSellerAuctionProducts()
  return <SellerAuctionProductsView products={products} />
}
