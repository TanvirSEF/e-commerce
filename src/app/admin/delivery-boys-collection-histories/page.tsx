import React from "react"
import { getAllDeliveryCollections } from "@/services/delivery-boy-service"
import { ensureAddonActivated } from "@/services/addon-service"
import { AdminDeliveryBoyCollectionsView } from "./_components/admin-delivery-boy-collections-view"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Delivery Boy Collections | Admin Panel",
}

export default async function AdminDeliveryBoysCollectionsPage() {
  await ensureAddonActivated("delivery_boy_system")
  const collections = await getAllDeliveryCollections()
  return <AdminDeliveryBoyCollectionsView collections={collections} />
}
