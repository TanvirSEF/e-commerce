"use client"

import React, { useState } from "react"
import Image from "next/image"
import { MediaPickerModal } from "@/components/ui/media-picker-modal"
import type { BlogInputData } from "@/types/blog"

interface BlogSeoFieldsProps {
  formData: BlogInputData
  setFormData: React.Dispatch<React.SetStateAction<BlogInputData>>
}

export function BlogSeoFields({ formData, setFormData }: BlogSeoFieldsProps) {
  const [isMetaImgPickerOpen, setIsMetaImgPickerOpen] = useState(false)

  return (
    <>
      {/* Meta Title */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center">
        <label className="md:col-span-3 font-semibold text-slate-700">Meta Title</label>
        <div className="md:col-span-9">
          <input
            type="text"
            value={formData.metaTitle || ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, metaTitle: e.target.value }))}
            placeholder="Meta Title"
            className="w-full px-3 py-2 border border-slate-300 rounded text-slate-800 focus:outline-none focus:border-[#d43533]"
          />
        </div>
      </div>

      {/* Meta Image */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-start">
        <label className="md:col-span-3 font-semibold text-slate-700 pt-2">
          Meta Image <span className="text-[11px] text-slate-400 font-normal">(200x200)+</span>
        </label>
        <div className="md:col-span-9 space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={formData.metaImg || ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, metaImg: e.target.value }))}
              placeholder="Paste SEO meta image URL or browse..."
              className="flex-1 px-3 py-2 border border-slate-300 rounded text-slate-800 focus:outline-none focus:border-[#d43533]"
            />
            <button
              type="button"
              onClick={() => setIsMetaImgPickerOpen(true)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded border border-slate-300 transition-colors"
            >
              Browse
            </button>
          </div>
          {formData.metaImg && (
            <div className="relative w-20 h-20 rounded border border-slate-200 overflow-hidden bg-slate-50">
              <Image src={formData.metaImg} alt="Meta Image Preview" fill className="object-cover" />
            </div>
          )}
        </div>
      </div>

      {/* Meta Description */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-start">
        <label className="md:col-span-3 font-semibold text-slate-700 pt-2">
          Meta Description
        </label>
        <div className="md:col-span-9">
          <textarea
            rows={3}
            value={formData.metaDescription || ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, metaDescription: e.target.value }))}
            placeholder="SEO meta description..."
            className="w-full px-3 py-2 border border-slate-300 rounded text-slate-800 focus:outline-none focus:border-[#d43533]"
          />
        </div>
      </div>

      {/* Meta Keywords */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center">
        <label className="md:col-span-3 font-semibold text-slate-700">Meta Keywords</label>
        <div className="md:col-span-9">
          <input
            type="text"
            value={formData.metaKeywords || ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, metaKeywords: e.target.value }))}
            placeholder="keyword1, keyword2, keyword3"
            className="w-full px-3 py-2 border border-slate-300 rounded text-slate-800 focus:outline-none focus:border-[#d43533]"
          />
        </div>
      </div>

      <MediaPickerModal
        isOpen={isMetaImgPickerOpen}
        onClose={() => setIsMetaImgPickerOpen(false)}
        onSelect={(urls) => {
          if (urls.length > 0) setFormData((prev) => ({ ...prev, metaImg: urls[0] }))
        }}
        title="Select Meta Image"
      />
    </>
  )
}
