import React from "react"
import { Metadata } from "next"
import { getAiConfigSettings } from "@/services/settings-service"
import { AiConfigurationView } from "./_components/ai-configuration-view"

export const metadata: Metadata = {
  title: "AI Writer Configuration | Admin Dashboard",
  description: "Configure OpenAI GPT-4 credentials and parameters",
}

export default async function AdminAiConfigurationPage() {
  const settings = await getAiConfigSettings()

  return (
    <div className="p-4 md:p-6">
      <AiConfigurationView initialSettings={settings} />
    </div>
  )
}
