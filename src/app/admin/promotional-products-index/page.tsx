import React from "react"
import { Metadata } from "next"
import {
  getPromotionalProducts,
  getCategoriesForPromotional,
} from "@/services/promotional-product-service"
import { PromotionalProductsView } from "./_components/promotional-products-view"

export const metadata: Metadata = {
  title: "Promotional Products | Active eCommerce CMS",
  description: "Manage promotional products, offers, and discounts in Active eCommerce CMS",
}

export const dynamic = "force-dynamic"

export default async function AdminPromotionalProductsPage() {
  const [initialData, categories] = await Promise.all([
    getPromotionalProducts({ page: 1, limit: 15 }),
    getCategoriesForPromotional(),
  ])

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PromotionalProductsView
        initialData={initialData}
        categories={categories}
      />
    </div>
  )
}
