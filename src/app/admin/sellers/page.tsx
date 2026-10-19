import React from "react"
import { getAllSellersAdmin } from "@/services/seller-service"
import { SellersManagementView } from "./_components/sellers-management-view"

export const metadata = {
  title: "All Sellers | Active eCommerce Admin",
}

interface AdminSellersPageProps {
  searchParams?: Promise<{
    tab?: "all" | "banned" | "suspicious"
    search?: string
    verificationStatus?: "verified" | "unverified"
  }>
}

export default async function AdminSellersPage({ searchParams }: AdminSellersPageProps) {
  const params = await searchParams
  const { sellers } = await getAllSellersAdmin(params)

  return <SellersManagementView initialSellers={sellers} />
}
