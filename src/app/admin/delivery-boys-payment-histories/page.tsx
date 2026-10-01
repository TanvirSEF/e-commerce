import React from "react"
import { getAllDeliveryPayouts } from "@/services/delivery-boy-service"
import { ensureAddonActivated } from "@/services/addon-service"
import { AdminDeliveryBoyPaymentsView } from "./_components/admin-delivery-boy-payments-view"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Delivery Boy Payment Histories | Admin Panel",
}

export default async function AdminDeliveryBoysPaymentsPage() {
  await ensureAddonActivated("delivery_boy_system")
  const payouts = await getAllDeliveryPayouts()
  return <AdminDeliveryBoyPaymentsView payouts={payouts} />
}
