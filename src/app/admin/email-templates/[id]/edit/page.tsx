import React from "react"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getEmailTemplateById } from "@/services/email-template-service"
import { EmailTemplateEditView } from "./_components/email-template-edit-view"

interface PageProps {
  params: Promise<{ id: string }>
}

export const metadata: Metadata = {
  title: "Edit Email Template | Admin Dashboard",
  description: "Modify transactional email notification body and subject",
}

export default async function AdminEmailTemplateEditPage({ params }: PageProps) {
  const { id } = await params
  const template = await getEmailTemplateById(Number(id))

  if (!template) {
    notFound()
  }

  return (
    <div className="p-4 md:p-6">
      <EmailTemplateEditView template={template} />
    </div>
  )
}
