import React from "react"
import { Metadata } from "next"
import { getAuctionProductsAdmin } from "@/services/auction-service"
import { AdminAuctionAllProductsView } from "../all-products/_components/admin-auction-all-products-view"

export const metadata: Metadata = {
  title: "Seller Auction Products | Admin Control Panel",
  description: "Manage vendor auction products, seller commissions, and bidding",
}

interface AdminSellerAuctionProductsPageProps {
  searchParams: Promise<{
    search?: string
    status?: string
    page?: string
  }>
}

export default async function AdminSellerAuctionProductsPage(
  props: AdminSellerAuctionProductsPageProps
) {
  const searchParams = await props.searchParams
  const search = searchParams.search || ""
  const status = searchParams.status || "all"
  const page = Number(searchParams.page) || 1

  const { products, counts } = await getAuctionProductsAdmin({
    userType: "seller",
    search,
    status,
    page,
    limit: 25,
  })

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <AdminAuctionAllProductsView
        products={products}
        activeType="seller"
        title="Seller Auction Products"
        counts={counts}
      />
    </div>
  )
}
