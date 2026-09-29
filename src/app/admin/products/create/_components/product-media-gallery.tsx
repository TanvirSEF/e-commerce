"use client"

import React, { useState } from "react"
import { UploadCloud, XCircle, Plus, Image as ImageIcon } from "lucide-react"
import { MediaPickerModal } from "@/components/ui/media-picker-modal"

interface ProductMediaGalleryProps {
  thumbnail: string
  photos: string[]
  description: string
  onThumbnailChange: (url: string) => void
  onPhotosChange: (photos: string[]) => void
  onDescriptionChange: (description: string) => void
}

export function ProductMediaGallery({
  thumbnail,
  photos,
  description,
  onThumbnailChange,
  onPhotosChange,
  onDescriptionChange,
}: ProductMediaGalleryProps) {
  const [isThumbnailPickerOpen, setIsThumbnailPickerOpen] = useState(false)
  const [isGalleryPickerOpen, setIsGalleryPickerOpen] = useState(false)

  const handleAddGalleryImages = (urls: string[]) => {
    if (urls.length > 0) {
      const merged = Array.from(new Set([...photos, ...urls]))
      onPhotosChange(merged)
    }
  }

  const handleRemoveGalleryImage = (indexToRemove: number) => {
    onPhotosChange(photos.filter((_, idx) => idx !== indexToRemove))
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-xs p-6 space-y-6">
      <h2 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center justify-between">
        <span>Product Images & Details</span>
        <span className="text-[11px] font-normal text-slate-400">Media gallery & descriptive copy</span>
      </h2>

      {/* 1. Main Thumbnail (Single) */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-slate-500" />
          <span>Product Main Thumbnail (300×300 or 600×600)</span>
        </label>
        {thumbnail && thumbnail !== "/assets/img/placeholder.jpg" ? (
          <div className="relative w-32 h-32 rounded-lg border border-slate-200 overflow-hidden group bg-white shadow-2xs">
            <img
              src={thumbnail}
              alt="Thumbnail"
              className="w-full h-full object-contain p-1"
            />
            <button
              type="button"
              onClick={() => onThumbnailChange("/assets/img/placeholder.jpg")}
              className="absolute top-1.5 right-1.5 p-1 bg-red-600 text-white rounded-full opacity-90 hover:opacity-100 transition shadow-xs"
              title="Remove Thumbnail"
            >
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div
            onClick={() => setIsThumbnailPickerOpen(true)}
            className="border-2 border-dashed border-slate-300 rounded-lg p-5 text-center hover:border-[#d43533] cursor-pointer transition-colors bg-slate-50 max-w-sm"
          >
            <UploadCloud className="w-7 h-7 mx-auto text-slate-400 mb-1.5" />
            <p className="text-xs font-semibold text-slate-700">Choose Main Thumbnail</p>
            <p className="text-[10px] text-slate-400">Cloudinary & Local Media Library</p>
          </div>
        )}
      </div>

      {/* 2. Gallery Images (Multiple Photos) */}
      <div className="pt-2 border-t border-slate-100">
        <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-slate-500" />
            <span>Product Gallery Images (Multi-Photos, 600×600)</span>
          </span>
          <span className="text-[11px] font-normal text-slate-400">
            {photos.length} image(s) selected
          </span>
        </label>

        <div className="flex flex-wrap items-center gap-3">
          {photos.map((url, idx) => (
            <div
              key={`${url}-${idx}`}
              className="relative w-24 h-24 rounded-lg border border-slate-200 overflow-hidden bg-white shadow-2xs group"
            >
              <img
                src={url}
                alt={`Gallery ${idx + 1}`}
                className="w-full h-full object-contain p-1"
              />
              <button
                type="button"
                onClick={() => handleRemoveGalleryImage(idx)}
                className="absolute top-1 right-1 p-0.5 bg-red-600 text-white rounded-full opacity-80 hover:opacity-100 transition shadow-xs"
                title="Remove photo"
              >
                <XCircle className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() => setIsGalleryPickerOpen(true)}
            className="w-24 h-24 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center gap-1 text-slate-500 hover:border-[#d43533] hover:text-[#d43533] transition-colors bg-slate-50"
            title="Add gallery images"
          >
            <Plus className="w-5 h-5" />
            <span className="text-[10px] font-bold">Add Images</span>
          </button>
        </div>
      </div>

      {/* 3. Product Description */}
      <div className="pt-2 border-t border-slate-100">
        <label className="block text-xs font-bold text-slate-700 mb-1">
          Product Description & Specifications
        </label>
        <textarea
          rows={5}
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Detailed product features, specifications, and warranty info..."
          className="w-full p-3 border border-slate-300 rounded text-xs text-slate-800 focus:outline-hidden focus:border-[#d43533]"
        />
      </div>

      {/* Modals */}
      <MediaPickerModal
        isOpen={isThumbnailPickerOpen}
        onClose={() => setIsThumbnailPickerOpen(false)}
        title="Select Product Thumbnail"
        multiple={false}
        onSelect={(urls) => {
          if (urls[0]) onThumbnailChange(urls[0])
        }}
      />

      <MediaPickerModal
        isOpen={isGalleryPickerOpen}
        onClose={() => setIsGalleryPickerOpen(false)}
        title="Select Gallery Images"
        multiple={true}
        onSelect={handleAddGalleryImages}
      />
    </div>
  )
}
