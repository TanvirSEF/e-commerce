import React from "react"
import { Metadata } from "next"
import { getAllCategoriesHierarchy } from "@/services/category-service"
import { CategoriesView } from "./_components/categories-view"

export const metadata: Metadata = {
  title: "All Categories | Active eCommerce",
  description: "Browse all product categories and subcategories in Active eCommerce CMS",
}

export const dynamic = "force-dynamic"

export default async function CategoriesPage() {
  const categories = await getAllCategoriesHierarchy()

  return <CategoriesView categories={categories} />
}
