import React from "react"
import { getEarningPayoutReport } from "@/services/report-service"
import { AdminEarningPayoutReportView } from "./_components/admin-earning-payout-report-view"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Earning Report | Active eCommerce Admin",
}

export default async function AdminEarningPayoutReportPage() {
  const data = await getEarningPayoutReport()

  return <AdminEarningPayoutReportView data={data} />
}
