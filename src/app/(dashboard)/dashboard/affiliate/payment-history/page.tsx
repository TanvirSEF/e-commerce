import React from "react"
import { getAllAffiliateWithdrawRequests } from "@/services/affiliate-service"
import { CustomerAffiliatePaymentsView } from "./_components/customer-affiliate-payments-view"

export const metadata = {
  title: "Affiliate Payout History | Customer Dashboard",
}

export default async function CustomerAffiliatePaymentsPage() {
  const requests = await getAllAffiliateWithdrawRequests()
  return <CustomerAffiliatePaymentsView requests={requests} />
}
