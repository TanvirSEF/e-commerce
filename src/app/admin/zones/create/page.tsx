import React from "react"
import { Metadata } from "next"
import { getAllCountries } from "@/services/geographic-service"
import { ZoneCreateView } from "./_components/zone-create-view"

export const metadata: Metadata = {
  title: "Add Shipping Zone | Admin Dashboard",
  description: "Create a new regional shipping territory",
}

export default async function AdminZoneCreatePage() {
  const countries = await getAllCountries()

  return (
    <div className="p-4 md:p-6">
      <ZoneCreateView countries={countries.filter((c) => c.status)} />
    </div>
  )
}
