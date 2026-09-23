import React from "react"
import { getUserRefunds } from "@/services/refund-service"
import { RefundRequestsView } from "./_components/refund-requests-view"

export const metadata = {
  title: "Refund & Return Requests | Customer Portal",
}

export default async function CustomerRefundRequestsPage() {
  const refunds = await getUserRefunds()

  return <RefundRequestsView initialRefunds={refunds} />
}
