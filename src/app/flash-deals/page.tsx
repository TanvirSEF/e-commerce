import React from "react"
import { Metadata } from "next"
import { getFlashDeals } from "@/services/settings-service"
import { FlashDealsView } from "./_components/flash-deals-view"

export const metadata: Metadata = {
  title: "Flash Deals | Active eCommerce",
  description: "Exclusive limited-time discount campaigns on Active eCommerce CMS",
}

export default async function FlashDealsPage() {
  const deals = await getFlashDeals()
  return <FlashDealsView deals={deals} />
}
