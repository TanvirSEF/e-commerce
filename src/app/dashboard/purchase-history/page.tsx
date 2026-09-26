import { Metadata } from "next"
import { PurchaseHistoryView } from "./_components/purchase-history-view"
import { getUserOrders } from "@/services/order-service"

export const metadata: Metadata = {
  title: "Purchase History | Active eCommerce",
  description: "View and manage all previous purchases and orders.",
}

export default async function PurchaseHistoryPage() {
  const orders = await getUserOrders("usr_customer_default_01")
  return <PurchaseHistoryView initialOrders={orders} />
}
