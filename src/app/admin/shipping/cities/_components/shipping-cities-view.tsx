"use client"

import React, { useState, useTransition } from "react"
import {
  MapPin,
  Search,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Building2,
} from "lucide-react"
import {
  toggleCityDeliveryStatusAction,
  createShippingCityAction,
} from "@/app/actions/ecommerce-actions"
import type { ShippingCity } from "@/db/schema"

interface ShippingCitiesViewProps {
  initialCities: ShippingCity[]
}

const BANGLADESH_DIVISIONS = [
  "Dhaka",
  "Chattogram",
  "Sylhet",
  "Rajshahi",
  "Khulna",
  "Barishal",
  "Rangpur",
  "Mymensingh",
]

export function ShippingCitiesView({ initialCities }: ShippingCitiesViewProps) {
  const [cities, setCities] = useState<ShippingCity[]>(initialCities)
  const [search, setSearch] = useState("")
  const [selectedState, setSelectedState] = useState("")
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  // New City form state
  const [newName, setNewName] = useState("")
  const [newState, setNewState] = useState("Dhaka")
  const [newCost, setNewCost] = useState("60.00")

  const filteredCities = cities.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase())
    const matchState = !selectedState || c.state === selectedState
    return matchSearch && matchState
  })

  const handleToggleStatus = (id: number, currentStatus: boolean) => {
    startTransition(async () => {
      const res = await toggleCityDeliveryStatusAction(id, !currentStatus)
      if (res) {
        setCities((prev) =>
          prev.map((c) => (c.id === id ? { ...c, status: !currentStatus } : c))
        )
        setFeedback({ type: "success", text: "City delivery status updated" })
      } else {
        setFeedback({ type: "error", text: "Failed to update city status" })
      }
      setTimeout(() => setFeedback(null), 3000)
    })
  }

  const handleCreateCity = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName) {
      setFeedback({ type: "error", text: "City name is required" })
      return
    }

    startTransition(async () => {
      const created = await createShippingCityAction({
        name: newName,
        state: newState,
        cost: newCost,
      })

      if (created) {
        setCities((prev) => [created, ...prev])
        setNewName("")
        setFeedback({ type: "success", text: `City "${created.name}" created successfully` })
      } else {
        setFeedback({ type: "error", text: "Failed to create city" })
      }
      setTimeout(() => setFeedback(null), 3000)
    })
  }

  return (
    <div className="space-y-6">
      {/* Title Bar */}
      <div>
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <MapPin className="h-6 w-6 text-[#d43533]" />
          Regional Shipping Cities & Rates
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Manage destination cities, delivery availability, and regional flat-rate shipping surcharges
        </p>
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: 7 cols - Cities Table */}
        <div className="lg:col-span-7 rounded-xl border border-gray-200 bg-white shadow-xs">
          <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100">
            <h2 className="text-sm font-bold text-gray-900">
              All Cities ({filteredCities.length})
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs text-gray-700 focus:outline-hidden focus:border-[#d43533]"
              >
                <option value="">All Divisions</option>
                {BANGLADESH_DIVISIONS.map((div) => (
                  <option key={div} value={div}>
                    {div}
                  </option>
                ))}
              </select>

              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Filter city..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-gray-200 focus:outline-hidden focus:border-[#d43533]"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/75 border-b border-gray-100 text-gray-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">City Name</th>
                  <th className="px-4 py-3">Division</th>
                  <th className="px-4 py-3">Delivery Cost</th>
                  <th className="px-4 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {filteredCities.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-400">
                      No shipping cities found.
                    </td>
                  </tr>
                ) : (
                  filteredCities.map((city) => (
                    <tr key={city.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3 font-bold text-gray-900">
                        {city.name}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {city.state}
                      </td>
                      <td className="px-4 py-3 font-mono font-semibold text-[#d43533]">
                        ৳{parseFloat(city.cost || "0").toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(city.id, city.status)}
                          disabled={isPending}
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                            city.status ? "bg-emerald-500" : "bg-gray-200"
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                              city.status ? "translate-x-4" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: 5 cols - Add New City Form */}
        <div className="lg:col-span-5 rounded-xl border border-gray-200 bg-white p-5 shadow-xs h-fit space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <Building2 className="w-4 h-4 text-[#d43533]" />
            <h2 className="text-sm font-bold text-gray-900">Add New Shipping City</h2>
          </div>

          <form onSubmit={handleCreateCity} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                City / Area Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Uttara / Dhanmondi"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-[#d43533] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                State / Division <span className="text-red-500">*</span>
              </label>
              <select
                value={newState}
                onChange={(e) => setNewState(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-800 focus:border-[#d43533] focus:outline-hidden"
              >
                {BANGLADESH_DIVISIONS.map((div) => (
                  <option key={div} value={div}>
                    {div}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                Area-Wise Flat Delivery Cost (৳) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                placeholder="e.g. 60.00"
                value={newCost}
                onChange={(e) => setNewCost(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-[#d43533] focus:outline-hidden font-mono"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isPending}
                className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#d43533] py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#b02a28] transition"
              >
                <Plus className="w-4 h-4" />
                {isPending ? "Adding..." : "Save City"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
