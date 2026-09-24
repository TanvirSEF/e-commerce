import React from "react"
import { Metadata } from "next"
import { getFeatureActivations } from "@/services/settings-service"
import { FeaturesActivationView } from "./_components/features-activation-view"

export const metadata: Metadata = {
  title: "Feature Activation | Active eCommerce Admin",
}

export default async function AdminFeaturesActivationPage() {
  const settings = await getFeatureActivations()

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <FeaturesActivationView initialSettings={settings} />
    </div>
  )
}
