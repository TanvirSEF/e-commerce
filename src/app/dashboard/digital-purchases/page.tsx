import React from "react"
import { Metadata } from "next"
import { headers } from "next/headers"
import { auth } from "@/lib/auth/auth"
import { getDigitalPurchases } from "@/services/customer-extra-service"
import { DigitalPurchasesView } from "./_components/digital-purchases-view"

export const metadata: Metadata = {
  title: "Download Your Products | Active eCommerce",
  description: "Access and download your purchased digital products and license keys.",
}

export const dynamic = "force-dynamic"

export default async function CustomerDigitalPurchasesPage() {
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

  const purchases = await getDigitalPurchases(currentUserId)

  return <DigitalPurchasesView initialPurchases={purchases} />
}
