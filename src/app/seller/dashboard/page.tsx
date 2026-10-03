import React from "react"
import { Metadata } from "next"
import { getServerSession } from "@/lib/auth/session-helper"
import { getSellerFullDashboardData } from "@/services/seller-service"
import { SellerDashboardView } from "./_components/seller-dashboard-view"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Seller Dashboard | Active eCommerce",
  description: "Monitor store sales, products, orders, and withdraw requests in real-time.",
}

export default async function SellerDashboardPage() {
  const session = await getServerSession()
  const sellerUserId = session?.user?.id

  const data = await getSellerFullDashboardData({
    userId: sellerUserId,
  })

  return <SellerDashboardView data={data} />
}
