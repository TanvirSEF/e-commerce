"use client"

import React, { useState } from "react"
import { X, Ruler, Check } from "lucide-react"

interface SizeGuideModalProps {
  isOpen: boolean
  onClose: () => void
  categoryName?: string
}

export function SizeGuideModal({ isOpen, onClose, categoryName = "Apparel" }: SizeGuideModalProps) {
  const [unit, setUnit] = useState<"in" | "cm">("in")

  if (!isOpen) return null

  // Sizing chart data in inches and cm
  const rowsInches = [
    { size: "S", chest: "36 - 38", waist: "30 - 32", hips: "36 - 38", length: "27", shoulder: "17" },
    { size: "M", chest: "38 - 40", waist: "32 - 34", hips: "38 - 40", length: "28", shoulder: "18" },
    { size: "L", chest: "40 - 42", waist: "34 - 36", hips: "40 - 42", length: "29", shoulder: "19" },
    { size: "XL", chest: "42 - 44", waist: "36 - 38", hips: "42 - 44", length: "30", shoulder: "20" },
    { size: "XXL", chest: "44 - 46", waist: "38 - 40", hips: "44 - 46", length: "31", shoulder: "21" },
    { size: "3XL", chest: "46 - 48", waist: "40 - 42", hips: "46 - 48", length: "32", shoulder: "22" },
  ]

  const rowsCm = [
    { size: "S", chest: "91 - 96", waist: "76 - 81", hips: "91 - 96", length: "68", shoulder: "43" },
    { size: "M", chest: "96 - 101", waist: "81 - 86", hips: "96 - 101", length: "71", shoulder: "45" },
    { size: "L", chest: "101 - 106", waist: "86 - 91", hips: "101 - 106", length: "73", shoulder: "48" },
    { size: "XL", chest: "106 - 111", waist: "91 - 96", hips: "106 - 111", length: "76", shoulder: "50" },
    { size: "XXL", chest: "111 - 116", waist: "96 - 101", hips: "111 - 116", length: "78", shoulder: "53" },
    { size: "3XL", chest: "116 - 121", waist: "101 - 106", hips: "116 - 121", length: "81", shoulder: "55" },
  ]

  const rows = unit === "in" ? rowsInches : rowsCm

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-50 text-[#d43533] flex items-center justify-center">
              <Ruler className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Size & Fit Guide</h3>
              <p className="text-xs text-gray-500">Standard body measurements for {categoryName}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Unit Selector */}
        <div className="px-5 pt-4 flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Dimension Matrix
          </span>
          <div className="flex items-center bg-gray-100 p-0.5 rounded-lg text-xs font-semibold">
            <button
              type="button"
              onClick={() => setUnit("in")}
              className={`px-3 py-1 rounded-md transition-colors ${
                unit === "in" ? "bg-white text-gray-900 shadow-xs" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Inches (in)
            </button>
            <button
              type="button"
              onClick={() => setUnit("cm")}
              className={`px-3 py-1 rounded-md transition-colors ${
                unit === "cm" ? "bg-white text-gray-900 shadow-xs" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Centimeters (cm)
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="p-5 overflow-y-auto">
          <div className="overflow-x-auto border border-gray-200 rounded-xl">
            <table className="w-full text-xs text-left">
              <thead className="bg-gray-50 font-bold text-gray-700 border-b border-gray-200">
                <tr>
                  <th className="p-3">Size</th>
                  <th className="p-3">Chest</th>
                  <th className="p-3">Waist</th>
                  <th className="p-3">Hips</th>
                  <th className="p-3">Length</th>
                  <th className="p-3">Shoulder</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((r) => (
                  <tr key={r.size} className="hover:bg-gray-50 transition-colors">
                    <td className="p-3 font-bold font-mono text-[#d43533] bg-gray-50/50">
                      {r.size}
                    </td>
                    <td className="p-3 text-gray-700">{r.chest}</td>
                    <td className="p-3 text-gray-700">{r.waist}</td>
                    <td className="p-3 text-gray-700">{r.hips}</td>
                    <td className="p-3 text-gray-700">{r.length}</td>
                    <td className="p-3 text-gray-700">{r.shoulder}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200/60 text-[11px] text-amber-900 flex items-start gap-2">
            <span className="font-bold shrink-0 mt-0.5">Tip:</span>
            <span>If you are between two sizes, we recommend ordering the larger size for a relaxed comfortable fit.</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 text-right bg-gray-50/50">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-lg transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  )
}
