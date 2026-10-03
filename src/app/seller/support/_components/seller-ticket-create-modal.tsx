"use client"

import React, { useState } from "react"
import { X, Loader2 } from "lucide-react"
import { createSellerTicketAction } from "@/app/actions/seller-actions"
import type { SellerSupportTicketRow } from "@/services/seller-panel-service"

interface SellerTicketCreateModalProps {
  onClose: () => void
  onSuccess: (newTicket: SellerSupportTicketRow) => void
}

export function SellerTicketCreateModal({
  onClose,
  onSuccess,
}: SellerTicketCreateModalProps) {
  const [subject, setSubject] = useState("")
  const [details, setDetails] = useState("")
  const [attachment, setAttachment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!subject.trim() || !details.trim()) return

    setIsSubmitting(true)
    setErrorMessage("")

    const res = await createSellerTicketAction({
      subject: subject.trim(),
      details: details.trim(),
      files: attachment.trim() ? [attachment.trim()] : [],
    })

    setIsSubmitting(false)

    if (res.success && res.data) {
      onSuccess({
        id: res.data.id,
        code: res.data.code,
        subject: res.data.subject,
        details: res.data.details,
        files: res.data.files || [],
        status: (res.data.status as "pending" | "open" | "solved") || "pending",
        createdAt: new Date().toISOString(),
        replyCount: 0,
      })
      onClose()
    } else {
      setErrorMessage(res.error || "Failed to create support ticket.")
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-sm border border-gray-200 shadow-xl w-full max-w-lg overflow-hidden">
        {/* Modal Header */}
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between bg-white">
          <h5 className="text-sm font-semibold text-gray-800">Create a Ticket</h5>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 md:p-5 text-xs">
          {errorMessage && (
            <div className="mb-3 p-2.5 text-xs text-red-700 bg-red-50 border border-red-200 rounded">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Subject <span className="text-[#d43533]">*</span>
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Subject"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:border-[#d43533] focus:outline-none text-xs text-gray-800"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Provide a detailed description <span className="text-[#d43533]">*</span>
              </label>
              <textarea
                rows={4}
                required
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Type your reply"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:border-[#d43533] focus:outline-none text-xs text-gray-800"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Attachment / Photo URL
              </label>
              <input
                type="text"
                value={attachment}
                onChange={(e) => setAttachment(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 border border-gray-300 rounded focus:border-[#d43533] focus:outline-none text-xs text-gray-800"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs transition-colors"
              >
                cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#d43533] hover:bg-[#b82a28] text-white rounded text-xs font-medium transition-colors"
              >
                {isSubmitting && <Loader2 className="w-3 h-3 animate-spin" />}
                Send Ticket
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
