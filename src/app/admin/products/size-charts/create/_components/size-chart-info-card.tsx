"use client"

import React, { useState } from "react"
import { MediaPickerModal } from "@/components/ui/media-picker-modal"
import { X, Image as ImageIcon } from "lucide-react"

export interface CategoryItem {
  id: string
  name: string
  parentId?: string | null
}

interface SizeChartInfoCardProps {
  name: string
  setName: (val: string) => void
  categoryId: string
  setCategoryId: (val: string) => void
  categories: CategoryItem[]
  photos: string[]
  setPhotos: (val: string[]) => void
  description: string
  setDescription: (val: string) => void
}

export function SizeChartInfoCard({
  name,
  setName,
  categoryId,
  setCategoryId,
  categories,
  photos,
  setPhotos,
  description,
  setDescription,
}: SizeChartInfoCardProps) {
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false)

  const handleMediaSelect = (urls: string[]) => {
    // Add unique selected urls
    const merged = Array.from(new Set([...photos, ...urls]))
    setPhotos(merged)
  }

  const removePhoto = (urlToRemove: string) => {
    setPhotos(photos.filter((p) => p !== urlToRemove))
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
      <div className="p-4 border-b border-slate-100 bg-[#fafbfc]">
        <h5 className="mb-0 text-sm font-bold text-slate-800">
          Size Chart Information
        </h5>
      </div>

      <div className="p-5 space-y-4 text-xs">
        {/* Chart Name */}
        <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-2">
          <label className="md:col-span-3 text-slate-700 font-medium">
            Chart Name <span className="text-red-500">*</span>
          </label>
          <div className="md:col-span-9">
            <input
              type="text"
              name="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Chart Name"
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded focus:outline-none focus:border-[#d43533] focus:ring-1 focus:ring-[#d43533]/20 bg-white"
            />
          </div>
        </div>

        {/* Category */}
        <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-2">
          <label className="md:col-span-3 text-slate-700 font-medium">
            Category <span className="text-red-500">*</span>
          </label>
          <div className="md:col-span-9">
            <select
              name="category_id"
              required
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded focus:outline-none focus:border-[#d43533] focus:ring-1 focus:ring-[#d43533]/20 bg-white text-slate-800"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.parentId ? `— ${cat.name}` : cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Images */}
        <div className="grid grid-cols-1 md:grid-cols-12 items-start gap-2">
          <label className="md:col-span-3 text-slate-700 font-medium pt-2">
            Images
          </label>
          <div className="md:col-span-9 space-y-2">
            <div
              onClick={() => setIsMediaModalOpen(true)}
              className="flex items-stretch border border-slate-200 rounded cursor-pointer overflow-hidden bg-white hover:border-slate-300 transition-colors"
            >
              <div className="bg-slate-100 text-slate-700 px-3.5 py-2 text-xs font-medium border-r border-slate-200 shrink-0">
                Browse
              </div>
              <div className="px-3 py-2 text-xs text-slate-500 truncate flex-1">
                {photos.length > 0
                  ? `${photos.length} files selected`
                  : "Choose File"}
              </div>
            </div>

            {/* Thumbnail previews */}
            {photos.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {photos.map((url, idx) => (
                  <div
                    key={idx}
                    className="relative group w-14 h-14 border border-slate-200 rounded overflow-hidden bg-slate-50 shrink-0"
                  >
                    <img
                      src={url}
                      alt="Size Chart"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(url)}
                      className="absolute top-0.5 right-0.5 p-0.5 bg-red-600 text-white rounded-full opacity-80 hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <p className="text-[11px] text-slate-500 leading-tight">
              These images are visible in product size gide beside size description.
            </p>
          </div>
        </div>

        {/* Size Description */}
        <div className="grid grid-cols-1 md:grid-cols-12 items-start gap-2">
          <label className="md:col-span-3 text-slate-700 font-medium pt-2">
            Size Description
          </label>
          <div className="md:col-span-9">
            <textarea
              name="description"
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Size Description"
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded focus:outline-none focus:border-[#d43533] focus:ring-1 focus:ring-[#d43533]/20 bg-white"
            />
          </div>
        </div>
      </div>

      <MediaPickerModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        onSelect={handleMediaSelect}
        multiple={true}
        type="image"
        title="Choose Size Guide Images"
      />
    </div>
  )
}
