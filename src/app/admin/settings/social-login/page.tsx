import React from "react"
import { Metadata } from "next"
import { getSocialLoginSettings } from "@/services/settings-service"
import { SocialLoginView } from "./_components/social-login-view"

export const metadata: Metadata = {
  title: "Social Login Settings | Admin Dashboard",
  description: "Configure third-party social OAuth credentials",
}

export default async function AdminSocialLoginPage() {
  const settings = await getSocialLoginSettings()

  return (
    <div className="p-4 md:p-6">
      <SocialLoginView initialSettings={settings} />
    </div>
  )
}
