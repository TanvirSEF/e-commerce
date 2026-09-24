import React from "react"
import { Metadata } from "next"
import { getAllColors } from "@/services/color-service"
import { ColorsView } from "./_components/colors-view"

export const metadata: Metadata = {
  title: "Product Colors | Admin Control Panel",
  description: "Manage product color variations and hex color codes.",
}

export const dynamic = "force-dynamic"

export default async function AdminColorsPage() {
  const colorsList = await getAllColors()

  return <ColorsView initialColors={colorsList} />
}
