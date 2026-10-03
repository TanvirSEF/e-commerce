"use client"

import React, { useState } from "react"
import { Plus, MoreVertical, Edit2, Trash2, Check, X, Loader2 } from "lucide-react"
import {
  createSellerAddressAction,
  updateSellerAddressAction,
  deleteSellerAddressAction,
  setDefaultSellerAddressAction,
} from "@/app/actions/seller-actions"
import type { customerAddresses } from "@/db/schema"

type CustomerAddressRow = typeof customerAddresses.$inferSelect

interface SellerAddressBookProps {
  initialAddresses: CustomerAddressRow[]
}

export function SellerAddressBook({ initialAddresses }: SellerAddressBookProps) {
  const [addresses, setAddresses] = useState<CustomerAddressRow[]>(initialAddresses)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [form, setForm] = useState({
    address: "",
    postalCode: "",
    city: "Dhaka",
    state: "Dhaka Division",
    country: "Bangladesh",
    phone: "",
    setDefault: false,
  })

  const openAddModal = () => {
    setEditingId(null)
    setForm({
      address: "",
      postalCode: "",
      city: "Dhaka",
      state: "Dhaka Division",
      country: "Bangladesh",
      phone: "+880 1711 000111",
      setDefault: addresses.length === 0,
    })
    setModalOpen(true)
  }

  const openEditModal = (addr: CustomerAddressRow) => {
    setEditingId(addr.id)
    setForm({
      address: addr.address,
      postalCode: addr.postalCode || "",
      city: addr.city || "Dhaka",
      state: addr.state || "",
      country: addr.country || "Bangladesh",
      phone: addr.phone || "",
      setDefault: !!addr.setDefault,
    })
    setActiveMenuId(null)
    setModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    setActiveMenuId(null)
    setAddresses((prev) => prev.filter((a) => a.id !== id))
    await deleteSellerAddressAction(id)
  }

  const handleMakeDefault = async (id: number) => {
    setActiveMenuId(null)
    setAddresses((prev) =>
      prev.map((a) => ({
        ...a,
        setDefault: a.id === id,
      }))
    )
    await setDefaultSellerAddressAction(id)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    if (editingId) {
      const res = await updateSellerAddressAction(editingId, form)
      if (res.success && res.data) {
        setAddresses((prev) =>
          prev.map((a) => (a.id === editingId ? (res.data as CustomerAddressRow) : form.setDefault ? { ...a, setDefault: false } : a))
        )
      }
    } else {
      const res = await createSellerAddressAction(form)
      if (res.success && res.data) {
        setAddresses((prev) => [
          res.data as CustomerAddressRow,
          ...(form.setDefault ? prev.map((a) => ({ ...a, setDefault: false })) : prev),
        ])
      }
    }
    setIsSubmitting(false)
    setModalOpen(false)
  }

  return (
    <div className="card bg-white border border-gray-200 rounded-sm shadow-xs overflow-hidden">
      <div className="card-header px-4 py-3 border-b border-gray-200 bg-white">
        <h5 className="mb-0 text-sm font-semibold text-gray-800">Address</h5>
      </div>
      <div className="card-body p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="border border-gray-200 rounded p-4 relative text-xs text-gray-700 bg-white"
            >
              <div className="space-y-1 pr-6">
                <div>
                  <span className="font-semibold text-gray-900 inline-block w-24">Address:</span>
                  <span>{address.address}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-900 inline-block w-24">Postal Code:</span>
                  <span>{address.postalCode || "-"}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-900 inline-block w-24">City:</span>
                  <span>{address.city || "-"}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-900 inline-block w-24">State:</span>
                  <span>{address.state || "-"}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-900 inline-block w-24">Country:</span>
                  <span>{address.country || "Bangladesh"}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-900 inline-block w-24">Phone:</span>
                  <span>{address.phone || "-"}</span>
                </div>
              </div>

              {address.setDefault && (
                <div className="mt-3">
                  <span className="inline-block px-2 py-0.5 text-[10px] font-semibold text-white bg-[#d43533] rounded">
                    default
                  </span>
                </div>
              )}

              {/* Action Dropdown */}
              <div className="absolute top-2 right-2">
                <button
                  type="button"
                  onClick={() =>
                    setActiveMenuId(activeMenuId === address.id ? null : address.id)
                  }
                  className="p-1 text-gray-400 hover:text-gray-700 rounded hover:bg-gray-100"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
                {activeMenuId === address.id && (
                  <div className="absolute right-0 top-7 w-36 bg-white border border-gray-200 rounded shadow-md z-10 py-1 text-xs">
                    <button
                      type="button"
                      onClick={() => openEditModal(address)}
                      className="w-full text-left px-3 py-1.5 hover:bg-gray-50 flex items-center gap-1.5 text-gray-700"
                    >
                      <Edit2 className="w-3 h-3" /> Edit
                    </button>
                    {!address.setDefault && (
                      <button
                        type="button"
                        onClick={() => handleMakeDefault(address.id)}
                        className="w-full text-left px-3 py-1.5 hover:bg-gray-50 flex items-center gap-1.5 text-gray-700"
                      >
                        <Check className="w-3 h-3" /> Make Default
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDelete(address.id)}
                      className="w-full text-left px-3 py-1.5 hover:bg-gray-50 flex items-center gap-1.5 text-red-600"
                    >
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Add New Address Card */}
          <div
            onClick={openAddModal}
            className="border-2 border-dashed border-gray-300 rounded p-6 text-center cursor-pointer hover:border-[#d43533] hover:bg-red-50/20 transition-all flex flex-col items-center justify-center min-h-[160px]"
          >
            <Plus className="w-7 h-7 text-gray-400 mb-1" />
            <div className="text-xs font-semibold text-gray-600">Add New Address</div>
          </div>
        </div>
      </div>

      {/* Modal for Add / Edit Address */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-sm border border-gray-200 shadow-xl w-full max-w-md p-5 space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h5 className="text-sm font-semibold text-gray-900">
                {editingId ? "Edit Address" : "Add New Address"}
              </h5>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Address <span className="text-[#d43533]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="Street / House / Road"
                  className="w-full px-3 py-2 border rounded focus:border-[#d43533] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">City</label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    placeholder="City"
                    className="w-full px-3 py-2 border rounded focus:border-[#d43533] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Postal Code</label>
                  <input
                    type="text"
                    value={form.postalCode}
                    onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                    placeholder="Postal Code"
                    className="w-full px-3 py-2 border rounded focus:border-[#d43533] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">State / Division</label>
                  <input
                    type="text"
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                    placeholder="State"
                    className="w-full px-3 py-2 border rounded focus:border-[#d43533] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Country</label>
                  <input
                    type="text"
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                    className="w-full px-3 py-2 border rounded focus:border-[#d43533] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Phone</label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+880 1..."
                  className="w-full px-3 py-2 border rounded focus:border-[#d43533] focus:outline-none"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={form.setDefault}
                  onChange={(e) => setForm({ ...form, setDefault: e.target.checked })}
                  className="rounded border-gray-300 text-[#d43533] focus:ring-[#d43533]"
                />
                <span className="text-gray-700">Set as default address</span>
              </label>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#d43533] text-white rounded hover:bg-[#b82a28]"
                >
                  {isSubmitting && <Loader2 className="w-3 h-3 animate-spin" />}
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
