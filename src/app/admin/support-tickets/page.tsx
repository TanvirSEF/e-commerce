import React from "react"
import { getAllTicketsAdmin } from "@/services/ticket-service"
import { SupportTicketsAdminView } from "./_components/support-tickets-admin-view"

export const metadata = {
  title: "Support Ticket Desk | Active eCommerce Admin",
}

export default async function AdminSupportTicketsPage() {
  const tickets = await getAllTicketsAdmin()

  return <SupportTicketsAdminView initialTickets={tickets} />
}
