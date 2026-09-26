import { Metadata } from "next"
import { headers } from "next/headers"
import { DashboardOverview } from "./_components/dashboard-overview"
import { getUserOrders } from "@/services/order-service"
import { getWalletBalance, getClubPoints } from "@/services/wallet-service"
import { auth } from "@/lib/auth/auth"

export const metadata: Metadata = {
  title: "Customer Dashboard | Active eCommerce",
  description: "Manage your purchases, orders, profile, and rewards in one place.",
}

export default async function DashboardPage() {
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

  const [orders, walletBalance, clubPointsData] = await Promise.all([
    getUserOrders(currentUserId),
    getWalletBalance(currentUserId),
    getClubPoints(currentUserId),
  ])

  return (
    <DashboardOverview
      recentOrders={orders.slice(0, 5)}
      walletBalance={walletBalance}
      clubPoints={clubPointsData.totalPoints}
      totalOrders={orders.length}
    />
  )
}
