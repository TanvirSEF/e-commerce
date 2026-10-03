"use client"

import React, { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Send, Paperclip, Clock, CheckCircle2, AlertCircle, FileText, User } from "lucide-react"
import { replyCustomerTicketAction } from "@/app/actions/ecommerce-actions"

interface TicketReplyItem {
  id: number
  reply: string
  files: string[]
  createdAt: string
  userName: string
  userRole: string
  userAvatar: string
}

interface TicketDetailData {
  id: number
  code: string
  subject: string
  details: string
  files: string[]
  status: string
  createdAt: string
  userName: string
  userAvatar: string
  replies: TicketReplyItem[]
}

interface TicketDetailViewProps {
  ticket: TicketDetailData
}

export function TicketDetailView({ ticket: initialTicket }: TicketDetailViewProps) {
  const [ticket, setTicket] = useState(initialTicket)
  const [replyText, setReplyText] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyText.trim()) return

    setSubmitting(true)
    setFeedback(null)

    try {
      const res = await replyCustomerTicketAction({
        ticketId: ticket.id,
        reply: replyText.trim(),
      })

      if (res.success) {
        const newReply: TicketReplyItem = {
          id: (res as any).replyId || Date.now(),
          reply: replyText.trim(),
          files: [],
          createdAt: new Date().toISOString().slice(0, 16).replace("T", " "),
          userName: ticket.userName,
          userRole: "customer",
          userAvatar: ticket.userAvatar,
        }
        setTicket({
          ...ticket,
          status: "pending",
          replies: [...ticket.replies, newReply],
        })
        setReplyText("")
        setFeedback({ type: "success", text: "Reply sent successfully." })
        setTimeout(() => setFeedback(null), 4000)
      } else {
        setFeedback({ type: "error", text: res.error || "Failed to send reply." })
      }
    } catch {
      setFeedback({ type: "error", text: "An unexpected error occurred while sending reply." })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Back button & Title */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/support-tickets"
          className="inline-flex items-center justify-center size-8 rounded border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-colors shadow-xs"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span>{ticket.subject}</span>
            <span className="text-sm font-mono text-[#d43533]">#{ticket.code}</span>
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Ticket submitted by {ticket.userName} on {ticket.createdAt}
          </p>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-3.5 rounded text-xs font-semibold flex items-center justify-between border ${
            feedback.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          <span>{feedback.text}</span>
          <button type="button" onClick={() => setFeedback(null)} className="text-gray-500 hover:text-gray-800">✕</button>
        </div>
      )}

      {/* Main Ticket Card */}
      <div className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden">
        {/* Header Status Bar */}
        <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <span className="font-bold text-sm text-gray-900">{ticket.userName}</span>
            <span className="text-xs text-gray-500">{ticket.createdAt}</span>
          </div>
          <div>
            {ticket.status === "pending" && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                <AlertCircle className="size-3.5" />
                <span>Pending</span>
              </span>
            )}
            {ticket.status === "open" && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                <Clock className="size-3.5" />
                <span>Open</span>
              </span>
            )}
            {ticket.status === "solved" && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                <CheckCircle2 className="size-3.5" />
                <span>Solved</span>
              </span>
            )}
          </div>
        </div>

        {/* Reply Form (Matching Active eCommerce CMS) */}
        <div className="p-4 sm:p-6 border-b border-gray-200 bg-white">
          <form onSubmit={handleSendReply} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Reply to Ticket <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                required
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your message or follow-up query here..."
                className="w-full rounded border border-gray-300 p-3 text-xs text-gray-800 placeholder-gray-400 focus:border-[#d43533] focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[11px] text-gray-400">
                Support agents will be notified immediately of your response.
              </span>
              <button
                type="submit"
                disabled={submitting || !replyText.trim()}
                className="inline-flex items-center gap-1.5 rounded bg-[#d43533] px-5 py-2 text-xs font-bold text-white hover:bg-[#9d1b1a] transition-colors disabled:opacity-50"
              >
                <Send className="size-3.5" />
                <span>{submitting ? "Sending..." : "Send Reply"}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Thread of Messages (Chronological) */}
        <div className="p-4 sm:p-6 space-y-6 bg-gray-50/30">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">
            Conversation Thread ({ticket.replies.length + 1})
          </h3>

          {/* Original Inquiry */}
          <div className="rounded border border-gray-200 bg-white p-4 sm:p-5 shadow-xs">
            <div className="flex items-center gap-3 mb-3">
              <div className="size-8 rounded-full bg-red-100 text-[#d43533] font-bold text-xs flex items-center justify-center uppercase">
                {ticket.userName.slice(0, 2)}
              </div>
              <div>
                <span className="text-xs font-bold text-gray-900 block">{ticket.userName}</span>
                <span className="text-[11px] text-gray-400">{ticket.createdAt} (Initial Request)</span>
              </div>
            </div>
            <p className="text-xs text-gray-800 leading-relaxed whitespace-pre-wrap">{ticket.details}</p>

            {ticket.files.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-2">
                {ticket.files.map((file, idx) => (
                  <a
                    key={idx}
                    href={file}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 rounded bg-gray-100 hover:bg-gray-200 px-2.5 py-1 text-[11px] text-gray-700 transition-colors"
                  >
                    <FileText className="size-3 text-gray-500" />
                    <span>Attachment #{idx + 1}</span>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Subsequent Replies */}
          {ticket.replies.map((reply) => {
            const isAdmin = reply.userRole === "admin" || reply.userRole === "staff"
            return (
              <div
                key={reply.id}
                className={`rounded border p-4 sm:p-5 shadow-xs ${
                  isAdmin ? "bg-blue-50/50 border-blue-200" : "bg-white border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`size-8 rounded-full font-bold text-xs flex items-center justify-center uppercase ${
                        isAdmin ? "bg-[#1967d2] text-white" : "bg-red-100 text-[#d43533]"
                      }`}
                    >
                      {reply.userName ? reply.userName.slice(0, 2) : <User className="size-4" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-900">{reply.userName}</span>
                        {isAdmin && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                            Support Staff
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-gray-400">{reply.createdAt}</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-800 leading-relaxed whitespace-pre-wrap">{reply.reply}</p>

                {reply.files.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-2">
                    {reply.files.map((file, idx) => (
                      <a
                        key={idx}
                        href={file}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded bg-white hover:bg-gray-100 px-2.5 py-1 text-[11px] text-gray-700 transition-colors border border-gray-200"
                      >
                        <FileText className="size-3 text-gray-500" />
                        <span>Attachment #{idx + 1}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
