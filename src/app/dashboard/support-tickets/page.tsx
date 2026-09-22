import { Metadata } from "next"
import { getSupportTickets } from "@/services/ticket-service"
import { SupportTicketsView } from "./_components/support-tickets-view"

export const metadata: Metadata = {
  title: "Support Tickets | Active eCommerce CMS",
  description: "Customer service support tickets and inquiries.",
}

export default async function SupportTicketsPage() {
  const tickets = await getSupportTickets()

  return <SupportTicketsView initialTickets={tickets} />
}
