import React from "react"
import { getAllAffiliateWithdrawRequests } from "@/services/affiliate-service"
import { AdminAffiliateWithdrawRequestsView } from "./_components/admin-affiliate-withdraw-requests-view"

export const metadata = {
  title: "Affiliate Withdraw Requests | Admin Panel",
}

export default async function AdminAffiliateWithdrawRequestsPage() {
  const requests = await getAllAffiliateWithdrawRequests()
  return <AdminAffiliateWithdrawRequestsView requests={requests} />
}
