"use client"

import React, { useState, useTransition } from "react"
import { SearchCheck, Save, CheckCircle2, AlertCircle } from "lucide-react"
import { updateGenericSettingAction } from "@/app/actions/ecommerce-actions"
import type { SeoSettings } from "@/services/settings-service"

interface SeoSettingsViewProps {
  initialSettings: SeoSettings
}

export function SeoSettingsView({ initialSettings }: SeoSettingsViewProps) {
  const [settings, setSettings] = useState<SeoSettings>(initialSettings)
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      const ok = await updateGenericSettingAction("seo_settings", JSON.stringify(settings))
      if (ok) {
        setFeedback({ type: "success", text: "Global SEO metadata updated successfully" })
      } else {
        setFeedback({ type: "error", text: "Failed to update SEO settings" })
      }
      setTimeout(() => setFeedback(null), 3000)
    })
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <SearchCheck className="w-5 h-5 text-[#d43533]" />
          Global SEO Configuration
        </h1>
        <p className="text-xs text-gray-500">Configure default search engine meta tags and social share previews</p>
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

      <form onSubmit={handleSave} className="space-y-6">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs space-y-4">
          <div className="border-b border-gray-100 pb-3">
            <h2 className="text-sm font-bold text-gray-900">Search Engine Meta Tags</h2>
            <p className="text-[11px] text-gray-500">Standard Google & Bing search result appearance</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Meta Title (Recommended: 50-60 chars)
            </label>
            <input
              type="text"
              value={settings.metaTitle}
              onChange={(e) => setSettings({ ...settings, metaTitle: e.target.value })}
              className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-900 focus:border-[#d43533] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Meta Description (Recommended: 150-160 chars)
            </label>
            <textarea
              rows={3}
              value={settings.metaDescription}
              onChange={(e) => setSettings({ ...settings, metaDescription: e.target.value })}
              className="w-full rounded-lg border border-gray-200 p-3 text-xs text-gray-900 focus:border-[#d43533] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Meta Keywords (Comma separated)
            </label>
            <input
              type="text"
              value={settings.metaKeywords}
              onChange={(e) => setSettings({ ...settings, metaKeywords: e.target.value })}
              className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-900 focus:border-[#d43533] focus:outline-hidden"
            />
          </div>
        </div>

        {/* OpenGraph & Social Cards */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs space-y-4">
          <div className="border-b border-gray-100 pb-3">
            <h2 className="text-sm font-bold text-gray-900">Social Graph Sharing (Facebook & Twitter)</h2>
            <p className="text-[11px] text-gray-500">Preview banners when site URL is shared on WhatsApp, Facebook, LinkedIn, Twitter</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                OpenGraph Title
              </label>
              <input
                type="text"
                value={settings.ogTitle}
                onChange={(e) => setSettings({ ...settings, ogTitle: e.target.value })}
                className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-900 focus:border-[#d43533] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                OG Banner Image URL
              </label>
              <input
                type="text"
                value={settings.ogImage}
                onChange={(e) => setSettings({ ...settings, ogImage: e.target.value })}
                className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-900 font-mono focus:border-[#d43533] focus:outline-hidden"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                OpenGraph Description
              </label>
              <textarea
                rows={2}
                value={settings.ogDescription}
                onChange={(e) => setSettings({ ...settings, ogDescription: e.target.value })}
                className="w-full rounded-lg border border-gray-200 p-3 text-xs text-gray-900 focus:border-[#d43533] focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#d43533] px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#b82a28] transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isPending ? "Saving..." : "Save SEO Settings"}
          </button>
        </div>
      </form>
    </div>
  )
}
