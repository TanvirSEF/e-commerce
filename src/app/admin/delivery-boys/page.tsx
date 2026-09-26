import React from "react"
import { getAllDeliveryBoys } from "@/services/delivery-boy-service"
import { AdminDeliveryBoysView } from "./_components/admin-delivery-boys-view"

export const metadata = {
  title: "Delivery Boys & Couriers | Admin Panel",
}

export default async function AdminDeliveryBoysPage() {
  const boys = await getAllDeliveryBoys()
  return <AdminDeliveryBoysView deliveryBoys={boys} />
}
