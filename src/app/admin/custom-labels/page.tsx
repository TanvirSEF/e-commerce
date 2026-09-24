import React from "react"
import type { Metadata } from "next"
import { getCustomLabels } from "@/services/custom-label-service"
import { CustomLabelsListView } from "./_components/custom-labels-list-view"

export const metadata: Metadata = {
  title: "Custom Product Labels | Admin | Active eCommerce",
  description: "Manage product promotional custom labels and badges in Active eCommerce CMS",
}

export default async function CustomLabelsPage() {
  const labels = await getCustomLabels()

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <CustomLabelsListView labels={labels} />
    </div>
  )
}
