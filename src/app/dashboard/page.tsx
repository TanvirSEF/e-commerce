import { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerSession } from "@/lib/auth/session-helper"
import { DashboardOverview } from "./_components/dashboard-overview"
import { getUserOrders, getUserTotalExpenditure } from "@/services/order-service"
import { getWalletBalance, getClubPoints } from "@/services/wallet-service"
import { getUserWishlistProducts, getDefaultShippingAddress, getCustomerAddresses } from "@/services/customer-extra-service"

export const metadata: Metadata = {
  title: "Customer Dashboard | Active eCommerce",
  description: "Manage your purchases, orders, profile, and rewards in one place.",
}

export default async function DashboardPage() {
  const session = await getServerSession()
  if (!session?.user) {
    redirect("/login")
  }
  const currentUserId = session.user.id

  const [
    orders,
    expenditure,
    walletBalance,
    clubPointsData,
    wishlistProducts,
    defaultShipping,
    allAddresses,
  ] = await Promise.all([
    getUserOrders(currentUserId),
    getUserTotalExpenditure(currentUserId),
    getWalletBalance(currentUserId),
    getClubPoints(currentUserId),
    getUserWishlistProducts(currentUserId),
    getDefaultShippingAddress(currentUserId),
    getCustomerAddresses(currentUserId),
  ])

  // Billing address is default shipping address or second address
  const billingAddress = allAddresses.length > 1 ? allAddresses[1] : defaultShipping

  return (
    <DashboardOverview
      walletBalance={walletBalance}
      totalExpenditure={expenditure}
      clubPoints={clubPointsData.totalPoints}
      totalOrders={orders.length}
      shippingAddress={defaultShipping}
      billingAddress={billingAddress}
      wishlistProducts={wishlistProducts}
    />
  )
}
