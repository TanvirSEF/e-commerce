"use client"

import React from "react"
import { Image as ImageIcon, Video } from "lucide-react"

interface CreateProductMediaCardProps {
  thumbnail: string
  setThumbnail: (v: string) => void
  galleryImages: string[]
  setGalleryImages: (v: string[]) => void
  videoProvider: string
  setVideoProvider: (v: string) => void
  videoLink: string
  setVideoLink: (v: string) => void
}

export function CreateProductMediaCard({
  thumbnail,
  setThumbnail,
  galleryImages,
  setGalleryImages,
  videoProvider,
  setVideoProvider,
  videoLink,
  setVideoLink,
}: CreateProductMediaCardProps) {
  return (
    <div className="card rounded-2 border border-gray-200 bg-white shadow-xs overflow-hidden">
      <div className="card-header px-4 py-3 border-b border-gray-100 bg-[#f8f9fb]">
        <h5 className="mb-0 text-sm font-semibold text-gray-800">Product Files & Media</h5>
      </div>
      <div className="card-body p-4 space-y-4">
        {/* Gallery Images */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-start">
          <label className="md:col-span-3 text-xs font-semibold text-gray-700 pt-2">
            Gallery Images <small className="text-gray-400 font-normal">(600x400)</small>
          </label>
          <div className="md:col-span-9 space-y-1">
            <div className="flex items-center rounded border border-gray-200 overflow-hidden bg-white">
              <span className="px-3 py-2 bg-gray-100 text-xs font-medium text-gray-700 border-r border-gray-200 shrink-0">
                Browse
              </span>
              <input
                type="text"
                placeholder="Paste image URLs separated by comma or upload"
                value={galleryImages.join(", ")}
                onChange={(e) =>
                  setGalleryImages(
                    e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean)
                  )
                }
                className="w-full px-3 py-2 text-xs text-gray-900 focus:outline-hidden"
              />
            </div>
            <p className="text-[11px] text-gray-400">
              Upload multiple images, each 600x400 pixels. [e.g. Images showing products from different angles.]
            </p>
          </div>
        </div>

        {/* Thumbnail Image */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-start">
          <label className="md:col-span-3 text-xs font-semibold text-gray-700 pt-2">
            Thumbnail Image <small className="text-gray-400 font-normal">(300x200)</small>
          </label>
          <div className="md:col-span-9 space-y-1">
            <div className="flex items-center rounded border border-gray-200 overflow-hidden bg-white">
              <span className="px-3 py-2 bg-gray-100 text-xs font-medium text-gray-700 border-r border-gray-200 shrink-0">
                Browse
              </span>
              <input
                type="text"
                placeholder="/assets/img/placeholder.jpg"
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                className="w-full px-3 py-2 text-xs text-gray-900 focus:outline-hidden"
              />
            </div>
            <p className="text-[11px] text-gray-400">
              Upload a primary image at 300x200 pixels for quick preview. [e.g. A front view of the product.]
            </p>
          </div>
        </div>

        {/* Video Provider */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-start">
          <label className="md:col-span-3 text-xs font-semibold text-gray-700 pt-2">Video Provider</label>
          <div className="md:col-span-9 space-y-1">
            <select
              value={videoProvider}
              onChange={(e) => setVideoProvider(e.target.value)}
              className="w-full rounded border border-gray-200 px-3 py-2 text-xs text-gray-900 bg-white focus:border-[#d43533] focus:outline-hidden"
            >
              <option value="youtube">Youtube</option>
              <option value="dailymotion">Dailymotion</option>
              <option value="vimeo">Vimeo</option>
            </select>
            <p className="text-[11px] text-gray-400">
              Select the video platform hosting the product video. [e.g. &quot;YouTube&quot;]
            </p>
          </div>
        </div>

        {/* Video Link */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-start">
          <label className="md:col-span-3 text-xs font-semibold text-gray-700 pt-2">Video Link</label>
          <div className="md:col-span-9 space-y-1">
            <input
              type="text"
              placeholder="e.g. https://www.youtube.com/watch?v=12345"
              value={videoLink}
              onChange={(e) => setVideoLink(e.target.value)}
              className="w-full rounded border border-gray-200 px-3 py-2 text-xs text-gray-900 focus:border-[#d43533] focus:outline-hidden"
            />
            <p className="text-[11px] text-gray-400">
              Provide the link to the product video.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
