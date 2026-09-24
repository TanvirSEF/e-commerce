import React from "react"
import { getAllQueriesAdmin } from "@/services/product-query-service"
import { ProductQueriesAdminView } from "./_components/product-queries-admin-view"

export const metadata = {
  title: "Product Queries & Customer Q&A Desk | Admin Panel",
}

export default async function AdminProductQueriesPage() {
  const queries = await getAllQueriesAdmin()

  return <ProductQueriesAdminView initialQueries={queries} />
}
