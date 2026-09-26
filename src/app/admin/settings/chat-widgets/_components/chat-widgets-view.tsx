"use client"

import React, { useState, useTransition } from "react"
import { MessageCircle, Save, CheckCircle2, AlertCircle } from "lucide-react"
import { updateGenericSettingAction } from "@/app/actions/ecommerce-actions"
import type { ChatWidgetsSettings } from "@/services/settings-service"

interface ChatWidgetsViewProps {
  initialSettings: ChatWidgetsSettings
}

export function ChatWidgetsView({ initialSettings }: ChatWidgetsViewProps) {
  const [settings, setSettings] = useState<ChatWidgetsSettings>(initialSettings)
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      const ok = await updateGenericSettingAction("chat_widgets_settings", JSON.stringify(settings))
      if (ok) {
        setFeedback({ type: "success", text: "Chat widget settings saved successfully" })
      } else {
        setFeedback({ type: "error", text: "Failed to update chat widgets" })
      }
      setTimeout(() => setFeedback(null), 3000)
    })
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-[#d43533]" />
          Live Chat Widgets (WhatsApp & Messenger)
        </h1>
        <p className="text-xs text-gray-500">Configure floating instant chat buttons for visitors on your storefront</p>
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
        {/* WhatsApp Chat Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                WhatsApp Floating Chat Button
              </h2>
              <p className="text-[11px] text-gray-500">Direct one-click customer messaging via WhatsApp Web / App</p>
            </div>
            <label className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out">
              <input
                type="checkbox"
                checked={settings.whatsapp.active}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    whatsapp: { ...settings.whatsapp, active: e.target.checked },
                  })
                }
                className="sr-only"
              />
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                  settings.whatsapp.active ? "translate-x-4 bg-white" : "translate-x-0"
                }`}
              />
              <span
                className={`absolute inset-0 rounded-full transition-colors -z-10 ${
                  settings.whatsapp.active ? "bg-emerald-500" : "bg-gray-200"
                }`}
              />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                WhatsApp Number (with country code)
              </label>
              <input
                type="text"
                placeholder="+8801700000000"
                value={settings.whatsapp.phone}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    whatsapp: { ...settings.whatsapp, phone: e.target.value },
                  })
                }
                className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-900 font-mono focus:border-[#d43533] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Floating Screen Position
              </label>
              <select
                value={settings.whatsapp.position}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    whatsapp: {
                      ...settings.whatsapp,
                      position: e.target.value as "bottom-right" | "bottom-left",
                    },
                  })
                }
                className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-900 focus:border-[#d43533] focus:outline-hidden"
              >
                <option value="bottom-right">Bottom Right Corner</option>
                <option value="bottom-left">Bottom Left Corner</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Default Pre-filled Message
              </label>
              <input
                type="text"
                placeholder="Hello! I need assistance with an order."
                value={settings.whatsapp.message}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    whatsapp: { ...settings.whatsapp, message: e.target.value },
                  })
                }
                className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-900 focus:border-[#d43533] focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Facebook Messenger Chat Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-gray-900">Facebook Messenger Live Chat</h2>
              <p className="text-[11px] text-gray-500">Official Facebook Customer Chat plugin</p>
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

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Facebook Page ID
            </label>
            <input
              type="text"
              placeholder="e.g. 100234567890"
              value={settings.facebook.pageId}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  facebook: { ...settings.facebook, pageId: e.target.value },
                })
              }
              className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-900 font-mono focus:border-[#d43533] focus:outline-hidden max-w-md"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#d43533] px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#b82a28] transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isPending ? "Saving..." : "Save Chat Widget Settings"}
          </button>
        </div>
      </form>
    </div>
  )
}
