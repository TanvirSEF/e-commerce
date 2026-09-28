import React from "react"
import { AdminMeasurementPointsView } from "./_components/admin-measurement-points-view"

export const metadata = {
  title: "Measurement Points | Admin Panel",
}

const initialMeasurementPoints = [
  { id: 1, name: "Chest", createdAt: "2024-01-15" },
  { id: 2, name: "Waist", createdAt: "2024-01-15" },
  { id: 3, name: "Hips", createdAt: "2024-01-15" },
  { id: 4, name: "Length", createdAt: "2024-01-16" },
  { id: 5, name: "Shoulder", createdAt: "2024-01-16" },
  { id: 6, name: "Inseam", createdAt: "2024-01-18" },
  { id: 7, name: "Sleeve Length", createdAt: "2024-01-20" },
  { id: 8, name: "Collar / Neck", createdAt: "2024-01-22" },
]

export default function MeasurementPointsPage() {
  return <AdminMeasurementPointsView initialPoints={initialMeasurementPoints} />
}
