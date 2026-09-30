import React from "react"
import { Metadata } from "next"
import { getCategories } from "@/services/category-service"
import { getBrands } from "@/services/brand-service"
import { AdminAuctionCreateView } from "./_components/admin-auction-create-view"

export const metadata: Metadata = {
  title: "Create Auction Product | Admin Control Panel",
  description: "Configure starting bid, reserve rules, and publish a new auction listing",
}

export default async function AdminAuctionCreatePage() {
  const [categories, brands] = await Promise.all([
    getCategories(),
    getBrands(),
  ])

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <AdminAuctionCreateView
        categories={(categories || []).map((c) => ({ id: c.id, name: c.name, slug: c.slug }))}
        brands={(brands || []).map((b) => ({ id: b.id, name: b.name, slug: b.slug }))}
      />
    </div>
  )
}
