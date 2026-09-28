"use client"

import React, { useState } from "react"
import Image from "next/image"
import { X, Calendar, Loader2 } from "lucide-react"
import { createFlashDealAction } from "@/app/actions/ecommerce-actions"
import { MediaPickerModal } from "@/components/ui/media-picker-modal"

interface FlashDealItem {
  id: string
  title: string
  slug: string
  startDate: number
  endDate: number
  status: boolean
  featured: boolean
  banner?: string
}

interface CreateFlashDealModalProps {
  isOpen: boolean
  onClose: () => void
  onCreated: (deal: FlashDealItem) => void
}

export function CreateFlashDealModal({
  isOpen,
  onClose,
  onCreated,
}: CreateFlashDealModalProps) {
  const [title, setTitle] = useState("")
  const [startDateStr, setStartDateStr] = useState("")
  const [endDateStr, setEndDateStr] = useState("")
  const [banner, setBanner] = useState("")
  const [isPickerOpen, setIsPickerOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")

    if (!title || !startDateStr || !endDateStr) {
      setErrorMsg("Please fill in all required fields.")
      return
    }

    setSubmitting(true)
    try {
      const start = new Date(startDateStr).getTime()
      const end = new Date(endDateStr).getTime()

      const res = await createFlashDealAction({
        title,
        banner: banner || undefined,
        startDate: start,
        endDate: end,
      })

      if (res && res.deal) {
        onCreated(res.deal)
        onClose()
      } else {
        setErrorMsg("Failed to create flash deal campaign.")
      }
    } catch {
      setErrorMsg("An unexpected error occurred.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-900 text-sm">Create Flash Deal Campaign</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
            >
              <X className="size-4" />
            </button>
          </div>

          {errorMsg && (
            <div className="m-4 mb-0 p-2.5 bg-red-50 border border-red-200 text-red-600 text-xs rounded">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Campaign Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Mega Eid Flash Sale 2026"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-xs border border-gray-200 rounded p-2.5 focus:border-[#d43533] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    value={startDateStr}
                    onChange={(e) => setStartDateStr(e.target.value)}
                    className="w-full text-xs border border-gray-200 rounded p-2.5 focus:border-[#d43533] focus:outline-none bg-white"
                  />
                  <Calendar className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-3 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  End Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    value={endDateStr}
                    onChange={(e) => setEndDateStr(e.target.value)}
                    className="w-full text-xs border border-gray-200 rounded p-2.5 focus:border-[#d43533] focus:outline-none bg-white"
                  />
                  <Calendar className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-3 pointer-events-none" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Banner <span className="text-gray-400 font-normal">(800x400)</span>
              </label>
              <div className="flex rounded border border-gray-300 overflow-hidden text-xs">
                <button
                  type="button"
                  onClick={() => setIsPickerOpen(true)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 font-medium border-r border-gray-300 transition-colors shrink-0 cursor-pointer"
                >
                  Browse
                </button>
                <div
                  onClick={() => setIsPickerOpen(true)}
                  className="px-3 py-2 text-gray-500 bg-white flex-1 cursor-pointer truncate flex items-center"
                >
                  {banner ? (
                    <span className="text-gray-800 font-medium truncate">1 File selected</span>
                  ) : (
                    <span className="text-gray-400">Choose File</span>
                  )}
                </div>
              </div>
              {banner && (
                <div className="mt-2 relative w-32 h-16 rounded border border-gray-200 overflow-hidden bg-gray-50">
                  <Image
                    src={banner}
                    alt="Flash Deal Banner"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setBanner("")}
                    className="absolute top-1 right-1 bg-black/60 hover:bg-black text-white rounded-full p-0.5"
                    title="Remove"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded text-xs font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 rounded text-xs font-bold bg-[#d43533] hover:bg-[#b82a28] text-white shadow-xs disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
              >
                {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{submitting ? "Saving..." : "Save Campaign"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <MediaPickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onSelect={(urls) => {
          if (urls.length > 0) {
            setBanner(urls[0])
          }
          setIsPickerOpen(false)
        }}
        title="Select Flash Deal Banner"
      />
    </>
  )
}
