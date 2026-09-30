"use client"

import React, { useState } from "react"
import { Clock } from "lucide-react"
import { updateGenericSettingAction } from "@/app/actions/ecommerce-actions"

interface DynamicPopupDurationCardProps {
  initialDuration: string
  onFeedback: (feedback: { type: "success" | "error"; text: string }) => void
}

export function DynamicPopupDurationCard({
  initialDuration,
  onFeedback,
}: DynamicPopupDurationCardProps) {
  const [duration, setDuration] = useState(initialDuration || "10")
  const [saving, setSaving] = useState(false)

  const handleSaveDuration = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await updateGenericSettingAction("dynamic_popup_duration", duration)
      onFeedback({
        type: "success",
        text: "Dynamic popup duration updated successfully.",
      })
    } catch {
      onFeedback({
        type: "error",
        text: "Failed to update dynamic popup duration.",
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-xs p-5">
      <form
        onSubmit={handleSaveDuration}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-red-50 text-[#d43533]">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wide">
              Dynamic Popup Duration (seconds)
            </h2>
            <p className="text-[11px] text-gray-500">
              Set how long promotional modals remain visible before automatic dismissal
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="number"
            min={5}
            step={1}
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-24 px-3 py-1.5 border border-gray-200 rounded text-xs font-bold text-gray-800 focus:outline-none focus:border-[#d43533]"
            placeholder="Seconds"
            required
          />
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-1.5 bg-[#d43533] hover:bg-[#b82a28] text-white rounded text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer"
          >
            {saving ? "Saving..." : "Update"}
          </button>
        </div>
      </form>
    </div>
  )
}
