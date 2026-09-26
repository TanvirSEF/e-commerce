import React from "react"
import { getAffiliateOptions } from "@/services/affiliate-service"
import { AdminAffiliateOptionsView } from "./_components/admin-affiliate-options-view"

export const metadata = {
  title: "Affiliate Configurations | Admin Panel",
}

export default async function AdminAffiliatePage() {
  const options = await getAffiliateOptions()
  return <AdminAffiliateOptionsView options={options} />
}
