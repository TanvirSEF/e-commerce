import React from "react"
import { getAiTokenUsageReport } from "@/services/report-service"
import { AdminAiTokenReportView } from "./_components/admin-ai-token-report-view"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "AI Token Usage Report | Active eCommerce Admin",
}

interface PageProps {
  searchParams: Promise<{ date?: string }>
}

export default async function AdminAiTokenReportPage({ searchParams }: PageProps) {
  const params = await searchParams
  const data = await getAiTokenUsageReport(params.date)

  return <AdminAiTokenReportView data={data} currentDateFilter={params.date} />
}
