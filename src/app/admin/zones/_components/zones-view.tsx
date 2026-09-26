"use client"

import React, { useState, useTransition } from "react"
import Link from "next/link"
import { Layers, Plus, CheckCircle2, AlertCircle } from "lucide-react"
import { toggleZoneStatusAction } from "@/app/actions/ecommerce-actions"
import type { Zone } from "@/db/schema"

interface ZonesViewProps {
  initialZones: (Zone & { countryCount?: number; countryNames?: string[] })[]
}

export function ZonesView({ initialZones }: ZonesViewProps) {
  const [zones, setZones] = useState<(Zone & { countryCount?: number; countryNames?: string[] })[]>(initialZones)
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleToggle = (id: number, current: boolean) => {
    startTransition(async () => {
      const ok = await toggleZoneStatusAction(id, !current)
      if (ok) {
        setZones((prev) => prev.map((z) => (z.id === id ? { ...z, status: !current } : z)))
        setFeedback({ type: "success", text: "Shipping zone status updated" })
      } else {
        setFeedback({ type: "error", text: "Failed to update zone status" })
      }
      setTimeout(() => setFeedback(null), 3000)
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#d43533]" />
            Shipping Zones
          </h1>
          <p className="text-xs text-gray-500">Group countries into logistics zones with custom delivery rates</p>
        </div>
        <Link
          href="/admin/zones/create"
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#d43533] px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#b82a28] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add New Zone
        </Link>
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

      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-xs">
        <div className="border-b border-gray-200 px-5 py-3 bg-gray-50/50">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-700">All Zones</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50 text-gray-700 uppercase font-semibold border-b border-gray-200">
              <tr>
                <th className="py-3 px-4 w-12">#</th>
                <th className="py-3 px-4">Zone Name</th>
                <th className="py-3 px-4">Assigned Countries</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {zones.map((zone, idx) => (
                <tr key={zone.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="py-3 px-4 font-mono text-gray-400">{idx + 1}</td>
                  <td className="py-3 px-4 font-semibold text-gray-900">{zone.name}</td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {zone.countryNames && zone.countryNames.length > 0 ? (
                        zone.countryNames.map((name) => (
                          <span
                            key={name}
                            className="inline-block rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-700"
                          >
                            {name}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400 italic text-[11px]">No countries attached</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => handleToggle(zone.id, zone.status)}
                      disabled={isPending}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                        zone.status ? "bg-emerald-500" : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                          zone.status ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
