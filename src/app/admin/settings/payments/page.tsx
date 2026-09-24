import React from "react"
import { getPaymentGatewaysSettings } from "@/services/settings-service"
import { PaymentGatewaysView } from "./_components/payment-gateways-view"

export const metadata = {
  title: "Payment Methods & Gateways | Admin Panel",
}

export default async function AdminPaymentGatewaysPage() {
  const settings = await getPaymentGatewaysSettings()

  return <PaymentGatewaysView initialSettings={settings} />
}
