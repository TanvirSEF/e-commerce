import React from "react"
import { Metadata } from "next"
import { getDigitalPurchases } from "@/services/customer-extra-service"
import { DigitalPurchasesView } from "./_components/digital-purchases-view"

export const metadata: Metadata = {
  title: "Digital Purchases & Downloads | Customer Dashboard",
  description: "Access and download your purchased digital software, ebooks, spreadsheets, and product license keys.",
}

export const dynamic = "force-dynamic"

export default async function CustomerDigitalPurchasesPage() {
  const purchases = await getDigitalPurchases()

  return <DigitalPurchasesView initialPurchases={purchases} />
}
