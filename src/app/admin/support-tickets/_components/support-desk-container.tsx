"use client"

import React, { useState, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search } from "lucide-react"
import { TicketTable } from "./ticket-table"
import type { AdminTicketsResponse } from "@/services/ticket-service"

interface SupportDeskContainerProps {
  initialData: AdminTicketsResponse
  currentSearch?: string
  currentStatus?: string
}

export function SupportDeskContainer({
  initialData,
  currentSearch = "",
  currentStatus = "all",
}: SupportDeskContainerProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(currentSearch)
  const [isPending, startTransition] = useTransition()

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (searchTerm.trim()) {
      params.set("search", searchTerm.trim())
    } else {
      params.delete("search")
    }
    params.delete("page")
    startTransition(() => {
      router.push(`/admin/support-tickets?${params.toString()}`)
    })
  }

  const handleStatusChange = (statusKey: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (statusKey !== "all") {
      params.set("status", statusKey)
    } else {
      params.delete("status")
    }
    params.delete("page")
    startTransition(() => {
      router.push(`/admin/support-tickets?${params.toString()}`)
    })
  }

  const activeTab = currentStatus || "all"

  return (
    <div className="space-y-4">
      {/* 1:1 Active eCommerce Main Card */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        {/* Card Header matching backend/support/support_tickets/index.blade.php */}
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h5 className="text-base font-bold text-slate-800">Support Desk</h5>
            <span className="text-xs text-slate-500 hidden sm:inline">
              ({initialData.total} Total Inquiries)
            </span>
          </div>

          {/* Search Form: Type ticket code & Enter */}
          <form onSubmit={handleSearchSubmit} className="w-full md:w-72">
            <div className="relative">
              <input
                type="text"
                name="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Type ticket code & Enter"
                className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#d43533]"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </form>
        </div>

        {/* Quick Filter Navigation Tabs */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border-b border-slate-200 text-xs overflow-x-auto">
          <button
            type="button"
            onClick={() => handleStatusChange("all")}
            className={`px-3 py-1 rounded font-medium transition-colors ${
              activeTab === "all"
                ? "bg-white text-slate-800 shadow-xs font-semibold border border-slate-200"
                : "text-slate-600 hover:text-slate-800"
            }`}
          >
            All Tickets ({initialData.total})
          </button>

          <button
            type="button"
            onClick={() => handleStatusChange("pending")}
            className={`px-3 py-1 rounded font-medium transition-colors inline-flex items-center gap-1.5 ${
              activeTab === "pending"
                ? "bg-rose-50 text-[#e62e04] shadow-xs font-semibold border border-rose-200"
                : "text-slate-600 hover:text-[#e62e04]"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            Pending ({initialData.pendingCount})
          </button>

          <button
            type="button"
            onClick={() => handleStatusChange("open")}
            className={`px-3 py-1 rounded font-medium transition-colors inline-flex items-center gap-1.5 ${
              activeTab === "open"
                ? "bg-slate-200 text-slate-800 shadow-xs font-semibold border border-slate-300"
                : "text-slate-600 hover:text-slate-800"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-slate-500" />
            Open ({initialData.openCount})
          </button>

          <button
            type="button"
            onClick={() => handleStatusChange("solved")}
            className={`px-3 py-1 rounded font-medium transition-colors inline-flex items-center gap-1.5 ${
              activeTab === "solved"
                ? "bg-emerald-50 text-[#28a745] shadow-xs font-semibold border border-emerald-200"
                : "text-slate-600 hover:text-[#28a745]"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Solved ({initialData.solvedCount})
          </button>

          {isPending && (
            <span className="ml-auto text-[11px] text-slate-400 animate-pulse">
              Filtering tickets...
            </span>
          )}
        </div>

        {/* aiz-table */}
        <TicketTable tickets={initialData.tickets} />
      </div>
    </div>
  )
}
