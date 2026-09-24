import React from "react"
import { Metadata } from "next"
import { getSmsGateways } from "@/services/sms-service"
import { OtpConfigurationView } from "./_components/otp-configuration-view"

export const metadata: Metadata = {
  title: "OTP & SMS Providers | Admin Dashboard",
  description: "Configure local Bangladesh and international SMS gateways",
}

export default async function AdminOtpConfigPage() {
  const gateways = await getSmsGateways()

  return (
    <div className="p-4 md:p-6">
      <OtpConfigurationView initialGateways={gateways} />
    </div>
  )
}
