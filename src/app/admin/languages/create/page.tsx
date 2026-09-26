import React from "react"
import { Metadata } from "next"
import { LanguageCreateView } from "./_components/language-create-view"

export const metadata: Metadata = {
  title: "Add New Language | Admin Dashboard",
  description: "Create and register a new language for the storefront",
}

export default function AdminLanguageCreatePage() {
  return (
    <div className="p-4 md:p-6">
      <LanguageCreateView />
    </div>
  )
}
