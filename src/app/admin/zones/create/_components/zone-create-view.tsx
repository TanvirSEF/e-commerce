"use client"

import React, { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Layers, ArrowLeft, Save, AlertCircle } from "lucide-react"
import { createZoneAction } from "@/app/actions/ecommerce-actions"
import type { Country } from "@/db/schema"

interface ZoneCreateViewProps {
  countries: Country[]
}

export function ZoneCreateView({ countries }: ZoneCreateViewProps) {
  const router = useRouter()
  const [name, setName] = useState("")
  const [selectedCountries, setSelectedCountries] = useState<number[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleToggleCountry = (id: number) => {
    setSelectedCountries((prev) =>
      prev.includes(id) ? prev.filter((cId) => cId !== id) : [...prev, id]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError("Zone Name is required")
      return
    }

    startTransition(async () => {
      try {
        await createZoneAction({
          name: name.trim(),
          countryIds: selectedCountries,
        })
        router.push("/admin/zones")
        router.refresh()
      } catch (err) {
        setError("Failed to create zone")
      }
    })
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/zones"
          className="p-2 rounded-lg border border-gray-200 bg-white text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#d43533]" />
            Add New Shipping Zone
          </h1>
          <p className="text-xs text-gray-500">Group international or domestic territories into a shipping tier</p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 text-xs rounded-lg border bg-red-50 text-red-800 border-red-200">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs space-y-5">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Zone Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Asia Pacific Zone, GCC Region, North America Standard"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3.5 py-2 text-xs text-gray-900 focus:border-[#d43533] focus:outline-hidden"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-2">
            Select Countries for this Zone
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-60 overflow-y-auto p-3 border border-gray-100 rounded-lg bg-gray-50/50">
            {countries.map((c) => (
              <label
                key={c.id}
                className="flex items-center gap-2 text-xs text-gray-700 hover:text-gray-900 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedCountries.includes(c.id)}
                  onChange={() => handleToggleCountry(c.id)}
                  className="rounded border-gray-300 text-[#d43533] focus:ring-[#d43533]"
                />
                <span className="truncate">{c.name}</span>
              </label>
            ))}
          </div>
          <p className="text-[11px] text-gray-400 mt-1">
            {selectedCountries.length} countries selected
          </p>
        </div>

        <div className="pt-2 flex items-center justify-end gap-3">
          <Link
            href="/admin/zones"
            className="px-4 py-2 text-xs font-medium text-gray-600 hover:text-gray-900"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#d43533] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#b82a28] transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isPending ? "Saving..." : "Save Zone"}
          </button>
        </div>
      </form>
    </div>
  )
}
