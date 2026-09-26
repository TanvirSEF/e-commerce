import React from "react"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getLanguageById } from "@/services/language-service"
import { LanguageEditView } from "./_components/language-edit-view"

interface PageProps {
  params: Promise<{ id: string }>
}

export const metadata: Metadata = {
  title: "Edit Language | Admin Dashboard",
  description: "Modify language parameters",
}

export default async function AdminLanguageEditPage({ params }: PageProps) {
  const { id } = await params
  const language = await getLanguageById(Number(id))

  if (!language) {
    notFound()
  }

  return (
    <div className="p-4 md:p-6">
      <LanguageEditView language={language} />
    </div>
  )
}
