import React from "react"
import { getDeliveryBoyConfig } from "@/services/delivery-boy-service"
import { AdminDeliveryBoyConfigView } from "./_components/admin-delivery-boy-config-view"

export const metadata = {
  title: "Delivery Boy Configuration | Admin Panel",
}

export default async function AdminDeliveryBoyConfigPage() {
  const config = await getDeliveryBoyConfig()
  return <AdminDeliveryBoyConfigView config={config} />
}
