"use client"

import React, { useState } from "react"
import { Layout, Save, CheckCircle, Check } from "lucide-react"
import { updateAuthLayoutAction } from "@/app/actions/ecommerce-actions"
import type { AuthLayoutSettings, AuthLayoutType } from "@/services/settings-service"

interface AuthenticationLayoutViewProps {
  initialSettings: AuthLayoutSettings
}

const LAYOUT_OPTIONS: { id: AuthLayoutType; title: string; desc: string; previewClass: string }[] = [
  {
    id: "boxed",
    title: "Layout 1 - Boxed",
    desc: "Centered card with rounded container, subtle shadow, and clean borders.",
    previewClass: "flex items-center justify-center p-3 bg-slate-100",
  },
  {
    id: "free",
    title: "Layout 2 - Free Floating",
    desc: "Open layout without heavy outer card borders, ideal for modern sleek brands.",
    previewClass: "flex items-center justify-center p-3 bg-white border border-dashed border-slate-200",
  },
  {
    id: "focused",
    title: "Layout 3 - Focused Minimal",
    desc: "Single-column condensed format emphasizing primary credentials and SSO login.",
    previewClass: "flex flex-col items-center justify-center p-3 bg-slate-50",
  },
  {
    id: "split",
    title: "Layout 4 - Split Banner",
    desc: "Two-column design with brand illustration on left and auth form on right.",
    previewClass: "grid grid-cols-2 p-3 bg-slate-100 gap-1.5",
  },
]

export function AuthenticationLayoutView({ initialSettings }: AuthenticationLayoutViewProps) {
  const [selectedLayout, setSelectedLayout] = useState<AuthLayoutType>(initialSettings.layout)
  const [isSaving, setIsSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      const res = await updateAuthLayoutAction({ layout: selectedLayout })
      if (res.success) {
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      }
    } catch (err) {
      console.error("Save auth layout error:", err)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Layout className="w-5 h-5 text-[#d43533]" />
          Authentication Page Layout
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Choose the design template for customer login, registration, and password recovery pages (Active eCommerce 1:1)
        </p>
      </div>

      {success && (
        <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-semibold">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          Authentication layout updated successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {LAYOUT_OPTIONS.map((opt) => {
            const isSelected = selectedLayout === opt.id
            return (
              <div
                key={opt.id}
                onClick={() => setSelectedLayout(opt.id)}
                className={`relative bg-white rounded-xl border-2 p-5 cursor-pointer transition-all ${
                  isSelected
                    ? "border-[#d43533] shadow-md ring-1 ring-[#d43533]/20"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#d43533] text-white flex items-center justify-center">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}

                {/* Wireframe Mockup */}
                <div className={`h-28 rounded-lg mb-4 overflow-hidden ${opt.previewClass}`}>
                  {opt.id === "boxed" && (
                    <div className="w-24 h-20 bg-white rounded-md shadow-xs border border-slate-200 flex flex-col p-1.5 space-y-1.5">
                      <div className="w-8 h-2 bg-slate-300 rounded"></div>
                      <div className="w-full h-2.5 bg-slate-100 rounded"></div>
                      <div className="w-full h-2.5 bg-slate-100 rounded"></div>
                      <div className="w-full h-3 bg-[#d43533]/80 rounded mt-auto"></div>
                    </div>
                  )}
                  {opt.id === "free" && (
                    <div className="w-28 flex flex-col space-y-1.5">
                      <div className="w-12 h-2 bg-slate-400 rounded"></div>
                      <div className="w-full h-2.5 bg-slate-100 rounded border border-slate-200"></div>
                      <div className="w-full h-2.5 bg-slate-100 rounded border border-slate-200"></div>
                      <div className="w-full h-3 bg-[#d43533] rounded"></div>
                    </div>
                  )}
                  {opt.id === "focused" && (
                    <div className="w-20 flex flex-col items-center space-y-1.5">
                      <div className="w-6 h-6 rounded-full bg-slate-200"></div>
                      <div className="w-full h-2 bg-slate-200 rounded"></div>
                      <div className="w-full h-2.5 bg-slate-100 rounded border border-slate-200"></div>
                      <div className="w-full h-3 bg-[#d43533] rounded"></div>
                    </div>
                  )}
                  {opt.id === "split" && (
                    <>
                      <div className="bg-[#d43533]/15 rounded flex items-center justify-center">
                        <div className="w-8 h-8 rounded bg-[#d43533]/30"></div>
                      </div>
                      <div className="bg-white rounded p-1.5 flex flex-col justify-center space-y-1">
                        <div className="w-full h-2 bg-slate-100 rounded"></div>
                        <div className="w-full h-2 bg-slate-100 rounded"></div>
                        <div className="w-full h-2.5 bg-[#d43533] rounded"></div>
                      </div>
                    </>
                  )}
                </div>

                <h3 className="text-sm font-bold text-slate-800">{opt.title}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{opt.desc}</p>
              </div>
            )
          })}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-[#d43533] hover:bg-[#b82a28] text-white text-xs font-semibold rounded shadow-sm transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSaving ? "Saving..." : "Save Layout Settings"}
          </button>
        </div>
      </form>
    </div>
  )
}
