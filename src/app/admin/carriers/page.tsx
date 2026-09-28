import React from "react"
import { Metadata } from "next"
import { getAllCarriers } from "@/services/shipping-location-service"
import { AdminCarriersView } from "./_components/admin-carriers-view"

export const metadata: Metadata = {
  title: "Shipping Carriers | Admin Control Panel",
  description: "Manage courier and shipping carrier integrations",
}

export default async function AdminCarriersPage() {
  const carriers = await getAllCarriers()

  const formattedCarriers = carriers.map((c) => ({
    id: c.id,
    name: c.name,
    transitTime: c.transitTime,
    logo: c.logo || "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=200",
    status: c.status,
    freeShipping: c.freeShipping,
  }))

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <AdminCarriersView initialCarriers={formattedCarriers} />
    </div>
  )
}
