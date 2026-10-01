"use client"

import React from "react"
import { Star, ExternalLink } from "lucide-react"
import type { AvailableAddonItem } from "@/types/addon"

interface Props {
  addons: AvailableAddonItem[]
}

export function AvailableAddonsGrid({ addons }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {addons.map((item) => (
        <div
          key={item.id}
          className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
        >
          {/* Card Image */}
          <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Card Body */}
          <div className="p-4 flex-1 flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-semibold text-gray-800 line-clamp-1 mb-1">
                {item.name}
              </h4>

              {/* Rating */}
              <div className="flex items-center gap-0.5 text-amber-400 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>

              <p className="text-xs text-gray-500 line-clamp-3">
                {item.shortDescription}
              </p>
            </div>
          </div>

          {/* Card Footer matching index.blade.php */}
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <div className="text-base font-bold text-red-600">
              ${item.price}
            </div>

            {item.comingSoon ? (
              <span className="px-2.5 py-1 text-[11px] font-semibold text-gray-500 bg-gray-200 rounded">
                Coming Soon
              </span>
            ) : (
              <div className="flex items-center gap-1.5">
                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 rounded transition-colors inline-flex items-center gap-1"
                  >
                    <span>Preview</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {item.purchase && (
                  <a
                    href={item.purchase}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1 text-xs font-semibold text-white bg-[#1d3557] hover:bg-[#16304d] rounded transition-colors"
                  >
                    Purchase
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
