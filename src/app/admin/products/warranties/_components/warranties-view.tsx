"use client"

import React, { useState } from "react"
import { ShieldCheck, Plus, Trash2, Search, CheckCircle2, Award } from "lucide-react"
import { createWarrantyAction, deleteWarrantyAction } from "@/app/actions/ecommerce-actions"
import type { WarrantyData } from "@/services/warranty-service"

interface WarrantiesViewProps {
  initialWarranties: WarrantyData[]
}

const DURATIONS = [
  "7 Days",
  "1 Month",
  "3 Months",
  "6 Months",
  "1 Year",
  "2 Years",
  "3 Years",
  "Lifetime",
]

export function WarrantiesView({ initialWarranties }: WarrantiesViewProps) {
  const [warranties, setWarranties] = useState<WarrantyData[]>(initialWarranties)
  const [search, setSearch] = useState("")

  // Form states
  const [text, setText] = useState("")
  const [duration, setDuration] = useState("1 Year")
  const [logo, setLogo] = useState("/assets/img/warranty.png")
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [successMsg, setSuccessMsg] = useState("")

  const filtered = warranties.filter(
    (w) =>
      w.text.toLowerCase().includes(search.toLowerCase()) ||
      w.duration.toLowerCase().includes(search.toLowerCase())
  )

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text) return

    setSaving(true)
    const res = await createWarrantyAction({ text, duration, logo })
    if (res.warranty) {
      setWarranties([res.warranty, ...warranties])
      setSuccessMsg(`Warranty "${text}" created successfully!`)
      setText("")
      setDuration("1 Year")
      setTimeout(() => setSuccessMsg(""), 3000)
    }
    setSaving(false)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this warranty policy?")) return
    setDeletingId(id)
    await deleteWarrantyAction(id)
    setWarranties((prev) => prev.filter((w) => w.id !== id))
    setDeletingId(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#d43533]" />
          Product Warranties & Guarantee Policies
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Configure warranty options that sellers and admins can assign to individual catalog products.
        </p>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-700 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {successMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Table Column (Col 7) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs space-y-4 p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-bold text-gray-900">Warranty Policies ({warranties.length})</h2>
            <div className="relative w-48">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search warranties..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#d43533]"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-gray-50 text-gray-700 font-semibold border-y border-gray-200">
                <tr>
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Warranty Details</th>
                  <th className="py-2.5 px-3">Duration</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((w, idx) => (
                  <tr key={w.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-2.5 px-3 font-mono text-gray-400 font-semibold">
                      {String(idx + 1).padStart(2, "0")}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-red-50 text-[#d43533] flex items-center justify-center shrink-0">
                          <Award className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-gray-900">{w.text}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold text-[11px]">
                        {w.duration}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleDelete(w.id)}
                        disabled={deletingId === w.id}
                        className="p-1 text-red-500 hover:text-red-700 disabled:opacity-50"
                        title="Delete warranty"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Form Column (Col 5) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-gray-200 p-5 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-[#d43533]" />
            Add New Warranty Policy
          </h2>

          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Warranty Statement / Text <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 2 Years Official Brand Warranty"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#d43533]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Warranty Period Duration <span className="text-red-500">*</span>
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:border-[#d43533]"
              >
                {DURATIONS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Warranty Badge Icon URL
              </label>
              <input
                type="text"
                value={logo}
                onChange={(e) => setLogo(e.target.value)}
                className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#d43533]"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 bg-[#d43533] hover:bg-[#b82a28] text-white text-xs font-bold rounded-lg shadow-sm transition-colors disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                {saving ? "Saving Policy..." : "Save Warranty Policy"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
