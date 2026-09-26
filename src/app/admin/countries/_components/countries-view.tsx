"use client"

import React, { useState, useTransition } from "react"
import { Globe, Search, CheckCircle2, AlertCircle } from "lucide-react"
import { toggleCountryStatusAction } from "@/app/actions/ecommerce-actions"
import type { Country } from "@/db/schema"

interface CountriesViewProps {
  initialCountries: Country[]
}

export function CountriesView({ initialCountries }: CountriesViewProps) {
  const [countries, setCountries] = useState<Country[]>(initialCountries)
  const [search, setSearch] = useState("")
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleToggle = (id: number, current: boolean) => {
    startTransition(async () => {
      const ok = await toggleCountryStatusAction(id, !current)
      if (ok) {
        setCountries((prev) => prev.map((c) => (c.id === id ? { ...c, status: !current } : c)))
        setFeedback({ type: "success", text: "Country status updated" })
      } else {
        setFeedback({ type: "error", text: "Failed to update country status" })
      }
      setTimeout(() => setFeedback(null), 3000)
    })
  }

  const filtered = countries.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#d43533]" />
            Countries
          </h1>
          <p className="text-xs text-gray-500">Manage countries available for shipping and user registration</p>
        </div>
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

      {/* Filter Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Filter country by name or ISO code..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-gray-200 bg-white focus:border-[#d43533] focus:outline-hidden"
        />
      </div>

      {/* Countries Table */}
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-xs">
        <div className="border-b border-gray-200 px-5 py-3 bg-gray-50/50 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-700">Country List</span>
          <span className="text-xs font-mono text-gray-400">{filtered.length} entries</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50 text-gray-700 uppercase font-semibold border-b border-gray-200">
              <tr>
                <th className="py-3 px-4 w-12">#</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Dial Code</th>
                <th className="py-3 px-4 text-right">Show / Hide</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((country, idx) => (
                <tr key={country.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="py-3 px-4 font-mono text-gray-400">{idx + 1}</td>
                  <td className="py-3 px-4 font-semibold text-gray-900">{country.name}</td>
                  <td className="py-3 px-4 font-mono uppercase font-bold text-gray-700">{country.code}</td>
                  <td className="py-3 px-4 font-mono text-gray-500">{country.phoneCode || "-"}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleToggle(country.id, country.status)}
                      disabled={isPending}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                        country.status ? "bg-emerald-500" : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                          country.status ? "translate-x-4" : "translate-x-0"
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
