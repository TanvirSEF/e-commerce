"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Send, CheckCircle, Mail, Users, ArrowLeft, RefreshCw } from "lucide-react"
import { sendNewsletterAction } from "@/app/actions/ecommerce-actions"

interface UserOption {
  id: string
  email: string
  name?: string
}

interface SubscriberOption {
  id: string
  email: string
}

interface NewsletterComposerViewProps {
  users: UserOption[]
  subscribers: SubscriberOption[]
}

export function NewsletterComposerView({
  users,
  subscribers,
}: NewsletterComposerViewProps) {
  const [selectedUserEmails, setSelectedUserEmails] = useState<string[]>([])
  const [selectedSubscriberEmails, setSelectedSubscriberEmails] = useState<string[]>([])
  const [subject, setSubject] = useState("")
  const [content, setContent] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [sentResult, setSentResult] = useState<{ count: number; date: string } | null>(null)

  const handleSelectAllUsers = () => {
    setSelectedUserEmails(users.map((u) => u.email))
  }
  const handleDeselectAllUsers = () => {
    setSelectedUserEmails([])
  }

  const handleSelectAllSubscribers = () => {
    setSelectedSubscriberEmails(subscribers.map((s) => s.email))
  }
  const handleDeselectAllSubscribers = () => {
    setSelectedSubscriberEmails([])
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!subject.trim() || !content.trim()) return

    const totalRecipients = Array.from(
      new Set([...selectedUserEmails, ...selectedSubscriberEmails])
    )

    if (totalRecipients.length === 0) {
      alert("Please select at least one recipient user or subscriber.")
      return
    }

    setIsSending(true)
    try {
      const res = await sendNewsletterAction({
        subject: subject.trim(),
        content: content.trim(),
        audience: `custom_${totalRecipients.length}`,
      })

      if (res.success) {
        setSentResult({
          count: totalRecipients.length,
          date: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        })
        setSubject("")
        setContent("")
      }
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Send className="w-5 h-5 text-[#d43533]" />
            Send Newsletter
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Broadcast promotional newsletters to your subscriber list and registered users
          </p>
        </div>

        <Link
          href="/admin/subscribers"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-300 rounded px-3 py-2 bg-white hover:bg-slate-50"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Manage Subscribers
        </Link>
      </div>

      {sentResult && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold">Campaign dispatched successfully!</span> Broadcast transmitted to{" "}
              <strong>{sentResult.count} recipient(s)</strong> at {sentResult.date}.
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSentResult(null)}
            className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      <form onSubmit={handleSend} className="bg-white border border-slate-200 rounded-xl shadow-xs p-6 space-y-5">
        {/* Emails (Users) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Emails (Users) ({selectedUserEmails.length}/{users.length} Selected)
            </label>
            <div className="space-x-2 text-xs">
              <button
                type="button"
                onClick={handleSelectAllUsers}
                className="text-blue-600 hover:underline font-semibold cursor-pointer"
              >
                Select All
              </button>
              <span className="text-slate-300">|</span>
              <button
                type="button"
                onClick={handleDeselectAllUsers}
                className="text-slate-500 hover:underline cursor-pointer"
              >
                Deselect All
              </button>
            </div>
          </div>
          <div className="border border-slate-200 rounded-lg p-2.5 max-h-32 overflow-y-auto space-y-1 bg-slate-50/50">
            {users.length === 0 ? (
              <p className="text-xs text-slate-400 py-1 text-center">No users found</p>
            ) : (
              users.map((u) => (
                <label key={u.id} className="flex items-center gap-2 p-1 hover:bg-white rounded cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={selectedUserEmails.includes(u.email)}
                    onChange={() =>
                      setSelectedUserEmails((prev) =>
                        prev.includes(u.email) ? prev.filter((em) => em !== u.email) : [...prev, u.email]
                      )
                    }
                    className="w-3.5 h-3.5 text-[#d43533] rounded border-slate-300"
                  />
                  <span className="font-medium text-slate-800">{u.name || u.email}</span>
                  <span className="text-slate-400">({u.email})</span>
                </label>
              ))
            )}
          </div>
        </div>

        {/* Emails (Subscribers) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Emails (Subscribers) ({selectedSubscriberEmails.length}/{subscribers.length} Selected)
            </label>
            <div className="space-x-2 text-xs">
              <button
                type="button"
                onClick={handleSelectAllSubscribers}
                className="text-blue-600 hover:underline font-semibold cursor-pointer"
              >
                Select All
              </button>
              <span className="text-slate-300">|</span>
              <button
                type="button"
                onClick={handleDeselectAllSubscribers}
                className="text-slate-500 hover:underline cursor-pointer"
              >
                Deselect All
              </button>
            </div>
          </div>
          <div className="border border-slate-200 rounded-lg p-2.5 max-h-32 overflow-y-auto space-y-1 bg-slate-50/50">
            {subscribers.length === 0 ? (
              <p className="text-xs text-slate-400 py-1 text-center">No subscribers found</p>
            ) : (
              subscribers.map((s) => (
                <label key={s.id} className="flex items-center gap-2 p-1 hover:bg-white rounded cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={selectedSubscriberEmails.includes(s.email)}
                    onChange={() =>
                      setSelectedSubscriberEmails((prev) =>
                        prev.includes(s.email) ? prev.filter((em) => em !== s.email) : [...prev, s.email]
                      )
                    }
                    className="w-3.5 h-3.5 text-[#d43533] rounded border-slate-300"
                  />
                  <span className="text-slate-800">{s.email}</span>
                </label>
              ))
            )}
          </div>
        </div>

        {/* Subject */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Newsletter Subject <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Exclusive Weekend Sale & New Arrivals!"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:border-[#d43533] focus:outline-none"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Newsletter Content <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            rows={7}
            placeholder="Write your email body copy..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:border-[#d43533] focus:outline-none font-mono"
          />
        </div>

        <div className="pt-2 text-right">
          <button
            type="submit"
            disabled={isSending}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#d43533] hover:bg-[#b82a28] text-white rounded-lg text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
          >
            {isSending ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Broadcasting...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Send Newsletter</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
