import React from "react"
import { Metadata } from "next"
import { redirect } from "next/navigation"
import { getCurrentSeller, getSellerProductQueries } from "@/services/seller-panel-service"
import { SellerQueriesView } from "./_components/seller-queries-view"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Product Queries | Seller Dashboard",
  description: "View and reply to customer inquiries on your products",
}

export default async function SellerProductQueriesPage() {
  const seller = await getCurrentSeller()
  if (!seller) {
    redirect("/seller/login")
  }

  const queries = await getSellerProductQueries(seller)

  return (
    <div className="aiz-user-panel p-4 md:p-6 space-y-4">
      <SellerQueriesView initialQueries={queries} />
    </div>
  )
}
