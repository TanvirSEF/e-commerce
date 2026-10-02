import React from "react"
import { Metadata } from "next"
import { headers } from "next/headers"
import { auth } from "@/lib/auth/auth"
import { getCustomerProductsByUser } from "@/services/customer-product-service"
import { CustomerProductsListView } from "./_components/customer-products-list-view"

export const metadata: Metadata = {
  title: "Classified Products | Active eCommerce",
  description: "Manage your classified ads, availability status, and product listings.",
}

export const dynamic = "force-dynamic"

export default async function CustomerDashboardProductsPage() {
  let currentUserId = "usr_customer_default_01"
  try {
    const h = await headers()
    const session = await auth.api.getSession({ headers: h })
    if (session?.user?.id) {
      currentUserId = session.user.id
    }
  } catch {
    // fallback
  }

  const products = await getCustomerProductsByUser(currentUserId)

  return <CustomerProductsListView initialProducts={products} />
}
