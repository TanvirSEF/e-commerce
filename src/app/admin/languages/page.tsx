import React from "react"
import { Metadata } from "next"
import { getAllLanguages } from "@/services/language-service"
import { LanguagesView } from "./_components/languages-view"

export const metadata: Metadata = {
  title: "Language Settings | Admin Dashboard",
  description: "Manage system languages, default locale, RTL support, and translations",
}

export default async function AdminLanguagesPage() {
  const languages = await getAllLanguages()

  return (
    <div className="p-4 md:p-6">
      <LanguagesView initialLanguages={languages} />
    </div>
  )
}
