"use client"

import React, { useState } from "react"
import { X, MapPin } from "lucide-react"
import { createCustomerAddressAction } from "@/app/actions/customer-address-actions"

interface AddAddressModalProps {
  isOpen: boolean
  onClose: () => void
  onAddressAdded?: (address: any) => void
}

export function AddAddressModal({ isOpen, onClose, onAddressAdded }: AddAddressModalProps) {
  const [address, setAddress] = useState("")
  const [country, setCountry] = useState("Bangladesh")
  const [city, setCity] = useState("Dhaka")
  const [state, setState] = useState("Dhaka Division")
  const [postalCode, setPostalCode] = useState("")
  const [phone, setPhone] = useState("")
  const [setDefault, setSetDefault] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!address.trim()) return

    setSubmitting(true)
    try {
      const res = await createCustomerAddressAction({
        address,
        country,
        city,
        state,
        postalCode,
        phone,
        setDefault,
      })

      if (res.success && res.address) {
        onAddressAdded?.(res.address)
        onClose()
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-50 text-[#d43533]">
              <MapPin className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-bold text-gray-900">New Address</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Address <span className="text-[#d43533]">*</span>
            </label>
            <textarea
              required
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="House, road, area details..."
              className="w-full rounded border border-gray-300 p-2.5 text-xs focus:border-[#d43533] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Country</label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full rounded border border-gray-300 p-2.5 text-xs focus:border-[#d43533] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">State / Division</label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="e.g. Dhaka Division"
                className="w-full rounded border border-gray-300 p-2.5 text-xs focus:border-[#d43533] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Dhaka"
                className="w-full rounded border border-gray-300 p-2.5 text-xs focus:border-[#d43533] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Postal Code</label>
              <input
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="e.g. 1213"
                className="w-full rounded border border-gray-300 p-2.5 text-xs focus:border-[#d43533] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+880 1700-000000"
              className="w-full rounded border border-gray-300 p-2.5 text-xs focus:border-[#d43533] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="set_default"
              checked={setDefault}
              onChange={(e) => setSetDefault(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-[#d43533] focus:ring-[#d43533]"
            />
            <label htmlFor="set_default" className="text-xs text-gray-700 select-none cursor-pointer">
              Set as default shipping address
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded bg-[#d43533] px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#b82a28] disabled:opacity-50 transition"
            >
              {submitting ? "Saving..." : "Save Address"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
