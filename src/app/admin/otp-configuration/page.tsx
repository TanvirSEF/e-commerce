import React from "react"
import { Metadata } from "next"
import { getSmsGateways } from "@/services/sms-service"
import { ensureAddonActivated } from "@/services/addon-service"
import { OtpConfigurationView } from "./_components/otp-configuration-view"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "OTP Configurations | Admin",
  description: "Configure local Bangladesh and international SMS gateways",
}

export default async function AdminOtpConfigPage() {
  await ensureAddonActivated("otp_system")
  const gateways = await getSmsGateways()

  return <OtpConfigurationView initialGateways={gateways} />
}
