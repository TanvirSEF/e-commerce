import React from "react"
import { getSellerDashboardStats } from "@/services/seller-service"
import { getProducts } from "@/services/product-service"
import { SellerDashboardView } from "./_components/seller-dashboard-view"

export const metadata = {
  title: "Seller Dashboard | Active eCommerce",
}

export default async function SellerDashboardPage() {
  const [stats, { data: recentProducts }] = await Promise.all([
    getSellerDashboardStats("active-fashion-outlet"),
    getProducts({ limit: 5 }),
  ])

  return <SellerDashboardView stats={stats} recentProducts={recentProducts} />
}
