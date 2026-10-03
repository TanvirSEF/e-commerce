import React from "react"
import { Metadata } from "next"
import { redirect } from "next/navigation"
import { getCurrentSeller } from "@/services/seller-panel-service"
import { getSellerNotifications } from "@/services/notification-service"
import { SellerNotificationsView } from "../notifications/_components/seller-notifications-view"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "All Notifications | Merchant Panel",
  description: "View all store notifications and alerts",
}

export default async function SellerAllNotificationPage() {
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
