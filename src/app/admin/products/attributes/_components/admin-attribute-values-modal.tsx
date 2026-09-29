"use client"

import React, { useState, useEffect } from "react"
import { Tag, Plus, X, Loader2 } from "lucide-react"
import { updateAttributeAction } from "@/app/actions/ecommerce-actions"
import type { AttributeItem } from "@/services/attribute-service"

interface AdminAttributeValuesModalProps {
  attr: AttributeItem | null
  isOpen: boolean
  onClose: () => void
  onSave: (updatedItem: AttributeItem) => void
  onError: (message: string) => void
}

export function AdminAttributeValuesModal({
  attr,
  isOpen,
  onClose,
  onSave,
  onError,
}: AdminAttributeValuesModalProps) {
  const [values, setValues] = useState<string[]>([])
  const [newValInput, setNewValInput] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (attr) {
      setValues([...attr.values])
      setNewValInput("")
    }
  }, [attr])

  if (!isOpen || !attr) return null

  const handleAddValue = () => {
    const trimmed = newValInput.trim()
    if (!trimmed) return
    if (!values.includes(trimmed)) {
      setValues((prev) => [...prev, trimmed])
    }
    setNewValInput("")
  }

  const handleRemoveValue = (valToRemove: string) => {
    setValues((prev) => prev.filter((v) => v !== valToRemove))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const res = await updateAttributeAction(attr.id, {
        values,
      })
      if (res.success) {
        onSave({
          ...attr,
          values,
        })
        onClose()
      } else {
        onError("Failed to update attribute values.")
      }
    } catch (err) {
      console.error("Error saving attribute values:", err)
      onError("An error occurred while saving attribute values.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-2xs animate-in fade-in duration-150">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-[#d43533]" />
            <h3 className="text-sm font-bold text-slate-800">
              Manage Values: <span className="text-[#d43533]">{attr.name}</span>
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 font-bold p-1 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 text-xs">
          {/* Add Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Add New Option Value
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Medium, 256GB, Cotton"
                value={newValInput}
                onChange={(e) => setNewValInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleAddValue()
                  }
                }}
                className="flex-1 text-xs px-3 py-2 border border-slate-300 rounded focus:border-[#d43533] focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={handleAddValue}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Press Enter or click Add to append to list
            </p>
          </div>

          {/* Current Values List */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700">
                Attribute Values ({values.length})
              </label>
              {values.length > 0 && (
                <button
                  type="button"
                  onClick={() => setValues([])}
                  className="text-[11px] text-red-500 hover:underline cursor-pointer"
                >
                  Clear all
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2 p-3 bg-slate-50 border border-slate-200 rounded min-h-[100px] max-h-[220px] overflow-y-auto">
              {values.length === 0 ? (
                <div className="w-full text-center py-6 text-slate-400 text-xs italic">
                  No values added yet. Add a value above.
                </div>
              ) : (
                values.map((v) => (
                  <span
                    key={v}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white text-slate-800 font-semibold border border-slate-300 text-xs shadow-2xs group"
                  >
                    <span>{v}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveValue(v)}
                      className="text-slate-400 hover:text-red-500 font-bold p-0.5 cursor-pointer transition-colors"
                      title="Remove option"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isSaving}
            onClick={handleSave}
            className="px-5 py-2 bg-[#d43533] hover:bg-[#b82a28] text-white rounded text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <span>Save Changes</span>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
