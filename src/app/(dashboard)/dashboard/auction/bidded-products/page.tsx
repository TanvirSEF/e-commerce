import React from "react"
import { getUserBids } from "@/services/auction-service"
import { CustomerBiddedProductsView } from "./_components/customer-bidded-products-view"

export const metadata = {
  title: "My Auction Bids | Customer Portal",
}

export default async function CustomerBiddedProductsPage() {
  const items = await getUserBids("alex.vance@example.com")
  return <CustomerBiddedProductsView items={items} />
}
