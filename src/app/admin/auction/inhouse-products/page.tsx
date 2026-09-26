import React from "react"
import { getInhouseAuctionProducts } from "@/services/auction-service"
import { AdminAuctionAllProductsView } from "../all-products/_components/admin-auction-all-products-view"

export const metadata = {
  title: "Inhouse Auction Products | Admin Panel",
}

export default async function AdminInhouseAuctionProductsPage() {
  const products = await getInhouseAuctionProducts()

  return (
    <AdminAuctionAllProductsView
      products={products}
      title="Inhouse Auction Products"
      subtitle="Exclusive luxury, rare items, and flagship auctions managed by platform admins"
    />
  )
}
