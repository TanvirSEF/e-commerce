import React from "react"
import { Metadata } from "next"
import { getServerSession } from "@/lib/auth/session-helper"
import { getSellerFullDashboardData } from "@/services/seller-service"
import { SellerProductCreateView } from "./_components/seller-product-create-view"
import { getCategories } from "@/services/category-service"
import { getBrands } from "@/services/brand-service"
import { getProductForEdit } from "@/services/product-service"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Product Editor | Seller Dashboard",
  description: "Create and publish new items to your seller store catalog",
}

export default async function SellerProductCreatePage(props: {
  searchParams: Promise<{ edit?: string }>
}) {
  const searchParams = await props.searchParams
  const editId = searchParams?.edit

  const session = await getServerSession()
  const sellerData = await getSellerFullDashboardData({
    userId: session?.user?.id,
  })

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
      shopId={sellerData.shop.id}
      sellerUserId={session?.user?.id || "usr_seller_default_01"}
    />
  )
}
