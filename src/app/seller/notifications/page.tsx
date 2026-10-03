import React from "react"
import { Metadata } from "next"
import { redirect } from "next/navigation"
import { getCurrentSeller } from "@/services/seller-panel-service"
import { getSellerNotifications } from "@/services/notification-service"
import { SellerNotificationsView } from "./_components/seller-notifications-view"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Notifications | Merchant Panel",
  description: "View store orders, payment alerts, and verification notifications",
}

export default async function SellerNotificationsPage() {
  const seller = await getCurrentSeller()
  if (!seller) {
    redirect("/seller/login")
  }

  const notifications = await getSellerNotifications(seller.userId || undefined)

  return (
    <div className="aiz-user-panel p-4 md:p-6 space-y-4">
      <SellerNotificationsView initialNotifications={notifications} />
    </div>
  )
}
