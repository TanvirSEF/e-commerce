import { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { getServerSession } from "@/lib/auth/session-helper"
import { getTicketDetailCustomer } from "@/services/ticket-service"
import { TicketDetailView } from "./_components/ticket-detail-view"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Ticket Details | Active eCommerce CMS",
  description: "View ticket thread, replies, and agent communications.",
}

export default async function TicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await getServerSession()
  if (!session?.user?.id) {
    redirect("/login")
  }

  const ticket = await getTicketDetailCustomer(id, session.user.id)
  if (!ticket) {
    notFound()
  }

  return <TicketDetailView ticket={ticket} />
}
