"use client"

import React, { useState, useEffect } from "react"
import { Tag } from "lucide-react"
import { updateAttributeAction } from "@/app/actions/ecommerce-actions"
import type { AttributeItem } from "@/services/attribute-service"

interface EditAttributeModalProps {
  attr: AttributeItem | null
  onClose: () => void
  onSave: (updated: AttributeItem) => void
}

export function EditAttributeModal({
  attr,
  onClose,
  onSave,
}: EditAttributeModalProps) {
  const [editName, setEditName] = useState("")
  const [editValues, setEditValues] = useState<string[]>([])
  const [valInput, setValInput] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (attr) {
      setEditName(attr.name)
      setEditValues([...attr.values])
      setValInput("")
    }
  }, [attr])

  if (!attr) return null

  const handleAddValue = () => {
    if (!valInput.trim()) return
    if (!editValues.includes(valInput.trim())) {
      setEditValues((prev) => [...prev, valInput.trim()])
    }
    setValInput("")
  }

  const handleRemoveValue = (val: string) => {
    setEditValues((prev) => prev.filter((v) => v !== val))
  }

  const handleSave = async () => {
    if (!editName.trim()) return
    setIsSaving(true)
    try {
      await updateAttributeAction(attr.id, {
        name: editName.trim(),
        values: editValues,
      })
      onSave({
        ...attr,
        name: editName.trim(),
        values: editValues,
      })
      onClose()
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Tag className="w-4 h-4 text-[#d43533]" />
            Edit Attribute: {attr.name}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Attribute Name
            </label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:border-[#d43533] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Add New Value
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter value (e.g. XXL)"
                value={valInput}
                onChange={(e) => setValInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleAddValue()
                  }
                }}
                className="flex-1 text-xs px-3 py-1.5 border border-slate-300 rounded focus:border-[#d43533] focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddValue}
                className="px-3 py-1.5 bg-slate-800 text-white rounded text-xs font-bold hover:bg-slate-700 cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Current Values ({editValues.length})
            </label>
            <div className="flex flex-wrap gap-2 p-3 bg-slate-50 border border-slate-200 rounded min-h-[80px]">
              {editValues.map((v) => (
                <span
                  key={v}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white text-slate-800 font-semibold border border-slate-300 text-xs shadow-xs"
                >
                  {v}
                  <button
                    type="button"
                    onClick={() => handleRemoveValue(v)}
                    className="text-slate-400 hover:text-red-500 font-bold cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isSaving}
            onClick={handleSave}
            className="px-5 py-2 bg-[#d43533] text-white rounded text-xs font-bold hover:bg-[#b82a28] cursor-pointer disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  )
}
