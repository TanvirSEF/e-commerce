import React from "react"
import { Metadata } from "next"
import { getAuctionProductsAdmin } from "@/services/auction-service"
import { AdminAuctionAllProductsView } from "../all-products/_components/admin-auction-all-products-view"

export const metadata: Metadata = {
  title: "Inhouse Auction Products | Admin Control Panel",
  description: "Manage inhouse auction products and starting bids",
}

interface AdminInhouseAuctionProductsPageProps {
  searchParams: Promise<{
    search?: string
    status?: string
    page?: string
  }>
}

export default async function AdminInhouseAuctionProductsPage(
  props: AdminInhouseAuctionProductsPageProps
) {
  const searchParams = await props.searchParams
  const search = searchParams.search || ""
  const status = searchParams.status || "all"
  const page = Number(searchParams.page) || 1

  const { products, counts } = await getAuctionProductsAdmin({
    userType: "inhouse",
    search,
    status,
    page,
    limit: 25,
  })

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <AdminAuctionAllProductsView
        products={products}
        activeType="inhouse"
        title="Inhouse Auction Products"
        counts={counts}
      />
    </div>
  )
}
