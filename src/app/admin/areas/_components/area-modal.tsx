"use client"

import React, { useState, useEffect } from "react"
import { X } from "lucide-react"

export interface Area {
  id: number
  name: string
  city: string
  state: string
  country: string
  status: boolean
}

interface AreaModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: {
    id?: number
    name: string
    city: string
    state: string
    country: string
    status: boolean
  }) => void
  initialData?: Area | null
}

export function AreaModal({ isOpen, onClose, onSave, initialData }: AreaModalProps) {
  const [formName, setFormName] = useState("")
  const [formCity, setFormCity] = useState("Dhaka")
  const [formState, setFormState] = useState("Dhaka Division")
  const [formCountry, setFormCountry] = useState("Bangladesh")
  const [formStatus, setFormStatus] = useState(true)

  useEffect(() => {
    if (initialData) {
      setFormName(initialData.name)
      setFormCity(initialData.city)
      setFormState(initialData.state)
      setFormCountry(initialData.country)
      setFormStatus(initialData.status)
    } else {
      setFormName("")
      setFormCity("Dhaka")
      setFormState("Dhaka Division")
      setFormCountry("Bangladesh")
      setFormStatus(true)
    }
  }, [initialData, isOpen])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formName.trim()) return

    onSave({
      id: initialData?.id,
      name: formName.trim(),
      city: formCity.trim(),
      state: formState.trim(),
      country: formCountry.trim(),
      status: formStatus,
    })
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-5 shadow-xl animate-in fade-in zoom-in-95 duration-150">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b">
            <h3 className="font-bold text-gray-900 text-sm">
              {initialData ? "Edit Area" : "Add New Area"}
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Area Name <span className="text-red-500">*</span>
              </label>
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
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formCity}
                onChange={(e) => setFormCity(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-[#d43533]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                State / Region <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formState}
                onChange={(e) => setFormState(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-[#d43533]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Country <span className="text-red-500">*</span>
              </label>
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
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 text-xs rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#d43533] text-white text-xs font-semibold rounded-lg hover:bg-[#b82d2b]"
            >
              {initialData ? "Update Area" : "Create Area"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
