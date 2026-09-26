import React from "react"
import { getAffiliateConfigs } from "@/services/affiliate-service"
import { AdminAffiliateConfigsView } from "./_components/admin-affiliate-configs-view"

export const metadata = {
  title: "Affiliate Rules & Policies | Admin Panel",
}

export default async function AdminAffiliateConfigsPage() {
  const configs = await getAffiliateConfigs()
  return <AdminAffiliateConfigsView configs={configs} />
}
