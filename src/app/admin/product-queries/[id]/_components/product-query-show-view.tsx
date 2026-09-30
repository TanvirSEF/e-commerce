"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react"
import { replyProductQueryAction } from "@/app/actions/product-query-actions"
import type { ProductQueryItem } from "@/services/product-query-service"

interface ProductQueryShowViewProps {
  query: ProductQueryItem
}

export function ProductQueryShowView({ query: initialQuery }: ProductQueryShowViewProps) {
  const [query, setQuery] = useState<ProductQueryItem>(initialQuery)
  const [replyText, setReplyText] = useState(initialQuery.reply || "")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [notification, setNotification] = useState<{
    type: "success" | "danger"
    message: string
  } | null>(null)

  const showNotification = (type: "success" | "danger", message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 3000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyText.trim()) return

    setIsSubmitting(true)
    try {
      const ok = await replyProductQueryAction({
        id: query.id,
        reply: replyText.trim(),
        repliedBy: "Super Admin",
      })

      if (ok) {
        setQuery((prev) => ({
          ...prev,
          reply: replyText.trim(),
          status: "approved",
        }))
        showNotification("success", "Replied successfully!")
      } else {
        showNotification("danger", "Failed to submit reply")
      }
    } catch {
      showNotification("danger", "Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Toast Alert */}
      {notification && (
        <div
          className={`fixed top-5 right-5 z-[1060] flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-sm font-semibold animate-in fade-in slide-in-from-top-3 ${
            notification.type === "success"
              ? "bg-emerald-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Back & Breadcrumb */}
      <div className="flex items-center gap-2 pb-1">
        <Link
          href="/admin/product-queries"
          className="p-1.5 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <span className="text-sm font-medium text-slate-500">Back to Product Queries</span>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        {/* Card Header (Product Name) */}
        <div className="px-6 py-4 border-b border-slate-100 bg-white">
          <h5 className="text-base font-bold text-slate-800 tracking-tight">
            {query.productName || "Product Not Found"}
          </h5>
        </div>

        {/* Card Body */}
        <div className="p-6 space-y-6">
          {/* Customer Question Thread */}
          <div className="border-b border-slate-100 pb-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 overflow-hidden relative shrink-0">
                <Image
                  src={query.userAvatar || "/assets/img/avatar-placeholder.png"}
                  alt={query.userName}
                  fill
                  sizes="36px"
                  className="object-cover"
                />
              </div>
              <div>
                <h6 className="text-xs font-bold text-slate-900 leading-tight">
                  {query.userName || "Customer Not Found"}
                </h6>
                <p className="text-[11px] text-slate-400 mt-0.5">{query.date}</p>
              </div>
            </div>

            <p className="text-sm font-bold text-slate-800 leading-relaxed pl-12">
              {query.question}
            </p>
          </div>

          {/* Reply Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Reply to Customer
              </label>
              <textarea
                rows={4}
                required
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your reply"
                className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-cyan-600 font-medium text-slate-800"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting || !replyText.trim()}
                className="px-6 py-2 text-xs font-bold text-white rounded bg-cyan-600 hover:bg-cyan-700 transition-colors shadow-xs disabled:opacity-50"
              >
                {isSubmitting
                  ? "Saving..."
                  : query.reply
                  ? "Update"
                  : "Send"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
