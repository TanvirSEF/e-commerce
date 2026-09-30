"use client"

import React, { useState } from "react"
import { type SmartBarSettings } from "@/services/settings-service"
import {
  updateSmartBarSettingsAction,
  updateSmartBarStatusAction,
} from "@/app/actions/ecommerce-actions"
import { SmartBarForm } from "./smart-bar-form"
import { SmartBarConfirmModal } from "./smart-bar-confirm-modal"
import { CheckCircle2, AlertCircle } from "lucide-react"

interface SmartBarViewProps {
  initialSettings: SmartBarSettings
}

export function SmartBarView({ initialSettings }: SmartBarViewProps) {
  const [settings, setSettings] = useState<SmartBarSettings>(initialSettings)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalTargetStatus, setModalTargetStatus] = useState(initialSettings.showSmartBar)
  const [isStatusUpdating, setIsStatusUpdating] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<{
    type: "success" | "danger"
    text: string
  } | null>(null)

  const showNotification = (type: "success" | "danger", text: string) => {
    setFeedback({ type, text })
    setTimeout(() => setFeedback(null), 3500)
  }

  // Handle toggle switch click (opens confirmation modal)
  const handleToggleStatusClick = () => {
    setModalTargetStatus(!settings.showSmartBar)
    setIsModalOpen(true)
  }

  // Handle confirmation modal Allow/Disable click
  const handleConfirmStatusChange = async () => {
    setIsStatusUpdating(true)
    try {
      const res = await updateSmartBarStatusAction(modalTargetStatus)
      if (res && res.success) {
        setSettings((prev) => ({ ...prev, showSmartBar: modalTargetStatus }))
        showNotification("success", "Settings updated successfully")
      } else {
        showNotification("danger", "Something went wrong")
      }
    } catch {
      showNotification("danger", "Network error")
    } finally {
      setIsStatusUpdating(false)
      setIsModalOpen(false)
    }
  }

  // Handle whole form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const res = await updateSmartBarSettingsAction(settings)
      if (res && res.success) {
        showNotification("success", "Settings updated successfully")
      } else {
        showNotification("danger", "Something went wrong")
      }
    } catch {
      showNotification("danger", "Network error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      {/* Toast Notification (Active eCommerce 1:1) */}
      {feedback && (
        <div
          className={`flex items-center gap-2 p-3 text-xs rounded-lg border shadow-2xs transition-all ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Main Card */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-[#fafbfc]">
          <h5 className="mb-0 text-sm font-bold text-slate-800">Smart Bar</h5>
        </div>

        <SmartBarForm
          settings={settings}
          setSettings={setSettings}
          onToggleStatusClick={handleToggleStatusClick}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>

      {/* Confirm Trigger Modal */}
      <SmartBarConfirmModal
        isOpen={isModalOpen}
        targetStatus={modalTargetStatus}
        onConfirm={handleConfirmStatusChange}
        onCancel={() => setIsModalOpen(false)}
        isSubmitting={isStatusUpdating}
      />
    </div>
  )
}
