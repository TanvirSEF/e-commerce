import React from "react"
import { notFound } from "next/navigation"
import { getTicketByIdAdmin } from "@/services/ticket-service"
import { TicketShowHeader } from "./_components/ticket-show-header"
import { TicketReplyForm } from "./_components/ticket-reply-form"
import { TicketThreadList } from "./_components/ticket-thread-list"

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params
  const ticketId = parseInt(id, 10)
  if (isNaN(ticketId)) {
    return { title: "Support Ticket Not Found" }
  }

  const ticket = await getTicketByIdAdmin(ticketId)
  if (!ticket) {
    return { title: "Support Ticket Not Found" }
  }

  return {
    title: `${ticket.subject} #${ticket.code} | Support Ticket Desk`,
  }
}

export default async function AdminSupportTicketDetailPage({ params }: PageProps) {
  const { id } = await params
  const ticketId = parseInt(id, 10)

  if (isNaN(ticketId)) {
    notFound()
  }

  const ticket = await getTicketByIdAdmin(ticketId)

  if (!ticket) {
    notFound()
  }

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-4">
      {/* 1:1 Active eCommerce Ticket Show Card Container */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <TicketShowHeader ticket={ticket} />

        <div className="p-5 sm:p-6 space-y-6">
          {/* Admin Reply Form with Split Submit Button */}
          <TicketReplyForm ticketId={ticket.id} currentStatus={ticket.status} />

          {/* Conversation Thread History */}
          <TicketThreadList ticket={ticket} />
        </div>
      </div>
    </div>
  )
}
