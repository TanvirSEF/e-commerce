import React from "react"
import { getAllTicketsAdmin } from "@/services/ticket-service"
import { SupportDeskContainer } from "./_components/support-desk-container"

export const metadata = {
  title: "Support Desk | Active eCommerce Admin",
}

interface PageProps {
  searchParams: Promise<{
    search?: string
    status?: string
  }>
}

export default async function AdminSupportTicketsPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams
  const search = resolvedParams?.search || ""
  const status = resolvedParams?.status || "all"

  const ticketsData = await getAllTicketsAdmin({
    search,
    status,
  })

  return (
    <div className="p-4 sm:p-6 space-y-4">
      <SupportDeskContainer
        initialData={ticketsData}
        currentSearch={search}
        currentStatus={status}
      />
    </div>
  )
}
