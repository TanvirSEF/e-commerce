import React from "react"
import { Metadata } from "next"
import { getAllPosSales } from "@/services/pos-service"
import { SellerPosOrdersView } from "./_components/seller-pos-orders-view"

export const metadata: Metadata = {
  title: "Vendor POS Orders | Seller Console",
  description: "View walk-in store POS transactions",
}

export default async function SellerPosOrdersPage() {
  const sales = await getAllPosSales()

  return (
    <div className="p-4 md:p-6">
      <SellerPosOrdersView initialSales={sales} />
    </div>
  )
}
