import React from "react"
import { getAllAuctionProducts } from "@/services/auction-service"
import { AdminAuctionAllProductsView } from "./_components/admin-auction-all-products-view"

export const metadata = {
  title: "All Auction Products | Admin Panel",
}

export default async function AdminAuctionAllProductsPage() {
  const products = await getAllAuctionProducts()

  return <AdminAuctionAllProductsView products={products} />
}
