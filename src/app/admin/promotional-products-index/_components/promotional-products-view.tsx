"use client"

import React, { useState, useEffect, useTransition } from "react"
import { Plus, CheckCircle2, AlertCircle } from "lucide-react"
import {
  fetchPromotionalProductsAction,
  removePromotionalProductsAction,
  togglePromotionalProductTodaysDealAction,
} from "@/app/actions/promotional-product-actions"
import type {
  PromotionalProductsResponse,
} from "@/services/promotional-product-service"
import { PromotionalProductsTable } from "./promotional-products-table"
import { PromotionalProductsOffcanvas } from "./promotional-products-offcanvas"
import { PromotionalConfirmModal } from "./promotional-confirm-modal"
import { PromotionalFilterBar } from "./promotional-filter-bar"

interface PromotionalProductsViewProps {
  initialData: PromotionalProductsResponse
  categories: { id: number; name: string }[]
}

export function PromotionalProductsView({
  initialData,
  categories,
}: PromotionalProductsViewProps) {
  const [data, setData] = useState<PromotionalProductsResponse>(initialData)
  const [search, setSearch] = useState<string>("")
  const [sortType, setSortType] = useState<string>("")
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])

  // Selection for bulk actions
  const [selectedIds, setSelectedIds] = useState<number[]>([])

  // Modal & Offcanvas state
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState<boolean>(false)
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean
    isBulk: boolean
    targetId?: number
  }>({ isOpen: false, isBulk: false })
  const [isRemoving, setIsRemoving] = useState<boolean>(false)

  // Toast / notification feedback
  const [notification, setNotification] = useState<{
    type: "success" | "danger"
    message: string
  } | null>(null)

  const [, startTransition] = useTransition()

  const showNotification = (type: "success" | "danger", message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 3500)
  }

  // Reload data from PostgreSQL
  const reloadData = (page = 1) => {
    startTransition(async () => {
      try {
        const res = await fetchPromotionalProductsAction({
          search: search.trim() || undefined,
          type: sortType || undefined,
          selectedFilter: selectedFilters,
          page,
          limit: 15,
        })
        setData(res)
      } catch (err) {
        console.error("Error fetching promotional products:", err)
      }
    })
  }

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      reloadData(1)
    }, 400)
    return () => clearTimeout(timer)
  }, [search, sortType, selectedFilters])

  // Select all / single product
  const handleSelectProduct = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(data.products.map((p) => p.id))
    } else {
      setSelectedIds([])
    }
  }

  // Filter checkboxes
  const handleFilterToggle = (filterName: string) => {
    if (filterName === "all") {
      if (selectedFilters.includes("all")) {
        setSelectedFilters([])
      } else {
        setSelectedFilters(["all", "all-discount", "low-stock"])
      }
    } else {
      setSelectedFilters((prev) => {
        const withoutAll = prev.filter((f) => f !== "all")
        if (withoutAll.includes(filterName)) {
          return withoutAll.filter((f) => f !== filterName)
        } else {
          return [...withoutAll, filterName]
        }
      })
    }
  }

  // Toggle Today's Deal
  const handleToggleTodaysDeal = async (productId: number, status: boolean) => {
    // Optimistic UI update
    setData((prev) => ({
      ...prev,
      products: prev.products.map((p) =>
        p.id === productId ? { ...p, todaysDeal: status } : p
      ),
    }))

    try {
      const ok = await togglePromotionalProductTodaysDealAction(productId, status)
      if (ok) {
        showNotification("success", "Todays Deal updated successfully")
      } else {
        showNotification("danger", "Failed to update Todays Deal")
        reloadData(data.currentPage)
      }
    } catch {
      showNotification("danger", "Something went wrong")
      reloadData(data.currentPage)
    }
  }

  // Handle Removal Confirm
  const handleConfirmRemove = async () => {
    setIsRemoving(true)
    try {
      const idsToRemove = confirmModal.isBulk
        ? selectedIds
        : confirmModal.targetId
        ? [confirmModal.targetId]
        : []

      if (idsToRemove.length === 0) return

      const ok = await removePromotionalProductsAction(idsToRemove)
      if (ok) {
        showNotification(
          "success",
          confirmModal.isBulk
            ? "Selected products removed from Promotional"
            : "Product removed from Promotional successfully"
        )
        setSelectedIds((prev) => prev.filter((id) => !idsToRemove.includes(id)))
        setConfirmModal({ isOpen: false, isBulk: false })
        reloadData(data.currentPage)
      } else {
        showNotification("danger", "Operation failed")
      }
    } catch {
      showNotification("danger", "Something went wrong")
    } finally {
      setIsRemoving(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Toast Notification Alert */}
      {notification && (
        <div
          className={`fixed top-5 right-5 z-[1060] flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-sm font-semibold animate-in fade-in slide-in-from-top-3 ${
            notification.type === "success"
              ? "bg-emerald-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Page Title */}
      <div className="flex items-center justify-between pb-1">
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">
          Promotional Products
        </h1>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        {/* Nav Tabs Bar */}
        <div className="flex items-center justify-between flex-wrap border-b border-slate-100 px-5 pt-3 pb-2 gap-3">
          {/* Left Tab */}
          <div className="flex items-center">
            <button className="pb-3 px-1 text-sm font-semibold text-blue-600 border-b-2 border-blue-600 cursor-pointer">
              Promotional Product List
            </button>
          </div>

          {/* Right Side Add Button (Active eCommerce style pill button) */}
          <div>
            <button
              onClick={() => setIsOffcanvasOpen(true)}
              className="relative inline-flex items-center bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold text-xs py-2 pl-4 pr-10 rounded-full border border-blue-200 transition-colors cursor-pointer group shadow-xs"
            >
              <span>Promotional Products</span>
              <span className="absolute right-0 top-0 bottom-0 w-8 bg-blue-600 group-hover:bg-blue-700 flex items-center justify-center rounded-full text-white transition-colors">
                <Plus className="w-4 h-4 stroke-[2.5]" />
              </span>
            </button>
          </div>
        </div>

        {/* Filter Bar Component */}
        <PromotionalFilterBar
          search={search}
          onSearchChange={setSearch}
          sortType={sortType}
          onSortChange={setSortType}
          selectedFilters={selectedFilters}
          onFilterToggle={handleFilterToggle}
          selectedCount={selectedIds.length}
          onBulkRemoveClick={() => {
            if (selectedIds.length === 0) {
              showNotification("danger", "Please select at least one item")
              return
            }
            setConfirmModal({ isOpen: true, isBulk: true })
          }}
        />

        {/* Promotional Products Table */}
        <PromotionalProductsTable
          products={data.products}
          totalCount={data.totalCount}
          currentPage={data.currentPage}
          totalPages={data.totalPages}
          selectedIds={selectedIds}
          onSelectProduct={handleSelectProduct}
          onSelectAll={handleSelectAll}
          onPageChange={(page) => reloadData(page)}
          onToggleTodaysDeal={handleToggleTodaysDeal}
          onOpenSingleRemoveModal={(id) =>
            setConfirmModal({ isOpen: true, isBulk: false, targetId: id })
          }
        />
      </div>

      {/* Offcanvas Drawer for Adding Products */}
      <PromotionalProductsOffcanvas
        isOpen={isOffcanvasOpen}
        categories={categories}
        onClose={() => setIsOffcanvasOpen(false)}
        onSuccess={() => reloadData(data.currentPage)}
        showNotification={showNotification}
      />

      {/* Confirmation Modal */}
      <PromotionalConfirmModal
        isOpen={confirmModal.isOpen}
        isBulk={confirmModal.isBulk}
        isLoading={isRemoving}
        onClose={() => setConfirmModal({ isOpen: false, isBulk: false })}
        onConfirm={handleConfirmRemove}
      />
    </div>
  )
}
