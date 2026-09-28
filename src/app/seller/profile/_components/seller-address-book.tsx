"use client"

import React, { useState } from "react"
import { MapPin, Plus, MoreVertical, Edit2, Trash2, Check, X } from "lucide-react"

export interface SellerAddress {
  id: string
  address: string
  postalCode: string
  area?: string
  city: string
  state?: string
  country: string
  phone: string
  isDefault?: boolean
}

const INITIAL_ADDRESSES: SellerAddress[] = [
  {
    id: "addr-seller-1",
    address: "Plot 12, Road 4, Sector 7, Uttara",
    postalCode: "1230",
    area: "Uttara",
    city: "Dhaka",
    state: "Dhaka Division",
    country: "Bangladesh",
    phone: "+880 1711 000111",
    isDefault: true,
  },
  {
    id: "addr-seller-2",
    address: "Holding 45, GEC Circle, Agrabad Commercial Area",
    postalCode: "4000",
    area: "Agrabad",
    city: "Chittagong",
    state: "Chittagong Division",
    country: "Bangladesh",
    phone: "+880 1819 223344",
    isDefault: false,
  },
]

export function SellerAddressBook() {
  const [addresses, setAddresses] = useState<SellerAddress[]>(INITIAL_ADDRESSES)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null)

  const [formData, setFormData] = useState<Omit<SellerAddress, "id">>({
    address: "",
    postalCode: "",
    area: "",
    city: "Dhaka",
    state: "Dhaka Division",
    country: "Bangladesh",
    phone: "",
    isDefault: false,
  })

  const openAddModal = () => {
    setEditingId(null)
    setFormData({
      address: "",
      postalCode: "",
      area: "",
      city: "Dhaka",
      state: "Dhaka Division",
      country: "Bangladesh",
      phone: "+880 1711 000111",
      isDefault: addresses.length === 0,
    })
    setModalOpen(true)
  }

  const openEditModal = (addr: SellerAddress) => {
    setEditingId(addr.id)
    setFormData({
      address: addr.address,
      postalCode: addr.postalCode,
      area: addr.area || "",
      city: addr.city,
      state: addr.state || "",
      country: addr.country,
      phone: addr.phone,
      isDefault: !!addr.isDefault,
    })
    setActiveMenuId(null)
    setModalOpen(true)
  }

  const handleDelete = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id))
    setActiveMenuId(null)
  }

  const handleMakeDefault = (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }))
    )
    setActiveMenuId(null)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId) {
      setAddresses((prev) =>
        prev.map((a) => (a.id === editingId ? { ...formData, id: editingId } : a))
      )
    } else {
      const newAddr: SellerAddress = {
        ...formData,
        id: `addr-seller-${Date.now()}`,
      }
      setAddresses((prev) => [...prev, newAddr])
    }
    setModalOpen(false)
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 sm:p-6 shadow-xs">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-5">
        <MapPin className="h-5 w-5 text-[#d43533]" />
        <div>
          <h2 className="text-base font-bold text-slate-800">Address</h2>
          <p className="text-xs text-slate-500">Manage your warehouse, pickup, and billing addresses</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className="border border-slate-200 rounded-lg p-4 relative bg-white hover:border-slate-300 transition-colors text-xs text-slate-700 space-y-1.5"
          >
            <div className="flex justify-between items-start">
              <span className="font-semibold text-slate-900 line-clamp-1">{addr.address}</span>
              {/* Menu */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setActiveMenuId(activeMenuId === addr.id ? null : addr.id)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
                {activeMenuId === addr.id && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setActiveMenuId(null)} />
                    <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-slate-200 rounded shadow-md z-40 py-1">
                      <button
                        type="button"
                        onClick={() => openEditModal(addr)}
                        className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        Edit
                      </button>
                      {!addr.isDefault && (
                        <button
                          type="button"
                          onClick={() => handleMakeDefault(addr.id)}
                          className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Make Default
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDelete(addr.id)}
                        className="w-full text-left px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div><span className="text-slate-400">Postal Code:</span> <span className="font-medium text-slate-800">{addr.postalCode}</span></div>
            {addr.area && <div><span className="text-slate-400">Area:</span> <span className="font-medium text-slate-800">{addr.area}</span></div>}
            <div><span className="text-slate-400">City:</span> <span className="font-medium text-slate-800">{addr.city}</span></div>
            {addr.state && <div><span className="text-slate-400">State:</span> <span className="font-medium text-slate-800">{addr.state}</span></div>}
            <div><span className="text-slate-400">Country:</span> <span className="font-medium text-slate-800">{addr.country}</span></div>
            <div><span className="text-slate-400">Phone:</span> <span className="font-medium text-slate-800">{addr.phone}</span></div>

            {addr.isDefault && (
              <div className="pt-2">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px] uppercase">
                  Default
                </span>
              </div>
            )}
          </div>
        ))}

        {/* Add New Address Card */}
        <button
          type="button"
          onClick={openAddModal}
          className="border-2 border-dashed border-slate-200 hover:border-[#d43533] hover:bg-red-50/20 rounded-lg p-6 flex flex-col items-center justify-center text-center transition-all group min-h-[160px]"
        >
          <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-[#d43533] text-slate-500 group-hover:text-white flex items-center justify-center transition-colors mb-2">
            <Plus className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-700 group-hover:text-[#d43533]">
            Add New Address
          </span>
        </button>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-in fade-in">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800">
                {editingId ? "Edit Address" : "Add New Address"}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Your Address *</label>
                <textarea
                  required
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Street address, building, floor"
                  className="w-full rounded border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:border-[#d43533] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Country *</label>
                  <input
                    type="text"
                    required
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full rounded border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:border-[#d43533] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full rounded border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:border-[#d43533] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Postal Code *</label>
                  <input
                    type="text"
                    required
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className="w-full rounded border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:border-[#d43533] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+880 1711..."
                    className="w-full rounded border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:border-[#d43533] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="default-address"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                  className="rounded text-[#d43533] focus:ring-[#d43533]"
                />
                <label htmlFor="default-address" className="text-xs text-slate-700 cursor-pointer">
                  Set as default address
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#d43533] hover:bg-[#b82927] text-white rounded font-bold transition-colors"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
