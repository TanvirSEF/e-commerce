"use client"

import React from "react"

interface AuctionCreateInfoCardProps {
  name: string
  setName: (v: string) => void
  slug: string
  setSlug: (v: string) => void
  thumbnail: string
  setThumbnail: (v: string) => void
  description: string
  setDescription: (v: string) => void
}

export function AuctionCreateInfoCard({
  name,
  setName,
  slug,
  setSlug,
  thumbnail,
  setThumbnail,
  description,
  setDescription,
}: AuctionCreateInfoCardProps) {
  const handleNameChange = (val: string) => {
    setName(val)
    const generatedSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "")
    setSlug(generatedSlug)
  }

  return (
    <div className="card rounded-2 border border-gray-200 bg-white shadow-xs overflow-hidden">
      <div className="card-header px-4 py-3 border-b border-gray-100 bg-[#f8f9fb]">
        <h5 className="mb-0 text-sm font-semibold text-gray-800">Auction Product Information</h5>
      </div>
      <div className="card-body p-4 space-y-4">
        {/* Product Name */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-start">
          <label className="md:col-span-3 text-xs font-semibold text-gray-700 pt-2">
            Product Title <span className="text-red-500">*</span>
          </label>
          <div className="md:col-span-9 space-y-1">
            <input
              type="text"
              required
              placeholder="e.g. Vintage Rolex Chronograph 1972"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full rounded border border-gray-200 px-3 py-2 text-xs text-gray-900 focus:border-[#d43533] focus:outline-hidden"
            />
            <p className="text-[11px] text-gray-400">
              Descriptive title of the auction collectible or item.
            </p>
          </div>
        </div>

        {/* Slug */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-start">
          <label className="md:col-span-3 text-xs font-semibold text-gray-700 pt-2">Slug</label>
          <div className="md:col-span-9">
            <input
              type="text"
              placeholder="slug-url"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full rounded border border-gray-200 px-3 py-2 text-xs font-mono text-gray-900 focus:border-[#d43533] focus:outline-hidden"
            />
          </div>
        </div>

        {/* Thumbnail Image */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-start">
          <label className="md:col-span-3 text-xs font-semibold text-gray-700 pt-2">
            Thumbnail Image <span className="text-red-500">*</span>
          </label>
          <div className="md:col-span-9 space-y-1">
            <div className="flex rounded border border-gray-200 overflow-hidden bg-white">
              <span className="px-3 py-2 bg-gray-100 text-xs font-medium text-gray-600 border-r border-gray-200 shrink-0">
                Browse
              </span>
              <input
                type="text"
                required
                placeholder="Image URL or choose file"
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                className="w-full px-3 py-2 text-xs text-gray-900 focus:outline-hidden"
              />
            </div>
            {thumbnail && (
              <div className="mt-2 w-16 h-16 rounded border border-gray-200 overflow-hidden bg-gray-50">
                <img
                  src={thumbnail}
                  alt="Thumbnail Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).src = "/assets/img/placeholder.jpg"
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Description & Authenticity */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-start">
          <label className="md:col-span-3 text-xs font-semibold text-gray-700 pt-2">
            Description & Notes
          </label>
          <div className="md:col-span-9">
            <textarea
              rows={4}
              placeholder="Condition grade, provenance, warranty, collector documentation..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded border border-gray-200 p-3 text-xs text-gray-900 focus:border-[#d43533] focus:outline-hidden"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
