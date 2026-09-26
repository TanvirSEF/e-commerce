"use client"

import React, { useState, useTransition } from "react"
import Link from "next/link"
import { Mail, Search, Edit, CheckCircle2, AlertCircle } from "lucide-react"
import { toggleEmailTemplateStatusAction } from "@/app/actions/ecommerce-actions"
import type { EmailTemplate } from "@/db/schema"

interface EmailTemplatesViewProps {
  initialTemplates: EmailTemplate[]
}

const TABS = [
  { id: "all", label: "All Email Templates" },
  { id: "admin", label: "Admin Email Templates" },
  { id: "seller", label: "Seller Email Templates" },
  { id: "customer", label: "Customer Email Templates" },
  { id: "common", label: "Common Email Templates" },
]

export function EmailTemplatesView({ initialTemplates }: EmailTemplatesViewProps) {
  const [templates, setTemplates] = useState<EmailTemplate[]>(initialTemplates)
  const [activeTab, setActiveTab] = useState("all")
  const [search, setSearch] = useState("")
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleToggle = (id: number, current: boolean) => {
    startTransition(async () => {
      const ok = await toggleEmailTemplateStatusAction(id, !current)
      if (ok) {
        setTemplates((prev) => prev.map((t) => (t.id === id ? { ...t, status: !current } : t)))
        setFeedback({ type: "success", text: "Email template status updated" })
      } else {
        setFeedback({ type: "error", text: "Failed to update status" })
      }
      setTimeout(() => setFeedback(null), 3000)
    })
  }

  const filtered = templates.filter((t) => {
    const matchTab =
      activeTab === "all" ||
      t.receiver === activeTab ||
      (activeTab === "common" && t.receiver === "all")
    const matchSearch =
      t.emailType.toLowerCase().includes(search.toLowerCase()) ||
      t.subject.toLowerCase().includes(search.toLowerCase())
    return matchTab && matchSearch
  })

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Mail className="w-5 h-5 text-[#d43533]" />
          All Email Templates
        </h1>
        <p className="text-xs text-gray-500">Configure transactional email notifications, subjects, and automated layouts</p>
      </div>

      {feedback && (
        <div
          className={`flex items-center gap-2 p-3 text-xs rounded-lg border ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Main Card with Tabs */}
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-xs">
        {/* Nav Tabs */}
        <div className="flex border-b border-gray-200 px-4 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-[#d43533] text-[#d43533]"
                  : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Filter Input */}
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search Emails by type or subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-gray-200 bg-white focus:border-[#d43533] focus:outline-hidden"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50 text-gray-700 uppercase font-semibold border-b border-gray-200">
              <tr>
                <th className="py-3 px-4 w-12">#</th>
                <th className="py-3 px-4">Email Type</th>
                <th className="py-3 px-4">Target Receiver</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Edit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((tpl, idx) => (
                <tr key={tpl.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="py-3 px-4 font-mono text-gray-400">{idx + 1}</td>
                  <td className="py-3 px-4 font-semibold text-gray-900">{tpl.emailType}</td>
                  <td className="py-3 px-4">
                    <span className="capitalize font-medium text-gray-700 bg-gray-100 px-2 py-0.5 rounded text-[11px]">
                      {tpl.receiver}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600 max-w-xs truncate">{tpl.subject}</td>
                  <td className="py-3 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => handleToggle(tpl.id, tpl.status)}
                      disabled={isPending}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                        tpl.status ? "bg-emerald-500" : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                          tpl.status ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      href={`/admin/email-templates/${tpl.id}/edit`}
                      className="inline-flex p-1.5 rounded-md text-amber-600 hover:bg-amber-50 transition-colors"
                      title="Edit Template"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs text-gray-400">
                    No email templates found in this section.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
