import React from "react"
import { Metadata } from "next"
import { getOtpSettings } from "@/services/sms-service"
import { OtpLoginView } from "./_components/otp-login-view"

export const metadata: Metadata = {
  title: "OTP Login Configuration | Admin",
  description: "Configure phone verification, COD OTP, and login authentication rules",
}

export default async function AdminOtpLoginPage() {
  const settings = await getOtpSettings()

  return <OtpLoginView initialSettings={settings} />
}
