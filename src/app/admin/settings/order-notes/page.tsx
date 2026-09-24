import React from "react"
import { Metadata } from "next"
import { getAllOrderNotes } from "@/services/order-rules-service"
import { OrderNotesView } from "./_components/order-notes-view"

export const metadata: Metadata = {
  title: "Order Notes | Admin Dashboard",
  description: "Configure predefined order handling and fulfillment notes",
}

export default async function AdminOrderNotesPage() {
  const notes = await getAllOrderNotes()

  return (
    <div className="p-4 md:p-6">
      <OrderNotesView initialNotes={notes} />
    </div>
  )
}
