"use client"

import React, { useState, useTransition } from "react"
import Link from "next/link"
import {
  Languages,
  ArrowLeft,
  Search,
  Save,
  Copy,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"
import { saveTranslationsAction } from "@/app/actions/ecommerce-actions"
import type { Language } from "@/db/schema"

interface TranslationsViewProps {
  language: Language
  initialTranslations: { key: string; value: string }[]
}

export function TranslationsView({ language, initialTranslations }: TranslationsViewProps) {
  const [translations, setTranslations] = useState<{ key: string; value: string }[]>(initialTranslations)
  const [search, setSearch] = useState("")
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleValueChange = (key: string, val: string) => {
    setTranslations((prev) =>
      prev.map((item) => (item.key === key ? { ...item, value: val } : item))
    )
  }

  const handleCopyKeys = () => {
    setTranslations((prev) =>
      prev.map((item) => ({ ...item, value: item.value || item.key }))
    )
    setFeedback({ type: "success", text: "Keys copied into empty translation values" })
    setTimeout(() => setFeedback(null), 3000)
  }

  const handleSave = () => {
    startTransition(async () => {
      const payload: Record<string, string> = {}
      for (const item of translations) {
        payload[item.key] = item.value
      }
      const ok = await saveTranslationsAction(language.code, payload)
      if (ok) {
        setFeedback({ type: "success", text: `Translations saved for ${language.name}` })
      } else {
        setFeedback({ type: "error", text: "Failed to save translations" })
      }
      setTimeout(() => setFeedback(null), 3000)
    })
  }

  const filtered = translations.filter(
    (t) =>
      t.key.toLowerCase().includes(search.toLowerCase()) ||
      t.value.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/languages"
            className="p-2 rounded-lg border border-gray-200 bg-white text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Languages className="w-5 h-5 text-[#d43533]" />
              Translations: {language.name} ({language.code.toUpperCase()})
            </h1>
            <p className="text-xs text-gray-500">Localize user interface string keys for this language</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyKeys}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 shadow-xs"
          >
            <Copy className="w-3.5 h-3.5 text-gray-500" />
            Copy Keys
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#d43533] px-4 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#b82a28] transition-colors disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            {isPending ? "Saving..." : "Save Translations"}
          </button>
        </div>
      </div>

      {/* Feedback Toast */}
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

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search string keys or existing translations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-gray-200 bg-white focus:border-[#d43533] focus:outline-hidden"
        />
      </div>

      {/* Strings Table */}
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-xs">
        <div className="border-b border-gray-200 px-5 py-3 bg-gray-50/50 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-700">UI Dictionary</span>
          <span className="text-xs font-mono text-gray-400">{filtered.length} terms</span>
        </div>
        <div className="divide-y divide-gray-100">
          {filtered.map((item, idx) => (
            <div key={item.key} className="p-4 flex flex-col md:flex-row md:items-center gap-3 hover:bg-gray-50/40">
              <div className="md:w-1/2">
                <span className="text-xs font-mono text-gray-400 mr-2">#{idx + 1}</span>
                <span className="text-xs font-semibold text-gray-800">{item.key}</span>
              </div>
              <div className="md:w-1/2">
                <input
                  type="text"
                  placeholder={`Translate "${item.key}"`}
                  value={item.value}
                  onChange={(e) => handleValueChange(item.key, e.target.value)}
                  dir={language.rtl ? "rtl" : "ltr"}
                  className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-900 focus:border-[#d43533] focus:outline-hidden"
                />
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="p-8 text-center text-xs text-gray-400">
              No translation keys match your search term.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
