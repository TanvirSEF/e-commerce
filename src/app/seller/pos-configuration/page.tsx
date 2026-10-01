import React from "react"
import { Metadata } from "next"
import { SellerPosConfigView } from "./_components/seller-pos-config-view"

import { ensureAddonActivated } from "@/services/addon-service"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "POS Settings | Seller Console",
  description: "Configure seller POS terminal and thermal print settings",
}

export default async function SellerPosConfigPage() {
  await ensureAddonActivated("pos_system")
  return (
    <div className="p-4 md:p-6">
      <SellerPosConfigView />
    </div>
  )
}
