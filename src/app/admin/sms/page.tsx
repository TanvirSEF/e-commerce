import React from "react"
import { Metadata } from "next"
import { getSmsGateways } from "@/services/sms-service"
import { BulkSmsView } from "./_components/bulk-sms-view"

export const metadata: Metadata = {
  title: "Bulk SMS Broadcaster | Admin Dashboard",
  description: "Send broadcast SMS messages to registered customers and sellers",
}

export default async function AdminBulkSmsPage() {
  const gateways = await getSmsGateways()

  return (
    <div className="p-4 md:p-6">
      <BulkSmsView gateways={gateways} />
    </div>
  )
}
