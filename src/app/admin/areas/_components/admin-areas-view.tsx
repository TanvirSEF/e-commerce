"use client"

import React, { useState } from "react"
import { MapPin, Plus, Edit2, Trash2, X, Search } from "lucide-react"

interface Area {
  id: number
  name: string
  city: string
  state: string
  country: string
  status: boolean
}

interface AdminAreasViewProps {
  initialAreas: Area[]
}

export function AdminAreasView({ initialAreas }: AdminAreasViewProps) {
  const [areas, setAreas] = useState<Area[]>(initialAreas)
  const [search, setSearch] = useState("")
  const [cityFilter, setCityFilter] = useState("all")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingArea, setEditingArea] = useState<Area | null>(null)

  // Form State
  const [formName, setFormName] = useState("")
  const [formCity, setFormCity] = useState("Dhaka")
  const [formState, setFormState] = useState("Dhaka Division")
  const [formCountry, setFormCountry] = useState("Bangladesh")
  const [formStatus, setFormStatus] = useState(true)

  const openAddModal = () => {
    setEditingArea(null)
    setFormName("")
    setFormCity("Dhaka")
    setFormState("Dhaka Division")
    setFormCountry("Bangladesh")
    setFormStatus(true)
    setIsModalOpen(true)
  }

  const openEditModal = (a: Area) => {
    setEditingArea(a)
    setFormName(a.name)
    setFormCity(a.city)
    setFormState(a.state)
    setFormCountry(a.country)
    setFormStatus(a.status)
    setIsModalOpen(true)
  }

  const handleToggleStatus = (id: number) => {
    setAreas((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: !a.status } : a))
    )
  }

  const handleDelete = (id: number) => {
    if (!confirm("Are you sure you want to delete this shipping area?")) return
    setAreas((prev) => prev.filter((a) => a.id !== id))
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formName.trim()) return

    if (editingArea) {
      setAreas((prev) =>
        prev.map((a) =>
          a.id === editingArea.id
            ? { ...a, name: formName, city: formCity, state: formState, country: formCountry, status: formStatus }
            : a
        )
      )
    } else {
      const newArea: Area = {
        id: Date.now(),
        name: formName,
        city: formCity,
        state: formState,
        country: formCountry,
        status: formStatus,
      }
      setAreas((prev) => [newArea, ...prev])
    }

    setIsModalOpen(false)
  }

  const filtered = areas.filter((a) => {
    if (cityFilter !== "all" && a.city !== cityFilter) return false
    if (search && !a.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="space-y-6">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">All Areas</h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage sub-city delivery zones, thanas, and delivery perimeters
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#d43533] hover:bg-[#b82d2b] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" /> Add New Area
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-bold text-gray-800">Areas List ({filtered.length})</h3>
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="text-xs px-2.5 py-1 border border-gray-200 rounded-lg outline-none bg-white text-gray-700"
            >
              <option value="all">All Cities</option>
              <option value="Dhaka">Dhaka</option>
              <option value="Chittagong">Chittagong</option>
            </select>
          </div>
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search area name..."
              className="text-xs pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg outline-none w-56 focus:border-[#d43533]"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/75 text-gray-500 font-semibold border-b border-gray-100 uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Area Name</th>
                <th className="py-3 px-4">City</th>
                <th className="py-3 px-4">State / Region</th>
                <th className="py-3 px-4">Country</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Options</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {filtered.map((area, idx) => (
                <tr key={area.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 px-4 font-mono text-gray-400">{idx + 1}</td>
                  <td className="py-3 px-4 font-bold text-gray-900">{area.name}</td>
                  <td className="py-3 px-4">{area.city}</td>
                  <td className="py-3 px-4 text-gray-600">{area.state}</td>
                  <td className="py-3 px-4 text-gray-500">{area.country}</td>
                  <td className="py-3 px-4">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={area.status}
                        onChange={() => handleToggleStatus(area.id)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openEditModal(area)}
                        className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(area.id)}
                        className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSave}
            className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-gray-800">
                {editingArea ? "Edit Area" : "Add New Area"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Area Name</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Gulshan 2"
                  className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-[#d43533]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  value={formCity}
                  onChange={(e) => setFormCity(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-[#d43533]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">State / Region</label>
                <input
                  type="text"
                  value={formState}
                  onChange={(e) => setFormState(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-[#d43533]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Country</label>
                <input
                  type="text"
                  value={formCountry}
                  onChange={(e) => setFormCountry(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-[#d43533]"
                  required
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-semibold text-gray-700">Status</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formStatus}
                    onChange={(e) => setFormStatus(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 text-xs rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#d43533] text-white text-xs font-semibold rounded-lg hover:bg-[#b82d2b]"
              >
                {editingArea ? "Update Area" : "Create Area"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
