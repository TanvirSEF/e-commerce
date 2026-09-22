import React from "react"
import { SellerProductCreateView } from "./_components/seller-product-create-view"
import { getCategories } from "@/services/category-service"
import { getBrands } from "@/services/brand-service"

export const metadata = {
  title: "Add New Product | Seller Dashboard",
}

export default async function SellerProductCreatePage() {
  const [categories, brands] = await Promise.all([getCategories(), getBrands()])

  return <SellerProductCreateView categories={categories} brands={brands} />
}
