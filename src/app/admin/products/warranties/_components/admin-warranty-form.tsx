"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import { Plus, Check, Loader2, X, ShieldCheck } from "lucide-react"
import { createWarrantyAction, updateWarrantyAction } from "@/app/actions/ecommerce-actions"
import { MediaPickerModal } from "@/components/ui/media-picker-modal"
import type { WarrantyData } from "@/services/warranty-service"

interface AdminWarrantyFormProps {
  editingWarranty: WarrantyData | null
  onCancelEdit: () => void
  onSubmitSuccess: (warranty: WarrantyData, isEdit: boolean, message: string) => void
  onError: (message: string) => void
}

const DURATIONS = [
  "7 Days",
  "14 Days",
  "1 Month",
  "3 Months",
  "6 Months",
  "1 Year",
  "2 Years",
  "3 Years",
  "5 Years",
  "Lifetime",
]

export function AdminWarrantyForm({
  editingWarranty,
  onCancelEdit,
  onSubmitSuccess,
  onError,
}: AdminWarrantyFormProps) {
  const [text, setText] = useState("")
  const [duration, setDuration] = useState("1 Year")
  const [logo, setLogo] = useState("/assets/img/warranty.png")
  const [isPickerOpen, setIsPickerOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Sync state on edit selection change
  useEffect(() => {
    if (editingWarranty) {
      setText(editingWarranty.text || "")
      setDuration(editingWarranty.duration || "1 Year")
      setLogo(editingWarranty.logo || "/assets/img/warranty.png")
    } else {
      setText("")
      setDuration("1 Year")
      setLogo("/assets/img/warranty.png")
    }
  }, [editingWarranty])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) {
      onError("Warranty statement is required.")
      return
    }

    setIsSubmitting(true)
    try {
      if (editingWarranty) {
        const res = await updateWarrantyAction(editingWarranty.id, {
          text: text.trim(),
          duration,
          logo: logo || undefined,
        })
        if (res.success && res.warranty) {
          onSubmitSuccess(
            res.warranty,
            true,
            `Warranty "${res.warranty.text}" updated successfully!`
          )
        } else {
          onError("Failed to update warranty policy.")
        }
      } else {
        const res = await createWarrantyAction({
          text: text.trim(),
          duration,
          logo: logo || undefined,
        })
        if (res.success && res.warranty) {
          onSubmitSuccess(
            res.warranty,
            false,
            `Warranty "${res.warranty.text}" created successfully!`
          )
          setText("")
          setDuration("1 Year")
          setLogo("/assets/img/warranty.png")
        } else {
          onError("Failed to create warranty policy.")
        }
      }
    } catch (err) {
      console.error("Error saving warranty:", err)
      onError("An unexpected error occurred while saving the warranty.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white border border-slate-200 rounded-sm shadow-xs p-5 self-start">
      {/* Header */}
      <div className="border-b border-slate-100 pb-3 mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-800">
            {editingWarranty ? "Edit Warranty Policy" : "Add New Warranty"}
          </h2>
          {editingWarranty && (
            <span className="inline-block mt-0.5 text-[10px] bg-amber-100 text-amber-800 font-semibold px-1.5 py-0.5 rounded">
              Editing: {editingWarranty.text}
            </span>
          )}
        </div>

        {editingWarranty && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="text-xs text-slate-500 hover:text-slate-800 underline font-medium cursor-pointer"
          >
            Cancel Edit
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Warranty Statement */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Warranty Statement / Text <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="e.g. 1 Year Official Brand Warranty"
            className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533] transition-colors"
          />
        </div>

        {/* Duration */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Warranty Period Duration <span className="text-red-500">*</span>
          </label>
          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 bg-white focus:outline-none focus:border-[#d43533] transition-colors cursor-pointer"
          >
            {DURATIONS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Badge Icon / Logo */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Badge Icon / Logo <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <div className="flex rounded border border-slate-300 overflow-hidden text-xs">
            <button
              type="button"
              onClick={() => setIsPickerOpen(true)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 font-medium border-r border-slate-300 transition-colors shrink-0 cursor-pointer"
            >
              Browse
            </button>
            <div
              onClick={() => setIsPickerOpen(true)}
              className="px-3 py-2 text-slate-500 bg-white flex-1 cursor-pointer truncate flex items-center"
            >
              {logo ? (
                <span className="text-slate-800 font-medium truncate">1 File selected</span>
              ) : (
                <span className="text-slate-400">Choose File</span>
              )}
            </div>
          </div>

          {logo && (
            <div className="mt-2.5 relative w-16 h-16 rounded border border-slate-200 overflow-hidden bg-slate-50 shadow-2xs">
              <Image
                src={logo}
                alt="Warranty Icon Preview"
                fill
                className="object-contain p-1"
              />
              <button
                type="button"
                onClick={() => setLogo("")}
                className="absolute top-1 right-1 bg-black/70 hover:bg-black text-white rounded-full p-0.5 cursor-pointer transition-colors"
                title="Remove logo"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 bg-[#d43533] text-white text-xs font-bold rounded shadow-xs hover:bg-[#b82a28] transition-colors flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>{editingWarranty ? "Updating..." : "Saving..."}</span>
              </>
            ) : editingWarranty ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Update Policy</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Save Warranty Policy</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onSelect={(urls) => {
          if (urls.length > 0) {
            setLogo(urls[0])
          }
          setIsPickerOpen(false)
        }}
        title="Select Warranty Icon"
      />
    </div>
  )
}
