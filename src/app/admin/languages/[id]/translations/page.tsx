import React from "react"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getLanguageById, getTranslationsForLanguage } from "@/services/language-service"
import { TranslationsView } from "./_components/translations-view"

interface PageProps {
  params: Promise<{ id: string }>
}

export const metadata: Metadata = {
  title: "Language Translations | Admin Dashboard",
  description: "Edit translations for localized user interface",
}

export default async function AdminTranslationsPage({ params }: PageProps) {
  const { id } = await params
  const language = await getLanguageById(Number(id))

  if (!language) {
    notFound()
  }

  const translations = await getTranslationsForLanguage(language.code)

  return (
    <div className="p-4 md:p-6">
      <TranslationsView language={language} initialTranslations={translations} />
    </div>
  )
}
