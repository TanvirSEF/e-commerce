"use client"

import React, { useState } from "react"
import { HelpCircle, MessageSquare, Send, CheckCircle, X } from "lucide-react"
import { askProductQuestionAction } from "@/app/actions/ecommerce-actions"

interface ProductQATabProps {
  productSlug: string
  productName: string
}

interface QuestionItem {
  id: string
  userName: string
  question: string
  reply?: string
  repliedBy?: string
  date: string
}

const DEFAULT_FAQS: QuestionItem[] = [
  {
    id: "qa-1",
    userName: "Tariqul Islam",
    question: "Is this item 100% genuine and does it come with official warranty?",
    reply: "Yes, 100% original product with official brand manufacturer warranty and retail invoice.",
    repliedBy: "Active eCommerce Outlet",
    date: "2 days ago",
  },
  {
    id: "qa-2",
    userName: "Nafis Imtiaz",
    question: "How long does home delivery take inside Dhaka city?",
    reply: "Inside Dhaka deliveries arrive within 24 to 48 hours via express courier.",
    repliedBy: "Support Specialist",
    date: "5 days ago",
  },
]

export function ProductQATab({ productSlug, productName }: ProductQATabProps) {
  const [qaList, setQaList] = useState<QuestionItem[]>(DEFAULT_FAQS)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [userName, setUserName] = useState("")
  const [question, setQuestion] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!question.trim()) return

    setIsSubmitting(true)
    try {
      await askProductQuestionAction({
        productSlug,
        productName,
        userName: userName.trim() || "Customer",
        question: question.trim(),
      })

      const newQ: QuestionItem = {
        id: `qa-${Date.now()}`,
        userName: userName.trim() || "Customer",
        question: question.trim(),
        date: "Just now",
      }
      setQaList((prev) => [newQ, ...prev])
      setIsModalOpen(false)
      setQuestion("")
      setUserName("")
      setFeedback("Your question has been submitted! It will appear once reviewed.")
      setTimeout(() => setFeedback(""), 5000)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-50 border border-slate-200 rounded-md">
        <div>
          <h4 className="text-sm font-bold text-slate-800">
            Have questions about this product?
          </h4>
          <p className="text-xs text-slate-500">
            Get prompt answers directly from our product specialists or the verified seller.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#d43533] text-white rounded text-xs font-bold hover:bg-[#b82a28] shrink-0 transition-colors shadow-sm"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          Ask a Question
        </button>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Questions List */}
      <div className="divide-y divide-gray-100">
        {qaList.map((item) => (
          <div key={item.id} className="py-4 space-y-2">
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                Q
              </span>
              <div>
                <p className="font-semibold text-slate-800 text-xs">{item.question}</p>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Asked by <span className="font-medium text-slate-600">{item.userName}</span> • {item.date}
                </div>
              </div>
            </div>

            {item.reply ? (
              <div className="flex items-start gap-2 pl-4 border-l-2 border-emerald-300 ml-2.5 bg-emerald-50/50 p-2.5 rounded">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  A
                </span>
                <div>
                  <p className="text-xs text-slate-700 leading-relaxed">{item.reply}</p>
                  <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                    Answered by {item.repliedBy || "Store Representative"}
                  </div>
                </div>
              </div>
            ) : (
              <div className="pl-6 text-[11px] text-amber-600 italic">
                ⏳ Awaiting seller response...
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Ask Question Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-5 relative animate-in fade-in zoom-in-95">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold"
            >
              ✕
            </button>

            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-1">
              <HelpCircle className="w-4 h-4 text-[#d43533]" />
              Ask Question to Seller
            </h3>
            <p className="text-xs text-slate-500 mb-4 truncate">
              Product: <span className="font-semibold text-slate-700">{productName}</span>
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Tanvir Ahmed"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:border-[#d43533] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Your Question <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Ask about size, delivery, features, or specifications..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full text-xs p-3 border border-slate-300 rounded focus:border-[#d43533] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded text-xs text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#d43533] text-white rounded text-xs font-bold hover:bg-[#b82a28] disabled:opacity-50"
                >
                  <Send className="w-3 h-3" />
                  {isSubmitting ? "Submitting..." : "Submit Question"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
