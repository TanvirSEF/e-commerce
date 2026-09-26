import React from "react"
import { Metadata } from "next"
import { SellerCategoryCommissionView } from "./_components/category-commission-view"

export const metadata: Metadata = {
  title: "Category-wise Commission | Seller Portal",
}

export default function SellerCategoryCommissionPage() {
  return <SellerCategoryCommissionView />
}
