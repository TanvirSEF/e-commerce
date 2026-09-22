import { Metadata } from "next"
import { PurchaseHistoryView } from "./_components/purchase-history-view"

export const metadata: Metadata = {
  title: "Purchase History | Active eCommerce",
  description: "View and manage all previous purchases and orders.",
}

export default function PurchaseHistoryPage() {
  return <PurchaseHistoryView />
}
