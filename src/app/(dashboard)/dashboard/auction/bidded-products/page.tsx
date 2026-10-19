import React from "react"
import { redirect } from "next/navigation"
import { getServerSession } from "@/lib/auth/session-helper"
import { getUserBids } from "@/services/auction-service"
import { CustomerBiddedProductsView } from "./_components/customer-bidded-products-view"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "My Auction Bids | Customer Portal",
}

export default async function CustomerBiddedProductsPage() {
  const session = await getServerSession()
  if (!session?.user?.email) {
    redirect("/login")
  }

  const items = await getUserBids(session.user.email)
  return <CustomerBiddedProductsView items={items} />
}
