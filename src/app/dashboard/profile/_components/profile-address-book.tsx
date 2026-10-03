"use client"

import React, { useState } from "react"
import { MapPin, Plus, X, Trash2, Loader2, Check } from "lucide-react"
import type { CustomerAddressItem } from "@/services/customer-extra-service"
import {
  addCustomerAddressAction,
  deleteCustomerAddressAction,
  setDefaultAddressAction,
} from "@/app/actions/ecommerce-actions"

interface ProfileAddressBookProps {
  initialAddresses: CustomerAddressItem[]
}

export function ProfileAddressBook({ initialAddresses }: ProfileAddressBookProps) {
  const [addresses, setAddresses] = useState<CustomerAddressItem[]>(initialAddresses)
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [newAddr, setNewAddr] = useState({
    address: "",
    city: "Dhaka",
    state: "",
    postalCode: "",
    country: "Bangladesh",
    phone: "",
  })

  const notify = (msg: string) => {
    setStatusMessage(msg)
    setTimeout(() => setStatusMessage(null), 3500)
  }

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newAddr.address || !newAddr.phone) return

    setIsSaving(true)
    try {
      const res = await addCustomerAddressAction({
        address: newAddr.address,
        city: newAddr.city,
        state: newAddr.state,
        postalCode: newAddr.postalCode,
        country: newAddr.country,
        phone: newAddr.phone,
        setDefault: addresses.length === 0,
        setBilling: addresses.length === 0,
      })

      if (res.success && res.item) {
        setAddresses([res.item, ...addresses])
        setShowAddressModal(false)
        setNewAddr({
          address: "",
          city: "Dhaka",
          state: "",
          postalCode: "",
          country: "Bangladesh",
          phone: "",
        })
        notify("Address added successfully!")
      } else {
        notify("Failed to save address.")
      }
    } catch {
      notify("Failed to save address.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteAddress = async (id: number) => {
    if (!confirm("Are you sure you want to delete this address?")) return
    const prev = [...addresses]
    setAddresses(addresses.filter((a) => a.id !== id))
    try {
      const res = await deleteCustomerAddressAction(id)
      if (!res.success) {
        setAddresses(prev)
        notify("Failed to delete address.")
      } else {
        notify("Address deleted successfully.")
      }
    } catch {
      setAddresses(prev)
      notify("Failed to delete address.")
    }
  }

  const handleSetDefaultShipping = async (id: number) => {
    setAddresses(
      addresses.map((a) => ({
        ...a,
        setDefault: a.id === id,
      }))
    )
    try {
      await setDefaultAddressAction(id, "shipping")
      notify("Default shipping address updated.")
    } catch {
      notify("Failed to set default shipping address.")
    }
  }

  const handleSetDefaultBilling = async (id: number) => {
    setAddresses(
      addresses.map((a) => ({
        ...a,
        setBilling: a.id === id,
      }))
    )
    try {
      await setDefaultAddressAction(id, "billing")
      notify("Default billing address updated.")
    } catch {
      notify("Failed to set default billing address.")
    }
  }

  return (
    <div className="rounded border border-gray-200 bg-white p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-5">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-[#d43533]" />
          <div>
            <h2 className="text-base font-bold text-gray-900">Address Book</h2>
            <p className="text-xs text-gray-500">Manage your shipping and billing destinations (1:1 Active eCommerce)</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowAddressModal(true)}
          className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1.5 text-xs font-bold text-[#1967d2] hover:bg-blue-100 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          Add New Address
        </button>
      </div>

      {statusMessage && (
        <div className="flex items-center gap-2 rounded border border-emerald-200 bg-emerald-50 p-2.5 text-xs text-emerald-800 mb-4 animate-in fade-in">
          <Check className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
          <span>{statusMessage}</span>
        </div>
      )}

      {addresses.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-gray-200 rounded text-xs text-gray-500">
          No addresses saved yet. Click &quot;Add New Address&quot; to add your delivery destination.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`rounded border p-4 text-xs transition-colors relative ${
                addr.setDefault ? "border-[#d43533] bg-red-50/15" : "border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-gray-900 text-sm">
                  {addr.city || "Delivery Address"}
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {addr.setDefault && (
                    <span className="rounded bg-red-100 px-2 py-0.5 text-[10px] font-bold text-[#d43533]">
                      Default Shipping
                    </span>
                  )}
                  {addr.setBilling && (
                    <span className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-[#1967d2]">
                      Default Billing
                    </span>
                  )}
                </div>
              </div>

              <p className="text-gray-600 line-clamp-2">
                {addr.address}
                {addr.city ? `, ${addr.city}` : ""}
                {addr.postalCode ? ` - ${addr.postalCode}` : ""}
                {addr.country ? `, ${addr.country}` : ""}
              </p>
              <p className="mt-1 font-semibold text-gray-800">Phone: {addr.phone || "N/A"}</p>

              <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-3">
                  {!addr.setDefault && (
                    <button
                      type="button"
                      onClick={() => handleSetDefaultShipping(addr.id)}
                      className="font-medium text-[#1967d2] hover:underline"
                    >
                      Make Default Shipping
                    </button>
                  )}
                  {!addr.setBilling && (
                    <button
                      type="button"
                      onClick={() => handleSetDefaultBilling(addr.id)}
                      className="font-medium text-emerald-600 hover:underline"
                    >
                      Make Default Billing
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteAddress(addr.id)}
                  className="text-gray-400 hover:text-red-600 transition-colors p-1"
                  title="Delete address"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Add Address */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded bg-white p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-150">
            <button
              type="button"
              onClick={() => setShowAddressModal(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2 border-b border-gray-100 pb-3 mb-4">
              <MapPin className="h-5 w-5 text-[#d43533]" />
              <h4 className="text-base font-bold text-gray-900">Add New Address</h4>
            </div>

            <form onSubmit={handleAddAddress} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Street Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Street / Road / Block / Sector"
                  value={newAddr.address}
                  onChange={(e) => setNewAddr({ ...newAddr, address: e.target.value })}
                  className="w-full rounded border border-gray-300 px-3 py-2 text-xs focus:border-[#d43533] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    value={newAddr.city}
                    onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                    className="w-full rounded border border-gray-300 px-3 py-2 text-xs focus:border-[#d43533] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Postal Code</label>
                  <input
                    type="text"
                    value={newAddr.postalCode}
                    onChange={(e) => setNewAddr({ ...newAddr, postalCode: e.target.value })}
                    className="w-full rounded border border-gray-300 px-3 py-2 text-xs focus:border-[#d43533] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Country</label>
                  <input
                    type="text"
                    value={newAddr.country}
                    onChange={(e) => setNewAddr({ ...newAddr, country: e.target.value })}
                    className="w-full rounded border border-gray-300 px-3 py-2 text-xs focus:border-[#d43533] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+880 1712 345678"
                    value={newAddr.phone}
                    onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                    className="w-full rounded border border-gray-300 px-3 py-2 text-xs focus:border-[#d43533] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="rounded border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded bg-[#d43533] px-5 py-2 text-xs font-bold text-white hover:bg-[#9d1b1a] transition-colors disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSaving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  <span>Save Address</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
