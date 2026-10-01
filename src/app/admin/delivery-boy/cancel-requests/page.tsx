import React from "react"
import { getAllDeliveryCancelRequests } from "@/services/delivery-boy-service"
import { ensureAddonActivated } from "@/services/addon-service"
import { AdminDeliveryBoyCancelsView } from "./_components/admin-delivery-boy-cancels-view"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Delivery Boy Cancellation Requests | Admin Panel",
}

export default async function AdminDeliveryBoyCancelsPage() {
  await ensureAddonActivated("delivery_boy_system")
  const requests = await getAllDeliveryCancelRequests()
  return <AdminDeliveryBoyCancelsView requests={requests} />
}
