"use client"

import React, { useState } from "react"
import { Plus, Check, MapPin, X } from "lucide-react"

export interface AddressData {
  id: string
  name: string
  email: string
  phone: string
  address: string
  city: string
  postalCode: string
  country: string
  isDefault?: boolean
}

interface ShippingStepProps {
  selectedAddressId: string
  onSelectAddress: (address: AddressData) => void
  addresses: AddressData[]
  onAddNewAddress: (address: AddressData) => void
  sameAsShipping: boolean
  setSameAsShipping: (val: boolean) => void
}

export function ShippingStep({
  selectedAddressId,
  onSelectAddress,
  addresses,
  onAddNewAddress,
  sameAsShipping,
  setSameAsShipping,
}: ShippingStepProps) {
  const [activeTab, setActiveTab] = useState<"shipping" | "billing">("shipping")
  const [showModal, setShowModal] = useState(false)

  // New Address Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "Dhaka",
    postalCode: "",
    country: "Bangladesh",
  })

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.phone || !formData.address) return

    const newAddr: AddressData = {
      id: `addr-${Date.now()}`,
      ...formData,
    }

    onAddNewAddress(newAddr)
    onSelectAddress(newAddr)
    setShowModal(false)
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "Dhaka",
      postalCode: "",
      country: "Bangladesh",
    })
  }

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          type="button"
          onClick={() => setActiveTab("shipping")}
          className={`pb-2.5 text-sm font-bold transition-colors relative mr-6 ${
            activeTab === "shipping"
              ? "text-gray-900 border-b-2 border-[#d43533]"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          Shipping Address
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("billing")}
          className={`pb-2.5 text-sm font-bold transition-colors relative ${
            activeTab === "billing"
              ? "text-gray-900 border-b-2 border-[#d43533]"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          Billing Address
        </button>
      </div>

      {activeTab === "shipping" ? (
        <div className="space-y-3">
          {/* Address Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {addresses.map((addr) => {
              const isSelected = addr.id === selectedAddressId
              return (
                <div
                  key={addr.id}
                  onClick={() => onSelectAddress(addr)}
                  className={`relative cursor-pointer rounded border p-4 transition-all ${
                    isSelected
                      ? "border-[#d43533] bg-red-50/20 shadow-sm"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                          isSelected
                            ? "border-[#d43533] bg-[#d43533] text-white"
                            : "border-gray-300 bg-white"
                        }`}
                      >
                        {isSelected && <Check className="h-2.5 w-2.5" />}
                      </div>
                      <span className="text-sm font-bold text-gray-900">{addr.name}</span>
                    </div>
                    {addr.isDefault && (
                      <span className="rounded bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600">
                        Default
                      </span>
                    )}
                  </div>

                  <div className="mt-2.5 text-xs text-gray-600 space-y-1">
                    <p className="line-clamp-2">
                      {addr.address}, {addr.city} {addr.postalCode && `- ${addr.postalCode}`},{" "}
                      {addr.country}
                    </p>
                    <p className="font-medium text-gray-800">Phone: {addr.phone}</p>
                    {addr.email && <p className="text-gray-500">Email: {addr.email}</p>}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Add New Address Trigger & Same as Billing Checkbox */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={sameAsShipping}
                onChange={(e) => setSameAsShipping(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-[#d43533] focus:ring-[#d43533] cursor-pointer"
              />
              <span>Use this as billing address</span>
            </label>

            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50/70 px-4 py-2 text-xs font-bold text-[#1967d2] hover:bg-blue-100 transition-colors self-start sm:self-auto"
            >
              <Plus className="h-3.5 w-3.5" />
              Add New Address
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded border border-gray-200 bg-gray-50/50 p-4 text-xs text-gray-600">
          {sameAsShipping ? (
            <p>
              Your billing address is currently set to the same as your shipping address. Uncheck
              &quot;Use this as billing address&quot; under Shipping Address if you want a separate
              billing destination.
            </p>
          ) : (
            <p>
              Separate billing address active. Delivery invoices will be issued to this billing entity.
            </p>
          )}
        </div>
      )}

      {/* Modal: Add New Address */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded bg-white p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-150">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2 border-b border-gray-100 pb-3 mb-4">
              <MapPin className="h-5 w-5 text-[#d43533]" />
              <h4 className="text-base font-bold text-gray-900">Add New Address</h4>
            </div>

            <form onSubmit={handleModalSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tanvir Ahmed"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded border border-gray-300 px-3 py-2 text-xs focus:border-[#d43533] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+880 1712 345678"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded border border-gray-300 px-3 py-2 text-xs focus:border-[#d43533] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="tanvir@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded border border-gray-300 px-3 py-2 text-xs focus:border-[#d43533] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Street Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="House #12, Road #4, Block #C, Banani"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full rounded border border-gray-300 px-3 py-2 text-xs focus:border-[#d43533] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full rounded border border-gray-300 px-3 py-2 text-xs focus:border-[#d43533] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Postal Code</label>
                  <input
                    type="text"
                    placeholder="1213"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className="w-full rounded border border-gray-300 px-3 py-2 text-xs focus:border-[#d43533] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Country</label>
                  <input
                    type="text"
                    value={formData.country}
                    readOnly
                    className="w-full rounded border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded bg-[#d43533] px-5 py-2 text-xs font-bold text-white hover:bg-[#9d1b1a] transition-colors"
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
