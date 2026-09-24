import React from "react"
import { Metadata } from "next"
import { getCustomerProductsByUser } from "@/services/customer-product-service"
import { CustomerProductsListView } from "./_components/customer-products-list-view"

export const metadata: Metadata = {
  title: "My Classified Advertisements | Customer Dashboard",
  description: "Manage your second-hand product listings and post new classified ads.",
}

export const dynamic = "force-dynamic"

export default async function CustomerDashboardProductsPage() {
  const products = await getCustomerProductsByUser()

  return <CustomerProductsListView initialProducts={products} />
}
