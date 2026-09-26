"use client"

import React, { useState, useRef } from "react"
import { UploadCloud, Link as LinkIcon, X, CheckCircle, Loader2 } from "lucide-react"
import { type Upload } from "@/db/schema/uploads"
import { createUploadRecordAction } from "@/app/actions/ecommerce-actions"

interface UploadFileModalProps {
  isOpen: boolean
  onClose: () => void
  onUploaded: (files: Upload[]) => void
}

export function UploadFileModal({ isOpen, onClose, onUploaded }: UploadFileModalProps) {
  const [activeTab, setActiveTab] = useState<"file" | "url">("file")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [urlInput, setUrlInput] = useState("")
  const [urlName, setUrlName] = useState("")
  const [urlType, setUrlType] = useState("image")
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!isOpen) return null

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setIsUploading(true)
    setUploadError(null)

    try {
      const formData = new FormData()
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i])
      }
      formData.append("userId", "admin")

      const res = await fetch("/api/uploader", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to upload file")
      }

      onUploaded(data.files || [data.file])
      onClose()
    } catch (err: any) {
      console.error("Upload error:", err)
      setUploadError(err.message || "Upload failed. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!urlInput.trim() || !urlName.trim()) return
    setIsUploading(true)
    setUploadError(null)

    try {
      const ext = urlInput.split(".").pop()?.split("?")[0] || "jpg"
      const created = await createUploadRecordAction({
        fileOriginalName: urlName.trim(),
        fileName: urlInput.trim(),
        fileSize: 450000,
        extension: ext,
        type: urlType,
        externalLink: urlInput.trim(),
      })

      if (created) {
        onUploaded([created])
      }
      setUrlInput("")
      setUrlName("")
      onClose()
    } catch (err: any) {
      setUploadError(err.message || "Failed to save link")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h3 className="text-base font-bold text-gray-900">Upload to Media Library</h3>
            <p className="text-xs text-gray-500">Cloudinary cloud storage connected</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 px-6">
          <button
            onClick={() => setActiveTab("file")}
            className={`py-2.5 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "file"
                ? "border-[#d43533] text-[#d43533]"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            Upload from Device
          </button>
          <button
            onClick={() => setActiveTab("url")}
            className={`py-2.5 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "url"
                ? "border-[#d43533] text-[#d43533]"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            <LinkIcon className="w-4 h-4" />
            Add via URL
          </button>
        </div>

        {uploadError && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600">
            {uploadError}
          </div>
        )}

        {/* Tab 1: File Upload */}
        {activeTab === "file" && (
          <div className="p-6 space-y-4">
            <div
              onDragOver={(e) => {
                e.preventDefault()
                setDragOver(true)
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault()
                setDragOver(false)
                handleFileUpload(e.dataTransfer.files)
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                dragOver
                  ? "border-[#d43533] bg-red-50/50"
                  : "border-gray-300 hover:border-gray-400 bg-gray-50/60"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx,.mp4"
                className="hidden"
                onChange={(e) => handleFileUpload(e.target.files)}
                disabled={isUploading}
              />
              {isUploading ? (
                <div className="flex flex-col items-center justify-center py-4 space-y-3">
                  <Loader2 className="w-10 h-10 text-[#d43533] animate-spin" />
                  <p className="text-sm font-semibold text-gray-700">Uploading to Cloudinary CDN...</p>
                  <p className="text-xs text-gray-400">Optimizing and storing your media</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-red-50 text-[#d43533] rounded-full flex items-center justify-center mx-auto mb-3">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-gray-800">
                    Click to browse or drag and drop files here
                  </p>
                  <p className="text-xs text-gray-500">
                    JPG, PNG, WebP, SVG, GIF, PDF up to 10MB per file
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-gray-400 px-1">
              <span>Cloud Storage: Cloudinary (Fast CDN)</span>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="text-[#d43533] font-semibold hover:underline"
              >
                Browse Files
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: URL Input */}
        {activeTab === "url" && (
          <form onSubmit={handleUrlSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">File Name</label>
              <input
                type="text"
                value={urlName}
                onChange={(e) => setUrlName(e.target.value)}
                placeholder="e.g. promo-summer-banner.jpg"
                className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-[#d43533]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Direct Link (URL)</label>
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-[#d43533]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">File Type</label>
              <select
                value={urlType}
                onChange={(e) => setUrlType(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg outline-none bg-white"
              >
                <option value="image">Image</option>
                <option value="document">Document (PDF/DOC)</option>
                <option value="video">Video</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 text-xs rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUploading}
                className="px-4 py-2 bg-[#d43533] text-white text-xs font-semibold rounded-lg hover:bg-[#b82d2b] disabled:opacity-50"
              >
                {isUploading ? "Saving..." : "Add to Library"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
