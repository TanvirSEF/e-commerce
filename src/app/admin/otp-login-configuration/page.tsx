import React from "react"
import { Metadata } from "next"
import { getOtpSettings } from "@/services/sms-service"
import { ensureAddonActivated } from "@/services/addon-service"
import { OtpLoginView } from "./_components/otp-login-view"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "OTP Login Configuration | Admin",
  description: "Configure phone verification, COD OTP, and login authentication rules",
}

export default async function AdminOtpLoginPage() {
  await ensureAddonActivated("otp_system")
  const settings = await getOtpSettings()

  return <OtpLoginView initialSettings={settings} />
}
