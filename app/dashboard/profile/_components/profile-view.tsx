"use client"

import React, { useState } from "react"
import { useAuth } from "@/lib/context/auth-context"
import { User, MapPin, Plus, Check, X } from "lucide-react"

export function ProfileView() {
  const { user, updateProfile } = useAuth()

  const [name, setName] = useState(user?.name || "Tanvir Ahmed")
  const [phone, setPhone] = useState(user?.phone || "+880 1712 345678")
  const [email] = useState(user?.email || "tanvir@example.com")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [savedMessage, setSavedMessage] = useState(false)

  // Addresses
  const [addresses, setAddresses] = useState([
    {
      id: "addr-1",
      title: "Home",
      address: "House #12, Road #4, Block #C, Banani",
      city: "Dhaka",
      postalCode: "1213",
      country: "Bangladesh",
      phone: "+880 1712 345678",
      isDefault: true,
    },
    {
      id: "addr-2",
      title: "Office",
      address: "Level 8, Concord Tower, Gulshan-2",
      city: "Dhaka",
      postalCode: "1212",
      country: "Bangladesh",
      phone: "+880 1912 987654",
      isDefault: false,
    },
  ])

  const [showAddressModal, setShowAddressModal] = useState(false)
  const [newAddr, setNewAddr] = useState({
    title: "Home",
    address: "",
    city: "Dhaka",
    postalCode: "",
    country: "Bangladesh",
    phone: "",
  })

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault()
    updateProfile({ name, phone })
    setSavedMessage(true)
    setTimeout(() => setSavedMessage(false), 3000)
  }

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newAddr.address || !newAddr.phone) return
    setAddresses([
      ...addresses,
      {
        id: `addr-${Date.now()}`,
        ...newAddr,
        isDefault: false,
      },
    ])
    setShowAddressModal(false)
    setNewAddr({
      title: "Home",
      address: "",
      city: "Dhaka",
      postalCode: "",
      country: "Bangladesh",
      phone: "",
    })
  }

  return (
    <div className="space-y-6">
      {/* Basic Info Card */}
      <div className="rounded border border-gray-200 bg-white p-5 sm:p-6 shadow-sm">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-3 mb-5">
          <User className="h-5 w-5 text-[#d43533]" />
          <div>
            <h2 className="text-base font-bold text-gray-900">Basic Info</h2>
            <p className="text-xs text-gray-500">Update your account identity and credentials</p>
          </div>
        </div>

        {savedMessage && (
          <div className="flex items-center gap-2 rounded border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-700 mb-4">
            <Check className="h-4 w-4" />
            <span>Profile information updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Your Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 text-xs text-gray-800 focus:border-[#d43533] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Your Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 text-xs text-gray-800 focus:border-[#d43533] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Your Email (Permanent)</label>
            <input
              type="email"
              value={email}
              readOnly
              className="w-full rounded border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
            <div>
              <label className="block font-bold text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                placeholder="Leave blank to keep unchanged"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 text-xs text-gray-800 focus:border-[#d43533] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 text-xs text-gray-800 focus:border-[#d43533] focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2 text-right">
            <button
              type="submit"
              className="rounded bg-[#d43533] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#9d1b1a] transition-colors"
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>

      {/* Address Book Card */}
      <div className="rounded border border-gray-200 bg-white p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-5">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-[#d43533]" />
            <div>
              <h2 className="text-base font-bold text-gray-900">Address Book</h2>
              <p className="text-xs text-gray-500">Manage your shipping and delivery destinations</p>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`rounded border p-4 text-xs ${
                addr.isDefault ? "border-[#d43533] bg-red-50/20" : "border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-gray-900">{addr.title}</span>
                {addr.isDefault && (
                  <span className="rounded bg-red-100 px-2 py-0.5 text-[10px] font-bold text-[#d43533]">
                    Default
                  </span>
                )}
              </div>
              <p className="text-gray-600 line-clamp-2">
                {addr.address}, {addr.city} - {addr.postalCode}, {addr.country}
              </p>
              <p className="mt-1 font-semibold text-gray-800">Phone: {addr.phone}</p>
            </div>
          ))}
        </div>
      </div>

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
                <label className="block font-semibold text-gray-700 mb-1">Address Label</label>
                <input
                  type="text"
                  placeholder="e.g. Home, Office, Parent's House"
                  value={newAddr.title}
                  onChange={(e) => setNewAddr({ ...newAddr, title: e.target.value })}
                  className="w-full rounded border border-gray-300 px-3 py-2 text-xs focus:border-[#d43533] focus:outline-none"
                />
              </div>

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
