import React from "react"
import { Metadata } from "next"
import { getAllEmailTemplates } from "@/services/email-template-service"
import { EmailTemplatesView } from "./_components/email-templates-view"

export const metadata: Metadata = {
  title: "Email Templates | Admin Dashboard",
  description: "Configure system automated email notification templates",
}

export default async function AdminEmailTemplatesPage() {
  const templates = await getAllEmailTemplates()

  return (
    <div className="p-4 md:p-6">
      <EmailTemplatesView initialTemplates={templates} />
    </div>
  )
}
