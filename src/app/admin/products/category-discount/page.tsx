import React from "react"
import type { Metadata } from "next"
import { getCategories } from "@/services/category-service"
import { getCategoryDiscounts } from "@/services/settings-service"
import { getProducts } from "@/services/product-service"
import { CategoryDiscountView } from "./_components/category-discount-view"
import type { CategoryDiscountTableItem } from "./_components/category-discount-table"

export const metadata: Metadata = {
  title: "Set Category Wise Product Discount | Active eCommerce CMS",
  description: "Set global category product discounts in Active eCommerce CMS",
}

export const dynamic = "force-dynamic"

export default async function CategoryDiscountPage() {
  const [categories, discounts, productsResult] = await Promise.all([
    getCategories(),
    getCategoryDiscounts(),
    getProducts({ limit: 1000, includeUnpublished: true }),
  ])

  const products = productsResult.data

  const items: CategoryDiscountTableItem[] = categories.map((cat) => {
    const parent = categories.find((c) => String(c.id) === String(cat.parentId))
    const inhouseCount = products.filter(
      (p) =>
        p.categorySlug === cat.slug &&
        (p.addedBy === "admin" || !p.addedBy)
    ).length
    const sellerCount = products.filter(
      (p) =>
        p.categorySlug === cat.slug &&
        p.addedBy !== "admin" &&
        !!p.addedBy
    ).length

    const rule = discounts[String(cat.id)]

    return {
      id: String(cat.id),
      name: cat.name,
      slug: cat.slug,
      icon: cat.icon,
      parentId: cat.parentId,
      parentName: parent ? parent.name : "—",
      digital: cat.digital,
      inhouseCount: inhouseCount || 0,
      sellerCount: sellerCount || 0,
      discount: rule?.discount || 0,
      startDate: rule?.startDate || "",
      endDate: rule?.endDate || "",
      sellerDiscount: rule?.applyToSeller ?? false,
    }
  })

  return <CategoryDiscountView initialCategories={items} />
}
