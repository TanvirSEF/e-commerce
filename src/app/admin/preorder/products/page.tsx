import React from "react"
import { Metadata } from "next"
import { getPreorderProductsAdmin } from "@/services/preorder-service"
import { AdminPreorderProductsView } from "./_components/admin-preorder-products-view"

export const metadata: Metadata = {
  title: "All Preorder Products | Active eCommerce CMS",
  description: "Manage pre-order products, pricing, discounts, and quotas",
}

interface PageProps {
  searchParams?: Promise<{
    userType?: string
    statusFilter?: string
    sort?: string
    search?: string
    page?: string
  }>
}

export default async function AdminPreorderProductsPage(props: PageProps) {
  const searchParams = props.searchParams ? await props.searchParams : {}
  const page = parseInt(searchParams.page || "1", 10) || 1
  const userType = searchParams.userType || "all"
  const statusFilter = searchParams.statusFilter || "all"
  const sort = searchParams.sort || ""
  const search = searchParams.search || ""

  // Live database query via Drizzle ORM
  const result = await getPreorderProductsAdmin({
    userType,
    statusFilter,
    sort,
    search,
    page,
    limit: 15,
  })

  return (
    <div className="p-4 md:p-6 space-y-4">
      <AdminPreorderProductsView
        initialProducts={result.products}
        counts={result.counts}
        initialPage={result.page}
        initialTotalPages={result.totalPages}
        initialTotal={result.total}
        initialLimit={result.limit}
      />
    </div>
  )
}
