import React from "react"
import { Metadata } from "next"
import { SellerCategoryDiscountView } from "./_components/category-discount-view"

export const metadata: Metadata = {
  title: "Category Base Product Discount | Seller Portal",
}

export default function SellerCategoryDiscountPage() {
  return <SellerCategoryDiscountView />
}
