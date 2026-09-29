"use client"

import React from "react"

interface AdminCategorySeoFieldsProps {
  metaTitle: string
  metaDescription: string
  metaKeywords: string
  onTitleChange: (val: string) => void
  onDescriptionChange: (val: string) => void
  onKeywordsChange: (val: string) => void
}

export function AdminCategorySeoFields({
  metaTitle,
  metaDescription,
  metaKeywords,
  onTitleChange,
  onDescriptionChange,
  onKeywordsChange,
}: AdminCategorySeoFieldsProps) {
  return (
    <div className="border-t border-slate-100 pt-3 space-y-3">
      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
        SEO Meta Tags
      </p>
      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">Meta Title</label>
        <input
          type="text"
          value={metaTitle}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Meta Title"
          className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 focus:outline-hidden focus:border-[#d43533]"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">Meta Description</label>
        <textarea
          rows={2}
          value={metaDescription}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Meta Description..."
          className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 focus:outline-hidden focus:border-[#d43533] resize-none"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">Meta Keywords</label>
        <input
          type="text"
          value={metaKeywords}
          onChange={(e) => onKeywordsChange(e.target.value)}
          placeholder="Keyword, Keyword (comma separated)"
          className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 focus:outline-hidden focus:border-[#d43533]"
        />
      </div>
    </div>
  )
}
