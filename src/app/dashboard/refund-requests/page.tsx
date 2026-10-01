import React from "react"
import { getUserRefunds } from "@/services/refund-service"
import { ensureAddonActivated } from "@/services/addon-service"
import { RefundRequestsView } from "./_components/refund-requests-view"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Refund & Return Requests | Customer Portal",
}

export default async function CustomerRefundRequestsPage() {
  await ensureAddonActivated("refund_system")
  const refunds = await getUserRefunds()

  return <RefundRequestsView initialRefunds={refunds} />
}
