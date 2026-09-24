import React from "react"
import { Metadata } from "next"
import { getPosConfig } from "@/services/pos-service"
import { PosActivationView } from "./_components/pos-activation-view"

export const metadata: Metadata = {
  title: "POS Configuration | Admin Dashboard",
  description: "Configure thermal printer, barcode scanning, and POS terminal behavior",
}

export default async function AdminPosActivationPage() {
  const config = await getPosConfig()

  return (
    <div className="p-4 md:p-6">
      <PosActivationView initialConfig={config} />
    </div>
  )
}
