import React from "react"
import { AdminMeasurementPointsView } from "./_components/admin-measurement-points-view"
import { getAllMeasurementPoints } from "@/services/size-chart-service"

export const metadata = {
  title: "Measurement Points | Admin Panel",
}

export default async function MeasurementPointsPage() {
  const points = await getAllMeasurementPoints()
  const formatted = points.map((p) => ({
    id: p.id,
    name: p.name,
    createdAt: p.createdAt instanceof Date ? p.createdAt.toISOString().split("T")[0] : String(p.createdAt),
  }))

  return <AdminMeasurementPointsView initialPoints={formatted} />
}
