"use client"

import React, { useState } from "react"
import { X } from "lucide-react"
import { type SizeMeasurementRow } from "@/db/schema"

export interface SizeChartDetailItem {
  id: number
  name: string
  categoryId: number
  categoryName: string
  fitType: string
  stretchType?: string
  unit: string
  description?: string
  photos?: string[]
  measurements: SizeMeasurementRow[]
}

interface SizeChartDetailModalProps {
  isOpen: boolean
  chart: SizeChartDetailItem | null
  onClose: () => void
}

export function SizeChartDetailModal({
  isOpen,
  chart,
  onClose,
}: SizeChartDetailModalProps) {
  const [activeUnit, setActiveUnit] = useState<"in" | "cm">("in")

  if (!isOpen || !chart) return null

  const points: (keyof SizeMeasurementRow)[] = ["chest", "waist", "hip", "length", "shoulder", "inseam"]
  const activePoints = points.filter((p) =>
    chart.measurements.some((m) => !!m[p])
  )

  const formatValue = (val?: string) => {
    if (!val) return "—"
    if (activeUnit === "cm") {
      // If values are e.g. "36-38" or "28", convert inches to cm approximately
      if (val.includes("-")) {
        const parts = val.split("-").map((v) => Math.round(Number(v.trim()) * 2.54))
        return `${parts[0]}-${parts[1]} cm`
      }
      const num = Number(val)
      return !isNaN(num) ? `${Math.round(num * 2.54)} cm` : val
    }
    return `${val} in`
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-[#fafbfc]">
          <div>
            <h3 className="text-sm font-bold text-slate-800">{chart.name}</h3>
            <p className="text-[11px] text-slate-500">Category: {chart.categoryName}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Fit & Stretch Type (Active eCommerce 1:1) */}
          <div className="grid grid-cols-2 gap-4 pb-3 border-b border-slate-100">
            <div>
              <span className="font-bold text-slate-700">Fit Type: </span>
              <span className="text-slate-600 font-medium capitalize">
                {chart.fitType || "Regular Fit"}
              </span>
            </div>
            <div>
              <span className="font-bold text-slate-700">Stretch Type: </span>
              <span className="text-slate-600 font-medium capitalize">
                {chart.stretchType || "Slight"}
              </span>
            </div>
          </div>

          {/* Unit Tabs (Inches / Centimeter) */}
          <div>
            <div className="flex border-b border-slate-200 mb-3">
              <button
                type="button"
                onClick={() => setActiveUnit("in")}
                className={`px-4 py-1.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                  activeUnit === "in"
                    ? "border-[#d43533] text-[#d43533]"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                Inches
              </button>
              <button
                type="button"
                onClick={() => setActiveUnit("cm")}
                className={`px-4 py-1.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                  activeUnit === "cm"
                    ? "border-[#d43533] text-[#d43533]"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                Centimeter
              </button>
            </div>

            {/* Measurement Matrix Table */}
            <div className="border border-slate-200 rounded overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Measurement Points</th>
                    {chart.measurements.map((m, i) => (
                      <th key={i} className="py-2.5 px-3 text-center uppercase">
                        {m.size}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {activePoints.map((point) => (
                    <tr key={point} className="hover:bg-slate-50/75">
                      <td className="py-2.5 px-3 font-semibold capitalize text-slate-800">
                        {point}
                      </td>
                      {chart.measurements.map((m, i) => (
                        <td key={i} className="py-2.5 px-3 text-center font-mono text-[11px]">
                          {formatValue(m[point])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Description */}
          {chart.description && (
            <div className="pt-2 border-t border-slate-100">
              <h4 className="font-bold text-slate-800 mb-1">Description:</h4>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line text-[11px]">
                {chart.description}
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-slate-100 bg-[#fafbfc] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
