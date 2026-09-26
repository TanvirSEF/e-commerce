import React from "react"
import { getAffiliateUserByEmail, getAllAffiliateLogs } from "@/services/affiliate-service"
import { CustomerAffiliatePortalView } from "./_components/customer-affiliate-portal-view"

export const metadata = {
  title: "Affiliate Portal | Customer Dashboard",
}

export default async function CustomerAffiliatePage() {
  const user = (await getAffiliateUserByEmail("marcus.h@techreviews.com"))!
  const logs = await getAllAffiliateLogs()
  return <CustomerAffiliatePortalView affiliateUser={user} logs={logs} />
}
