import React from "react"
import { getServerSession } from "@/lib/auth/session-helper"
import { getAffiliateUserByEmail, getOrCreateAffiliateUser, getAllAffiliateLogs } from "@/services/affiliate-service"
import { CustomerAffiliatePortalView } from "./_components/customer-affiliate-portal-view"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Affiliate Portal | Customer Dashboard",
}

export default async function CustomerAffiliatePage() {
  const session = await getServerSession()
  let user = null
  if (session?.user?.email) {
    user = await getOrCreateAffiliateUser({
      email: session.user.email,
      name: session.user.name || "Affiliate Partner",
      userId: session.user.id,
    })
  } else {
    user = await getAffiliateUserByEmail("marcus.h@techreviews.com")
  }

  const logs = await getAllAffiliateLogs()
  return <CustomerAffiliatePortalView affiliateUser={user} logs={logs} />
}
