import React from "react"
import { getAllAffiliateUsers } from "@/services/affiliate-service"
import { AdminAffiliateReferralsView } from "./_components/admin-affiliate-referrals-view"

export const metadata = {
  title: "Affiliate Referral Links | Admin Panel",
}

export default async function AdminAffiliateReferralsPage() {
  const users = await getAllAffiliateUsers()
  return <AdminAffiliateReferralsView users={users} />
}
