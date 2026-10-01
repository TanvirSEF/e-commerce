import React from "react"
import { ensureAddonActivated } from "@/services/addon-service"
import { AffiliateLandingView } from "./_components/affiliate-landing-view"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Affiliate Partner Program | Earn Commissions on Every Referral",
  description: "Join our official partner program. Share products and earn recurring commissions.",
}

export default async function AffiliatePage() {
  await ensureAddonActivated("affiliate_system")
  return <AffiliateLandingView />
}
