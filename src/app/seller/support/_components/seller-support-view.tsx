"use client"

import React, { useState } from "react"
import {
  LifeBuoy, Search, CheckCircle, Clock, Plus, X, Send,
} from "lucide-react"
import { createTicketAction, updateTicketStatusAction } from "@/app/actions/ecommerce-actions"
import type { SeedSupportTicket } from "@/db/seed/data"

interface SellerSupportViewProps {
  initialTickets: SeedSupportTicket[]
}

export function SellerSupportView({ initialTickets }: SellerSupportViewProps) {
  const [tickets, setTickets] = useState<SeedSupportTicket[]>(initialTickets)
  const [searchTerm, setSearchTerm] = useState("")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<SeedSupportTicket | null>(null)
  const [subject, setSubject] = useState("")
  const [details, setDetails] = useState("")
  const [replyText, setReplyText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const filtered = tickets.filter(
    (t) =>
      t.code.includes(searchTerm) ||
      t.subject.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const res = await createTicketAction({ subject, details })
      setTickets((prev) => [res.ticket, ...prev])
      setShowCreateModal(false)
      setSubject("")
      setDetails("")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTicket || !replyText.trim()) return
    const newReply: SeedSupportTicket["replies"][number] = {
      id: `tr-${Date.now()}`,
      senderName: "You (Seller)",
      senderRole: "customer",
      message: replyText,
      date: new Date().toLocaleString("en-GB"),
    }
    setTickets((prev) =>
      prev.map((t) =>
        t.id === selectedTicket.id ? { ...t, replies: [...(t.replies || []), newReply] } : t
      )
    )
    setSelectedTicket((prev) =>
      prev ? { ...prev, replies: [...(prev.replies || []), newReply] } : null
    )
    setReplyText("")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Support Tickets</h1>
          <p className="text-xs text-slate-500 mt-0.5">Submit and track your vendor support requests</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#d43533] hover:bg-[#b82a28] text-white text-xs font-semibold rounded-md shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Ticket
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by code or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533]"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[11px] tracking-wider">
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#d43533]">#{ticket.code}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800 max-w-xs truncate">{ticket.subject}</td>
                  <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">{ticket.date}</td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize ${
                      ticket.status === "solved" ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : ticket.status === "open" ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedTicket(ticket)}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold rounded transition-colors"
                    >
                      View Thread
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-5 relative animate-in fade-in zoom-in-95">
            <button onClick={() => setShowCreateModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-base font-bold text-slate-800 mb-4">Create New Ticket</h3>
            <form onSubmit={handleCreateTicket} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Subject *</label>
                <input required type="text" value={subject} onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Details *</label>
                <textarea required rows={4} value={details} onChange={(e) => setDetails(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533]" />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button type="button" onClick={() => setShowCreateModal(false)} className="px-3 py-1.5 border border-slate-300 text-slate-600 rounded text-xs hover:bg-slate-50">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-1.5 bg-[#d43533] hover:bg-[#b82a28] text-white rounded text-xs font-semibold">
                  {isSubmitting ? "Submitting..." : "Submit Ticket"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Thread Drawer */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] flex flex-col p-5 relative animate-in fade-in zoom-in-95">
            <button onClick={() => setSelectedTicket(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
            <div className="border-b border-slate-100 pb-3 mb-3">
              <span className="font-mono font-bold text-sm text-[#d43533]">#{selectedTicket.code}</span>
              <h3 className="text-base font-bold text-slate-800 mt-1">{selectedTicket.subject}</h3>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
              <div className="bg-slate-50 p-3 rounded border border-slate-200">
                <div className="text-[10px] text-slate-400 mb-1">Initial Message</div>
                <p className="text-slate-700">{selectedTicket.details}</p>
              </div>
              {selectedTicket.replies?.map((r, idx) => (
                <div key={idx} className={`p-3 rounded border ${r.senderRole === "support" ? "bg-red-50/50 border-red-200 ml-4" : "bg-blue-50/50 border-blue-200 mr-4"}`}>
                  <div className="text-[10px] text-slate-400 mb-1">{r.senderName}</div>
                  <p className="text-slate-700">{r.message}</p>
                </div>
              ))}
            </div>
            <form onSubmit={handleSendReply} className="pt-3 border-t border-slate-100 mt-3 space-y-2">
              <textarea required rows={3} value={replyText} onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your reply..." className="w-full px-3 py-2 border border-slate-300 rounded text-xs focus:outline-none focus:border-[#d43533]" />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setSelectedTicket(null)} className="px-3 py-1.5 border border-slate-300 text-slate-600 rounded text-xs hover:bg-slate-50">Close</button>
                <button type="submit" className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#d43533] hover:bg-[#b82a28] text-white rounded text-xs font-semibold">
                  <Send className="w-3.5 h-3.5" />
                  Send Reply
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
