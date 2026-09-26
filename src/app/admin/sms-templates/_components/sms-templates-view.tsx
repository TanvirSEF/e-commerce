"use client"

import React, { useState, useTransition } from "react"
import {
  FileText,
  Save,
  CheckCircle2,
  AlertCircle,
  Tag,
} from "lucide-react"
import { updateSmsTemplateAction } from "@/app/actions/ecommerce-actions"
import type { SmsTemplate } from "@/db/schema"

interface SmsTemplatesViewProps {
  initialTemplates: SmsTemplate[]
}

export function SmsTemplatesView({ initialTemplates }: SmsTemplatesViewProps) {
  const [templates, setTemplates] = useState<SmsTemplate[]>(initialTemplates)
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleBodyChange = (id: number, val: string) => {
    setTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, body: val } : t))
    )
  }

  const handleToggleStatus = (id: number, current: boolean) => {
    setTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: !current } : t))
    )
  }

  const handleInsertTag = (id: number, tag: string) => {
    setTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, body: `${t.body} ${tag}` } : t))
    )
  }

  const handleSave = (template: SmsTemplate) => {
    startTransition(async () => {
      const res = await updateSmsTemplateAction(template.id, {
        body: template.body,
        status: template.status,
      })
      if (res.success) {
        setFeedback({ type: "success", text: `"${template.title}" template updated!` })
      } else {
        setFeedback({ type: "error", text: "Failed to update template" })
      }
      setTimeout(() => setFeedback(null), 3000)
    })
  }

  return (
    <div className="space-y-6">
      {/* Title Bar */}
      <div>
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <FileText className="h-6 w-6 text-[#d43533]" />
          SMS Notification Templates
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Customize automated SMS messages dispatched to customers on order progress, dispatch, and OTP verification
        </p>
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

      {/* Templates List */}
      <div className="space-y-4">
        {templates.map((tpl) => (
          <div
            key={tpl.id}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs space-y-4"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-bold text-sm text-gray-900">{tpl.title}</h3>
                <span className="text-[10px] text-gray-400 font-mono">
                  Trigger Identifier: {tpl.identifier}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500">
                  {tpl.status ? "Active (Sends SMS)" : "Disabled"}
                </span>
                <button
                  type="button"
                  onClick={() => handleToggleStatus(tpl.id, tpl.status)}
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
              </div>
            </div>

            {/* Variable Pills */}
            <div>
              <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                Insertable Placeholders:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(tpl.variables || []).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => handleInsertTag(tpl.id, v)}
                    className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-mono font-medium text-gray-700 hover:bg-red-50 hover:text-[#d43533] transition"
                  >
                    <Tag className="w-2.5 h-2.5 text-gray-400" />
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* Template Body */}
            <div>
              <textarea
                rows={3}
                value={tpl.body}
                onChange={(e) => handleBodyChange(tpl.id, e.target.value)}
                className="w-full rounded-lg border border-gray-200 p-3 text-xs text-gray-800 focus:border-[#d43533] focus:outline-hidden leading-relaxed"
              />
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => handleSave(tpl)}
                disabled={isPending}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#d43533] px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#b02a28] transition"
              >
                <Save className="w-3.5 h-3.5" />
                Update Template
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
