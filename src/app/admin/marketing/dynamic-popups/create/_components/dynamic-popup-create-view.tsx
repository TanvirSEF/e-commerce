"use client"

import React, { useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react"
import { createDynamicPopupAction } from "@/app/actions/ecommerce-actions"
import { MediaPickerModal } from "@/components/ui/media-picker-modal"
import {
  DynamicPopupFormFields,
  DynamicPopupFormData,
} from "./dynamic-popup-form-fields"
import { DynamicPopupPreview } from "./dynamic-popup-preview"

export function DynamicPopupCreateView() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isPickerOpen, setIsPickerOpen] = useState(false)
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const [formData, setFormData] = useState<DynamicPopupFormData>({
    title: "",
    summary: "",
    bannerUrl: "",
    btnText: "Shop Now",
    btnBackgroundColor: "#d43533",
    btnTextColor: "white",
    link: "",
    delaySec: 3,
    durationSec: 15,
  })

  const handleChange = (updated: Partial<DynamicPopupFormData>) => {
    setFormData((prev) => ({ ...prev, ...updated }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.bannerUrl) {
      setFeedback({ type: "error", text: "Title and Image URL are required" })
      return
    }

    startTransition(async () => {
      const res = await createDynamicPopupAction(formData)
      if (res) {
        setFeedback({
          type: "success",
          text: "Dynamic popup created successfully! Redirecting...",
        })
        setTimeout(() => {
          router.push("/admin/marketing/dynamic-popups")
        }, 1200)
      } else {
        setFeedback({ type: "error", text: "Failed to create dynamic popup" })
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/marketing/dynamic-popups"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 transition"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Create New Dynamic Popup</h1>
            <p className="text-xs text-gray-500">
              Set up a targeted modal banner with interactive button and link
            </p>
          </div>
        </div>
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <DynamicPopupFormFields
            formData={formData}
            onChange={handleChange}
            onOpenPicker={() => setIsPickerOpen(true)}
            isPending={isPending}
            onSubmit={handleSubmit}
          />
        </div>
        <div className="lg:col-span-4">
          <DynamicPopupPreview
            title={formData.title}
            summary={formData.summary}
            bannerUrl={formData.bannerUrl}
            btnText={formData.btnText}
            btnBackgroundColor={formData.btnBackgroundColor}
            btnTextColor={formData.btnTextColor}
          />
        </div>
      </div>

      <MediaPickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onSelect={(urls) => {
          handleChange({ bannerUrl: urls[0] || "" })
          setIsPickerOpen(false)
        }}
      />
    </div>
  )
}
