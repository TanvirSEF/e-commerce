import React from "react"
import { Metadata } from "next"
import { getAllColors } from "@/services/color-service"
import { getSetting } from "@/services/settings-service"
import { ColorsView } from "./_components/colors-view"

export const metadata: Metadata = {
  title: "Product Colors | Admin Control Panel",
  description: "Manage product color variations and hex color codes.",
}

export const dynamic = "force-dynamic"

export default async function AdminColorsPage() {
  const [colorsList, colorFilterSetting] = await Promise.all([
    getAllColors(),
    getSetting("color_filter_activation"),
  ])

  const initialColorFilterActive = colorFilterSetting !== "0"

  return (
    <ColorsView
      initialColors={colorsList}
      initialColorFilterActive={initialColorFilterActive}
    />
  )
}

