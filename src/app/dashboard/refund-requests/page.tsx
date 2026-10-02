import React from "react"
import { Metadata } from "next"
import { headers } from "next/headers"
import { auth } from "@/lib/auth/auth"
import { getUserRefunds } from "@/services/refund-service"
import { ensureAddonActivated } from "@/services/addon-service"
import { RefundRequestsView } from "./_components/refund-requests-view"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Applied Refund Request | Active eCommerce",
  description: "View and manage your product refund requests and statuses.",
}

export default async function CustomerRefundRequestsPage() {
  await ensureAddonActivated("refund_system")

  let currentUserId = "usr_customer_default_01"
  try {
    const h = await headers()
    const session = await auth.api.getSession({ headers: h })
    if (session?.user?.id) {
      currentUserId = session.user.id
    }
  } catch {
    // fallback
  }

  const refunds = await getUserRefunds(currentUserId)

  return <RefundRequestsView initialRefunds={refunds} />
}
