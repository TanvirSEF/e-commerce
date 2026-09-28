"use client"

import React, { useState } from "react"
import { Warehouse, Plus, Edit2, Trash2, Search, CheckCircle2 } from "lucide-react"
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal"
import { PickupAddressModal, type PickupAddressItem } from "./pickup-address-modal"

interface AdminPickupAddressesViewProps {
  initialAddresses: PickupAddressItem[]
}

export function AdminPickupAddressesView({ initialAddresses }: AdminPickupAddressesViewProps) {
  const [addresses, setAddresses] = useState<PickupAddressItem[]>(initialAddresses)
  const [search, setSearch] = useState("")
  const [courierFilter, setCourierFilter] = useState("all")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<PickupAddressItem | null>(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [addressToDelete, setAddressToDelete] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const openAddModal = () => {
    setEditingAddress(null)
    setIsModalOpen(true)
  }

  const openEditModal = (item: PickupAddressItem) => {
    setEditingAddress(item)
    setIsModalOpen(true)
  }

  const handleToggleStatus = (id: number) => {
    setAddresses((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: !a.status } : a))
    )
  }

  const handleDeleteClick = (id: number) => {
    setAddressToDelete(id)
    setDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!addressToDelete) return
    setIsDeleting(true)
    try {
      setAddresses((prev) => prev.filter((a) => a.id !== addressToDelete))
    } finally {
      setIsDeleting(false)
      setDeleteModalOpen(false)
      setAddressToDelete(null)
    }
  }

  const handleSaveModal = (data: {
    id?: number
    nickname: string
    courierType: string
    phone: string
    address: string
    status: boolean
  }) => {
    if (data.id) {
      setAddresses((prev) =>
        prev.map((a) => (a.id === data.id ? { ...a, ...data, id: data.id! } : a))
      )
    } else {
      const newAddress: PickupAddressItem = {
        id: Date.now(),
        ...data,
      }
      setAddresses([newAddress, ...addresses])
    }
    setIsModalOpen(false)
  }

  const filteredAddresses = addresses.filter((a) => {
    const matchesSearch =
      a.nickname.toLowerCase().includes(search.toLowerCase()) ||
      a.address.toLowerCase().includes(search.toLowerCase()) ||
      a.phone.includes(search)
    const matchesCourier =
      courierFilter === "all" || a.courierType === courierFilter
    return matchesSearch && matchesCourier
  })

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Warehouse className="w-5 h-5 text-[#d43533]" />
            Courier Pickup & Warehouse Addresses
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Configure origin hubs for Shiprocket, Pathao, RedX, Steadfast, and local couriers
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#d43533] hover:bg-[#b82d2b] text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Pickup Address
        </button>
      </div>

      {/* Filter and Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <select
              value={courierFilter}
              onChange={(e) => setCourierFilter(e.target.value)}
              className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#d43533]"
            >
              <option value="all">All Couriers</option>
              <option value="pathao">Pathao</option>
              <option value="steadfast">Steadfast</option>
              <option value="redx">RedX</option>
              <option value="shiprocket">Shiprocket</option>
              <option value="internal">Internal Warehouse</option>
            </select>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search pickup address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#d43533]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50/75 border-b border-gray-200 text-gray-600 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4 w-10">#</th>
                <th className="py-3 px-4">Nickname</th>
                <th className="py-3 px-4">Courier Service</th>
                <th className="py-3 px-4">Contact Phone</th>
                <th className="py-3 px-4">Full Address</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredAddresses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400">
                    No pickup addresses found.
                  </td>
                </tr>
              ) : (
                filteredAddresses.map((a, idx) => (
                  <tr key={a.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 px-4 text-gray-400">{idx + 1}</td>
                    <td className="py-3 px-4 font-semibold text-gray-800">
                      {a.nickname}
                    </td>
                    <td className="py-3 px-4">
                      <span className="capitalize px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-100 text-gray-700">
                        {a.courierType}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{a.phone || "—"}</td>
                    <td className="py-3 px-4 text-gray-600 max-w-xs truncate">
                      {a.address}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleStatus(a.id)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-colors ${
                          a.status
                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {a.status ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => openEditModal(a)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(a.id)}
                          disabled={isDeleting && addressToDelete === a.id}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      <PickupAddressModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveModal}
        initialData={editingAddress}
      />

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          if (!isDeleting) {
            setDeleteModalOpen(false)
            setAddressToDelete(null)
          }
        }}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="Delete Pickup Address"
        description="Are you sure you want to delete this courier pickup address?"
      />
    </div>
  )
}
