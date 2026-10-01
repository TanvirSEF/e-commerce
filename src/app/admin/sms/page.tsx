import React from "react"
import { Metadata } from "next"
import { getSmsGateways, getSmsTemplates, getRecipientCounts } from "@/services/sms-service"
import { ensureAddonActivated } from "@/services/addon-service"
import { BulkSmsView } from "./_components/bulk-sms-view"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Bulk SMS | Admin",
  description: "Send broadcast SMS messages to registered customers and sellers",
}

export default async function AdminBulkSmsPage() {
  await ensureAddonActivated("otp_system")
  const [gateways, templates, recipientCounts] = await Promise.all([
    getSmsGateways(),
    getSmsTemplates(),
    getRecipientCounts(),
  ])

  return (
    <BulkSmsView
      gateways={gateways}
      templates={templates}
      recipientCounts={recipientCounts}
    />
  )
}
