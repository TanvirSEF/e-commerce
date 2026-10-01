import React from "react"
import { Metadata } from "next"
import { ensureAddonActivated } from "@/services/addon-service"
import { SellerRefundRequestsView } from "./_components/seller-refund-requests-view"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Received Refund Requests | Seller Portal",
}

export default async function SellerRefundRequestsPage() {
  await ensureAddonActivated("refund_system")
  return <SellerRefundRequestsView />
}
