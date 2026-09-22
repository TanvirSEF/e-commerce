import React from "react"
import { getAllTicketsAdmin } from "@/services/ticket-service"
import { SellerSupportView } from "./_components/seller-support-view"

export const metadata = { title: "Support Tickets | Seller Dashboard" }

export default async function SellerSupportPage() {
  const tickets = await getAllTicketsAdmin()
  return <SellerSupportView initialTickets={tickets} />
}
