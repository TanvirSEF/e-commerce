"use client"

import React, { useState, useEffect } from "react"
import { X } from "lucide-react"

export interface Banner {
  id: number
  text: string
  link: string
  status: boolean
  createdAt: string
}

interface EditBannerModalProps {
  isOpen: boolean
  onClose: () => void
  banner: Banner | null
  onSave: (id: number, text: string, link: string) => void
}

export function EditBannerModal({
  isOpen,
  onClose,
  banner,
  onSave,
}: EditBannerModalProps) {
  const [text, setText] = useState("")
  const [link, setLink] = useState("")

  useEffect(() => {
    if (banner) {
      setText(banner.text)
      setLink(banner.link)
    }
  }, [banner, isOpen])

  if (!isOpen || !banner) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    onSave(banner.id, text.trim(), link.trim() || "#")
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-800">
            Edit Top Bar Announcement
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Text <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
              className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#d43533]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Redirect Link
            </label>
            <input
              type="text"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#d43533]"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs bg-[#d43533] hover:bg-[#b82d2b] text-white font-bold rounded-lg shadow-sm transition-colors"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
