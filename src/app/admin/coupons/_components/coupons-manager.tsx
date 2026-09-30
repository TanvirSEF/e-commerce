"use client"

import React, { useState, useMemo } from "react"
import { Plus, Search, Trash2 } from "lucide-react"
import { SeedCoupon } from "@/db/seed/data"
import {
  deleteCouponAction,
  toggleCouponStatusAction,
} from "@/app/actions/ecommerce-actions"
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal"
import { CouponsTabs, CouponTabType } from "./coupons-tabs"
import { CouponsTable } from "./coupons-table"
import { CouponModal } from "./coupon-modal"

interface CouponsManagerProps {
  initialCoupons: SeedCoupon[]
}

export function CouponsManager({ initialCoupons }: CouponsManagerProps) {
  const [coupons, setCoupons] = useState<SeedCoupon[]>(initialCoupons)
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState<CouponTabType>("all")
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [showModal, setShowModal] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [couponsToDelete, setCouponsToDelete] = useState<string[]>([])
  const [isDeleting, setIsDeleting] = useState(false)
  const [warningMsg, setWarningMsg] = useState<string | null>(null)

  const counts = useMemo(() => ({
    all: coupons.length,
    admin: coupons.filter((c) => !c.type?.includes("seller")).length,
    seller: coupons.filter((c) => c.type?.includes("seller")).length,
  }), [coupons])

  const filteredCoupons = useMemo(() => {
    return coupons.filter((c) => {
      const matchSearch =
        c.code.toLowerCase().includes(search.toLowerCase()) ||
        c.type.toLowerCase().includes(search.toLowerCase())
      if (!matchSearch) return false
      if (activeTab === "seller") return c.type?.includes("seller")
      if (activeTab === "admin") return !c.type?.includes("seller")
      return true
    })
  }, [coupons, search, activeTab])

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredCoupons.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredCoupons.map((c) => c.id))
    }
  }

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    const nextStatus = !currentStatus
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: nextStatus } : c))
    )
    await toggleCouponStatusAction(id, nextStatus)
  }

  const handleDeleteSingle = (coupon: SeedCoupon) => {
    if (coupon.type === "welcome_base" && coupon.status) {
      setWarningMsg("Active welcome coupons cannot be deleted. Please deactivate them first.")
      setTimeout(() => setWarningMsg(null), 4000)
      return
    }
    setCouponsToDelete([coupon.id])
    setDeleteModalOpen(true)
  }

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return
    const protectedItems = coupons.filter(
      (c) => selectedIds.includes(c.id) && c.type === "welcome_base" && c.status
    )
    if (protectedItems.length > 0) {
      setWarningMsg("Active welcome coupons cannot be deleted. Please deactivate them first.")
      setTimeout(() => setWarningMsg(null), 4000)
      return
    }
    setCouponsToDelete(selectedIds)
    setDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (couponsToDelete.length === 0) return
    setIsDeleting(true)
    try {
      for (const id of couponsToDelete) {
        await deleteCouponAction(id)
      }
      setCoupons((prev) => prev.filter((c) => !couponsToDelete.includes(c.id)))
      setSelectedIds((prev) => prev.filter((id) => !couponsToDelete.includes(id)))
    } catch (err) {
      console.error("Error deleting coupon:", err)
    } finally {
      setIsDeleting(false)
      setDeleteModalOpen(false)
      setCouponsToDelete([])
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">All Coupons</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Configure promotional discount coupons, cart-level vouchers, and validity limits.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded text-xs font-bold bg-primary hover:bg-primary/90 text-white shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="size-4" />
          <span>Add New Coupon</span>
        </button>
      </div>

      {warningMsg && (
        <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-md">
          {warningMsg}
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg shadow-xs overflow-hidden">
        <div className="p-4 border-b border-gray-100 space-y-4">
          <CouponsTabs activeTab={activeTab} onTabChange={setActiveTab} counts={counts} />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search coupon code..."
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

        <CouponsTable
          coupons={filteredCoupons}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onToggleSelectAll={handleToggleSelectAll}
          onToggleStatus={handleToggleStatus}
          onDeleteClick={handleDeleteSingle}
        />
      </div>

      <CouponModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onCreated={(coupon) => setCoupons((prev) => [coupon, ...prev])}
      />

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          if (!isDeleting) {
            setDeleteModalOpen(false)
            setCouponsToDelete([])
          }
        }}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="Delete Confirmation"
        description={`Are you sure you want to delete ${couponsToDelete.length} selected coupon(s)?`}
      />
    </div>
  )
}
