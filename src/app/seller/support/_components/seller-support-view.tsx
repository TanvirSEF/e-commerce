"use client"

import React, { useState } from "react"
import { Plus, ChevronRight, Search, Loader2 } from "lucide-react"
import { SellerTicketCreateModal } from "./seller-ticket-create-modal"
import { SellerTicketDetailsModal } from "./seller-ticket-details-modal"
import { fetchSellerTicketDetailsAction } from "@/app/actions/seller-actions"
import type { SellerSupportTicketRow, SellerTicketDetailData } from "@/services/seller-panel-service"

interface SellerSupportViewProps {
  initialTickets: SellerSupportTicketRow[]
  userId: string
}

export function SellerSupportView({ initialTickets, userId }: SellerSupportViewProps) {
  const [tickets, setTickets] = useState<SellerSupportTicketRow[]>(initialTickets)
  const [search, setSearch] = useState("")
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [activeTicketData, setActiveTicketData] = useState<SellerTicketDetailData | null>(null)
  const [loadingTicketId, setLoadingTicketId] = useState<number | null>(null)

  const filteredTickets = tickets.filter(
    (t) =>
      t.code.includes(search.trim()) ||
      t.subject.toLowerCase().includes(search.toLowerCase().trim())
  )

  const handleOpenDetails = async (ticket: SellerSupportTicketRow) => {
    setLoadingTicketId(ticket.id)
    const res = await fetchSellerTicketDetailsAction(ticket.id)
    setLoadingTicketId(null)

    if (res.success && res.data) {
      setActiveTicketData(res.data)
    }
  }

  const handleTicketCreated = (newTicket: SellerSupportTicketRow) => {
    setTickets((prev) => [newTicket, ...prev])
  }

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString)
      return d.toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch {
      return isoString
    }
  }

  return (
    <div className="space-y-6">
      {/* Titlebar matching Laravel aiz-titlebar */}
      <div className="border-b border-gray-100 pb-3">
        <h1 className="text-xl font-bold text-gray-900">Support Ticket</h1>
      </div>

      {/* Signature Create a Ticket Callout Card matching support_ticket/index.blade.php */}
      <div className="flex justify-center">
        <div
          onClick={() => setCreateModalOpen(true)}
          className="w-full max-w-sm p-5 rounded border border-gray-200 bg-white text-center cursor-pointer hover:border-[#d43533] hover:shadow-md transition-all group"
        >
          <div className="w-16 h-16 rounded-full mx-auto bg-gray-500 group-hover:bg-[#d43533] flex items-center justify-center mb-3 transition-colors">
            <Plus className="w-8 h-8 text-white" />
          </div>
          <div className="text-base font-bold text-[#d43533]">Create a Ticket</div>
        </div>
      </div>

      {/* Tickets Card matching Laravel */}
      <div className="card bg-white border border-gray-200 rounded-sm shadow-xs overflow-hidden">
        <div className="card-header p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
          <h5 className="mb-0 text-sm font-semibold text-gray-800">Tickets</h5>
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by code or subject..."
              className="w-full text-xs pl-3 pr-8 py-1.5 border border-gray-300 rounded focus:border-[#d43533] focus:outline-none"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>
        </div>

        <div className="card-body p-0">
          {filteredTickets.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-700">
                <thead className="bg-[#f9fafb] text-gray-600 font-semibold border-b border-gray-200">
                  <tr>
                    <th className="py-3 px-4 w-32">Ticket ID</th>
                    <th className="py-3 px-4 w-44">Sending Date</th>
                    <th className="py-3 px-4">Subject</th>
                    <th className="py-3 px-4 text-center w-28">Status</th>
                    <th className="py-3 px-4 text-right w-36">Options</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredTickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-semibold text-gray-900">
                        #{ticket.code}
                      </td>
                      <td className="py-3 px-4 text-gray-500 font-mono text-[11px]">
                        {formatDate(ticket.createdAt)}
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-800">
                        {ticket.subject}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 text-[11px] font-semibold rounded ${
                            ticket.status === "pending"
                              ? "text-red-700 bg-red-50 border border-red-200"
                              : ticket.status === "open"
                              ? "text-gray-700 bg-gray-100 border border-gray-300"
                              : "text-emerald-700 bg-emerald-50 border border-emerald-200"
                          }`}
                        >
                          {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          disabled={loadingTicketId === ticket.id}
                          onClick={() => handleOpenDetails(ticket)}
                          className="inline-flex items-center gap-1 text-xs text-[#d43533] hover:underline font-medium"
                        >
                          {loadingTicketId === ticket.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <>
                              View Details
                              <ChevronRight className="w-3.5 h-3.5" />
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-400 text-xs">
              No support tickets found. Click &quot;Create a Ticket&quot; above to submit an inquiry.
            </div>
          )}
        </div>
      </div>

      {/* Create Ticket Modal */}
      {createModalOpen && (
        <SellerTicketCreateModal
          onClose={() => setCreateModalOpen(false)}
          onSuccess={handleTicketCreated}
        />
      )}

      {/* Ticket Details & Thread Modal */}
      {activeTicketData && (
        <SellerTicketDetailsModal
          initialData={activeTicketData}
          onClose={() => setActiveTicketData(null)}
          onReplyAdded={() => {
            setTickets((prev) =>
              prev.map((t) =>
                t.id === activeTicketData.ticket?.id ? { ...t, status: "pending" } : t
              )
            )
          }}
        />
      )}
    </div>
  )
}
