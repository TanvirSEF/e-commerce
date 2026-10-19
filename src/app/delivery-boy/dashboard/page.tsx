import React from "react"
import { getServerSession } from "@/lib/auth/session-helper"
import { getAllDeliveryBoys, getDeliveryBoyAssignedOrders } from "@/services/delivery-boy-service"
import { DeliveryBoyDashboardView } from "./_components/delivery-boy-dashboard-view"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Courier Driver Dashboard | Dispatch Portal",
}

export default async function DeliveryBoyDashboardPage() {
  const session = await getServerSession()
  const boys = await getAllDeliveryBoys()

  const driver =
    (session?.user?.email ? boys.find((b) => b.email === session.user.email) : null) ||
    boys[0]

  const assignedDeliveries = driver ? await getDeliveryBoyAssignedOrders(driver.id) : []

  return <DeliveryBoyDashboardView driver={driver} initialDeliveries={assignedDeliveries} />
}
