"use client"

import React, { useState, useTransition } from "react"
import Link from "next/link"
import {
  Globe,
  Plus,
  Edit,
  Languages,
  Info,
  CheckCircle2,
  AlertCircle,
  Check,
} from "lucide-react"
import {
  toggleLanguageStatusAction,
  toggleLanguageRtlAction,
  setDefaultLanguageAction,
} from "@/app/actions/ecommerce-actions"
import type { Language } from "@/db/schema"

interface LanguagesViewProps {
  initialLanguages: Language[]
}

export function LanguagesView({ initialLanguages }: LanguagesViewProps) {
  const [langs, setLangs] = useState<Language[]>(initialLanguages)
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleToggleStatus = (id: number, current: boolean) => {
    startTransition(async () => {
      const ok = await toggleLanguageStatusAction(id, !current)
      if (ok) {
        setLangs((prev) => prev.map((l) => (l.id === id ? { ...l, status: !current } : l)))
        setFeedback({ type: "success", text: "Language status updated successfully" })
      } else {
        setFeedback({ type: "error", text: "Failed to update status" })
      }
      setTimeout(() => setFeedback(null), 3000)
    })
  }

  const handleToggleRtl = (id: number, current: boolean) => {
    startTransition(async () => {
      const ok = await toggleLanguageRtlAction(id, !current)
      if (ok) {
        setLangs((prev) => prev.map((l) => (l.id === id ? { ...l, rtl: !current } : l)))
        setFeedback({ type: "success", text: "Language RTL direction updated" })
      } else {
        setFeedback({ type: "error", text: "Failed to update RTL direction" })
      }
      setTimeout(() => setFeedback(null), 3000)
    })
  }

  const handleSetDefault = (id: number) => {
    startTransition(async () => {
      const ok = await setDefaultLanguageAction(id)
      if (ok) {
        setLangs((prev) => prev.map((l) => ({ ...l, isDefault: l.id === id })))
        setFeedback({ type: "success", text: "System default language updated" })
      } else {
        setFeedback({ type: "error", text: "Failed to update default language" })
      }
      setTimeout(() => setFeedback(null), 3000)
    })
  }

  return (
    <div className="space-y-6">
      {/* Instructions & Help Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-sky-200 bg-sky-50/70 p-4 text-xs text-sky-950 space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-sky-800 text-sm">
            <Info className="w-4 h-4 text-sky-600" />
            Language Settings Instructions
          </div>
          <ul className="list-disc list-inside space-y-1 text-sky-900 leading-relaxed">
            <li>Click <strong>Add New Language</strong> to create a new language pack.</li>
            <li>Enter the <strong>Language Name</strong>, <strong>Code</strong> (e.g. en, bn, ar), and Flutter App Code.</li>
            <li>Click <strong>Set as Default</strong> to designate the store's primary baseline language.</li>
            <li>Toggle <strong>RTL</strong> for right-to-left languages (e.g. Arabic, Persian, Urdu).</li>
          </ul>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-xs text-amber-950 space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-amber-800 text-sm">
            <Languages className="w-4 h-4 text-amber-600" />
            Translation Dictionary Instructions
          </div>
          <ul className="list-disc list-inside space-y-1 text-amber-900 leading-relaxed">
            <li>Click the <strong>Translation icon</strong> next to any language to manage strings.</li>
            <li>Edit input fields for individual keys and click <strong>Save Translations</strong>.</li>
            <li>Use the search filter to quickly locate specific UI phrases or checkout terms.</li>
          </ul>
        </div>
      </div>

      {/* Action Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#d43533]" />
            Languages
          </h1>
          <p className="text-xs text-gray-500">Configure storefront languages and UI localization dictionaries</p>
        </div>
        <Link
          href="/admin/languages/create"
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#d43533] px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#b82a28] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add New Language
        </Link>
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

      {/* Languages Table */}
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-xs">
        <div className="border-b border-gray-200 px-5 py-3 bg-gray-50/50">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-700">Language Packs</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50 text-gray-700 uppercase font-semibold border-b border-gray-200">
              <tr>
                <th className="py-3 px-4 w-12">#</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">App Code</th>
                <th className="py-3 px-4 text-center">RTL</th>
                <th className="py-3 px-4 text-center">Default</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Options</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {langs.map((lang, idx) => (
                <tr key={lang.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="py-3 px-4 font-mono text-gray-400">{idx + 1}</td>
                  <td className="py-3 px-4 font-semibold text-gray-900">{lang.name}</td>
                  <td className="py-3 px-4 font-mono font-medium text-gray-700 uppercase">{lang.code}</td>
                  <td className="py-3 px-4 font-mono text-gray-500">{lang.appLangCode || lang.code}</td>
                  <td className="py-3 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => handleToggleRtl(lang.id, lang.rtl)}
                      disabled={isPending}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                        lang.rtl ? "bg-indigo-600" : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                          lang.rtl ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {lang.isDefault ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
                        <Check className="w-3 h-3" /> Default
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSetDefault(lang.id)}
                        disabled={isPending}
                        className="text-[11px] font-medium text-gray-500 hover:text-indigo-600 underline"
                      >
                        Set Default
                      </button>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(lang.id, lang.status)}
                      disabled={isPending || lang.isDefault}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                        lang.status ? "bg-emerald-500" : "bg-gray-200"
                      } ${lang.isDefault ? "opacity-60 cursor-not-allowed" : ""}`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                          lang.status ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/admin/languages/${lang.id}/translations`}
                        className="p-1.5 rounded-md text-sky-600 hover:bg-sky-50 transition-colors"
                        title="Translate Strings"
                      >
                        <Languages className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/admin/languages/${lang.id}/edit`}
                        className="p-1.5 rounded-md text-amber-600 hover:bg-amber-50 transition-colors"
                        title="Edit Language"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
