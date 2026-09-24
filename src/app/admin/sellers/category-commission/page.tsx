import React from "react"
import { Metadata } from "next"
import { getCategories } from "@/services/category-service"
import { getCategoryCommissions } from "@/services/settings-service"
import { CategoryCommissionView } from "./_components/category-commission-view"

export const metadata: Metadata = {
  title: "Category Commission | Admin Dashboard",
  description: "Configure category-wise marketplace commission rates",
}

export default async function AdminCategoryCommissionPage() {
  const [categories, commissions] = await Promise.all([
    getCategories(),
    getCategoryCommissions(),
  ])

  return (
    <div className="p-4 md:p-6">
      <CategoryCommissionView
        categories={categories}
        initialCommissions={commissions}
      />
    </div>
  )
}
