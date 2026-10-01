import React from "react"
import { getDeliveryBoyConfig } from "@/services/delivery-boy-service"
import { ensureAddonActivated } from "@/services/addon-service"
import { AdminDeliveryBoyConfigView } from "./_components/admin-delivery-boy-config-view"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Delivery Boy Configuration | Admin Panel",
}

export default async function AdminDeliveryBoyConfigPage() {
  await ensureAddonActivated("delivery_boy_system")
  const config = await getDeliveryBoyConfig()
  return <AdminDeliveryBoyConfigView config={config} />
}
