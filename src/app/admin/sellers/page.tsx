import React from "react"
import { getAllSellersAdmin } from "@/services/seller-service"
import { SellersManagementView } from "./_components/sellers-management-view"

export const metadata = {
  title: "All Sellers | Active eCommerce Admin",
}

export default async function AdminSellersPage() {
  const { sellers } = await getAllSellersAdmin()

  return <SellersManagementView initialSellers={sellers} />
}
