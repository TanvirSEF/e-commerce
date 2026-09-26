import { Metadata } from "next"
import { SellerNotificationsView } from "./_components/seller-notifications-view"

export const metadata: Metadata = {
  title: "Notifications | Merchant Panel",
  description: "View store orders, payment alerts, and verification notifications",
}

export default function SellerNotificationsPage() {
  return <SellerNotificationsView />
}
