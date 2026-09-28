import React from "react"
import { Metadata } from "next"
import { getAuthLayoutSettings } from "@/services/settings-service"
import { AuthenticationLayoutView } from "./_components/authentication-layout-view"

export const metadata: Metadata = {
  title: "Authentication Layout Settings | Website Settings | Admin",
  description: "Select design layout template for customer login and registration",
}

export default async function AuthenticationLayoutPage() {
  const settings = await getAuthLayoutSettings()

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      <AuthenticationLayoutView initialSettings={settings} />
    </div>
  )
}
