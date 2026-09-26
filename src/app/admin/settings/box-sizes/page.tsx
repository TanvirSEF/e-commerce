import React from "react"
import { Metadata } from "next"
import { getBoxSizesSettings } from "@/services/settings-service"
import { BoxSizesView } from "./_components/box-sizes-view"

export const metadata: Metadata = {
  title: "Packaging Box Sizes | Admin Dashboard",
  description: "Configure shipping packaging dimensions and max weights",
}

export default async function AdminBoxSizesPage() {
  const sizes = await getBoxSizesSettings()

  return (
    <div className="p-4 md:p-6">
      <BoxSizesView initialSizes={sizes} />
    </div>
  )
}
