import React from "react"
import { Metadata } from "next"
import { getServerStatusDiagnostics } from "@/services/report-service"
import { ServerStatusView } from "./_components/server-status-view"

export const metadata: Metadata = {
  title: "Server Information & Status | Active eCommerce Admin",
}

export default async function AdminServerStatusPage() {
  const diagnostics = await getServerStatusDiagnostics()

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <ServerStatusView status={diagnostics} />
    </div>
  )
}
