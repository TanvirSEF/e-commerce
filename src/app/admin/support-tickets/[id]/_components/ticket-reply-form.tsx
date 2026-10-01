"use client"

import React, { useState, useRef, useEffect } from "react"
import { ChevronDown, Send, Paperclip, Loader2, Check } from "lucide-react"
import { submitTicketReplyAction } from "@/app/actions/ticket-actions"

interface TicketReplyFormProps {
  ticketId: number
  currentStatus: string
}

export function TicketReplyForm({ ticketId, currentStatus }: TicketReplyFormProps) {
  const [reply, setReply] = useState("")
  const [targetStatus, setTargetStatus] = useState<string>(currentStatus)
  const [attachmentUrl, setAttachmentUrl] = useState("")
  const [attachments, setAttachments] = useState<string[]>([])
  const [showAttachmentsInput, setShowAttachmentsInput] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleAddAttachment = () => {
    if (attachmentUrl.trim()) {
      setAttachments((prev) => [...prev, attachmentUrl.trim()])
      setAttachmentUrl("")
    }
  }

  const handleRemoveAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (overrideStatus?: string) => {
    const finalStatus = overrideStatus || targetStatus || currentStatus
    if (!reply.trim()) {
      setErrorMessage("Please enter a reply message.")
      return
    }

    setIsSubmitting(true)
    setErrorMessage(null)
    setSuccessMessage(null)
    setDropdownOpen(false)

    try {
      const res = await submitTicketReplyAction({
        ticketId,
        reply,
        status: finalStatus,
        files: attachments,
      })

      if (res.success) {
        setSuccessMessage("Reply has been submitted successfully!")
        setReply("")
        setAttachments([])
        setShowAttachmentsInput(false)
        setTargetStatus(finalStatus)
        setTimeout(() => setSuccessMessage(null), 4000)
      } else {
        setErrorMessage(res.message || "Failed to submit reply.")
      }
    } catch (err) {
      setErrorMessage((err as Error).message || "An unexpected error occurred.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-slate-50/70 p-5 rounded-lg border border-slate-200">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit()
        }}
        className="space-y-3"
      >
        {/* Reply Message Box */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Reply to Ticket
          </label>
          <textarea
            required
            rows={4}
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Type your response to the customer or staff here..."
            className="w-full px-3.5 py-2.5 text-xs text-slate-800 bg-white border border-slate-300 rounded focus:outline-none focus:border-[#d43533] transition-colors resize-y placeholder:text-slate-400"
          />
        </div>

        {/* Attachment Toggle & Input */}
        <div>
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowAttachmentsInput(!showAttachmentsInput)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-[#d43533] transition-colors"
            >
              <Paperclip className="w-3.5 h-3.5" />
              {showAttachmentsInput ? "Hide Attachment Field" : "Attach File / URL"}
              {attachments.length > 0 && ` (${attachments.length} attached)`}
            </button>
          </div>

          {showAttachmentsInput && (
            <div className="mt-2 space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={attachmentUrl}
                  onChange={(e) => setAttachmentUrl(e.target.value)}
                  placeholder="Paste document/image link or file path..."
                  className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded bg-white focus:outline-none focus:border-[#d43533]"
                />
                <button
                  type="button"
                  onClick={handleAddAttachment}
                  className="px-3 py-1.5 text-xs font-semibold bg-slate-200 hover:bg-slate-300 text-slate-700 rounded transition-colors"
                >
                  Add
                </button>
              </div>

              {attachments.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {attachments.map((file, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] bg-white border border-slate-300 rounded text-slate-700 font-mono"
                    >
                      <Paperclip className="w-3 h-3 text-slate-400" />
                      <span className="max-w-[200px] truncate">{file}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveAttachment(idx)}
                        className="ml-1 text-slate-400 hover:text-red-500 font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Feedback Alerts */}
        {successMessage && (
          <div className="p-2.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-2.5 rounded bg-rose-50 border border-rose-200 text-rose-800 text-xs">
            {errorMessage}
          </div>
        )}

        {/* 1:1 Active eCommerce Split Button Submit Controls */}
        <div className="flex items-center justify-end pt-2">
          <div className="relative inline-flex rounded shadow-xs" ref={dropdownRef}>
            {/* Primary Action Button (btn-dark) */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-l border-r border-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  Submit as <strong className="capitalize">{targetStatus}</strong>
                </>
              )}
            </button>

            {/* Split Dropdown Trigger */}
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="px-2 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-r transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Change Submit Status"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {/* Dropdown Menu matching show.blade.php */}
            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded shadow-lg border border-slate-200 py-1 z-20 animate-in fade-in zoom-in-95 text-xs">
                <button
                  type="button"
                  onClick={() => handleSubmit("open")}
                  className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-between"
                >
                  <span>
                    Submit as <strong>Open</strong>
                  </span>
                  <span className="w-2 h-2 rounded-full bg-slate-500" />
                </button>

                <button
                  type="button"
                  onClick={() => handleSubmit("solved")}
                  className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-between"
                >
                  <span>
                    Submit as <strong>Solved</strong>
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </button>

                <button
                  type="button"
                  onClick={() => handleSubmit("pending")}
                  className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-between"
                >
                  <span>
                    Submit as <strong>Pending</strong>
                  </span>
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                </button>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}
