import React from "react"
import { getSellerWithdrawRequests, getSellerDashboardStats } from "@/services/seller-service"
import { SellerPayoutsView } from "./_components/seller-payouts-view"

export const metadata = {
  title: "Payout Requests | Seller Dashboard",
}

export default async function SellerPayoutsPage() {
  const [requests, stats] = await Promise.all([
    getSellerWithdrawRequests("active-fashion-outlet"),
    getSellerDashboardStats("active-fashion-outlet"),
  ])

  return (
    <SellerPayoutsView
      initialRequests={requests}
      currentBalance={stats.currentBalance}
    />
  )
}
