import React from "react"
import { getAllQueriesAdmin } from "@/services/product-query-service"
import { SellerQueriesView } from "./_components/seller-queries-view"

export const metadata = {
  title: "Product Queries & Customer Q&A | Seller Portal",
}

export default async function SellerProductQueriesPage() {
  const queries = await getAllQueriesAdmin()

  return <SellerQueriesView initialQueries={queries} />
}
