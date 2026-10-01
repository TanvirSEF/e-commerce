"use client"

import React, { useState, useTransition } from "react"
import { Save, CheckCircle2, AlertCircle, Tag } from "lucide-react"
import type { SmsTemplateItem } from "@/types/otp-sms"
import { updateSmsTemplateAction } from "@/app/actions/otp-sms-actions"

interface Props {
  initialTemplates: SmsTemplateItem[]
}

export function SmsTemplatesView({ initialTemplates }: Props) {
  const [templates, setTemplates] = useState<SmsTemplateItem[]>(initialTemplates)
  const [feedback, setFeedback] = useState<{
    type: "success" | "error"
    text: string
  } | null>(null)
  const [savingId, setSavingId] = useState<number | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleBodyChange = (id: number, val: string) => {
    setTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, body: val } : t))
    )
  }

  const handleToggleStatus = (id: number) => {
    setTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: !t.status } : t))
    )
  }

  const handleInsertTag = (id: number, tag: string) => {
    setTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, body: `${t.body} ${tag}` } : t))
    )
  }

  const handleSave = (template: SmsTemplateItem) => {
    setSavingId(template.id)
    startTransition(async () => {
      try {
        await updateSmsTemplateAction(template.id, {
          body: template.body,
          status: template.status,
        })
        setFeedback({
          type: "success",
          text: `"${template.title}" template updated successfully!`,
        })
      } catch {
        setFeedback({
          type: "error",
          text: `Failed to update template "${template.title}".`,
        })
      } finally {
        setSavingId(null)
      }
      setTimeout(() => setFeedback(null), 3000)
    })
  }

  return (
    <div className="space-y-4">
      {/* 1:1 Active eCommerce Titlebar */}
      <div>
        <h1 className="text-xl font-bold text-gray-800">SMS Templates</h1>
      </div>

      {feedback && (
        <div
          className={`flex items-center gap-2 p-3 text-xs rounded border transition-all ${
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

      {/* Card container matching backend/otp_systems/sms/templates.blade.php */}
      <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h5 className="text-sm font-semibold text-gray-800">All SMS Templates</h5>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-semibold border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 w-12">#</th>
                <th className="px-4 py-3 w-56">Template Name</th>
                <th className="px-4 py-3">SMS Body</th>
                <th className="px-4 py-3 w-28">Status</th>
                <th className="px-4 py-3 text-right w-24">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {templates.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                    No SMS templates found.
                  </td>
                </tr>
              ) : (
                templates.map((tmpl, idx) => (
                  <tr key={tmpl.id} className="hover:bg-gray-50/50 align-top">
                    <td className="px-4 py-4 text-gray-400 font-medium">{idx + 1}</td>
                    <td className="px-4 py-4">
                      <p className="font-semibold text-gray-800">{tmpl.title}</p>
                      <span className="text-[10px] font-mono text-gray-400">{tmpl.identifier}</span>
                    </td>
                    <td className="px-4 py-4 space-y-2">
                      <textarea
                        rows={2}
                        value={tmpl.body}
                        onChange={(e) => handleBodyChange(tmpl.id, e.target.value)}
                        className="w-full text-xs border border-gray-300 rounded p-2 focus:outline-none focus:border-blue-400"
                      />
                      {tmpl.variables && tmpl.variables.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                            <Tag className="w-3 h-3" /> Placeholders:
                          </span>
                          {tmpl.variables.map((tag) => (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => handleInsertTag(tmpl.id, tag)}
                              className="px-1.5 py-0.5 text-[10px] bg-gray-100 hover:bg-gray-200 rounded font-mono text-gray-700 transition-colors"
                              title={`Click to append ${tag}`}
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={tmpl.status}
                          onChange={() => handleToggleStatus(tmpl.id)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-[#28a745] after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border after:border-gray-300 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
                      </label>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleSave(tmpl)}
                        disabled={isPending && savingId === tmpl.id}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-[#1d3557] hover:bg-[#16304d] text-white rounded disabled:opacity-60 transition-colors"
                      >
                        <Save className="w-3 h-3" />
                        <span>{savingId === tmpl.id ? "Saving..." : "Save"}</span>
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
