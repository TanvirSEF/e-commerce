"use client"

import React, { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Globe, ArrowLeft, Save, AlertCircle } from "lucide-react"
import { updateLanguageAction } from "@/app/actions/ecommerce-actions"
import type { Language } from "@/db/schema"

interface LanguageEditViewProps {
  language: Language
}

export function LanguageEditView({ language }: LanguageEditViewProps) {
  const router = useRouter()
  const [name, setName] = useState(language.name)
  const [code, setCode] = useState(language.code)
  const [appLangCode, setAppLangCode] = useState(language.appLangCode || "")
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !code.trim()) {
      setError("Language Name and Code are required")
      return
    }

    startTransition(async () => {
      try {
        await updateLanguageAction(language.id, {
          name: name.trim(),
          code: code.trim().toLowerCase(),
          appLangCode: appLangCode.trim() || code.trim().toLowerCase(),
        })
        router.push("/admin/languages")
        router.refresh()
      } catch (err) {
        setError("Failed to update language")
      }
    })
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/languages"
          className="p-2 rounded-lg border border-gray-200 bg-white text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#d43533]" />
            Edit Language: {language.name}
          </h1>
          <p className="text-xs text-gray-500">Update language pack specifications</p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 text-xs rounded-lg border bg-red-50 text-red-800 border-red-200">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Language Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3.5 py-2 text-xs text-gray-900 focus:border-[#d43533] focus:outline-hidden"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Code (ISO 639-1) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            disabled={language.code === "en"}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className={`w-full rounded-lg border border-gray-200 px-3.5 py-2 text-xs font-mono text-gray-900 focus:border-[#d43533] focus:outline-hidden ${
              language.code === "en" ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          />
          {language.code === "en" && (
            <p className="text-[11px] text-amber-600 mt-1">Default English code cannot be changed.</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Flutter App Lang Code
          </label>
          <input
            type="text"
            value={appLangCode}
            onChange={(e) => setAppLangCode(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3.5 py-2 text-xs font-mono text-gray-900 focus:border-[#d43533] focus:outline-hidden"
          />
        </div>

        <div className="pt-2 flex items-center justify-end gap-3">
          <Link
            href="/admin/languages"
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
            {isPending ? "Updating..." : "Update Language"}
          </button>
        </div>
      </form>
    </div>
  )
}
