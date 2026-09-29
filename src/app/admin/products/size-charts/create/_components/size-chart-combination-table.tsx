"use client"

import React from "react"
import { MeasurementPointItem } from "./size-chart-config-card"
import { Layers } from "lucide-react"

export type SizeCombinationValueMap = Record<
  number, // pointId
  Record<
    string, // size
    { inch?: string; cen?: string }
  >
>

interface SizeChartCombinationTableProps {
  availablePoints: MeasurementPointItem[]
  selectedPoints: number[]
  selectedSizes: string[]
  isInchChecked: boolean
  isCenChecked: boolean
  combinationValues: SizeCombinationValueMap
  onValueChange: (
    pointId: number,
    size: string,
    unit: "inch" | "cen",
    val: string
  ) => void
}

export function SizeChartCombinationTable({
  availablePoints,
  selectedPoints,
  selectedSizes,
  isInchChecked,
  isCenChecked,
  combinationValues,
  onValueChange,
}: SizeChartCombinationTableProps) {
  const activePoints = availablePoints.filter((p) =>
    selectedPoints.includes(p.id)
  )

  const hasCombinations =
    activePoints.length > 0 &&
    selectedSizes.length > 0 &&
    (isInchChecked || isCenChecked)

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
      <div className="p-4 border-b border-slate-100 bg-[#fafbfc]">
        <h5 className="mb-0 text-sm font-bold text-slate-800">
          Size Combination
        </h5>
      </div>

      <div className="p-5">
        {!hasCombinations ? (
          <div className="py-8 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
            <Layers className="w-8 h-8 text-slate-300 stroke-[1.5]" />
            <p className="text-xs">
              Please choose at least one Measurement Point, one Size Option, and select a Measurement Type above to generate the size combination table.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto border border-slate-200 rounded">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-[#fafbfc] border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4 font-bold text-slate-700 w-44">
                    Measurement Points
                  </th>
                  {selectedSizes.map((sz) => (
                    <th
                      key={sz}
                      className="py-2.5 px-3 font-bold text-slate-700 text-center min-w-[120px]"
                    >
                      {sz}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {activePoints.map((point) => (
                  <tr key={point.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-semibold text-slate-800 align-middle bg-slate-50/30">
                      {point.name}
                    </td>
                    {selectedSizes.map((sz) => {
                      const current =
                        combinationValues[point.id]?.[sz] || {}
                      return (
                        <td key={sz} className="py-3 px-3 align-middle">
                          {isInchChecked && (
                            <input
                              type="text"
                              value={current.inch || ""}
                              onChange={(e) =>
                                onValueChange(
                                  point.id,
                                  sz,
                                  "inch",
                                  e.target.value
                                )
                              }
                              placeholder="Inches"
                              className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded focus:outline-none focus:border-[#d43533] focus:ring-1 focus:ring-[#d43533]/20 bg-white"
                            />
                          )}
                          {isCenChecked && (
                            <input
                              type="text"
                              value={current.cen || ""}
                              onChange={(e) =>
                                onValueChange(
                                  point.id,
                                  sz,
                                  "cen",
                                  e.target.value
                                )
                              }
                              placeholder="Centimeter"
                              className={`w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded focus:outline-none focus:border-[#d43533] focus:ring-1 focus:ring-[#d43533]/20 bg-white ${
                                isInchChecked ? "mt-2" : ""
                              }`}
                            />
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
