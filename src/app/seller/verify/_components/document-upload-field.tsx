"use client"

import React, { useState, useRef } from "react"
import {
  UploadCloud,
  FileText,
  Image as ImageIcon,
  FolderOpen,
  X,
  ExternalLink,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Link as LinkIcon,
} from "lucide-react"
import { MediaPickerModal } from "@/components/ui/media-picker-modal"

interface DocumentUploadFieldProps {
  value: string
  onChange: (url: string) => void
  disabled?: boolean
}

export function DocumentUploadField({
  value,
  onChange,
  disabled = false,
}: DocumentUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const isImage = value ? /\.(jpg|jpeg|png|webp|gif|svg)(\?.*)?$/i.test(value) : false
  const isPdf = value ? /\.pdf(\?.*)?$/i.test(value) : false

  const handleFile = async (file: File) => {
    if (!file) return

    // 15MB limit for identification documents
    if (file.size > 15 * 1024 * 1024) {
      setUploadError("File size exceeds 15MB limit.")
      return
    }

    setUploadError(null)
    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("userId", "seller")

      const res = await fetch("/api/uploader", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()
      if (data.success && (data.url || data.file?.externalLink)) {
        const fileUrl = data.url || data.file?.externalLink || data.file?.fileName
        onChange(fileUrl)
      } else {
        setUploadError(data.error || "Failed to upload document. Please try again.")
      }
    } catch (err: any) {
      setUploadError(err.message || "Network error while uploading document.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFile(file)
    }
    // Reset input value so same file can be re-selected if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled && !isUploading) setDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (disabled || isUploading) return

    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFile(file)
    }
  }

  return (
    <div className="space-y-3">
      {/* Hidden native file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx,.zip"
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {/* Upload Error Banner */}
      {uploadError && (
        <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Active Document Card Preview */}
      {value ? (
        <div className="bg-slate-50 border border-slate-200 rounded-md p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3 overflow-hidden">
            {isImage ? (
              <div className="relative size-12 rounded border border-gray-200 overflow-hidden bg-white shrink-0 shadow-2xs">
                <img src={value} alt="Document Scan" className="w-full h-full object-cover" />
              </div>
            ) : isPdf ? (
              <div className="size-12 rounded bg-red-100 text-red-700 font-bold text-xs flex flex-col items-center justify-center shrink-0 border border-red-200">
                <FileText className="w-5 h-5" />
                <span className="text-[9px] uppercase font-mono mt-0.5">PDF</span>
              </div>
            ) : (
              <div className="size-12 rounded bg-blue-100 text-blue-700 font-bold text-xs flex flex-col items-center justify-center shrink-0 border border-blue-200">
                <FileText className="w-5 h-5" />
                <span className="text-[9px] uppercase font-mono mt-0.5">DOC</span>
              </div>
            )}

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-gray-800 truncate block">
                  {value.split("/").pop() || "Document Attached"}
                </span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              </div>
              <p className="text-[11px] text-gray-400 truncate mt-0.5 max-w-[260px] sm:max-w-md">
                {value}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-medium rounded inline-flex items-center gap-1 transition-colors"
            >
              <ExternalLink className="w-3 h-3 text-gray-500" />
              Preview
            </a>
            {!disabled && (
              <>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1.5 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 text-xs font-medium rounded inline-flex items-center gap-1 transition-colors"
                  title="Replace Document"
                >
                  <UploadCloud className="w-3 h-3 text-gray-500" />
                  Change
                </button>
                <button
                  type="button"
                  onClick={() => onChange("")}
                  className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-medium rounded inline-flex items-center gap-1 transition-colors"
                  title="Remove Attached Document"
                >
                  <X className="w-3 h-3" />
                  Remove
                </button>
              </>
            )}
          </div>
        </div>
      ) : (
        /* Document Upload Dropzone & Actions */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-5 text-center transition-all ${
            dragActive
              ? "border-[#d43533] bg-red-50/40"
              : "border-gray-300 bg-gray-50/60 hover:bg-gray-50 hover:border-gray-400"
          }`}
        >
          {isUploading ? (
            <div className="py-4 flex flex-col items-center justify-center gap-2 text-gray-600">
              <Loader2 className="w-7 h-7 text-[#d43533] animate-spin" />
              <div className="text-xs font-semibold">Uploading document...</div>
              <div className="text-[11px] text-gray-400">Please wait while your file is securely uploaded.</div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-center">
                <div className="size-11 rounded-full bg-red-100/70 text-[#d43533] flex items-center justify-center">
                  <UploadCloud className="w-6 h-6" />
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-700">
                  Upload Trade License, NID, or Business ID Scan
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Drag and drop files here, or choose an option below (PDF, JPG, PNG, DOC - Max 15MB)
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={disabled}
                  className="px-3.5 py-1.5 bg-[#d43533] hover:bg-[#b82a28] text-white text-xs font-medium rounded inline-flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  Browse from Device
                </button>

                <button
                  type="button"
                  onClick={() => setPickerOpen(true)}
                  disabled={disabled}
                  className="px-3.5 py-1.5 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 text-xs font-medium rounded inline-flex items-center gap-1.5 transition-colors"
                >
                  <FolderOpen className="w-3.5 h-3.5 text-gray-500" />
                  Choose from Media Library
                </button>

                <button
                  type="button"
                  onClick={() => setShowUrlInput(!showUrlInput)}
                  className="px-2.5 py-1.5 text-gray-500 hover:text-gray-800 text-xs font-medium inline-flex items-center gap-1"
                >
                  <LinkIcon className="w-3 h-3" />
                  {showUrlInput ? "Hide Link Input" : "Insert External Link"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Optional Direct URL Input if user prefers pasting external link */}
      {showUrlInput && !value && (
        <div className="p-3 bg-white border border-gray-200 rounded text-xs space-y-1.5">
          <label className="text-gray-600 font-medium block">
            Direct Document URL (Google Drive, Dropbox, Cloud):
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="https://..."
              onChange={(e) => onChange(e.target.value)}
              className="w-full px-3 py-1.5 border border-gray-300 rounded focus:border-[#d43533] focus:outline-none"
            />
          </div>
          <p className="text-[10px] text-gray-400">
            Make sure public view permissions are enabled if using Google Drive or Dropbox links.
          </p>
        </div>
      )}

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        type="all"
        title="Select Verification Document"
        onSelect={(selected) => {
          if (selected.length > 0) {
            onChange(selected[0])
          }
        }}
      />
    </div>
  )
}
