import React from "react"
import { redirect } from "next/navigation"
import { getServerSession } from "@/lib/auth/session-helper"
import { getUserWonAuctions } from "@/services/auction-service"
import { CustomerWonAuctionsView } from "./_components/customer-won-auctions-view"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Won Auctions History | Customer Portal",
}

export default async function CustomerWonAuctionsPage() {
  const session = await getServerSession()
  if (!session?.user?.email) {
    redirect("/login")
  }

  const orders = await getUserWonAuctions(session.user.email)
  return <CustomerWonAuctionsView orders={orders} />
}
