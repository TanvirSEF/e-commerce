import React from "react"
import { getSupportTickets } from "@/services/ticket-service"
import { SellerSupportView } from "./_components/seller-support-view"

export const metadata = { title: "Support Tickets | Seller Dashboard" }

export default async function SellerSupportPage() {
  const tickets = await getSupportTickets("usr_seller_default_01")
  return <SellerSupportView initialTickets={tickets} />
}
