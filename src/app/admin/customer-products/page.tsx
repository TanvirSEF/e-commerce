import React from "react"
import { getAllClassifiedProductsAdmin } from "@/services/customer-product-service"
import { ClassifiedProductsAdminView } from "./_components/classified-products-admin-view"

export const metadata = {
  title: "Classified Customer Products Desk | Admin Panel",
}

export default async function AdminClassifiedProductsPage() {
  const products = await getAllClassifiedProductsAdmin()

  return <ClassifiedProductsAdminView initialProducts={products} />
}
