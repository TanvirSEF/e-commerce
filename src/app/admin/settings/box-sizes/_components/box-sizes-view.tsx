"use client"

import React, { useState, useTransition } from "react"
import { Box, Plus, Trash2, Save, CheckCircle2, AlertCircle } from "lucide-react"
import { updateGenericSettingAction } from "@/app/actions/ecommerce-actions"
import type { BoxSizeItem } from "@/services/settings-service"

interface BoxSizesViewProps {
  initialSizes: BoxSizeItem[]
}

export function BoxSizesView({ initialSizes }: BoxSizesViewProps) {
  const [sizes, setSizes] = useState<BoxSizeItem[]>(initialSizes)
  const [newName, setNewName] = useState("")
  const [newLength, setNewLength] = useState(20)
  const [newWidth, setNewWidth] = useState(15)
  const [newHeight, setNewHeight] = useState(10)
  const [newMaxWeight, setNewMaxWeight] = useState(2)

  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim()) return

    const newItem: BoxSizeItem = {
      id: Date.now(),
      name: newName.trim(),
      length: Number(newLength),
      width: Number(newWidth),
      height: Number(newHeight),
      maxWeight: Number(newMaxWeight),
    }

    const updated = [...sizes, newItem]
    setSizes(updated)
    setNewName("")

    startTransition(async () => {
      const ok = await updateGenericSettingAction("box_sizes_settings", JSON.stringify(updated))
      if (ok) {
        setFeedback({ type: "success", text: "Packaging box size added" })
      } else {
        setFeedback({ type: "error", text: "Failed to save box size" })
      }
      setTimeout(() => setFeedback(null), 3000)
    })
  }

  const handleDelete = (id: number) => {
    const updated = sizes.filter((s) => s.id !== id)
    setSizes(updated)

    startTransition(async () => {
      const ok = await updateGenericSettingAction("box_sizes_settings", JSON.stringify(updated))
      if (ok) {
        setFeedback({ type: "success", text: "Box size removed" })
      } else {
        setFeedback({ type: "error", text: "Failed to update box sizes" })
      }
      setTimeout(() => setFeedback(null), 3000)
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Box className="w-5 h-5 text-[#d43533]" />
          Packaging Box Sizes
        </h1>
        <p className="text-xs text-gray-500">Configure standard parcel packaging box dimensions for courier volumetric pricing</p>
      </div>

      {feedback && (
        <div
          className={`flex items-center gap-2 p-3 text-xs rounded-lg border ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Box Sizes Table (7 cols) */}
        <div className="lg:col-span-7">
          <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-xs">
            <div className="border-b border-gray-200 px-5 py-3 bg-gray-50/50 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-700">Packaging Boxes</span>
              <span className="text-xs font-mono text-gray-400">{sizes.length} types</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-600">
                <thead className="bg-gray-50 text-gray-700 uppercase font-semibold border-b border-gray-200">
                  <tr>
                    <th className="py-3 px-4">Box Type</th>
                    <th className="py-3 px-4">Dimensions (L × W × H)</th>
                    <th className="py-3 px-4">Max Weight</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {sizes.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-3 px-4 font-semibold text-gray-900">{s.name}</td>
                      <td className="py-3 px-4 font-mono text-gray-700">
                        {s.length} × {s.width} × {s.height} cm
                      </td>
                      <td className="py-3 px-4 font-semibold text-emerald-700">{s.maxWeight} kg</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleDelete(s.id)}
                          disabled={isPending}
                          className="p-1 rounded text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete Box Size"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {sizes.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-xs text-gray-400">
                        No packaging box sizes configured yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right: Add Box Form (5 cols) */}
        <div className="lg:col-span-5">
          <form
            onSubmit={handleAdd}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs space-y-4"
          >
            <div className="border-b border-gray-100 pb-3">
              <h2 className="text-sm font-bold text-gray-900">Add Box Size</h2>
              <p className="text-xs text-gray-500">Register standard parcel container specs</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Box Type Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Standard Shoe Box, Flyer A4"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-900 focus:border-[#d43533] focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                  Length (cm)
                </label>
                <input
                  type="number"
                  min={1}
                  value={newLength}
                  onChange={(e) => setNewLength(Number(e.target.value))}
                  className="w-full rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs text-gray-900 focus:border-[#d43533] focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                  Width (cm)
                </label>
                <input
                  type="number"
                  min={1}
                  value={newWidth}
                  onChange={(e) => setNewWidth(Number(e.target.value))}
                  className="w-full rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs text-gray-900 focus:border-[#d43533] focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                  Height (cm)
                </label>
                <input
                  type="number"
                  min={1}
                  value={newHeight}
                  onChange={(e) => setNewHeight(Number(e.target.value))}
                  className="w-full rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs text-gray-900 focus:border-[#d43533] focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Max Weight Capacity (kg)
              </label>
              <input
                type="number"
                step="0.5"
                min={0.5}
                value={newMaxWeight}
                onChange={(e) => setNewMaxWeight(Number(e.target.value))}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-900 focus:border-[#d43533] focus:outline-hidden"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#d43533] py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#b82a28] transition-colors disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              {isPending ? "Adding..." : "Save Box Size"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
