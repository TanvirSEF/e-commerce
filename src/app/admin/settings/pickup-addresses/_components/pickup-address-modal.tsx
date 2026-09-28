"use client"

import React, { useState, useEffect } from "react"
import { X } from "lucide-react"

export interface PickupAddressItem {
  id: number
  nickname: string
  courierType: string
  phone: string
  address: string
  status: boolean
}

interface PickupAddressModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: {
    id?: number
    nickname: string
    courierType: string
    phone: string
    address: string
    status: boolean
  }) => void
  initialData?: PickupAddressItem | null
}

export function PickupAddressModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: PickupAddressModalProps) {
  const [nickname, setNickname] = useState("")
  const [courierType, setCourierType] = useState("internal")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [status, setStatus] = useState(true)

  useEffect(() => {
    if (initialData) {
      setNickname(initialData.nickname)
      setCourierType(initialData.courierType)
      setPhone(initialData.phone)
      setAddress(initialData.address)
      setStatus(initialData.status)
    } else {
      setNickname("")
      setCourierType("internal")
      setPhone("")
      setAddress("")
      setStatus(true)
    }
  }, [initialData, isOpen])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nickname.trim() || !address.trim()) return

    onSave({
      id: initialData?.id,
      nickname: nickname.trim(),
      courierType,
      phone: phone.trim(),
      address: address.trim(),
      status,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-800">
            {initialData ? "Edit Pickup Address" : "Add Pickup Address"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Address Nickname <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Banani Central Hub"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
              className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#d43533]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Courier Type
            </label>
            <select
              value={courierType}
              onChange={(e) => setCourierType(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#d43533]"
            >
              <option value="pathao">Pathao</option>
              <option value="steadfast">Steadfast</option>
              <option value="redx">RedX</option>
              <option value="shiprocket">Shiprocket</option>
              <option value="internal">Internal Warehouse</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Contact Phone
            </label>
            <input
              type="text"
              placeholder="e.g. +880 1711 000111"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#d43533]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Full Street Address <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Road 11, Block D, Banani, Dhaka"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#d43533]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs bg-[#d43533] hover:bg-[#b82d2b] text-white font-bold rounded-lg shadow-sm transition-colors"
            >
              Save Address
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
