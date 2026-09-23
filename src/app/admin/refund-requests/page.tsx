import React from "react"
import { getAllRefundsAdmin } from "@/services/refund-service"
import { RefundRequestsAdminView } from "./_components/refund-requests-admin-view"

export const metadata = {
  title: "Refund & Return Requests Desk | Admin Panel",
}

export default async function AdminRefundRequestsPage() {
  const refunds = await getAllRefundsAdmin()

  return <RefundRequestsAdminView initialRefunds={refunds} />
}
