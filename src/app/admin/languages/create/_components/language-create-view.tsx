"use client"

import React, { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Globe, ArrowLeft, Save, AlertCircle } from "lucide-react"
import { createLanguageAction } from "@/app/actions/ecommerce-actions"

export function LanguageCreateView() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [code, setCode] = useState("")
  const [appLangCode, setAppLangCode] = useState("")
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
        await createLanguageAction({
          name: name.trim(),
          code: code.trim().toLowerCase(),
          appLangCode: appLangCode.trim() || code.trim().toLowerCase(),
        })
        router.push("/admin/languages")
        router.refresh()
      } catch (err) {
        setError("Failed to create language")
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
            Add New Language
          </h1>
          <p className="text-xs text-gray-500">Register a new locale in your storefront catalog</p>
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
            placeholder="e.g. Deutsch, Hindi, Turkish"
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
            placeholder="e.g. de, hi, tr"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3.5 py-2 text-xs font-mono text-gray-900 focus:border-[#d43533] focus:outline-hidden"
          />
          <p className="text-[11px] text-gray-400 mt-1">Lowercase 2-letter standard language code.</p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Flutter App Lang Code (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. de, hi, tr"
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
            {isPending ? "Saving..." : "Save Language"}
          </button>
        </div>
      </form>
    </div>
  )
}
