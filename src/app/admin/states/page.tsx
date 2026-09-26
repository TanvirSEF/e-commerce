import React from "react"
import { Metadata } from "next"
import { getAllStates, getAllCountries } from "@/services/geographic-service"
import { StatesView } from "./_components/states-view"

export const metadata: Metadata = {
  title: "States & Divisions | Admin Dashboard",
  description: "Configure administrative divisions and states",
}

export default async function AdminStatesPage() {
  const [states, countries] = await Promise.all([
    getAllStates(),
    getAllCountries(),
  ])

  return (
    <div className="p-4 md:p-6">
      <StatesView initialStates={states} countries={countries.filter((c) => c.status)} />
    </div>
  )
}
