import React from "react"
import { SellerProductCreateView } from "./_components/seller-product-create-view"
import { getCategories } from "@/services/category-service"
import { getBrands } from "@/services/brand-service"
import { getProductForEdit } from "@/services/product-service"

export const metadata = {
  title: "Product Editor | Seller Dashboard",
}

export default async function SellerProductCreatePage(props: {
  searchParams: Promise<{ edit?: string }>
}) {
  const searchParams = await props.searchParams
  const editId = searchParams?.edit

  const [categories, brands, initialProduct] = await Promise.all([
    getCategories(),
    getBrands(),
    editId ? getProductForEdit(editId) : Promise.resolve(null),
  ])

  return (
    <SellerProductCreateView
      categories={categories}
      brands={brands}
      initialProduct={initialProduct}
    />
  )
}

