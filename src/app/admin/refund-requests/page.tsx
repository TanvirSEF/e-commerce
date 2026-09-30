import React from "react"
import { getRefundsAdminWithPagination, getRefundReasons } from "@/services/refund-service"
import { RefundRequestsAdminView } from "./_components/refund-requests-admin-view"

export const metadata = {
  title: "Refund Requests | Active eCommerce CMS",
  description: "Audit customer refund and return requests",
}

interface PageProps {
  searchParams?: Promise<{
    search?: string
    status?: string
    page?: string
  }>
}

export default async function AdminRefundRequestsPage(props: PageProps) {
  const searchParams = props.searchParams ? await props.searchParams : {}
  const page = parseInt(searchParams.page || "1", 10) || 1
  const search = searchParams.search || ""
  const status = searchParams.status || "all"

  // Live database queries via Drizzle ORM
  const [refundData, reasonsList] = await Promise.all([
    getRefundsAdminWithPagination({
      search,
      status,
      page,
      limit: 15,
    }),
    getRefundReasons("customer_refund_reason"),
  ])

  const presetReasons = reasonsList.map((r) => r.reason)

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <RefundRequestsAdminView
        initialItems={refundData.items}
        stats={refundData.stats}
        presetReasons={presetReasons}
        initialPage={refundData.page}
        initialTotalPages={refundData.totalPages}
        initialTotal={refundData.total}
        initialLimit={refundData.limit}
      />
    </div>
  )
}
