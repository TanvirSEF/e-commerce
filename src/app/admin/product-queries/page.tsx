import React from "react"
import { Metadata } from "next"
import { getAllQueriesAdmin } from "@/services/product-query-service"
import { ProductQueriesAdminView } from "./_components/product-queries-admin-view"

export const metadata: Metadata = {
  title: "Product Queries | Active eCommerce CMS",
  description: "View and reply to customer product inquiries and pre-sales questions",
}

export const dynamic = "force-dynamic"

export default async function AdminProductQueriesPage() {
  const data = await getAllQueriesAdmin({ page: 1, limit: 20 })

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <ProductQueriesAdminView initialData={data} />
    </div>
  )
}
