"use client"

import React, { useState } from "react"
import Link from "next/link"
import {
  Mail,
  Search,
  Trash2,
  Send,
  Plus,
  Download,
  CheckCircle,
} from "lucide-react"
import {
  addSubscriberAction,
  deleteSubscriberAction,
} from "@/app/actions/ecommerce-actions"
import type { SubscriberItem } from "@/services/marketing-service"

interface SubscribersAdminViewProps {
  initialSubscribers: SubscriberItem[]
}

export function SubscribersAdminView({
  initialSubscribers,
}: SubscribersAdminViewProps) {
  const [subscribers, setSubscribers] = useState<SubscriberItem[]>(initialSubscribers)
  const [search, setSearch] = useState("")
  const [newEmail, setNewEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState("")

  const filtered = subscribers.filter((s) =>
    s.email.toLowerCase().includes(search.toLowerCase())
  )

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newEmail.trim()) return

    setIsSubmitting(true)
    try {
      await addSubscriberAction(newEmail.trim())
      const newItem: SubscriberItem = {
        id: Date.now(),
        email: newEmail.trim(),
        date: new Date().toISOString().slice(0, 10),
      }
      setSubscribers((prev) => [newItem, ...prev])
      setNewEmail("")
      setFeedback("Subscriber added successfully!")
      setTimeout(() => setFeedback(""), 3000)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to remove this email subscriber?")) return
    await deleteSubscriberAction(id)
    setSubscribers((prev) => prev.filter((s) => s.id !== id))
  }

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8,ID,Email,Date\n" +
      subscribers.map((s) => `${s.id},${s.email},${s.date}`).join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `subscribers_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Mail className="w-5 h-5 text-[#d43533]" />
            Newsletter Subscribers
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage subscriber email list, export customer newsletter leads, and broadcast promotions
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 border border-slate-300 text-slate-700 bg-white rounded text-xs font-semibold hover:bg-slate-50"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <Link
            href="/admin/newsletter"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#d43533] text-white rounded text-xs font-bold hover:bg-[#b82a28]"
          >
            <Send className="w-4 h-4" />
            Compose Newsletter
          </Link>
        </div>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table List (2 Cols) */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h2 className="text-sm font-bold text-slate-900">
                All Subscribers ({subscribers.length})
              </h2>
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search subscriber email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full text-xs pl-8 pr-3 py-1.5 border border-slate-200 rounded focus:border-[#d43533] focus:outline-none"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3 w-12">#</th>
                    <th className="px-5 py-3">Email Address</th>
                    <th className="px-5 py-3">Date Subscribed</th>
                    <th className="px-5 py-3 text-right">Options</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-5 py-8 text-center text-xs text-slate-400">
                        No subscribers found.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-slate-50/50">
                        <td className="px-5 py-3.5 text-slate-400 font-medium">{idx + 1}</td>
                        <td className="px-5 py-3.5 font-bold text-slate-800">
                          {item.email}
                        </td>
                        <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">
                          {item.date}
                        </td>
                        <td className="px-5 py-3.5 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 rounded text-red-600 hover:text-red-700 hover:bg-red-50"
                            title="Remove Subscriber"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Add Subscriber Card (1 Col) */}
        <div>
          <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden sticky top-6">
            <div className="p-4 border-b border-slate-100 bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#d43533]" />
                Add New Subscriber
              </h3>
            </div>

            <form onSubmit={handleAdd} className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. subscriber@domain.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded focus:border-[#d43533] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-[#d43533] text-white rounded text-xs font-bold hover:bg-[#b82a28] transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Adding..." : "Add to List"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
