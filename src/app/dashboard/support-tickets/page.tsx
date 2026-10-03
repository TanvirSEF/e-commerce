import { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerSession } from "@/lib/auth/session-helper"
import { getSupportTickets } from "@/services/ticket-service"
import { SupportTicketsView } from "./_components/support-tickets-view"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Support Tickets | Active eCommerce CMS",
  description: "Customer service support tickets and inquiries.",
}

export default async function SupportTicketsPage() {
  const session = await getServerSession()
  if (!session?.user?.id) {
    redirect("/login")
  }

  const tickets = await getSupportTickets(session.user.id)

  return <SupportTicketsView initialTickets={tickets} />
}
