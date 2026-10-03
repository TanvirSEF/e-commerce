"use client"

import React, { useState } from "react"
import Image from "next/image"
import { X, Loader2 } from "lucide-react"
import { replySellerProductQueryAction } from "@/app/actions/seller-actions"
import type { SellerProductQueryRow } from "@/services/seller-panel-service"

interface SellerQueryReplyModalProps {
  query: SellerProductQueryRow
  onClose: () => void
  onSuccess: (updatedReply: string) => void
}

export function SellerQueryReplyModal({
  query,
  onClose,
  onSuccess,
}: SellerQueryReplyModalProps) {
  const [replyText, setReplyText] = useState(query.reply || "")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyText.trim()) return

    setIsSubmitting(true)
    setErrorMessage("")

    const res = await replySellerProductQueryAction(query.id, replyText.trim())
    setIsSubmitting(false)

    if (res.success) {
      onSuccess(replyText.trim())
      onClose()
    } else {
      setErrorMessage(res.error || "Failed to submit reply.")
    }
  }

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString)
      return d.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    } catch {
      return isoString
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-sm border border-gray-200 shadow-xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="card-header px-4 py-3 border-b border-gray-200 flex items-center justify-between bg-white">
          <h5 className="text-sm font-semibold text-gray-800 line-clamp-1">
            {query.productName}
          </h5>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content matching show.blade.php */}
        <div className="p-4 md:p-5 space-y-4 text-xs">
          {/* Customer & Question */}
          <div className="border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 relative rounded-full overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                <Image
                  src={query.userAvatar || "/assets/img/avatar-placeholder.png"}
                  alt={query.userName}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h6 className="font-semibold text-gray-900 leading-none">{query.userName}</h6>
                <span className="text-[11px] text-gray-400">{formatDate(query.createdAt)}</span>
              </div>
            </div>
            <p className="text-gray-700 bg-gray-50/70 p-3 rounded border border-gray-200 leading-relaxed">
              {query.question}
            </p>
          </div>

          {errorMessage && (
            <div className="p-2.5 text-xs text-red-700 bg-red-50 border border-red-200 rounded">
              {errorMessage}
            </div>
          )}

          {/* Reply Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Your Reply <span className="text-[#d43533]">*</span>
              </label>
              <textarea
                rows={4}
                required
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your reply"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:border-[#d43533] focus:outline-none text-xs text-gray-800"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#d43533] hover:bg-[#b82a28] text-white rounded text-xs font-medium transition-colors"
              >
                {isSubmitting && <Loader2 className="w-3 h-3 animate-spin" />}
                {query.reply ? "Update" : "Send"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
