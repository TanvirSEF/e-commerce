"use client"

import React, { useState, useTransition } from "react"
import { MapPin, Plus, Search, CheckCircle2, AlertCircle } from "lucide-react"
import { createStateAction, toggleStateStatusAction } from "@/app/actions/ecommerce-actions"
import type { State, Country } from "@/db/schema"

interface StatesViewProps {
  initialStates: (State & { countryName?: string })[]
  countries: Country[]
}

export function StatesView({ initialStates, countries }: StatesViewProps) {
  const [states, setStates] = useState<(State & { countryName?: string })[]>(initialStates)
  const [search, setSearch] = useState("")
  const [countryFilter, setCountryFilter] = useState<number | "all">("all")

  // New state form
  const [newStateName, setNewStateName] = useState("")
  const [newCountryId, setNewCountryId] = useState<number>(countries[0]?.id || 1)

  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleToggle = (id: number, current: boolean) => {
    startTransition(async () => {
      const ok = await toggleStateStatusAction(id, !current)
      if (ok) {
        setStates((prev) => prev.map((s) => (s.id === id ? { ...s, status: !current } : s)))
        setFeedback({ type: "success", text: "State status updated" })
      } else {
        setFeedback({ type: "error", text: "Failed to update state status" })
      }
      setTimeout(() => setFeedback(null), 3000)
    })
  }

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newStateName.trim()) return

    startTransition(async () => {
      try {
        const created = await createStateAction({
          name: newStateName.trim(),
          countryId: newCountryId,
        })
        const selectedC = countries.find((c) => c.id === newCountryId)
        setStates((prev) => [{ ...created, countryName: selectedC?.name || "Country" }, ...prev])
        setNewStateName("")
        setFeedback({ type: "success", text: "State added successfully" })
      } catch (err) {
        setFeedback({ type: "error", text: "Failed to add state" })
      }
      setTimeout(() => setFeedback(null), 3000)
    })
  }

  const filtered = states.filter((s) => {
    const matchCountry = countryFilter === "all" || s.countryId === countryFilter
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase())
    return matchCountry && matchSearch
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-[#d43533]" />
          All States & Divisions
        </h1>
        <p className="text-xs text-gray-500">Configure regions, states, and administrative divisions</p>
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
        {/* Left: States Table (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Type state name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-gray-200 bg-white focus:border-[#d43533] focus:outline-hidden"
              />
            </div>
            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value === "all" ? "all" : Number(e.target.value))}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 focus:border-[#d43533] focus:outline-hidden"
            >
              <option value="all">All Countries</option>
              {countries.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-xs">
            <div className="border-b border-gray-200 px-5 py-3 bg-gray-50/50 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-700">States</span>
              <span className="text-xs font-mono text-gray-400">{filtered.length} entries</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-600">
                <thead className="bg-gray-50 text-gray-700 uppercase font-semibold border-b border-gray-200">
                  <tr>
                    <th className="py-3 px-4 w-12">#</th>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Country</th>
                    <th className="py-3 px-4 text-right">Show / Hide</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((state, idx) => (
                    <tr key={state.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-3 px-4 font-mono text-gray-400">{idx + 1}</td>
                      <td className="py-3 px-4 font-semibold text-gray-900">{state.name}</td>
                      <td className="py-3 px-4 text-gray-600">{state.countryName}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleToggle(state.id, state.status)}
                          disabled={isPending}
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                            state.status ? "bg-emerald-500" : "bg-gray-200"
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                              state.status ? "translate-x-4" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-xs text-gray-400">
                        No states found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right: Add New State Card (5 cols) */}
        <div className="lg:col-span-5">
          <form
            onSubmit={handleCreate}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs space-y-4"
          >
            <div className="border-b border-gray-100 pb-3">
              <h2 className="text-sm font-bold text-gray-900">Add New State</h2>
              <p className="text-xs text-gray-500">Attach a new state or division to an active country</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="State or Division Name"
                value={newStateName}
                onChange={(e) => setNewStateName(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-900 focus:border-[#d43533] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Country <span className="text-red-500">*</span>
              </label>
              <select
                value={newCountryId}
                onChange={(e) => setNewCountryId(Number(e.target.value))}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-900 focus:border-[#d43533] focus:outline-hidden"
              >
                {countries.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#d43533] py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#b82a28] transition-colors disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              {isPending ? "Adding..." : "Save State"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
