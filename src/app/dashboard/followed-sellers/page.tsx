import React from "react"
import { Metadata } from "next"
import { headers } from "next/headers"
import { auth } from "@/lib/auth/auth"
import { getFollowedSellers } from "@/services/customer-extra-service"
import { FollowedSellersView } from "./_components/followed-sellers-view"

export const metadata: Metadata = {
  title: "Followed Sellers | Active eCommerce",
  description: "View and manage your followed merchants and brand shops.",
}

export const dynamic = "force-dynamic"

export default async function CustomerFollowedSellersPage() {
  let currentUserId = "usr_customer_default_01"
  try {
    const h = await headers()
    const session = await auth.api.getSession({ headers: h })
    if (session?.user?.id) {
      currentUserId = session.user.id
    }
  } catch {
    // fallback
  }

  const sellers = await getFollowedSellers(currentUserId)

  return <FollowedSellersView initialSellers={sellers} />
}
