import React from "react"
import { getAllDeliveryPayouts } from "@/services/delivery-boy-service"
import { AdminDeliveryBoyPaymentsView } from "./_components/admin-delivery-boy-payments-view"

export const metadata = {
  title: "Delivery Boy Payment Histories | Admin Panel",
}

export default async function AdminDeliveryBoysPaymentsPage() {
  const payouts = await getAllDeliveryPayouts()
  return <AdminDeliveryBoyPaymentsView payouts={payouts} />
}
