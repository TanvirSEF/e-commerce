import React from "react"
import { Metadata } from "next"
import { getAllPosSales } from "@/services/pos-service"
import { ensureAddonActivated } from "@/services/addon-service"
import { SellerPosOrdersView } from "./_components/seller-pos-orders-view"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Vendor POS Orders | Seller Console",
  description: "View walk-in store POS transactions",
}

export default async function SellerPosOrdersPage() {
  await ensureAddonActivated("pos_system")
  const sales = await getAllPosSales()

  return (
    <div className="p-4 md:p-6">
      <SellerPosOrdersView initialSales={sales} />
    </div>
  )
}
