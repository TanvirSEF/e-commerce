import React from "react"
import { Metadata } from "next"
import { getCategories } from "@/services/category-service"
import { AdminCategoriesView, AdminCategoryItem } from "./_components/admin-categories-view"

export const metadata: Metadata = {
  title: "Categories Manager | Admin Control Panel",
  description: "Create, view, and organize product categories",
}

export default async function AdminCategoriesPage() {
  const categories = await getCategories()

  const initialCategories: AdminCategoryItem[] = categories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    icon: c.icon,
    featured: c.featured,
    orderLevel: c.orderLevel,
  }))

  return <AdminCategoriesView initialCategories={initialCategories} />
}
