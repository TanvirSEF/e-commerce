"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import { Plus, Save, RotateCcw, X, Loader2 } from "lucide-react"
import { MediaPickerModal } from "@/components/ui/media-picker-modal"
import type { AdminCategoryItem } from "./admin-categories-table"

interface AdminCategoryFormProps {
  allCategories: AdminCategoryItem[]
  editingCategory: AdminCategoryItem | null
  onSave: (data: {
    name: string
    parentId?: number | null
    orderLevel?: number
    banner?: string
    icon?: string
  }) => Promise<void>
  onCancelEdit: () => void
  isSubmitting: boolean
}

export function AdminCategoryForm({
  allCategories,
  editingCategory,
  onSave,
  onCancelEdit,
  isSubmitting,
}: AdminCategoryFormProps) {
  const [name, setName] = useState("")
  const [parentId, setParentId] = useState<string>("")
  const [orderLevel, setOrderLevel] = useState<number>(0)
  const [banner, setBanner] = useState("")
  const [icon, setIcon] = useState("")
  const [pickerTarget, setPickerTarget] = useState<"banner" | "icon" | null>(null)

  useEffect(() => {
    if (editingCategory) {
      setName(editingCategory.name)
      setParentId(editingCategory.parentId ? String(editingCategory.parentId) : "")
      setOrderLevel(editingCategory.orderLevel || 0)
      setBanner(editingCategory.banner || "")
      setIcon(editingCategory.icon || "")
    } else {
      setName("")
      setParentId("")
      setOrderLevel(0)
      setBanner("")
      setIcon("")
    }
  }, [editingCategory])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    await onSave({
      name: name.trim(),
      parentId: parentId ? Number(parentId) : null,
      orderLevel: Number(orderLevel) || 0,
      banner: banner || undefined,
      icon: icon || undefined,
    })

    if (!editingCategory) {
      setName("")
      setParentId("")
      setOrderLevel(0)
      setBanner("")
      setIcon("")
    }
  }

  const parentOptions = allCategories.filter(
    (c) => !editingCategory || String(c.id) !== String(editingCategory.id)
  )

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-xs p-5 self-start space-y-4">
      <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-800">
          {editingCategory ? "Edit Category" : "Add New Category"}
        </h2>
        {editingCategory && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="text-[11px] font-semibold text-slate-500 hover:text-red-600 flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            Cancel Edit
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Category Name */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Category Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Smart Electronics"
            className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 focus:outline-hidden focus:border-[#d43533]"
          />
        </div>

        {/* Parent Category (Active eCommerce 1:1) */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Parent Category</label>
          <select
            value={parentId}
            onChange={(e) => setParentId(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 bg-white focus:outline-hidden focus:border-[#d43533]"
          >
            <option value="">No Parent (Root Category)</option>
            {parentOptions.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Order Level */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Order Level / Sequence Number
          </label>
          <input
            type="number"
            value={orderLevel}
            onChange={(e) => setOrderLevel(parseInt(e.target.value, 10) || 0)}
            placeholder="0"
            className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 font-mono focus:outline-hidden focus:border-[#d43533]"
          />
          <p className="text-[10px] text-slate-400 mt-1">Lower numbers appear first in menu.</p>
        </div>

        {/* Banner */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Banner <span className="text-gray-400 font-normal">(200x200)</span>
          </label>
          <div className="flex rounded border border-slate-300 overflow-hidden text-xs">
            <button
              type="button"
              onClick={() => setPickerTarget("banner")}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 font-medium border-r border-slate-300 transition-colors shrink-0 cursor-pointer"
            >
              Browse
            </button>
            <div
              onClick={() => setPickerTarget("banner")}
              className="px-3 py-2 text-slate-500 bg-white flex-1 cursor-pointer truncate flex items-center"
            >
              {banner ? (
                <span className="text-slate-800 font-medium truncate">1 File selected</span>
              ) : (
                <span className="text-slate-400">Choose File</span>
              )}
            </div>
          </div>
          {banner && (
            <div className="mt-2 relative w-20 h-14 rounded border border-slate-200 overflow-hidden bg-slate-50">
              <Image src={banner} alt="Banner Preview" fill className="object-cover" />
              <button
                type="button"
                onClick={() => setBanner("")}
                className="absolute top-1 right-1 bg-black/60 hover:bg-black text-white rounded-full p-0.5 cursor-pointer"
                title="Remove"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Icon */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Icon <span className="text-gray-400 font-normal">(32x32)</span>
          </label>
          <div className="flex rounded border border-slate-300 overflow-hidden text-xs">
            <button
              type="button"
              onClick={() => setPickerTarget("icon")}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 font-medium border-r border-slate-300 transition-colors shrink-0 cursor-pointer"
            >
              Browse
            </button>
            <div
              onClick={() => setPickerTarget("icon")}
              className="px-3 py-2 text-slate-500 bg-white flex-1 cursor-pointer truncate flex items-center"
            >
              {icon ? (
                <span className="text-slate-800 font-medium truncate">1 File selected</span>
              ) : (
                <span className="text-slate-400">Choose File</span>
              )}
            </div>
          </div>
          {icon && (
            <div className="mt-2 relative w-12 h-12 rounded border border-slate-200 overflow-hidden bg-slate-50">
              <Image src={icon} alt="Icon Preview" fill className="object-contain p-1" />
              <button
                type="button"
                onClick={() => setIcon("")}
                className="absolute top-1 right-1 bg-black/60 hover:bg-black text-white rounded-full p-0.5 cursor-pointer"
                title="Remove"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 bg-[#d43533] text-white text-xs font-bold rounded shadow-xs hover:bg-[#b82a28] transition-colors flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Saving...</span>
            </>
          ) : editingCategory ? (
            <>
              <Save className="w-3.5 h-3.5" />
              <span>Update Category</span>
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" />
              <span>Save Category</span>
            </>
          )}
        </button>
      </form>

      <MediaPickerModal
        isOpen={pickerTarget !== null}
        onClose={() => setPickerTarget(null)}
        onSelect={(urls) => {
          if (urls.length > 0) {
            if (pickerTarget === "banner") setBanner(urls[0])
            if (pickerTarget === "icon") setIcon(urls[0])
          }
          setPickerTarget(null)
        }}
        title={pickerTarget === "icon" ? "Select Category Icon" : "Select Category Banner"}
      />
    </div>
  )
}
