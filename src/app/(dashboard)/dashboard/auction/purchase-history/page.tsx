import React from "react"
import { getUserWonAuctions } from "@/services/auction-service"
import { CustomerWonAuctionsView } from "./_components/customer-won-auctions-view"

export const metadata = {
  title: "Won Auctions History | Customer Portal",
}

export default async function CustomerWonAuctionsPage() {
  const orders = await getUserWonAuctions("r.sterling@example.com")
  return <CustomerWonAuctionsView orders={orders} />
}
