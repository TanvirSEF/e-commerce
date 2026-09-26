"use client"

import React, { useState, useTransition } from "react"
import { Bot, Save, CheckCircle2, AlertCircle, Sparkles } from "lucide-react"
import { updateGenericSettingAction } from "@/app/actions/ecommerce-actions"
import type { AiConfigSettings } from "@/services/settings-service"

interface AiConfigurationViewProps {
  initialSettings: AiConfigSettings
}

export function AiConfigurationView({ initialSettings }: AiConfigurationViewProps) {
  const [settings, setSettings] = useState<AiConfigSettings>(initialSettings)
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      const ok = await updateGenericSettingAction("ai_configuration_settings", JSON.stringify(settings))
      if (ok) {
        setFeedback({ type: "success", text: "AI Assistant settings updated successfully" })
      } else {
        setFeedback({ type: "error", text: "Failed to update AI settings" })
      }
      setTimeout(() => setFeedback(null), 3000)
    })
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Bot className="w-5 h-5 text-[#d43533]" />
          AI Product Writer & Assistant Configuration
        </h1>
        <p className="text-xs text-gray-500">Configure OpenAI API for generating product titles, marketing copy, and SEO meta</p>
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
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                OpenAI Engine Status
              </h2>
              <p className="text-[11px] text-gray-500">Enable or pause AI generation features for admin & sellers</p>
            </div>
            <label className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out">
              <input
                type="checkbox"
                checked={settings.active}
                onChange={(e) => setSettings({ ...settings, active: e.target.checked })}
                className="sr-only"
              />
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                  settings.active ? "translate-x-4 bg-white" : "translate-x-0"
                }`}
              />
              <span
                className={`absolute inset-0 rounded-full transition-colors -z-10 ${
                  settings.active ? "bg-emerald-500" : "bg-gray-200"
                }`}
              />
            </label>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                OpenAI Secret API Key <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                required
                value={settings.apiKey}
                onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
                className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-900 font-mono focus:border-[#d43533] focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Model Engine
                </label>
                <select
                  value={settings.model}
                  onChange={(e) => setSettings({ ...settings, model: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-900 focus:border-[#d43533] focus:outline-hidden"
                >
                  <option value="gpt-4o-mini">GPT-4o Mini (Fast & Cost Efficient)</option>
                  <option value="gpt-4o">GPT-4o (High Fidelity Creative Copy)</option>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Legacy)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Max Output Tokens
                </label>
                <input
                  type="number"
                  min={100}
                  max={2000}
                  value={settings.maxTokens}
                  onChange={(e) => setSettings({ ...settings, maxTokens: Number(e.target.value) })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-900 focus:border-[#d43533] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Temperature (Creativity: 0.0 - 1.0)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min={0.0}
                  max={1.0}
                  value={settings.temperature}
                  onChange={(e) => setSettings({ ...settings, temperature: Number(e.target.value) })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-900 focus:border-[#d43533] focus:outline-hidden"
                />
              </div>
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
            {isPending ? "Saving..." : "Save AI Configuration"}
          </button>
        </div>
      </form>
    </div>
  )
}
