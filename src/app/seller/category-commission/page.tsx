import React from "react"
import { Metadata } from "next"
import { getCategories } from "@/services/category-service"
import { SellerCategoryCommissionView, type CategoryCommissionItem } from "./_components/category-commission-view"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Category-wise Commission | Seller Portal",
  description: "View platform commission rates applied to your vendor store product sales by category",
}

export default async function SellerCategoryCommissionPage() {
  const dbCategories = await getCategories()

  const formatted: CategoryCommissionItem[] = dbCategories.map((c) => {
    // Default commissions based on catalog hierarchy matching Active eCommerce
    let comm = 10
    if (c.slug.includes("computer") || c.slug.includes("smartphone")) comm = 8
    if (c.slug.includes("kitchen")) comm = 12
    if (c.slug.includes("fitness")) comm = 9

    return {
      id: c.id,
      name: c.name,
      icon: c.icon,
      commission: comm,
    }
  })

  return (
    <div className="p-4 md:p-6">
      <SellerCategoryCommissionView categories={formatted} />
    </div>
  )
}
