"use client"

import React, { useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Plus,
  Search,
  Trash2,
  ExternalLink,
  Layers,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"
import {
  toggleDynamicPopupStatusAction,
  deleteDynamicPopupAction,
} from "@/app/actions/ecommerce-actions"

interface DynamicPopupItem {
  id: number
  title: string
  summary: string
  banner: string
  btnText: string
  btnBackgroundColor: string
  btnTextColor: string
  btnLink: string
  status: boolean
  createdAt: Date
}

interface DynamicPopupsViewProps {
  initialPopups: DynamicPopupItem[]
}

export function DynamicPopupsView({ initialPopups }: DynamicPopupsViewProps) {
  const router = useRouter()
  const [popups, setPopups] = useState<DynamicPopupItem[]>(initialPopups)
  const [search, setSearch] = useState("")
  const [duration, setDuration] = useState("10")
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  const filteredPopups = popups.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.summary.toLowerCase().includes(search.toLowerCase())
  )

  const handleToggleStatus = (id: number, currentStatus: boolean) => {
    startTransition(async () => {
      const ok = await toggleDynamicPopupStatusAction(id, !currentStatus)
      if (ok) {
        setPopups((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, status: !currentStatus } : item
          )
        )
        setFeedback({ type: "success", text: "Popup status updated successfully" })
      } else {
        setFeedback({ type: "error", text: "Failed to update status" })
      }
      setTimeout(() => setFeedback(null), 3000)
    })
  }

  const handleDelete = (id: number) => {
    if (!confirm("Are you sure you want to delete this dynamic popup?")) return
    startTransition(async () => {
      const ok = await deleteDynamicPopupAction(id)
      if (ok) {
        setPopups((prev) => prev.filter((p) => p.id !== id))
        setFeedback({ type: "success", text: "Dynamic popup deleted successfully" })
      } else {
        setFeedback({ type: "error", text: "Failed to delete popup" })
      }
      setTimeout(() => setFeedback(null), 3000)
    })
  }

  const handleSaveDuration = (e: React.FormEvent) => {
    e.preventDefault()
    setFeedback({ type: "success", text: `Dynamic popup duration set to ${duration}s` })
    setTimeout(() => setFeedback(null), 3000)
  }

  return (
    <div className="space-y-6">
      {/* Title Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Layers className="h-6 w-6 text-[#d43533]" />
            Dynamic Popups
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Configure promotional lightbox modals and dynamic campaigns for visitors
          </p>
        </div>
        <Link
          href="/admin/marketing/dynamic-popups/create"
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#d43533] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#b02a28]"
        >
          <Plus className="h-4 w-4" />
          Create New Dynamic Popup
        </Link>
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

      {/* Settings Card: Duration */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs">
        <form onSubmit={handleSaveDuration} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-50 text-[#d43533] flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-900 block">
                Dynamic Popup Delay / Duration (seconds)
              </label>
              <p className="text-[11px] text-gray-500">
                Number of seconds before the dynamic popup is triggered for first-time visitors
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min="1"
              max="120"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-24 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-900 focus:border-[#d43533] focus:outline-hidden"
            />
            <button
              type="submit"
              className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition"
            >
              Update
            </button>
          </div>
        </form>
      </div>

      {/* Main Table Card */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-xs">
        <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100">
          <h2 className="text-sm font-bold text-gray-900">
            All Dynamic Popups ({popups.length})
          </h2>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search popups..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-gray-200 focus:outline-hidden focus:border-[#d43533]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/75 border-b border-gray-100 text-gray-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Banner</th>
                <th className="px-4 py-3">Title & Summary</th>
                <th className="px-4 py-3">Button / Link</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {filteredPopups.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400">
                    <Layers className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                    No dynamic popups configured yet.
                  </td>
                </tr>
              ) : (
                filteredPopups.map((popup) => (
                  <tr key={popup.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="h-12 w-20 rounded-md overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                        {popup.banner ? (
                          <img
                            src={popup.banner}
                            alt={popup.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-gray-400 text-[10px]">
                            No Banner
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      <div className="font-bold text-gray-900">{popup.title}</div>
                      <div className="text-[11px] text-gray-500 truncate mt-0.5">
                        {popup.summary}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span
                          className="px-2 py-0.5 rounded text-[10px] font-bold"
                          style={{
                            backgroundColor: popup.btnBackgroundColor || "#d43533",
                            color: popup.btnTextColor === "dark" ? "#111827" : "#ffffff",
                          }}
                        >
                          {popup.btnText}
                        </span>
                        <a
                          href={popup.btnLink}
                          target="_blank"
                          rel="noreferrer"
                          className="text-gray-400 hover:text-blue-600 transition"
                          title={popup.btnLink}
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(popup.id, popup.status)}
                        disabled={isPending}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                          popup.status ? "bg-emerald-500" : "bg-gray-200"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                            popup.status ? "translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleDelete(popup.id)}
                        disabled={isPending}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                        title="Delete popup"
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
  )
}
