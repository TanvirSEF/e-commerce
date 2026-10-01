"use client"

import React from "react"
import { Copy, CheckCircle, Info, Trash2, FileText, Download } from "lucide-react"
import type { Upload } from "@/db/schema/uploads"

interface UploadedFileCardProps {
  file: Upload
  isSelected: boolean
  copiedId: number | null
  onToggleSelect: (id: number) => void
  onCopyLink: (file: Upload) => void
  onShowDetails: (file: Upload) => void
  onDelete: (file: Upload) => void
}

export function UploadedFileCard({
  file,
  isSelected,
  copiedId,
  onToggleSelect,
  onCopyLink,
  onShowDetails,
  onDelete,
}: UploadedFileCardProps) {
  const isImage =
    file.type === "image" ||
    ["jpg", "jpeg", "png", "webp", "gif"].includes(file.extension || "")
  const fileUrl = file.externalLink || file.fileName

  const formatSize = (bytes: number) => {
    if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(1)} MB`
    if (bytes >= 1024) return `${(bytes / 1024).toFixed(0)} KB`
    return `${bytes} B`
  }

  return (
    <div
      className={`bg-white border rounded-xl p-2.5 shadow-2xs transition-all group relative flex flex-col justify-between ${
        isSelected
          ? "border-[#d43533] ring-1 ring-[#d43533]"
          : "border-slate-200 hover:border-slate-300"
      }`}
    >
      {/* Top Row: Checkbox + Actions */}
      <div className="flex items-center justify-between mb-2">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(file.id)}
          className="w-3.5 h-3.5 rounded text-[#d43533] focus:ring-[#d43533] cursor-pointer"
        />
        <div className="flex items-center gap-1">
          <button
            onClick={() => onCopyLink(file)}
            title={copiedId === file.id ? "Copied!" : "Copy Link"}
            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded"
          >
            {copiedId === file.id ? (
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            download={`${file.fileOriginalName || "download"}.${file.extension}`}
            title="Download"
            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded"
          >
            <Download className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={() => onShowDetails(file)}
            title="Details Info"
            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(file)}
            title="Delete"
            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Preview Thumbnail */}
      <div className="h-28 bg-slate-50 rounded-lg overflow-hidden flex items-center justify-center border border-slate-100">
        {isImage ? (
          <img
            src={fileUrl}
            alt={file.fileOriginalName || "Media thumbnail"}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="flex flex-col items-center gap-1 text-slate-400">
            <FileText className="w-8 h-8" />
            <span className="text-[10px] uppercase font-bold text-slate-500">
              {file.extension}
            </span>
          </div>
        )}
      </div>

      {/* Metadata */}
      <div className="mt-2.5">
        <p
          className="text-xs font-semibold text-slate-800 truncate"
          title={file.fileOriginalName || ""}
        >
          {file.fileOriginalName || file.fileName}
        </p>
        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
          <span>{formatSize(file.fileSize || 0)}</span>
          <span className="uppercase text-[10px] font-bold px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">
            {file.extension}
          </span>
        </div>
      </div>
    </div>
  )
}
