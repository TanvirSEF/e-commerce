import React from "react"
import { Metadata } from "next"
import { getServerSession } from "@/lib/auth/session-helper"
import { getSellerFullDashboardData } from "@/services/seller-service"
import { getSellerOrderNotes } from "@/services/order-rules-service"
import { SellerNotesView } from "./_components/seller-notes-view"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "All Notes | Seller Portal",
}

export default async function SellerNotesPage() {
  const session = await getServerSession()
  const sellerData = await getSellerFullDashboardData({
    userId: session?.user?.id,
  })

  const notes = await getSellerOrderNotes()

  return (
    <div className="p-4 md:p-6">
      <SellerNotesView
        initialNotes={notes}
        shopName={sellerData.shop.name || "Active Fashion Outlet"}
      />
    </div>
  )
}
