"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Eye, ChevronLeft, ChevronRight } from "lucide-react"
import { TicketStatusBadge } from "./ticket-status-badge"
import type { AdminTicketItem } from "@/services/ticket-service"

interface TicketTableProps {
  tickets: AdminTicketItem[]
  pageSize?: number
}

export function TicketTable({ tickets, pageSize = 15 }: TicketTableProps) {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(tickets.length / pageSize) || 1
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, tickets.length)
  const currentTickets = tickets.slice(startIndex, endIndex)

  return (
    <div className="card-body p-0">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[11px] tracking-wider">
              <th className="py-3 px-4">Ticket ID</th>
              <th className="py-3 px-4">Sending Date</th>
              <th className="py-3 px-4">Subject</th>
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Last reply</th>
              <th className="py-3 px-4 text-right">Options</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {currentTickets.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-1.5">
                    <p className="text-sm font-medium text-slate-500">No support tickets found</p>
                    <p className="text-xs text-slate-400">No tickets match the current query or filter criteria.</p>
                  </div>
                </td>
              </tr>
            ) : (
              currentTickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-slate-50/70 transition-colors">
                  {/* Ticket ID */}
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                    <Link
                      href={`/admin/support-tickets/${ticket.id}`}
                      className="text-slate-800 hover:text-[#d43533] transition-colors"
                    >
                      #{ticket.code}
                    </Link>
                  </td>

                  {/* Sending Date + New Badge */}
                  <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px] whitespace-nowrap">
                    <span>{ticket.createdAt}</span>
                    {!ticket.viewed && (
                      <span className="ml-2 px-1.5 py-0.5 text-[10px] font-semibold bg-cyan-50 text-cyan-700 border border-cyan-200 rounded">
                        New
                      </span>
                    )}
                  </td>

                  {/* Subject */}
                  <td className="py-3.5 px-4 max-w-xs">
                    <Link
                      href={`/admin/support-tickets/${ticket.id}`}
                      className="font-medium text-slate-800 hover:text-[#d43533] line-clamp-1 transition-colors"
                      title={ticket.subject}
                    >
                      {ticket.subject}
                    </Link>
                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{ticket.details}</p>
                  </td>

                  {/* User */}
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800">{ticket.userName}</div>
                    {ticket.userEmail && (
                      <div className="text-[11px] text-slate-400">{ticket.userEmail}</div>
                    )}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    <TicketStatusBadge status={ticket.status} />
                  </td>

                  {/* Last reply */}
                  <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                    {ticket.lastReplyAt}
                  </td>

                  {/* Options */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center justify-end gap-1.5">
                      <Link
                        href={`/admin/support-tickets/${ticket.id}`}
                        className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-colors shadow-xs"
                        title="View Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {tickets.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-slate-200 bg-white">
          <div className="text-xs text-slate-500">
            Showing <span className="font-semibold text-slate-700">{startIndex + 1}</span> to{" "}
            <span className="font-semibold text-slate-700">{endIndex}</span> of{" "}
            <span className="font-semibold text-slate-700">{tickets.length}</span> tickets
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Previous page"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <span className="px-3 py-1 text-xs font-medium text-slate-700">
                Page {currentPage} of {totalPages}
              </span>

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Next page"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
