import React from "react"
import { Metadata } from "next"
import { getAllWarranties } from "@/services/warranty-service"
import { WarrantiesView } from "./_components/warranties-view"

export const metadata: Metadata = {
  title: "Product Warranties | Admin Control Panel",
  description: "Configure official brand warranties and seller guarantee policies.",
}

export const dynamic = "force-dynamic"

export default async function AdminWarrantiesPage() {
  const warrantiesList = await getAllWarranties()

  return <WarrantiesView initialWarranties={warrantiesList} />
}
