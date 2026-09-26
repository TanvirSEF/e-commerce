import React from "react"
import { getAllDeliveryCollections } from "@/services/delivery-boy-service"
import { AdminDeliveryBoyCollectionsView } from "./_components/admin-delivery-boy-collections-view"

export const metadata = {
  title: "Delivery Boy Collections | Admin Panel",
}

export default async function AdminDeliveryBoysCollectionsPage() {
  const collections = await getAllDeliveryCollections()
  return <AdminDeliveryBoyCollectionsView collections={collections} />
}
