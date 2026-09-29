import React from "react"
import type { Metadata } from "next"
import { getCustomLabels } from "@/services/custom-label-service"
import { getSetting } from "@/services/settings-service"
import { CustomLabelsListView } from "./_components/custom-labels-list-view"

export const metadata: Metadata = {
  title: "Custom Product Labels | Admin Control Panel",
  description: "Manage product promotional custom labels and badges in Active eCommerce CMS",
}

export const dynamic = "force-dynamic"

export default async function CustomLabelsPage() {
  const [labels, sellerCanAddSetting] = await Promise.all([
    getCustomLabels(),
    getSetting("seller_can_add_custom_label"),
  ])

  const initialSellerCanAdd = sellerCanAddSetting === "1"

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <CustomLabelsListView
        labels={labels}
        initialSellerCanAdd={initialSellerCanAdd}
      />
    </div>
  )
}
