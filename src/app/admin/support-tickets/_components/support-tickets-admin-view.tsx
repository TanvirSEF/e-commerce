"use client"

import React, { useState } from "react"
import {
  LifeBuoy,
  Search,
  CheckCircle,
  Clock,
  Send,
  X,
  User,
  MessageSquare,
  AlertCircle,
} from "lucide-react"
import { updateTicketStatusAction } from "@/app/actions/ecommerce-actions"
import type { SeedSupportTicket } from "@/db/seed/data"

interface TicketAdminItem extends SeedSupportTicket {
  userEmail?: string
  userName?: string
}

interface SupportTicketsAdminViewProps {
  initialTickets: TicketAdminItem[]
}

export function SupportTicketsAdminView({ initialTickets }: SupportTicketsAdminViewProps) {
  const [tickets, setTickets] = useState<TicketAdminItem[]>(initialTickets)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedTicket, setSelectedTicket] = useState<TicketAdminItem | null>(null)
  const [replyText, setReplyText] = useState("")
  const [newStatus, setNewStatus] = useState("solved")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const filtered = tickets.filter((t) => {
    const matchesSearch =
      t.code.includes(searchTerm) ||
      t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.userName && t.userName.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === "all" || t.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const pendingCount = tickets.filter((t) => t.status === "pending").length
  const openCount = tickets.filter((t) => t.status === "open").length
  const solvedCount = tickets.filter((t) => t.status === "solved").length

  const handleUpdateStatus = async (ticketId: number, status: string) => {
    await updateTicketStatusAction(ticketId, status)
    setTickets((prev) =>
      prev.map((t) => (t.id === String(ticketId) ? { ...t, status: status as any } : t))
    )
    if (selectedTicket && selectedTicket.id === String(ticketId)) {
      setSelectedTicket((prev) => (prev ? { ...prev, status: status as any } : null))
    }
  }

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTicket || !replyText.trim()) return
    setIsSubmitting(true)
    try {
      const numericId = parseInt(selectedTicket.id.replace(/\D/g, "")) || 1
      await updateTicketStatusAction(numericId, newStatus)
      const newReply: SeedSupportTicket["replies"][number] = {
        id: `tr-${Date.now()}`,
        senderName: "Staff Support Agent",
        senderRole: "support",
        message: replyText,
        date: new Date().toLocaleString("en-GB"),
      }
      setTickets((prev) =>
        prev.map((t) =>
          t.id === selectedTicket.id
            ? {
                ...t,
                status: newStatus as any,
                replies: [...(t.replies || []), newReply],
              }
            : t
        )
      )
      setSelectedTicket((prev) =>
        prev
          ? {
              ...prev,
              status: newStatus as any,
              replies: [...(prev.replies || []), newReply],
            }
          : null
      )
      setReplyText("")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Support Ticket Desk</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Customer and vendor inquiries, refund claims, and technical resolution desk
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Pending Tickets</div>
            <div className="text-xl font-bold text-slate-800">{pendingCount}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
            <LifeBuoy className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Open Tickets</div>
            <div className="text-xl font-bold text-slate-800">{openCount}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Solved Inquiries</div>
            <div className="text-xl font-bold text-slate-800">{solvedCount}</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search code, subject or user..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 border border-slate-300 rounded text-xs text-slate-700 bg-white focus:outline-none focus:border-[#d43533]"
          >
            <option value="all">All Ticket Statuses</option>
            <option value="pending">Pending</option>
            <option value="open">Open</option>
            <option value="solved">Solved</option>
          </select>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[11px] tracking-wider">
                <th className="py-3 px-4">Ticket Code</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#d43533]">
                    #{ticket.code}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                    {ticket.date}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800">{ticket.userName || "Customer"}</div>
                    <div className="text-[11px] text-slate-400">{ticket.userEmail || "customer@example.com"}</div>
                  </td>
                  <td className="py-3.5 px-4 max-w-xs">
                    <div className="font-bold text-slate-800 truncate">{ticket.subject}</div>
                    <div className="text-[11px] text-slate-500 truncate">{ticket.details}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize ${
                        ticket.status === "solved"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : ticket.status === "open"
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedTicket(ticket)}
                      className="px-3 py-1 bg-slate-100 hover:bg-[#d43533] hover:text-white text-slate-700 text-[11px] font-semibold rounded border border-slate-200 transition-colors"
                    >
                      Manage & Reply
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ticket Reply Modal / Drawer */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] flex flex-col p-5 relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setSelectedTicket(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="border-b border-slate-100 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-sm text-[#d43533]">
                  #{selectedTicket.code}
                </span>
                <span className="text-slate-300">|</span>
                <span className="text-xs text-slate-500">{selectedTicket.date}</span>
              </div>
              <h3 className="text-base font-bold text-slate-800 mt-1">
                {selectedTicket.subject}
              </h3>
              <div className="text-xs text-slate-500 mt-0.5">
                From: <span className="font-semibold text-slate-700">{selectedTicket.userName}</span> ({selectedTicket.userEmail})
              </div>
            </div>

            {/* Conversation Thread */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
              <div className="bg-slate-50 p-3 rounded border border-slate-200">
                <div className="flex items-center justify-between text-slate-400 text-[10px] mb-1">
                  <span className="font-semibold text-slate-700">Client Initial Message</span>
                  <span>{selectedTicket.date}</span>
                </div>
                <p className="text-slate-700 whitespace-pre-wrap">{selectedTicket.details}</p>
              </div>

              {selectedTicket.replies?.map((r, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded border ${
                    r.senderRole === "support"
                      ? "bg-red-50/50 border-red-200 ml-4"
                      : "bg-slate-50 border-slate-200 mr-4"
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                    <span className="font-semibold text-slate-800">{r.senderName}</span>
                    <span>{r.date}</span>
                  </div>
                  <p className="text-slate-700">{r.message}</p>
                </div>
              ))}
            </div>

            {/* Reply Form */}
            <form onSubmit={handleSendReply} className="pt-3 border-t border-slate-100 mt-3 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <label className="text-[11px] font-semibold text-slate-700">Ticket Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="px-2 py-1 border border-slate-300 rounded text-xs text-slate-700 bg-white"
                >
                  <option value="solved">Mark as Solved</option>
                  <option value="open">Keep Open</option>
                  <option value="pending">Mark as Pending</option>
                </select>
              </div>

              <textarea
                required
                rows={3}
                placeholder="Type your reply to customer..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533]"
              />

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setSelectedTicket(null)}
                  className="px-3 py-1.5 border border-slate-300 text-slate-600 rounded text-xs hover:bg-slate-50"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#d43533] hover:bg-[#b82a28] text-white rounded text-xs font-semibold transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  {isSubmitting ? "Sending..." : "Send Reply"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
