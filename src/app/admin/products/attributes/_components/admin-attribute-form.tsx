"use client"

import React, { useState, useEffect } from "react"
import { Plus, Check, Loader2 } from "lucide-react"
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
  const [valuesStr, setValuesStr] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Sync state on edit selection change
  useEffect(() => {
    if (editingAttr) {
      setName(editingAttr.name || "")
      setValuesStr(editingAttr.values.join(", "))
    } else {
      setName("")
      setValuesStr("")
    }
  }, [editingAttr])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      onError("Attribute name is required.")
      return
    }

    const values = valuesStr
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)

    setIsSubmitting(true)
    try {
      if (editingAttr) {
        const res = await updateAttributeAction(editingAttr.id, {
          name: name.trim(),
          values,
        })
        if (res.success) {
          onSubmitSuccess(
            {
              id: editingAttr.id,
              name: name.trim(),
              values,
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
          values,
        })
        if (res.success) {
          const newItem: AttributeItem = {
            id: (res.item as any)?.id || Date.now(),
            name: name.trim(),
            values,
          }
          onSubmitSuccess(
            newItem,
            false,
            `Attribute "${name.trim()}" created successfully!`
          )
          setName("")
          setValuesStr("")
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

        {/* Values */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Option Values <span className="text-slate-400 font-normal">(Comma Separated)</span>
          </label>
          <textarea
            rows={4}
            value={valuesStr}
            onChange={(e) => setValuesStr(e.target.value)}
            placeholder="e.g. S, M, L, XL, XXL"
            className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533] transition-colors resize-none"
          />
          <p className="text-[11px] text-slate-400 mt-1">
            Separate each value with a comma. You can also manage values individually from the table.
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
