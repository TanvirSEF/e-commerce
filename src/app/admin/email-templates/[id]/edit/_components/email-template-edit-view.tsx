"use client"

import React, { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Mail, ArrowLeft, Save, Tag, AlertCircle } from "lucide-react"
import { updateEmailTemplateAction } from "@/app/actions/ecommerce-actions"
import type { EmailTemplate } from "@/db/schema"

interface EmailTemplateEditViewProps {
  template: EmailTemplate
}

const VARIABLE_TAGS = [
  "[[customer_name]]",
  "[[order_code]]",
  "[[order_amount]]",
  "[[site_name]]",
  "[[order_tracking_link]]",
  "[[payment_method]]",
  "[[seller_name]]",
  "[[reset_password_link]]",
]

export function EmailTemplateEditView({ template }: EmailTemplateEditViewProps) {
  const router = useRouter()
  const [subject, setSubject] = useState(template.subject)
  const [defaultText, setDefaultText] = useState(template.defaultText)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleInsertTag = (tag: string) => {
    setDefaultText((prev) => `${prev} ${tag}`)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!subject.trim() || !defaultText.trim()) {
      setError("Subject and template body are required")
      return
    }

    startTransition(async () => {
      try {
        await updateEmailTemplateAction(template.id, {
          subject: subject.trim(),
          defaultText: defaultText.trim(),
        })
        router.push("/admin/email-templates")
        router.refresh()
      } catch (err) {
        setError("Failed to update email template")
      }
    })
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/email-templates"
          className="p-2 rounded-lg border border-gray-200 bg-white text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Mail className="w-5 h-5 text-[#d43533]" />
            Edit Template: {template.emailType}
          </h1>
          <p className="text-xs text-gray-500">Target audience: {template.receiver}</p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 text-xs rounded-lg border bg-red-50 text-red-800 border-red-200">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs space-y-5">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Email Subject <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3.5 py-2 text-xs text-gray-900 focus:border-[#d43533] focus:outline-hidden"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-gray-700">
              Email Body (Plain text / HTML) <span className="text-red-500">*</span>
            </label>
            <span className="text-[11px] text-gray-400">
              Click variable pills to insert
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-2.5 p-2.5 bg-gray-50 rounded-lg border border-gray-100">
            {VARIABLE_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleInsertTag(tag)}
                className="inline-flex items-center gap-1 text-[11px] font-mono bg-white hover:bg-sky-50 text-sky-700 border border-gray-200 rounded px-2 py-0.5 cursor-pointer shadow-2xs"
              >
                <Tag className="w-2.5 h-2.5" />
                {tag}
              </button>
            ))}
          </div>

          <textarea
            required
            rows={8}
            value={defaultText}
            onChange={(e) => setDefaultText(e.target.value)}
            className="w-full rounded-lg border border-gray-200 p-3 text-xs text-gray-900 font-mono focus:border-[#d43533] focus:outline-hidden leading-relaxed"
          />
        </div>

        <div className="pt-2 flex items-center justify-end gap-3">
          <Link
            href="/admin/email-templates"
            className="px-4 py-2 text-xs font-medium text-gray-600 hover:text-gray-900"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#d43533] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#b82a28] transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isPending ? "Saving..." : "Save Template"}
          </button>
        </div>
      </form>
    </div>
  )
}
