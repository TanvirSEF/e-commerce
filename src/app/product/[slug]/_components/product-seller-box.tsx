"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Store, MessageSquare, X, Send, Loader2 } from "lucide-react"
import { startConversationAction } from "@/app/actions/ecommerce-actions"

interface ProductSellerBoxProps {
  sellerName?: string
  sellerSlug?: string
  productName?: string
  shopId?: number
}

export function ProductSellerBox({
  sellerName,
  sellerSlug,
  productName,
  shopId = 1,
}: ProductSellerBoxProps) {
  const router = useRouter()
  const [modalOpen, setModalOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  if (!sellerName) return null

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    setSubmitting(true)
    setErrorMsg("")

    try {
      const res = await startConversationAction({
        shopId,
        title: `Inquiry: ${productName || "Product"}`,
        initialMessage: message.trim(),
      })

      if ("requireLogin" in res && res.requireLogin) {
        router.push("/login")
        return
      }

      if (res.success) {
        setModalOpen(false)
        setMessage("")
        router.push("/dashboard/conversations")
      } else {
        setErrorMsg("Failed to start conversation. Please try again.")
      }
    } catch {
      setErrorMsg("An unexpected error occurred. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <div className="flex items-center justify-between rounded-md border border-gray-100 bg-gray-50 p-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-600 shadow-sm">
            <Store className="h-4 w-4 text-[#d43533]" />
          </div>
          <div>
            <div className="text-[10px] text-gray-400 uppercase">Sold by</div>
            <div className="font-bold text-gray-800">{sellerName}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="rounded border border-[#d43533] bg-red-50/50 px-2.5 py-1.5 text-xs font-semibold text-[#d43533] transition-colors hover:bg-[#d43533] hover:text-white"
          >
            Chat with Seller
          </button>
          <Link
            href={`/shop/${sellerSlug || "store"}`}
            className="rounded border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:border-[#d43533] hover:text-[#d43533]"
          >
            Visit Store
          </Link>
        </div>
      </div>

      {/* Quick Chat Modal (Active eCommerce CMS 1:1) */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
          <div className="relative w-full max-w-md rounded-lg bg-white shadow-xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-gray-100 p-4 bg-gray-50/60">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#d43533]" />
                <h3 className="text-sm font-bold text-gray-900">Message {sellerName}</h3>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendMessage} className="p-5 space-y-4">
              {errorMsg && (
                <div className="text-xs text-red-600 bg-red-50 p-2.5 rounded border border-red-200">
                  {errorMsg}
                </div>
              )}

              {productName && (
                <div className="text-xs text-gray-500 bg-gray-50 p-2.5 rounded border border-gray-100">
                  Regarding: <span className="font-semibold text-gray-800">{productName}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Your Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  required
                  placeholder={`Hi ${sellerName}, I have a question about this product...`}
                  className="w-full rounded border border-gray-300 p-3 text-xs text-gray-800 placeholder-gray-400 focus:border-[#d43533] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  disabled={submitting}
                  className="rounded border border-gray-300 px-4 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-1.5 rounded bg-[#d43533] px-4 py-1.5 text-xs font-bold text-white hover:bg-[#b82a28] disabled:opacity-60 transition-colors shadow-2xs"
                >
                  {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  {submitting ? "Sending..." : "Send Message"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
