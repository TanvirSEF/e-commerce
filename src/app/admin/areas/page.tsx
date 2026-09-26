import React from "react"
import { Metadata } from "next"
import { AdminAreasView } from "./_components/admin-areas-view"

export const metadata: Metadata = {
  title: "Shipping Areas | Admin Control Panel",
  description: "Manage sub-city zones, delivery areas, and thanas",
}

export default function AdminAreasPage() {
  const initialAreas = [
    { id: 1, name: "Gulshan 1", city: "Dhaka", state: "Dhaka Division", country: "Bangladesh", status: true },
    { id: 2, name: "Gulshan 2", city: "Dhaka", state: "Dhaka Division", country: "Bangladesh", status: true },
    { id: 3, name: "Banani", city: "Dhaka", state: "Dhaka Division", country: "Bangladesh", status: true },
    { id: 4, name: "Dhanmondi", city: "Dhaka", state: "Dhaka Division", country: "Bangladesh", status: true },
    { id: 5, name: "Uttara Sector 3", city: "Dhaka", state: "Dhaka Division", country: "Bangladesh", status: true },
    { id: 6, name: "Agrabad", city: "Chittagong", state: "Chittagong Division", country: "Bangladesh", status: true },
    { id: 7, name: "Nasirabad", city: "Chittagong", state: "Chittagong Division", country: "Bangladesh", status: true },
  ]

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <AdminAreasView initialAreas={initialAreas} />
    </div>
  )
}
