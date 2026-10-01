import React from "react"

interface TicketStatusBadgeProps {
  status: "pending" | "open" | "solved" | string
  className?: string
}

export function TicketStatusBadge({ status, className = "" }: TicketStatusBadgeProps) {
  const normalized = status?.toLowerCase()

  if (normalized === "pending") {
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-semibold tracking-wide bg-rose-50 text-[#e62e04] border border-rose-200/80 ${className}`}
      >
        Pending
      </span>
    )
  }

  if (normalized === "open") {
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-semibold tracking-wide bg-slate-100 text-slate-700 border border-slate-200 ${className}`}
      >
        Open
      </span>
    )
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-semibold tracking-wide bg-emerald-50 text-[#28a745] border border-emerald-200/80 ${className}`}
    >
      Solved
    </span>
  )
}
