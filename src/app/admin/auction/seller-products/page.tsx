import React from "react"
import { getSellerAuctionProducts } from "@/services/auction-service"
import { AdminAuctionAllProductsView } from "../all-products/_components/admin-auction-all-products-view"

export const metadata = {
  title: "Seller Auction Products | Admin Panel",
}

export default async function AdminSellerAuctionProductsPage() {
  const products = await getSellerAuctionProducts()

  return (
    <AdminAuctionAllProductsView
      products={products}
      title="Seller Auction Products"
      subtitle="Supervise active bidder listings and auctions conducted by verified vendor shops"
    />
  )
}
