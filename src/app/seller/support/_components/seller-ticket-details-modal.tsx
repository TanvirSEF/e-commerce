"use client"

import React, { useState } from "react"
import Image from "next/image"
import { X, Loader2, Send, Download } from "lucide-react"
import { replySellerTicketAction } from "@/app/actions/seller-actions"
import type { SellerTicketDetailData, SellerTicketReplyItem } from "@/services/seller-panel-service"

interface SellerTicketDetailsModalProps {
  initialData: SellerTicketDetailData
  onClose: () => void
  onReplyAdded: () => void
}

export function SellerTicketDetailsModal({
  initialData,
  onClose,
  onReplyAdded,
}: SellerTicketDetailsModalProps) {
  const { ticket } = initialData
  const [replies, setReplies] = useState<SellerTicketReplyItem[]>(initialData.replies)
  const [replyText, setReplyText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  if (!ticket) return null

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyText.trim()) return

    setIsSubmitting(true)
    setErrorMessage("")

    const res = await replySellerTicketAction(ticket.id, replyText.trim())
    setIsSubmitting(false)

    if (res.success && res.data) {
      setReplies((prev) => [
        ...prev,
        {
          id: res.data!.id,
          userId: ticket.userId,
          userName: ticket.userName,
          userAvatar: ticket.userAvatar,
          reply: replyText.trim(),
          files: [],
          createdAt: new Date().toISOString(),
        },
      ])
      setReplyText("")
      onReplyAdded()
    } else {
      setErrorMessage(res.error || "Failed to submit reply.")
    }
  }

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString)
      return d.toLocaleString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch {
      return isoString
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-sm border border-gray-200 shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header matching show.blade.php card-header */}
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between bg-white shrink-0">
          <div>
            <h5 className="text-sm font-bold text-gray-900">
              {ticket.subject} <span className="font-mono text-gray-500">#{ticket.code}</span>
            </h5>
            <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-500">
              <span className="font-medium text-gray-700">{ticket.userName}</span>
              <span>•</span>
              <span>{formatDate(ticket.createdAt)}</span>
              <span>•</span>
              <span
                className={`px-1.5 py-0.2 rounded font-semibold text-[10px] uppercase ${
                  ticket.status === "pending"
                    ? "bg-red-50 text-red-700 border border-red-200"
                    : ticket.status === "open"
                    ? "bg-gray-100 text-gray-700 border border-gray-300"
                    : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                }`}
              >
                {ticket.status}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Reply Form (top) matching show.blade.php */}
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 shrink-0">
          {errorMessage && (
            <div className="mb-2 p-2 text-xs text-red-700 bg-red-50 border border-red-200 rounded">
              {errorMessage}
            </div>
          )}
          <form onSubmit={handleSendReply} className="space-y-2">
            <textarea
              rows={3}
              required
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type your reply"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:border-[#d43533] focus:outline-none text-xs text-gray-800 bg-white"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#d43533] hover:bg-[#b82a28] text-white rounded text-xs font-medium transition-colors"
              >
                {isSubmitting ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Send className="w-3 h-3" />
                )}
                Send Reply
              </button>
            </div>
          </form>
        </div>

        {/* Messages Thread (Original + Replies) */}
        <div className="overflow-y-auto flex-1 p-4 md:p-5 space-y-4 text-xs">
          {/* Thread List */}
          <div className="space-y-3">
            {/* Original ticket details */}
            <div className="border border-gray-200 rounded p-3 bg-white">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 relative rounded-full overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                  <Image
                    src={ticket.userAvatar || "/assets/img/avatar-placeholder.png"}
                    alt={ticket.userName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <span className="font-semibold text-gray-800">{ticket.userName}</span>
                  <span className="text-[10px] text-gray-400 ml-2">{formatDate(ticket.createdAt)}</span>
                </div>
              </div>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">{ticket.details}</p>
              {ticket.files && ticket.files.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {ticket.files.map((f, idx) => (
                    <a
                      key={idx}
                      href={f}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded"
                    >
                      <Download className="w-3 h-3" /> Attachment {idx + 1}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Replies */}
            {replies.map((rep) => (
              <div key={rep.id} className="border border-gray-200 rounded p-3 bg-white">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 relative rounded-full overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                    <Image
                      src={rep.userAvatar || "/assets/img/avatar-placeholder.png"}
                      alt={rep.userName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <span className="font-semibold text-gray-800">{rep.userName}</span>
                    <span className="text-[10px] text-gray-400 ml-2">{formatDate(rep.createdAt)}</span>
                  </div>
                </div>
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">{rep.reply}</p>
                {rep.files && rep.files.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {rep.files.map((f, idx) => (
                      <a
                        key={idx}
                        href={f}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded"
                      >
                        <Download className="w-3 h-3" /> Attachment {idx + 1}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-2.5 border-t border-gray-200 bg-gray-50 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs rounded transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
