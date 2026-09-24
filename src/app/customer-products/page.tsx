import React from "react"
import { Metadata } from "next"
import { getPublishedCustomerProducts } from "@/services/customer-product-service"
import { CustomerProductsView } from "./_components/customer-products-view"

export const metadata: Metadata = {
  title: "Classified Advertisements | Active eCommerce CMS",
  description: "Browse verified customer second-hand products, used smartphones, laptops, electronics, and vehicles.",
}

export const dynamic = "force-dynamic"

export default async function CustomerProductsPage() {
  const products = await getPublishedCustomerProducts()

  return <CustomerProductsView initialProducts={products} />
}
