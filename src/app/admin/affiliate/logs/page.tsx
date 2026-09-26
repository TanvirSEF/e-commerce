import React from "react"
import { getAllAffiliateLogs } from "@/services/affiliate-service"
import { AdminAffiliateLogsView } from "./_components/admin-affiliate-logs-view"

export const metadata = {
  title: "Affiliate Commission Logs | Admin Panel",
}

export default async function AdminAffiliateLogsPage() {
  const logs = await getAllAffiliateLogs()
  return <AdminAffiliateLogsView logs={logs} />
}
