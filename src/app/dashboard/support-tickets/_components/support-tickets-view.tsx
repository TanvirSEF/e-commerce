"use client"

import { useState } from "react"
import { Plus, Send, CheckCircle, Clock, AlertCircle, X, ChevronRight } from "lucide-react"
import { SeedSupportTicket } from "@/db/seed/data"
import { createTicketAction } from "@/app/actions/ecommerce-actions"

interface SupportTicketsViewProps {
  initialTickets: SeedSupportTicket[]
}

export function SupportTicketsView({ initialTickets }: SupportTicketsViewProps) {
  const [tickets, setTickets] = useState(initialTickets)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<SeedSupportTicket | null>(null)

  // Form states
  const [subject, setSubject] = useState("")
  const [details, setDetails] = useState("")
  const [submitting, setSubmitting] = useState(false)

  // Reply states
  const [replyText, setReplyText] = useState("")

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!subject.trim() || !details.trim()) return

    setSubmitting(true)
    const res = await createTicketAction({ subject, details })
    setTickets([res.ticket, ...tickets])
    setSubmitting(false)
    setShowCreateModal(false)
    setSubject("")
    setDetails("")
  }

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyText.trim() || !selectedTicket) return

    const newReply = {
      id: `tr-${Date.now()}`,
      senderName: "Tanvir Ahmed",
      senderRole: "customer" as const,
      message: replyText,
      date: new Date().toISOString().slice(0, 16).replace("T", " "),
    }

    const updated = {
      ...selectedTicket,
      replies: [...(selectedTicket.replies || []), newReply],
    }

    setSelectedTicket(updated)
    setTickets(tickets.map((t) => (t.id === selectedTicket.id ? updated : t)))
    setReplyText("")
  }

  return (
    <div className="space-y-6">
      {/* Titlebar */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Support Ticket</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Submit queries, request assistance, or view communications with support agents.
        </p>
      </div>

      {/* Create a Ticket Action Block */}
      <button
        onClick={() => setShowCreateModal(true)}
        className="w-full p-6 text-center bg-gray-50 border border-dashed border-gray-300 rounded-lg hover:bg-gray-100/70 hover:border-primary/50 transition-all cursor-pointer group"
      >
        <div className="size-12 rounded-full bg-white border border-gray-200 group-hover:border-primary text-gray-700 group-hover:text-primary flex items-center justify-center mx-auto mb-2 transition-colors shadow-xs">
          <Plus className="size-6" />
        </div>
        <span className="text-sm font-bold text-gray-800 group-hover:text-primary transition-colors">
          Create a Ticket
        </span>
        <span className="block text-[11px] text-gray-400 mt-0.5">
          Our team usually responds within 24 business hours.
        </span>
      </button>

      {/* Tickets Table */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-xs overflow-hidden">
        <div className="p-4 sm:px-6 border-b border-gray-200">
          <h2 className="text-sm sm:text-base font-bold text-gray-900">Tickets ({tickets.length})</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/50 text-[11px] uppercase tracking-wider text-gray-500 font-semibold">
                <th className="py-3 px-4 sm:px-6">Ticket ID</th>
                <th className="py-3 px-4">Sending Date</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 sm:px-6 text-right">Options</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {tickets.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-400">
                    No tickets opened yet.
                  </td>
                </tr>
              ) : (
                tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3.5 px-4 sm:px-6 font-mono font-bold text-gray-900">
                      #{ticket.code}
                    </td>
                    <td className="py-3.5 px-4 text-gray-600">{ticket.date}</td>
                    <td className="py-3.5 px-4 font-semibold text-gray-800 max-w-xs truncate">
                      {ticket.subject}
                    </td>
                    <td className="py-3.5 px-4">
                      {ticket.status === "pending" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-100 text-red-700">
                          <AlertCircle className="size-3" />
                          <span>Pending</span>
                        </span>
                      )}
                      {ticket.status === "open" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-700">
                          <Clock className="size-3" />
                          <span>Open</span>
                        </span>
                      )}
                      {ticket.status === "solved" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-green-100 text-green-700">
                          <CheckCircle className="size-3" />
                          <span>Solved</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-right">
                      <button
                        onClick={() => setSelectedTicket(ticket)}
                        className="inline-flex items-center gap-1 text-primary font-bold hover:underline"
                      >
                        <span>View Details</span>
                        <ChevronRight className="size-3" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Ticket Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-sm">Create a Support Ticket</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Inquiry regarding order delivery status"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full text-xs border border-gray-200 rounded p-2.5 focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Provide a detailed description <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Type your message or inquiry in detail..."
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="w-full text-xs border border-gray-200 rounded p-2.5 focus:border-primary focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded text-xs font-bold bg-primary hover:bg-primary/90 text-white shadow-xs disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Send Ticket"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Ticket Details & Thread Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-xl max-h-[85vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/60">
              <div>
                <span className="font-mono text-xs font-bold text-primary">
                  #{selectedTicket.code}
                </span>
                <h3 className="font-bold text-gray-900 text-sm mt-0.5">
                  {selectedTicket.subject}
                </h3>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
              {/* Original ticket inquiry */}
              <div className="bg-gray-50 p-3.5 rounded border border-gray-200 text-xs">
                <div className="flex justify-between items-center text-gray-500 mb-1.5 text-[11px]">
                  <span className="font-bold text-gray-800">You (Original Message)</span>
                  <span>{selectedTicket.date}</span>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap">{selectedTicket.details}</p>
              </div>

              {/* Replies */}
              {selectedTicket.replies?.map((reply) => (
                <div
                  key={reply.id}
                  className={`p-3.5 rounded border text-xs ${
                    reply.senderRole === "support"
                      ? "bg-blue-50/60 border-blue-200"
                      : "bg-gray-50 border-gray-200 ml-4"
                  }`}
                >
                  <div className="flex justify-between items-center text-gray-500 mb-1.5 text-[11px]">
                    <span className="font-bold text-gray-900">{reply.senderName}</span>
                    <span>{reply.date}</span>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">{reply.message}</p>
                </div>
              ))}
            </div>

            {/* Reply Input Bar */}
            <form onSubmit={handleSendReply} className="p-3 border-t border-gray-200 bg-gray-50/50 flex gap-2">
              <input
                type="text"
                required
                placeholder="Type your reply here..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="flex-1 text-xs border border-gray-200 rounded px-3 py-2 bg-white focus:outline-none focus:border-primary"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded text-xs font-bold bg-primary hover:bg-primary/90 text-white flex items-center gap-1.5 shadow-xs"
              >
                <span>Reply</span>
                <Send className="size-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
