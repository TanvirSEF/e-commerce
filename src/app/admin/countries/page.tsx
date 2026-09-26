import React from "react"
import { Metadata } from "next"
import { getAllCountries } from "@/services/geographic-service"
import { CountriesView } from "./_components/countries-view"

export const metadata: Metadata = {
  title: "Countries | Admin Dashboard",
  description: "Configure available shipping countries",
}

export default async function AdminCountriesPage() {
  const countries = await getAllCountries()

  return (
    <div className="p-4 md:p-6">
      <CountriesView initialCountries={countries} />
    </div>
  )
}
