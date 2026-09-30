import React from "react"
import { Metadata } from "next"
import { getAuctionProductsAdmin } from "@/services/auction-service"
import { AdminAuctionAllProductsView } from "./_components/admin-auction-all-products-view"

export const metadata: Metadata = {
  title: "All Auction Products | Admin Control Panel",
  description: "Supervise all active, inhouse, and vendor auction products",
}

interface AdminAuctionAllProductsPageProps {
  searchParams: Promise<{
    search?: string
    status?: string
    page?: string
  }>
}

export default async function AdminAuctionAllProductsPage(props: AdminAuctionAllProductsPageProps) {
  const searchParams = await props.searchParams
  const search = searchParams.search || ""
  const status = searchParams.status || "all"
  const page = Number(searchParams.page) || 1

  const { products, counts } = await getAuctionProductsAdmin({
    userType: "all",
    search,
    status,
    page,
    limit: 25,
  })

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <AdminAuctionAllProductsView
        products={products}
        activeType="all"
        title="All Auction Products"
        counts={counts}
      />
    </div>
  )
}
