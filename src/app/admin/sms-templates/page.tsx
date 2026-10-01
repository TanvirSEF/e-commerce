import React from "react"
import { Metadata } from "next"
import { getSmsTemplates } from "@/services/sms-service"
import { ensureAddonActivated } from "@/services/addon-service"
import { SmsTemplatesView } from "./_components/sms-templates-view"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "SMS Templates | Admin",
  description: "Configure automated SMS notification templates and placeholders",
}

export default async function AdminSmsTemplatesPage() {
  await ensureAddonActivated("otp_system")
  const templates = await getSmsTemplates()

  return <SmsTemplatesView initialTemplates={templates} />
}
