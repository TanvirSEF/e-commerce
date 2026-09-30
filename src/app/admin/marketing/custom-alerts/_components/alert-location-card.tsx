"use client"

import React from "react"

interface AlertLocationCardProps {
  currentLocation: string
  onLocationChange: (location: string) => void
}

const POSITIONS = [
  { id: "bottom-left", label: "From Bottom-left", badgePos: "bottom-2 left-2" },
  { id: "bottom-right", label: "From Bottom-right", badgePos: "bottom-2 right-2" },
  { id: "top-left", label: "From Top-left", badgePos: "top-2 left-2" },
  { id: "top-right", label: "From Top-right", badgePos: "top-2 right-2" },
] as const

export function AlertLocationCard({
  currentLocation,
  onLocationChange,
}: AlertLocationCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs">
      <h2 className="text-sm font-bold text-gray-900">Select Alert Location</h2>
      <p className="text-xs text-gray-500 mb-4">
        Select any alert location from following screen corners
      </p>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {POSITIONS.map((pos) => {
          const isSelected = (currentLocation || "bottom-left") === pos.id
          return (
            <div
              key={pos.id}
              onClick={() => onLocationChange(pos.id)}
              className={`relative cursor-pointer rounded-xl border-2 p-3 text-center transition-all ${
                isSelected
                  ? "border-[#d43533] bg-red-50/40 shadow-xs ring-2 ring-red-100"
                  : "border-gray-200 bg-gray-50/50 hover:border-gray-300"
              }`}
            >
              <div className="relative h-20 w-full rounded-md border border-gray-200 bg-white mb-2 overflow-hidden shadow-inner">
                <div className="h-2 w-full bg-gray-100 border-b border-gray-200" />
                <div className="p-1 space-y-1">
                  <div className="h-1.5 w-1/3 bg-gray-100 rounded" />
                  <div className="h-1.5 w-1/2 bg-gray-100 rounded" />
                </div>
                <div
                  className={`absolute ${pos.badgePos} h-3.5 w-10 rounded-sm bg-[#d43533] text-[6px] text-white flex items-center justify-center font-bold shadow-xs`}
                >
                  Alert
                </div>
              </div>

              <div className="flex items-center justify-center gap-1.5">
                <input
                  type="radio"
                  checked={isSelected}
                  onChange={() => onLocationChange(pos.id)}
                  className="h-3.5 w-3.5 text-[#d43533] focus:ring-[#d43533] cursor-pointer"
                />
                <span className="text-xs font-semibold text-gray-800">
                  {pos.label}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
