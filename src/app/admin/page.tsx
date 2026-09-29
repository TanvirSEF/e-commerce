import React from "react"
import { Metadata } from "next"
import { getAdminDashboardData } from "@/services/admin-dashboard-service"
import { AdminDashboardView } from "./_components/admin-dashboard-view"

export const metadata: Metadata = {
  title: "Admin Dashboard | Active eCommerce CMS",
  description: "Comprehensive management panel for products, sales, and catalog",
}

export const dynamic = "force-dynamic"

export default async function AdminDashboardPage() {
  const data = await getAdminDashboardData()

  return <AdminDashboardView data={data} />
}
