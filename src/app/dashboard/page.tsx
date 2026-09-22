import { Metadata } from "next"
import { DashboardOverview } from "./_components/dashboard-overview"

export const metadata: Metadata = {
  title: "Customer Dashboard | Active eCommerce",
  description: "Manage your purchases, orders, profile, and rewards in one place.",
}

export default function DashboardPage() {
  return <DashboardOverview />
}
