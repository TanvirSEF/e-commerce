import React from "react"
import { Metadata } from "next"
import { SellerPosConfigView } from "./_components/seller-pos-config-view"

export const metadata: Metadata = {
  title: "POS Settings | Seller Console",
  description: "Configure seller POS terminal and thermal print settings",
}

export default function SellerPosConfigPage() {
  return (
    <div className="p-4 md:p-6">
      <SellerPosConfigView />
    </div>
  )
}
