import React from "react"
import { Metadata } from "next"
import { SellerDigitalProductsView } from "./_components/seller-digital-products-view"

export const metadata: Metadata = {
  title: "Digital Products | Seller Merchant Panel",
  description: "Manage digital downloads, licenses, and media assets",
}

export default function SellerDigitalProductsPage() {
  return <SellerDigitalProductsView />
}
