import React from "react"
import { getAllAffiliateReferrals } from "@/services/affiliate-service"
import { AdminAffiliateReferralsView } from "./_components/admin-affiliate-referrals-view"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Referral Users | Admin Panel",
}

export default async function AdminAffiliateReferralsPage() {
  const referrals = await getAllAffiliateReferrals()
  return <AdminAffiliateReferralsView referrals={referrals} />
}
