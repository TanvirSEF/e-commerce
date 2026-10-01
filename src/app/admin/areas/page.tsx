import React from "react"
import { Metadata } from "next"
import { getAllAreas, getAllShippingCities } from "@/services/shipping-location-service"
import { AdminAreasView } from "./_components/admin-areas-view"

export const metadata: Metadata = {
  title: "Shipping Areas | Admin Control Panel",
  description: "Manage sub-city zones, delivery areas, and thanas",
}

export const dynamic = "force-dynamic"

export default async function AdminAreasPage() {
  const [areas, cities] = await Promise.all([
    getAllAreas(),
    getAllShippingCities(),
  ])

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <AdminAreasView
        initialAreas={areas}
        availableCities={cities.map((c) => ({
          name: c.name,
          state: c.state,
          country: c.country,
        }))}
      />
    </div>
  )
}
