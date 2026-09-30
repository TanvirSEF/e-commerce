"use client"

import React, { useState, useMemo } from "react"
import { Plus, Search, Trash2 } from "lucide-react"
import {
  deleteFlashDealAction,
  toggleFlashDealStatusAction,
  toggleFlashDealFeaturedAction,
} from "@/app/actions/ecommerce-actions"
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal"
import { FlashDealsTabs, FlashDealTabType } from "./flash-deals-tabs"
import { FlashDealsTable, FlashDealItem } from "./flash-deals-table"
import { CreateFlashDealModal } from "./create-flash-deal-modal"

interface FlashDealsManagerProps {
  initialDeals: FlashDealItem[]
}

export function FlashDealsManager({ initialDeals }: FlashDealsManagerProps) {
  const [deals, setDeals] = useState<FlashDealItem[]>(initialDeals)
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState<FlashDealTabType>("all")
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [showModal, setShowModal] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [dealsToDelete, setDealsToDelete] = useState<string[]>([])
  const [isDeleting, setIsDeleting] = useState(false)

  const counts = useMemo(() => ({
    all: deals.length,
    active: deals.filter((d) => d.status).length,
    inactive: deals.filter((d) => !d.status).length,
  }), [deals])

  const filteredDeals = useMemo(() => {
    return deals.filter((deal) => {
      const matchesSearch = deal.title.toLowerCase().includes(search.toLowerCase())
      if (!matchesSearch) return false
      if (activeTab === "active") return deal.status
      if (activeTab === "inactive") return !deal.status
      return true
    })
  }, [deals, search, activeTab])

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredDeals.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredDeals.map((d) => d.id))
    }
  }

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    const nextStatus = !currentStatus
    setDeals((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: nextStatus } : d))
    )
    await toggleFlashDealStatusAction(id, nextStatus)
  }

  const handleToggleFeatured = async (id: string, currentFeatured: boolean) => {
    const nextFeatured = !currentFeatured
    setDeals((prev) =>
      prev.map((d) => (d.id === id ? { ...d, featured: nextFeatured } : d))
    )
    await toggleFlashDealFeaturedAction(id, nextFeatured)
  }

  const handleDeleteSingle = (id: string) => {
    setDealsToDelete([id])
    setDeleteModalOpen(true)
  }

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return
    setDealsToDelete(selectedIds)
    setDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (dealsToDelete.length === 0) return
    setIsDeleting(true)
    try {
      for (const id of dealsToDelete) {
        await deleteFlashDealAction(id)
      }
      setDeals((prev) => prev.filter((d) => !dealsToDelete.includes(d.id)))
      setSelectedIds((prev) => prev.filter((id) => !dealsToDelete.includes(id)))
    } catch (err) {
      console.error("Error deleting flash deal:", err)
    } finally {
      setIsDeleting(false)
      setDeleteModalOpen(false)
      setDealsToDelete([])
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">All Flash Deals</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage flash sales campaigns, discount timer promos, and featured deals.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded text-xs font-bold bg-primary hover:bg-primary/90 text-white shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="size-4" />
          <span>Add New Flash Deal</span>
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-xs overflow-hidden">
        <div className="p-4 border-b border-gray-100 space-y-4">
          <FlashDealsTabs activeTab={activeTab} onTabChange={setActiveTab} counts={counts} />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Type name & enter..."
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-gray-200 rounded focus:outline-none focus:border-primary"
              />
            </div>
            {selectedIds.length > 0 && (
              <button
                type="button"
                onClick={handleBulkDelete}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded border border-red-200 cursor-pointer"
              >
                <Trash2 className="size-3.5" />
                <span>Delete Selected ({selectedIds.length})</span>
              </button>
            )}
          </div>
        </div>

        <FlashDealsTable
          deals={filteredDeals}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onToggleSelectAll={handleToggleSelectAll}
          onToggleStatus={handleToggleStatus}
          onToggleFeatured={handleToggleFeatured}
          onDeleteClick={handleDeleteSingle}
        />
      </div>

      <CreateFlashDealModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onCreated={(deal) => setDeals((prev) => [deal, ...prev])}
      />

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          if (!isDeleting) {
            setDeleteModalOpen(false)
            setDealsToDelete([])
          }
        }}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="Delete Confirmation"
        description={`Are you sure you want to delete ${dealsToDelete.length} selected flash deal(s)?`}
      />
    </div>
  )
}
