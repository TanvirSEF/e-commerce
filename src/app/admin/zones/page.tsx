import React from "react"
import { Metadata } from "next"
import { getAllZones } from "@/services/geographic-service"
import { ZonesView } from "./_components/zones-view"

export const metadata: Metadata = {
  title: "Shipping Zones | Admin Dashboard",
  description: "Configure regional shipping zones and assigned countries",
}

export default async function AdminZonesPage() {
  const zones = await getAllZones()

  return (
    <div className="p-4 md:p-6">
      <ZonesView initialZones={zones} />
    </div>
  )
}
