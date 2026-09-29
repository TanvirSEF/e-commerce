"use client"

import React, { useState, useEffect } from "react"
import { Plus, Check, Loader2, X } from "lucide-react"
import { createAttributeAction, updateAttributeAction } from "@/app/actions/ecommerce-actions"
import type { AttributeItem } from "@/services/attribute-service"

interface AdminAttributeFormProps {
  editingAttr: AttributeItem | null
  onCancelEdit: () => void
  onSubmitSuccess: (item: AttributeItem, isEdit: boolean, message: string) => void
  onError: (message: string) => void
}

export function AdminAttributeForm({
  editingAttr,
  onCancelEdit,
  onSubmitSuccess,
  onError,
}: AdminAttributeFormProps) {
  const [name, setName] = useState("")
  const [values, setValues] = useState<string[]>([""])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Sync state on edit selection change
  useEffect(() => {
    if (editingAttr) {
      setName(editingAttr.name || "")
      setValues(editingAttr.values.length > 0 ? [...editingAttr.values] : [""])
    } else {
      setName("")
      setValues([""])
    }
  }, [editingAttr])

  const handleAddRow = () => {
    setValues((prev) => [...prev, ""])
  }

  const handleRemoveRow = (index: number) => {
    setValues((prev) => prev.filter((_, idx) => idx !== index))
  }

  const handleValueChange = (index: number, val: string) => {
    setValues((prev) => {
      const next = [...prev]
      next[index] = val
      return next
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      onError("Attribute name is required.")
      return
    }

    const cleanValues = values
      .map((s) => s.trim())
      .filter(Boolean)

    setIsSubmitting(true)
    try {
      if (editingAttr) {
        const res = await updateAttributeAction(editingAttr.id, {
          name: name.trim(),
          values: cleanValues,
        })
        if (res.success) {
          onSubmitSuccess(
            {
              id: editingAttr.id,
              name: name.trim(),
              values: cleanValues,
            },
            true,
            `Attribute "${name.trim()}" updated successfully!`
          )
        } else {
          onError("Failed to update attribute. Please try again.")
        }
      } else {
        const res = await createAttributeAction({
          name: name.trim(),
          values: cleanValues,
        })
        if (res.success) {
          const newItem: AttributeItem = {
            id: (res.item as any)?.id || Date.now(),
            name: name.trim(),
            values: cleanValues,
          }
          onSubmitSuccess(
            newItem,
            false,
            `Attribute "${name.trim()}" created successfully!`
          )
          setName("")
          setValues([""])
        } else {
          onError("Failed to create attribute. Please try again.")
        }
      }
    } catch (err) {
      console.error("Error saving attribute:", err)
      onError("An unexpected error occurred while saving attribute.")
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
            {editingAttr ? "Edit Attribute" : "Add New Attribute"}
          </h2>
          {editingAttr && (
            <span className="inline-block mt-0.5 text-[10px] bg-amber-100 text-amber-800 font-semibold px-1.5 py-0.5 rounded">
              Editing: {editingAttr.name}
            </span>
          )}
        </div>

        {editingAttr && (
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
        {/* Name */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Attribute Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Size, Fabric, Storage, Shoe Size"
            className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533] transition-colors"
          />
        </div>

        {/* Dynamic Attribute Values (Active eCommerce 1:1) */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Attribute Values
          </label>
          <div className="space-y-2">
            {values.map((val, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={val}
                  onChange={(e) => handleValueChange(idx, e.target.value)}
                  placeholder="Enter Attribute Value"
                  maxLength={60}
                  className="flex-1 px-3 py-1.5 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533] transition-colors"
                />
                {values.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveRow(idx)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Remove value"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddRow}
              className="w-full py-2 border border-dashed border-slate-300 hover:border-slate-400 text-slate-600 text-xs font-medium rounded-sm flex items-center justify-center gap-1.5 hover:bg-slate-50 transition-colors cursor-pointer mt-1"
            >
              <Plus className="w-3.5 h-3.5 text-slate-500" />
              <span>Add More</span>
            </button>
          </div>
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
                <span>{editingAttr ? "Updating..." : "Saving..."}</span>
              </>
            ) : editingAttr ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Update Attribute</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Save Attribute</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
