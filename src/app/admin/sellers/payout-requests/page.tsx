import React from "react"
import { getAllWithdrawRequestsAdmin } from "@/services/seller-service"
import { PayoutRequestsView } from "./_components/payout-requests-view"

export const metadata = {
  title: "Seller Payout Requests | Active eCommerce Admin",
}

export default async function AdminPayoutRequestsPage() {
  const requests = await getAllWithdrawRequestsAdmin()

  return <PayoutRequestsView initialRequests={requests} />
}
