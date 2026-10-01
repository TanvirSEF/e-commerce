"use client"

import React, { useState, useTransition } from "react"
import { Plus, Edit2, Trash2, Search, Loader2 } from "lucide-react"
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal"
import { AreaModal, type Area, type CityOption } from "./area-modal"
import {
  createAreaAction,
  updateAreaAction,
  toggleAreaStatusAction,
  deleteAreaAction,
} from "@/app/actions/area-actions"

interface AdminAreasViewProps {
  initialAreas: Area[]
  availableCities?: CityOption[]
}

export function AdminAreasView({ initialAreas, availableCities = [] }: AdminAreasViewProps) {
  const [areas, setAreas] = useState<Area[]>(initialAreas)
  const [search, setSearch] = useState("")
  const [cityFilter, setCityFilter] = useState("all")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingArea, setEditingArea] = useState<Area | null>(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [areaToDelete, setAreaToDelete] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [, startTransition] = useTransition()

  // Distinct cities for filter dropdown
  const filterCities = Array.from(
    new Set([
      ...areas.map((a) => a.city),
      ...availableCities.map((c) => c.name),
    ])
  ).filter(Boolean)

  const openAddModal = () => {
    setEditingArea(null)
    setIsModalOpen(true)
  }

  const openEditModal = (a: Area) => {
    setEditingArea(a)
    setIsModalOpen(true)
  }

  const handleToggleStatus = (id: number) => {
    const target = areas.find((a) => a.id === id)
    if (!target) return
    const newStatus = !target.status

    setAreas((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    )

    startTransition(async () => {
      await toggleAreaStatusAction(id, newStatus)
    })
  }

  const handleDeleteClick = (id: number) => {
    setAreaToDelete(id)
    setDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!areaToDelete) return
    setIsDeleting(true)
    try {
      const res = await deleteAreaAction(areaToDelete)
      if (res.success) {
        setAreas((prev) => prev.filter((a) => a.id !== areaToDelete))
      }
    } finally {
      setIsDeleting(false)
      setDeleteModalOpen(false)
      setAreaToDelete(null)
    }
  }

  const handleSave = async (data: {
    id?: number
    name: string
    city: string
    state: string
    country: string
    status: boolean
  }) => {
    setIsSaving(true)
    try {
      if (data.id) {
        const res = await updateAreaAction(data.id, {
          name: data.name,
          city: data.city,
          state: data.state,
          country: data.country,
          status: data.status,
        })
        if (res.success) {
          setAreas((prev) =>
            prev.map((a) => (a.id === data.id ? { ...a, ...data, id: data.id! } : a))
          )
        }
      } else {
        const res = await createAreaAction({
          name: data.name,
          city: data.city,
          state: data.state,
          country: data.country,
          status: data.status,
        })
        if (res.success && res.area) {
          const newArea: Area = {
            id: res.area.id,
            name: res.area.name,
            city: res.area.city,
            state: res.area.state,
            country: res.area.country,
            status: res.area.status,
          }
          setAreas((prev) => [newArea, ...prev])
        }
      }
      setIsModalOpen(false)
    } finally {
      setIsSaving(false)
    }
  }

  const filtered = areas.filter((a) => {
    if (cityFilter !== "all" && a.city.toLowerCase() !== cityFilter.toLowerCase()) return false
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
              {filterCities.map((cityName) => (
                <option key={cityName} value={cityName}>
                  {cityName}
                </option>
              ))}
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
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400">
                    No shipping areas found. Click &quot;Add New Area&quot; to create one.
                  </td>
                </tr>
              ) : (
                filtered.map((area, idx) => (
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
                          onClick={() => handleDeleteClick(area.id)}
                          disabled={isDeleting && areaToDelete === area.id}
                          className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          {isDeleting && areaToDelete === area.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-red-600" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AreaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingArea}
        availableCities={availableCities}
        isLoading={isSaving}
      />

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          if (!isDeleting) {
            setDeleteModalOpen(false)
            setAreaToDelete(null)
          }
        }}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="Delete Shipping Area"
        message="Are you sure you want to delete this shipping area? This cannot be undone."
      />
    </div>
  )
}
