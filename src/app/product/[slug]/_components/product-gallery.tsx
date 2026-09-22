"use client"

import React, { useState } from "react"
import Image from "next/image"

interface ProductGalleryProps {
  images: string[]
  title: string
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const displayImages = images.length > 0 ? images : ["/assets/img/placeholder.jpg"]

  return (
    <div className="flex flex-col gap-3">
      {/* Main Large Image */}
      <div className="relative aspect-square w-full overflow-hidden rounded-md border border-gray-100 bg-white shadow-sm">
        <Image
          src={displayImages[activeIndex]}
          alt={title}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-contain p-4 transition-all duration-300"
          onError={(e) => {
            e.currentTarget.src = "/assets/img/placeholder.jpg"
          }}
        />
      </div>

      {/* Thumbnails Row */}
      {displayImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {displayImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded border bg-white p-1 transition-all ${
                activeIndex === idx
                  ? "border-[#d43533] ring-2 ring-[#d43533]/20"
                  : "border-gray-200 hover:border-gray-400"
              }`}
            >
              <Image
                src={img}
                alt={`${title} thumbnail ${idx + 1}`}
                fill
                className="object-contain"
                onError={(e) => {
                  e.currentTarget.src = "/assets/img/placeholder.jpg"
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProductGallery
