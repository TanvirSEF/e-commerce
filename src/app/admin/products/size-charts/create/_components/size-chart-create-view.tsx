"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { createSizeChartAction } from "@/app/actions/ecommerce-actions"
import { SizeChartInfoCard, type CategoryItem } from "./size-chart-info-card"
import {
  SizeChartConfigCard,
  type MeasurementPointItem,
} from "./size-chart-config-card"
import {
  SizeChartCombinationTable,
  type SizeCombinationValueMap,
} from "./size-chart-combination-table"
import { RefreshCw, AlertCircle } from "lucide-react"
import { type SizeMeasurementRow } from "@/db/schema"

interface SizeChartCreateViewProps {
  categories: CategoryItem[]
  measurementPoints: MeasurementPointItem[]
  initialSizes: string[]
}

export function SizeChartCreateView({
  categories,
  measurementPoints,
  initialSizes,
}: SizeChartCreateViewProps) {
  const router = useRouter()

  // Left card state
  const [name, setName] = useState("")
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "")
  const [photos, setPhotos] = useState<string[]>([])
  const [description, setDescription] = useState("")

  // Right card state
  const [fitType, setFitType] = useState("regular_fit")
  const [stretchType, setStretchType] = useState("slight")
  const [selectedPoints, setSelectedPoints] = useState<number[]>(
    measurementPoints.slice(0, 4).map((p) => p.id)
  )
  const [selectedSizes, setSelectedSizes] = useState<string[]>(
    initialSizes.length > 0 ? initialSizes.slice(0, 5) : ["S", "M", "L", "XL", "XXL"]
  )
  const [isInchChecked, setIsInchChecked] = useState(true)
  const [isCenChecked, setIsCenChecked] = useState(false)

  // Combination table state
  const [combinationValues, setCombinationValues] = useState<SizeCombinationValueMap>({})

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleValueChange = (
    pointId: number,
    size: string,
    unit: "inch" | "cen",
    val: string
  ) => {
    setCombinationValues((prev) => {
      const copy = { ...prev }
      if (!copy[pointId]) copy[pointId] = {}
      if (!copy[pointId][size]) copy[pointId][size] = {}
      copy[pointId][size] = {
        ...copy[pointId][size],
        [unit]: val,
      }
      return copy
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError("Chart Name is required")
      return
    }
    if (!categoryId) {
      setError("Category is required")
      return
    }
    if (selectedPoints.length === 0) {
      setError("Please choose at least one measurement point")
      return
    }
    if (selectedSizes.length === 0) {
      setError("Please choose at least one size option")
      return
    }
    if (!isInchChecked && !isCenChecked) {
      setError("Please select at least one measurement type (Inches or Centimeter)")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      // Build measurement rows for backward compatibility
      const pointMap = new Map(measurementPoints.map((p) => [p.id, p.name.toLowerCase()]))
      const rows: SizeMeasurementRow[] = selectedSizes.map((sz) => {
        const row: SizeMeasurementRow = { size: sz }
        for (const pid of selectedPoints) {
          const ptName = pointMap.get(pid) || `point_${pid}`
          const cell = combinationValues[pid]?.[sz]
          const val = isInchChecked ? cell?.inch : cell?.cen
          if (val) {
            if (ptName.includes("chest") || ptName.includes("bust")) row.chest = val
            else if (ptName.includes("waist")) row.waist = val
            else if (ptName.includes("hip")) row.hip = val
            else if (ptName.includes("length")) row.length = val
            else if (ptName.includes("shoulder")) row.shoulder = val
            else if (ptName.includes("inseam")) row.inseam = val
            else row[ptName] = val
          }
        }
        return row
      })

      const measurementOption: string[] = []
      if (isInchChecked) measurementOption.push("inch")
      if (isCenChecked) measurementOption.push("cen")

      // Convert combinationValues to serializable format
      const serializedValues: Record<string, Record<string, { inch?: string; cen?: string }>> = {}
      for (const [pid, sizeMap] of Object.entries(combinationValues)) {
        serializedValues[pid] = sizeMap
      }

      const res = await createSizeChartAction({
        name: name.trim(),
        categoryId: Number(categoryId),
        fitType,
        stretchType,
        photos: photos.join(","),
        description: description.trim(),
        measurementPoints: selectedPoints.map(String),
        sizeOptions: selectedSizes,
        measurementOption,
        unit: isInchChecked ? "in" : "cm",
        measurements: rows,
        sizeChartValues: serializedValues,
      })

      if (res) {
        router.push("/admin/products/size-charts")
      } else {
        setError("Failed to create size chart. Please check that category is unique.")
      }
    } catch (err) {
      console.error("Size chart create error:", err)
      setError("An unexpected error occurred while saving the size chart.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-5">
      {/* Titlebar (Active eCommerce 1:1) */}
      <div className="text-left mt-2 mb-3">
        <h5 className="mb-0 text-base font-bold text-slate-800">
          Add New Size Chart
        </h5>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 text-xs rounded-lg border bg-red-50 text-red-800 border-red-200 shadow-2xs">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Top 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-7">
            <SizeChartInfoCard
              name={name}
              setName={setName}
              categoryId={categoryId}
              setCategoryId={setCategoryId}
              categories={categories}
              photos={photos}
              setPhotos={setPhotos}
              description={description}
              setDescription={setDescription}
            />
          </div>

          <div className="lg:col-span-5">
            <SizeChartConfigCard
              fitType={fitType}
              setFitType={setFitType}
              stretchType={stretchType}
              setStretchType={setStretchType}
              availablePoints={measurementPoints}
              selectedPoints={selectedPoints}
              setSelectedPoints={setSelectedPoints}
              availableSizes={initialSizes}
              selectedSizes={selectedSizes}
              setSelectedSizes={setSelectedSizes}
              isInchChecked={isInchChecked}
              setIsInchChecked={setIsInchChecked}
              isCenChecked={isCenChecked}
              setIsCenChecked={setIsCenChecked}
            />
          </div>
        </div>

        {/* Dynamic Size Combination Matrix Table */}
        <SizeChartCombinationTable
          availablePoints={measurementPoints}
          selectedPoints={selectedPoints}
          selectedSizes={selectedSizes}
          isInchChecked={isInchChecked}
          isCenChecked={isCenChecked}
          combinationValues={combinationValues}
          onValueChange={handleValueChange}
        />

        {/* Bottom Toolbar Button (Active eCommerce 1:1) */}
        <div className="flex justify-end pt-2 mb-8">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-[230px] h-[42px] bg-[#28a745] hover:bg-[#218838] disabled:bg-slate-300 text-white font-bold text-sm rounded shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <span>Save</span>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
