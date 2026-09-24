import React from "react"
import { Metadata } from "next"
import { getSmsTemplates } from "@/services/sms-service"
import { SmsTemplatesView } from "./_components/sms-templates-view"

export const metadata: Metadata = {
  title: "SMS Templates | Admin Dashboard",
  description: "Configure system automated SMS notification templates and placeholders",
}

export default async function AdminSmsTemplatesPage() {
  const templates = await getSmsTemplates()

  return (
    <div className="p-4 md:p-6">
      <SmsTemplatesView initialTemplates={templates} />
    </div>
  )
}
