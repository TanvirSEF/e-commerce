import React from "react"
import { getAffiliateOptions, getCategoriesForAffiliate } from "@/services/affiliate-service"
import { AdminAffiliateOptionsView } from "./_components/admin-affiliate-options-view"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Affiliate Configurations | Admin Panel",
}

export default async function AdminAffiliatePage() {
  const [options, categories] = await Promise.all([
    getAffiliateOptions(),
    getCategoriesForAffiliate(),
  ])

  return <AdminAffiliateOptionsView options={options} categories={categories} />
}
