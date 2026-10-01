import React from "react"
import Link from "next/link"
import { ArrowLeft, User, Calendar } from "lucide-react"
import { TicketStatusBadge } from "../../_components/ticket-status-badge"
import type { AdminTicketDetail } from "@/services/ticket-service"

interface TicketShowHeaderProps {
  ticket: AdminTicketDetail
}

export function TicketShowHeader({ ticket }: TicketShowHeaderProps) {
  return (
    <div className="p-5 border-b border-slate-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
        <Link
          href="/admin/support-tickets"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#d43533] transition-colors w-fit"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Support Desk
        </Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold text-slate-800 leading-snug">
            {ticket.subject}{" "}
            <span className="font-mono text-slate-500 font-semibold">#{ticket.code}</span>
          </h1>

          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1 font-semibold text-slate-700">
              <User className="w-3.5 h-3.5 text-slate-400" />
              {ticket.userName}
            </span>

            {ticket.userEmail && (
              <>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500">{ticket.userEmail}</span>
              </>
            )}

            <span className="text-slate-300">•</span>
            <span className="inline-flex items-center gap-1 font-mono text-[11px] text-slate-500">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {ticket.createdAt}
            </span>

            <span className="text-slate-300">•</span>
            <TicketStatusBadge status={ticket.status} />
          </div>
        </div>
      </div>
    </div>
  )
}
