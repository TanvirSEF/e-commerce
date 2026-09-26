import { Metadata } from "next"
import { DashboardOverview } from "./_components/dashboard-overview"
import { getUserOrders } from "@/services/order-service"
import { getWalletBalance, getClubPoints } from "@/services/wallet-service"

export const metadata: Metadata = {
  title: "Customer Dashboard | Active eCommerce",
  description: "Manage your purchases, orders, profile, and rewards in one place.",
}

// TODO: Replace with session user ID once Better Auth session is wired
const CURRENT_USER_ID = "usr_customer_default_01"

export default async function DashboardPage() {
  const [orders, walletBalance, clubPointsData] = await Promise.all([
    getUserOrders(CURRENT_USER_ID),
    getWalletBalance(CURRENT_USER_ID),
    getClubPoints(CURRENT_USER_ID),
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
