import React from "react"
import { Metadata } from "next"
import { getAllPosSales } from "@/services/pos-service"
import { PosOrdersView } from "./_components/pos-orders-view"

export const metadata: Metadata = {
  title: "POS Orders Ledger | Admin Dashboard",
  description: "View and audit all in-store walk-in POS sales transactions",
}

export default async function AdminPosOrdersPage() {
  const sales = await getAllPosSales()

  return (
    <div className="p-4 md:p-6">
      <PosOrdersView initialSales={sales} />
    </div>
  )
}
