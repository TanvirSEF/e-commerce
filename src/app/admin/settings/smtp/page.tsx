import React from "react"
import { getSmtpSettings } from "@/services/settings-service"
import { SmtpSettingsView } from "./_components/smtp-settings-view"

export const metadata = {
  title: "SMTP & Mail Server Settings | Admin Panel",
}

export default async function AdminSmtpSettingsPage() {
  const settings = await getSmtpSettings()

  return <SmtpSettingsView initialSettings={settings} />
}
