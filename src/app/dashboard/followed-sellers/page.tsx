import React from "react"
import { Metadata } from "next"
import { getFollowedSellers } from "@/services/customer-extra-service"
import { FollowedSellersView } from "./_components/followed-sellers-view"

export const metadata: Metadata = {
  title: "Followed Stores | Customer Dashboard",
  description: "View and manage your followed merchants and brand shops.",
}

export const dynamic = "force-dynamic"

export default async function CustomerFollowedSellersPage() {
  const sellers = await getFollowedSellers()

  return <FollowedSellersView initialSellers={sellers} />
}
