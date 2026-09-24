import React from "react"
import { Metadata } from "next"
import { getAllShippingCities } from "@/services/shipping-location-service"
import { ShippingCitiesView } from "./_components/shipping-cities-view"

export const metadata: Metadata = {
  title: "Shipping Cities | Admin Dashboard",
  description: "Configure regional delivery cities and area-wise shipping rates",
}

export default async function AdminShippingCitiesPage() {
  const cities = await getAllShippingCities()

  return (
    <div className="p-4 md:p-6">
      <ShippingCitiesView initialCities={cities} />
    </div>
  )
}
