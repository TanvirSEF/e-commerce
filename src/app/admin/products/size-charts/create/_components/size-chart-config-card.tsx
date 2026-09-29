"use client"

import React, { useState } from "react"
import { Check, Plus, X } from "lucide-react"

export interface MeasurementPointItem {
  id: number
  name: string
}

export interface SizeConfigCardProps {
  fitType: string
  setFitType: (val: string) => void
  stretchType: string
  setStretchType: (val: string) => void
  availablePoints: MeasurementPointItem[]
  selectedPoints: number[]
  setSelectedPoints: (pts: number[]) => void
  availableSizes: string[]
  selectedSizes: string[]
  setSelectedSizes: (sizes: string[]) => void
  isInchChecked: boolean
  setIsInchChecked: (val: boolean) => void
  isCenChecked: boolean
  setIsCenChecked: (val: boolean) => void
}

export function SizeChartConfigCard({
  fitType,
  setFitType,
  stretchType,
  setStretchType,
  availablePoints,
  selectedPoints,
  setSelectedPoints,
  availableSizes,
  selectedSizes,
  setSelectedSizes,
  isInchChecked,
  setIsInchChecked,
  isCenChecked,
  setIsCenChecked,
}: SizeConfigCardProps) {
  const [pointSearch, setPointSearch] = useState("")
  const [isPointDropdownOpen, setIsPointDropdownOpen] = useState(false)
  const [sizeSearch, setSizeSearch] = useState("")
  const [isSizeDropdownOpen, setIsSizeDropdownOpen] = useState(false)

  const togglePoint = (id: number) => {
    if (selectedPoints.includes(id)) {
      setSelectedPoints(selectedPoints.filter((p) => p !== id))
    } else {
      setSelectedPoints([...selectedPoints, id])
    }
  }

  const toggleSize = (sz: string) => {
    if (selectedSizes.includes(sz)) {
      setSelectedSizes(selectedSizes.filter((s) => s !== sz))
    } else {
      setSelectedSizes([...selectedSizes, sz])
    }
  }

  const handleAddCustomSize = () => {
    const trimmed = sizeSearch.trim().toUpperCase()
    if (trimmed && !selectedSizes.includes(trimmed)) {
      setSelectedSizes([...selectedSizes, trimmed])
      setSizeSearch("")
    }
  }

  const filteredPoints = availablePoints.filter((p) =>
    p.name.toLowerCase().includes(pointSearch.toLowerCase())
  )

  const filteredSizes = availableSizes.filter((s) =>
    s.toLowerCase().includes(sizeSearch.toLowerCase())
  )

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
      <div className="p-4 border-b border-slate-100 bg-[#fafbfc]">
        <h5 className="mb-0 text-sm font-bold text-slate-800">
          Size Configuration
        </h5>
      </div>

      <div className="p-5 space-y-4 text-xs">
        {/* Fit Type */}
        <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-2">
          <label className="md:col-span-4 text-slate-700 font-medium">
            Fit Type
          </label>
          <div className="md:col-span-8">
            <select
              name="fit_type"
              value={fitType}
              onChange={(e) => setFitType(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded focus:outline-none focus:border-[#d43533] focus:ring-1 focus:ring-[#d43533]/20 bg-white text-slate-800"
            >
              <option value="">Select Fit Type</option>
              <option value="slim_fit">Slim Fit</option>
              <option value="regular_fit">Regular Fit</option>
              <option value="relaxed">Relaxed</option>
            </select>
          </div>
        </div>

        {/* Stretch Type */}
        <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-2">
          <label className="md:col-span-4 text-slate-700 font-medium">
            Stretch Type
          </label>
          <div className="md:col-span-8">
            <select
              name="stretch_type"
              value={stretchType}
              onChange={(e) => setStretchType(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded focus:outline-none focus:border-[#d43533] focus:ring-1 focus:ring-[#d43533]/20 bg-white text-slate-800"
            >
              <option value="">Select Stretch Type</option>
              <option value="non">Non</option>
              <option value="slight">Slight</option>
              <option value="medium">Medium</option>
              <option value="hign">Hign</option>
            </select>
          </div>
        </div>

        {/* Measurement Points */}
        <div className="grid grid-cols-1 md:grid-cols-12 items-start gap-2">
          <label className="md:col-span-4 text-slate-700 font-medium pt-2">
            Measurement Points <span className="text-red-500">*</span>
          </label>
          <div className="md:col-span-8 space-y-2 relative">
            {/* Selected Chips */}
            <div className="min-h-9 p-1.5 border border-slate-200 rounded bg-white flex flex-wrap gap-1.5 items-center">
              {selectedPoints.map((id) => {
                const pt = availablePoints.find((p) => p.id === id)
                return (
                  <span
                    key={id}
                    className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 text-[11px] px-2 py-0.5 rounded font-medium border border-slate-200"
                  >
                    {pt?.name || `Point #${id}`}
                    <button
                      type="button"
                      onClick={() => togglePoint(id)}
                      className="text-slate-400 hover:text-slate-700 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )
              })}
              <button
                type="button"
                onClick={() => setIsPointDropdownOpen(!isPointDropdownOpen)}
                className="text-[11px] text-[#d43533] hover:underline font-medium px-1 cursor-pointer"
              >
                {isPointDropdownOpen ? "Close list" : "+ Choose points"}
              </button>
            </div>

            {/* Dropdown list for multi-select */}
            {isPointDropdownOpen && (
              <div className="p-2 border border-slate-200 rounded shadow-md bg-white max-h-48 overflow-y-auto space-y-1 z-20">
                <input
                  type="text"
                  placeholder="Filter measurement points..."
                  value={pointSearch}
                  onChange={(e) => setPointSearch(e.target.value)}
                  className="w-full px-2 py-1 text-[11px] border border-slate-200 rounded mb-1 focus:outline-none"
                />
                {filteredPoints.map((pt) => {
                  const isSelected = selectedPoints.includes(pt.id)
                  return (
                    <div
                      key={pt.id}
                      onClick={() => togglePoint(pt.id)}
                      className={`flex items-center justify-between px-2 py-1 text-xs rounded cursor-pointer ${
                        isSelected
                          ? "bg-red-50 text-[#d43533] font-semibold"
                          : "hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      <span>{pt.name}</span>
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Size Options */}
        <div className="grid grid-cols-1 md:grid-cols-12 items-start gap-2">
          <label className="md:col-span-4 text-slate-700 font-medium pt-2">
            Size Options <span className="text-red-500">*</span>
          </label>
          <div className="md:col-span-8 space-y-2 relative">
            {/* Selected Chips */}
            <div className="min-h-9 p-1.5 border border-slate-200 rounded bg-white flex flex-wrap gap-1.5 items-center">
              {selectedSizes.map((sz) => (
                <span
                  key={sz}
                  className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 text-[11px] px-2 py-0.5 rounded font-medium border border-slate-200"
                >
                  {sz}
                  <button
                    type="button"
                    onClick={() => toggleSize(sz)}
                    className="text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <button
                type="button"
                onClick={() => setIsSizeDropdownOpen(!isSizeDropdownOpen)}
                className="text-[11px] text-[#d43533] hover:underline font-medium px-1 cursor-pointer"
              >
                {isSizeDropdownOpen ? "Close list" : "+ Choose sizes"}
              </button>
            </div>

            {/* Dropdown list for multi-select */}
            {isSizeDropdownOpen && (
              <div className="p-2 border border-slate-200 rounded shadow-md bg-white max-h-48 overflow-y-auto space-y-1 z-20">
                <div className="flex gap-1 mb-1">
                  <input
                    type="text"
                    placeholder="Search or add custom size..."
                    value={sizeSearch}
                    onChange={(e) => setSizeSearch(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleAddCustomSize()
                      }
                    }}
                    className="w-full px-2 py-1 text-[11px] border border-slate-200 rounded focus:outline-none"
                  />
                  {sizeSearch.trim() && (
                    <button
                      type="button"
                      onClick={handleAddCustomSize}
                      className="px-2 py-1 bg-slate-800 text-white text-[10px] rounded hover:bg-slate-700 shrink-0"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  )}
                </div>
                {filteredSizes.map((sz) => {
                  const isSelected = selectedSizes.includes(sz)
                  return (
                    <div
                      key={sz}
                      onClick={() => toggleSize(sz)}
                      className={`flex items-center justify-between px-2 py-1 text-xs rounded cursor-pointer ${
                        isSelected
                          ? "bg-red-50 text-[#d43533] font-semibold"
                          : "hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      <span>{sz}</span>
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Measurement Type */}
        <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-2 pt-1">
          <label className="md:col-span-4 text-slate-700 font-medium">
            Measurement Type
          </label>
          <div className="md:col-span-8 flex items-center gap-6">
            <label className="inline-flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isInchChecked}
                onChange={(e) => setIsInchChecked(e.target.checked)}
                className="w-4 h-4 rounded text-[#d43533] border-slate-300 focus:ring-[#d43533] cursor-pointer"
              />
              <span className="text-xs text-slate-700 font-medium">Inches</span>
            </label>

            <label className="inline-flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isCenChecked}
                onChange={(e) => setIsCenChecked(e.target.checked)}
                className="w-4 h-4 rounded text-[#d43533] border-slate-300 focus:ring-[#d43533] cursor-pointer"
              />
              <span className="text-xs text-slate-700 font-medium">
                Centimeter
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}
