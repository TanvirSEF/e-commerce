"use client"

import React, { useState, useEffect } from "react"
import { Plus, Check, Loader2 } from "lucide-react"
import { createColorAction, updateColorAction } from "@/app/actions/ecommerce-actions"
import type { ColorData } from "@/services/color-service"

interface AdminColorFormProps {
  editingColor: ColorData | null
  onCancelEdit: () => void
  onSubmitSuccess: (color: ColorData, isEdit: boolean, message: string) => void
  onError: (message: string) => void
}

export function AdminColorForm({
  editingColor,
  onCancelEdit,
  onSubmitSuccess,
  onError,
}: AdminColorFormProps) {
  const [name, setName] = useState("")
  const [code, setCode] = useState("#000000")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Sync state on edit selection change
  useEffect(() => {
    if (editingColor) {
      setName(editingColor.name || "")
      setCode(editingColor.code || "#000000")
    } else {
      setName("")
      setCode("#000000")
    }
  }, [editingColor])

  // Helper to ensure code starts with #
  const handleHexChange = (val: string) => {
    let clean = val.trim()
    if (!clean.startsWith("#")) {
      clean = "#" + clean
    }
    setCode(clean)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      onError("Color name is required.")
      return
    }
    if (!code.trim() || !/^#[0-9A-Fa-f]{3,8}$/.test(code.trim())) {
      onError("Please enter a valid hex color code (e.g. #FF0000).")
      return
    }

    setIsSubmitting(true)
    try {
      if (editingColor) {
        const res = await updateColorAction(editingColor.id, {
          name: name.trim(),
          code: code.trim().toUpperCase(),
        })
        if (res.success && res.color) {
          onSubmitSuccess(
            res.color,
            true,
            `Color "${res.color.name}" updated successfully!`
          )
        } else {
          onError("Failed to update color. Please try again.")
        }
      } else {
        const res = await createColorAction({
          name: name.trim(),
          code: code.trim().toUpperCase(),
        })
        if (res.success && res.color) {
          onSubmitSuccess(
            res.color,
            false,
            `Color "${res.color.name}" created successfully!`
          )
          setName("")
          setCode("#000000")
        } else {
          onError("Failed to create color. Please try again.")
        }
      }
    } catch (err) {
      console.error("Error saving color:", err)
      onError("An unexpected error occurred while saving the color.")
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
            {editingColor ? "Edit Color" : "Add New Color"}
          </h2>
          {editingColor && (
            <span className="inline-block mt-0.5 text-[10px] bg-amber-100 text-amber-800 font-semibold px-1.5 py-0.5 rounded">
              Editing: {editingColor.name}
            </span>
          )}
        </div>

        {editingColor && (
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
        {/* Color Name */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Color Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Midnight Blue, Crimson Red"
            className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533] transition-colors"
          />
        </div>

        {/* Color Code */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Color Code (Hex) <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={code.startsWith("#") && (code.length === 4 || code.length === 7) ? code : "#000000"}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="w-10 h-10 rounded border border-slate-300 cursor-pointer p-0.5 shrink-0 bg-white"
            />
            <input
              type="text"
              required
              placeholder="#000000"
              value={code}
              onChange={(e) => handleHexChange(e.target.value)}
              className="flex-1 px-3 py-2 font-mono uppercase border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533] transition-colors"
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Click swatch to open native color picker or type hex code
          </p>
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
                <span>{editingColor ? "Updating..." : "Saving..."}</span>
              </>
            ) : editingColor ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Update Color</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Save Color</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
