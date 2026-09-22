import React from "react"
import { Metadata } from "next"
import { getCategories } from "@/services/category-service"
import { CategoriesView } from "./_components/categories-view"

export const metadata: Metadata = {
  title: "All Categories | Active eCommerce",
  description: "Browse all product categories and subcategories in Active eCommerce CMS",
}

export default async function CategoriesPage() {
  const allCategories = await getCategories()

  // Format into hierarchical structures with representative subcategories
  const categoryGroups = allCategories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    banner: c.icon || "/assets/img/placeholder.jpg",
    subcategories: [
      {
        name: "Trending Now",
        slug: `${c.slug}?filter=trending`,
        children: [
          { name: "Top Rated", slug: `${c.slug}?filter=top-rated` },
          { name: "Best Sellers", slug: `${c.slug}?filter=best-sellers` },
          { name: "New Arrivals", slug: `${c.slug}?filter=new` },
          { name: "Special Deals", slug: `${c.slug}?filter=deals` },
        ],
      },
      {
        name: "Featured Collections",
        slug: `${c.slug}?filter=featured`,
        children: [
          { name: "Premium Series", slug: `${c.slug}?filter=premium` },
          { name: "Budget Friendly", slug: `${c.slug}?filter=budget` },
          { name: "Popular Choice", slug: `${c.slug}?filter=popular` },
        ],
      },
      {
        name: "Popular Brands",
        slug: `${c.slug}?filter=brands`,
        children: [
          { name: "Official Stores", slug: `${c.slug}?filter=official` },
          { name: "Verified Sellers", slug: `${c.slug}?filter=verified` },
        ],
      },
    ],
  }))

  return <CategoriesView categories={categoryGroups} />
}
