import { Metadata } from "next"
import { headers } from "next/headers"
import { PurchaseHistoryView } from "./_components/purchase-history-view"
import { getUserOrders } from "@/services/order-service"
import { auth } from "@/lib/auth/auth"

export const metadata: Metadata = {
  title: "Purchase History | Active eCommerce",
  description: "View and manage all previous purchases and orders.",
}

export default async function PurchaseHistoryPage() {
  let currentUserId = "usr_customer_default_01"
  try {
    const h = await headers()
    const session = await auth.api.getSession({ headers: h })
    if (session?.user?.id) {
      currentUserId = session.user.id
    }
  } catch {
    // Fallback to default customer
  }

  const orders = await getUserOrders(currentUserId)
  return <PurchaseHistoryView initialOrders={orders} />
}
