import React from "react"
import type { Metadata } from "next"
import { getAllPickupPoints } from "@/services/pickup-point-service"
import { PickupPointsView } from "./_components/pickup-points-view"

export const metadata: Metadata = {
  title: "All Pick-up Points | Admin | Active eCommerce",
  description: "Manage pickup stations and collection hubs in Active eCommerce CMS",
}

export default async function PickupPointsPage() {
  const points = await getAllPickupPoints()

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <PickupPointsView pickupPoints={points} />
    </div>
  )
}
