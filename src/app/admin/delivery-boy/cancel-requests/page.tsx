import React from "react"
import { getAllDeliveryCancelRequests } from "@/services/delivery-boy-service"
import { AdminDeliveryBoyCancelsView } from "./_components/admin-delivery-boy-cancels-view"

export const metadata = {
  title: "Delivery Boy Cancellation Requests | Admin Panel",
}

export default async function AdminDeliveryBoyCancelsPage() {
  const requests = await getAllDeliveryCancelRequests()
  return <AdminDeliveryBoyCancelsView requests={requests} />
}
