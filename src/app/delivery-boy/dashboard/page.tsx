import React from "react"
import { getAllDeliveryBoys } from "@/services/delivery-boy-service"
import { DeliveryBoyDashboardView } from "./_components/delivery-boy-dashboard-view"

export const metadata = {
  title: "Courier Driver Dashboard | Dispatch Portal",
}

export default async function DeliveryBoyDashboardPage() {
  const boys = await getAllDeliveryBoys()
  const driver = boys[0]
  return <DeliveryBoyDashboardView driver={driver} />
}
