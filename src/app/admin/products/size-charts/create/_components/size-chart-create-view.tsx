"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, RefreshCw } from "lucide-react"
import { createSizeChartAction } from "@/app/actions/ecommerce-actions"
import { type SizeMeasurementRow } from "@/db/schema"

interface CategoryOption {
  id: string
  name: string
}

interface SizeChartCreateViewProps {
  categories: CategoryOption[]
}

const DEFAULT_SIZES = ["S", "M", "L", "XL", "XXL", "3XL"]

export function SizeChartCreateView({ categories }: SizeChartCreateViewProps) {
  const router = useRouter()
  const [name, setName] = useState("")
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "1")
  const [fitType, setFitType] = useState("Regular")
  const [unit, setUnit] = useState<"in" | "cm">("in")
  const [measurements, setMeasurements] = useState<SizeMeasurementRow[]>(
    DEFAULT_SIZES.map((s) => ({
      size: s,
      chest: "",
      waist: "",
      hip: "",
      length: "",
      shoulder: "",
    }))
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleMeasurementChange = (
    index: number,
    field: keyof SizeMeasurementRow,
    value: string
  ) => {
    setMeasurements((prev) => {
      const copy = [...prev]
      copy[index] = { ...copy[index], [field]: value }
      return copy
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError("Please provide a name for the size chart.")
      return
    }

    setIsSubmitting(true)
    setError(null)
    try {
      const created = await createSizeChartAction({
        name: name.trim(),
        categoryId: Number(categoryId),
        fitType,
        unit,
        measurements: measurements.filter((m) => m.chest || m.waist || m.length),
      })
      if (created) {
        router.push("/admin/products/size-charts")
      } else {
        setError("Failed to save size chart.")
      }
    } catch {
      setError("Server error occurred while creating size chart.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Titlebar */}
      <div className="flex items-center justify-between pb-2 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products/size-charts"
            className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Create Size Chart</h1>
            <p className="text-xs sm:text-sm text-gray-500">
              Define body dimensions and garment specifications for customer size guides
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs sm:text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-6">
        {/* Header Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">
              Size Chart Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Men's Casual Shirts & T-Shirts"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-[#d43533] focus:bg-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">
              Target Category <span className="text-red-500">*</span>
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-[#d43533] focus:bg-white"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">Fit Type</label>
            <select
              value={fitType}
              onChange={(e) => setFitType(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs sm:text-sm text-gray-800"
            >
              <option value="Regular">Regular Fit</option>
              <option value="Slim">Slim Fit</option>
              <option value="Oversized">Oversized / Loose Fit</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">Measurement Unit</label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`flex items-center justify-center gap-2 p-2 border rounded-lg cursor-pointer text-xs font-semibold ${
                  unit === "in"
                    ? "border-blue-600 bg-blue-50/50 text-blue-900"
                    : "border-gray-200 bg-white text-gray-700"
                }`}
              >
                <input
                  type="radio"
                  name="unit"
                  value="in"
                  checked={unit === "in"}
                  onChange={() => setUnit("in")}
                  className="hidden"
                />
                <span>Inches (in)</span>
              </label>

              <label
                className={`flex items-center justify-center gap-2 p-2 border rounded-lg cursor-pointer text-xs font-semibold ${
                  unit === "cm"
                    ? "border-blue-600 bg-blue-50/50 text-blue-900"
                    : "border-gray-200 bg-white text-gray-700"
                }`}
              >
                <input
                  type="radio"
                  name="unit"
                  value="cm"
                  checked={unit === "cm"}
                  onChange={() => setUnit("cm")}
                  className="hidden"
                />
                <span>Centimeters (cm)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Measurement Matrix Table */}
        <div className="space-y-2 pt-2 border-t border-gray-100">
          <label className="text-xs sm:text-sm font-bold text-gray-800 block">
            Size Measurement Matrix ({unit.toUpperCase()})
          </label>
          <div className="overflow-x-auto border border-gray-200 rounded-xl">
            <table className="w-full text-xs text-left text-gray-700">
              <thead className="bg-gray-50 font-bold border-b border-gray-200 text-gray-700">
                <tr>
                  <th className="p-3 w-16">Size</th>
                  <th className="p-3">Chest / Bust ({unit})</th>
                  <th className="p-3">Waist ({unit})</th>
                  <th className="p-3">Hips ({unit})</th>
                  <th className="p-3">Length ({unit})</th>
                  <th className="p-3">Shoulder ({unit})</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {measurements.map((row, idx) => (
                  <tr key={row.size} className="hover:bg-gray-50">
                    <td className="p-3 font-mono font-bold text-gray-900 bg-gray-50/50">
                      {row.size}
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={row.chest || ""}
                        onChange={(e) =>
                          handleMeasurementChange(idx, "chest", e.target.value)
                        }
                        placeholder="e.g. 38-40"
                        className="w-full px-2 py-1 bg-white border border-gray-200 rounded text-xs"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={row.waist || ""}
                        onChange={(e) =>
                          handleMeasurementChange(idx, "waist", e.target.value)
                        }
                        placeholder="e.g. 32-34"
                        className="w-full px-2 py-1 bg-white border border-gray-200 rounded text-xs"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={row.hip || ""}
                        onChange={(e) =>
                          handleMeasurementChange(idx, "hip", e.target.value)
                        }
                        placeholder="e.g. 40"
                        className="w-full px-2 py-1 bg-white border border-gray-200 rounded text-xs"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={row.length || ""}
                        onChange={(e) =>
                          handleMeasurementChange(idx, "length", e.target.value)
                        }
                        placeholder="e.g. 28"
                        className="w-full px-2 py-1 bg-white border border-gray-200 rounded text-xs"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={row.shoulder || ""}
                        onChange={(e) =>
                          handleMeasurementChange(idx, "shoulder", e.target.value)
                        }
                        placeholder="e.g. 18"
                        className="w-full px-2 py-1 bg-white border border-gray-200 rounded text-xs"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 text-right">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#d43533] hover:bg-[#b82d2b] disabled:bg-gray-300 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition-colors"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Size Chart</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
