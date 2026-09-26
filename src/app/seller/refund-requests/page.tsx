import React from "react"
import { Metadata } from "next"
import { SellerRefundRequestsView } from "./_components/seller-refund-requests-view"

export const metadata: Metadata = {
  title: "Received Refund Requests | Seller Portal",
}

export default function SellerRefundRequestsPage() {
  return <SellerRefundRequestsView />
}
