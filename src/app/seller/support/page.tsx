import React from "react"
import { Metadata } from "next"
import { redirect } from "next/navigation"
import { getCurrentSeller, getSellerSupportTickets } from "@/services/seller-panel-service"
import { SellerSupportView } from "./_components/seller-support-view"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Support Ticket | Seller Dashboard",
  description: "Create and track vendor customer support tickets",
}

export default async function SellerSupportPage() {
  const seller = await getCurrentSeller()
  if (!seller?.userId) {
    redirect("/seller/login")
  }

  const tickets = await getSellerSupportTickets(seller.userId)

  return (
    <div className="aiz-user-panel p-4 md:p-6 space-y-6">
      <SellerSupportView initialTickets={tickets} userId={seller.userId} />
    </div>
  )
}
