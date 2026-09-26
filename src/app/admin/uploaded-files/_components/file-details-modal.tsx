"use client"

import React, { useState } from "react"
import { X, Copy, CheckCircle, ExternalLink } from "lucide-react"
import { type Upload } from "@/db/schema/uploads"

interface FileDetailsModalProps {
  file: Upload | null
  onClose: () => void
}

export function FileDetailsModal({ file, onClose }: FileDetailsModalProps) {
  const [copied, setCopied] = useState(false)

  if (!file) return null

  const fileUrl = file.externalLink || file.fileName

  const handleCopy = () => {
    navigator.clipboard.writeText(fileUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatSize = (bytes: number) => {
    if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(1)} MB`
    if (bytes >= 1024) return `${(bytes / 1024).toFixed(0)} KB`
    return `${bytes} B`
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="text-sm font-bold text-gray-800">File Details</h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2.5 text-xs">
          <div className="flex justify-between py-1.5 border-b border-gray-100">
            <span className="text-gray-500 font-medium">File Name:</span>
            <span className="text-gray-800 font-semibold truncate max-w-[240px]">
              {file.fileOriginalName || file.fileName}
            </span>
          </div>

          <div className="flex justify-between py-1.5 border-b border-gray-100">
            <span className="text-gray-500 font-medium">File Size:</span>
            <span className="text-gray-800 font-semibold">{formatSize(file.fileSize || 0)}</span>
          </div>

          <div className="flex justify-between py-1.5 border-b border-gray-100">
            <span className="text-gray-500 font-medium">Type & Extension:</span>
            <span className="text-gray-800 font-semibold uppercase">
              {file.type || "FILE"} ({file.extension || "N/A"})
            </span>
          </div>

          <div className="flex justify-between py-1.5 border-b border-gray-100">
            <span className="text-gray-500 font-medium">Storage CDN:</span>
            <span className="text-gray-800 font-semibold">
              {fileUrl.includes("cloudinary.com") ? "Cloudinary CDN" : "External Storage"}
            </span>
          </div>

          <div className="flex justify-between py-1.5 border-b border-gray-100">
            <span className="text-gray-500 font-medium">Uploaded Date:</span>
            <span className="text-gray-800 font-semibold">
              {new Date(file.createdAt).toLocaleDateString()}
            </span>
          </div>

          <div className="pt-2">
            <label className="text-gray-500 font-medium block mb-1">Direct CDN URL:</label>
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                readOnly
                value={fileUrl}
                className="w-full text-[11px] p-2 bg-gray-50 border border-gray-200 rounded font-mono truncate"
              />
              <button
                onClick={handleCopy}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded text-gray-700"
                title="Copy Link"
              >
                {copied ? (
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
              <a
                href={fileUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded text-gray-700"
                title="Open in new tab"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="text-right pt-2 border-t">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-gray-900 text-white rounded-lg text-xs font-semibold hover:bg-black"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
