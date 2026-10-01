import React from "react"
import { getCommissionHistoryReport } from "@/services/report-service"
import { AdminCommissionReportView } from "./_components/admin-commission-report-view"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Commission History Report | Active eCommerce Admin",
}

interface PageProps {
  searchParams: Promise<{ seller_id?: string; date_range?: string }>
}

export default async function AdminCommissionReportPage({ searchParams }: PageProps) {
  const params = await searchParams
  const { commissions, sellers } = await getCommissionHistoryReport({
    sellerId: params.seller_id,
    dateRange: params.date_range,
  })

  return (
    <AdminCommissionReportView
      commissions={commissions}
      sellers={sellers}
      currentSellerId={params.seller_id}
      currentDateRange={params.date_range}
    />
  )
}
