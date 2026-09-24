import React from "react"
import type { Metadata } from "next"
import { getCategories } from "@/services/category-service"
import { getCategoryDiscounts } from "@/services/settings-service"
import { CategoryDiscountView } from "./_components/category-discount-view"

export const metadata: Metadata = {
  title: "Set Category Wise Discount | Admin | Active eCommerce",
  description: "Set global category product discounts in Active eCommerce CMS",
}

export default async function CategoryDiscountPage() {
  const [categories, discounts] = await Promise.all([
    getCategories(),
    getCategoryDiscounts(),
  ])

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      <CategoryDiscountView
        categories={categories.map((c) => ({
          id: String(c.id),
          name: c.name,
          icon: c.icon,
        }))}
        initialDiscounts={discounts}
      />
    </div>
  )
}
