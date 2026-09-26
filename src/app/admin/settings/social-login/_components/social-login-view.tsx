"use client"

import React, { useState, useTransition } from "react"
import { Share2, Save, CheckCircle2, AlertCircle } from "lucide-react"
import { updateGenericSettingAction } from "@/app/actions/ecommerce-actions"
import type { SocialLoginSettings } from "@/services/settings-service"

interface SocialLoginViewProps {
  initialSettings: SocialLoginSettings
}

export function SocialLoginView({ initialSettings }: SocialLoginViewProps) {
  const [settings, setSettings] = useState<SocialLoginSettings>(initialSettings)
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      const ok = await updateGenericSettingAction("social_login_settings", JSON.stringify(settings))
      if (ok) {
        setFeedback({ type: "success", text: "Social login credentials updated successfully" })
      } else {
        setFeedback({ type: "error", text: "Failed to update social login settings" })
      }
      setTimeout(() => setFeedback(null), 3000)
    })
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Share2 className="w-5 h-5 text-[#d43533]" />
          Social Media Login Configuration
        </h1>
        <p className="text-xs text-gray-500">Configure OAuth 2.0 single sign-on credentials for customers</p>
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
        {/* Google OAuth Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                Google Login
              </h2>
              <p className="text-[11px] text-gray-500">Google Cloud Console OAuth 2.0 Client credentials</p>
            </div>
            <label className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out">
              <input
                type="checkbox"
                checked={settings.google.active}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    google: { ...settings.google, active: e.target.checked },
                  })
                }
                className="sr-only"
              />
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                  settings.google.active ? "translate-x-4 bg-white" : "translate-x-0"
                }`}
              />
              <span
                className={`absolute inset-0 rounded-full transition-colors -z-10 ${
                  settings.google.active ? "bg-emerald-500" : "bg-gray-200"
                }`}
              />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Client ID</label>
              <input
                type="text"
                value={settings.google.clientId}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    google: { ...settings.google, clientId: e.target.value },
                  })
                }
                className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-900 font-mono focus:border-[#d43533] focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Client Secret</label>
              <input
                type="password"
                value={settings.google.clientSecret}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    google: { ...settings.google, clientSecret: e.target.value },
                  })
                }
                className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-900 font-mono focus:border-[#d43533] focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Facebook Login Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-gray-900">Facebook Login</h2>
              <p className="text-[11px] text-gray-500">Meta Developers App ID and App Secret</p>
            </div>
            <label className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out">
              <input
                type="checkbox"
                checked={settings.facebook.active}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    facebook: { ...settings.facebook, active: e.target.checked },
                  })
                }
                className="sr-only"
              />
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                  settings.facebook.active ? "translate-x-4 bg-white" : "translate-x-0"
                }`}
              />
              <span
                className={`absolute inset-0 rounded-full transition-colors -z-10 ${
                  settings.facebook.active ? "bg-emerald-500" : "bg-gray-200"
                }`}
              />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">App ID</label>
              <input
                type="text"
                value={settings.facebook.appId}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    facebook: { ...settings.facebook, appId: e.target.value },
                  })
                }
                className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-900 font-mono focus:border-[#d43533] focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">App Secret</label>
              <input
                type="password"
                value={settings.facebook.appSecret}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    facebook: { ...settings.facebook, appSecret: e.target.value },
                  })
                }
                className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-900 font-mono focus:border-[#d43533] focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Twitter Login Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-gray-900">Twitter / X Login</h2>
              <p className="text-[11px] text-gray-500">Twitter Developer Portal API credentials</p>
            </div>
            <label className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out">
              <input
                type="checkbox"
                checked={settings.twitter.active}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    twitter: { ...settings.twitter, active: e.target.checked },
                  })
                }
                className="sr-only"
              />
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                  settings.twitter.active ? "translate-x-4 bg-white" : "translate-x-0"
                }`}
              />
              <span
                className={`absolute inset-0 rounded-full transition-colors -z-10 ${
                  settings.twitter.active ? "bg-emerald-500" : "bg-gray-200"
                }`}
              />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Client ID</label>
              <input
                type="text"
                value={settings.twitter.clientId}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    twitter: { ...settings.twitter, clientId: e.target.value },
                  })
                }
                className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-900 font-mono focus:border-[#d43533] focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Client Secret</label>
              <input
                type="password"
                value={settings.twitter.clientSecret}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    twitter: { ...settings.twitter, clientSecret: e.target.value },
                  })
                }
                className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-900 font-mono focus:border-[#d43533] focus:outline-hidden"
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
            {isPending ? "Saving..." : "Save Social Login Settings"}
          </button>
        </div>
      </form>
    </div>
  )
}
