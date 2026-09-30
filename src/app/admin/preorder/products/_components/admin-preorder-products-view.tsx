"use client"

import React, { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { PreorderProductsHeader } from "./preorder-products-header"
import { PreorderProductsFilterBar } from "./preorder-products-filter-bar"
import { PreorderProductsTable } from "./preorder-products-table"
import { PreorderDeleteModal } from "./preorder-delete-modal"
import {
  togglePreorderPublishedAction,
  togglePreorderFeaturedAction,
  deletePreorderProductAction,
  bulkDeletePreorderProductsAction,
} from "@/app/actions/preorder-actions"
import type { PreorderProduct } from "@/db/schema"

interface AdminPreorderProductsViewProps {
  initialProducts: PreorderProduct[]
  counts: {
    all: number
    inHouse: number
    seller: number
    published: number
    unpublished: number
    discounted: number
  }
  initialPage: number
  initialTotalPages: number
  initialTotal: number
  initialLimit: number
}

export function AdminPreorderProductsView({
  initialProducts,
  counts: initialCounts,
  initialPage,
  initialTotalPages,
  initialTotal,
  initialLimit,
}: AdminPreorderProductsViewProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  // State
  const [products, setProducts] = useState<PreorderProduct[]>(initialProducts)
  const [counts, setCounts] = useState(initialCounts)
  const [selectedIds, setSelectedIds] = useState<number[]>([])

  // Filters
  const [userType, setUserType] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortPrice, setSortPrice] = useState("")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(initialPage)

  // Modals
  const [deleteProduct, setDeleteProduct] = useState<PreorderProduct | null>(null)
  const [isBulkDelete, setIsBulkDelete] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const showFeedback = (type: "success" | "error", text: string) => {
    setFeedback({ type, text })
    setTimeout(() => setFeedback(null), 3000)
  }

  // Filter & Sort Logic
  const filtered = products
    .filter((p) => {
      // User type filter
      if (userType === "in_house" && p.sellerSlug !== "inhouse") return false
      if (userType === "seller" && p.sellerSlug === "inhouse") return false

      // Status filter
      if (statusFilter === "published" && !p.status) return false
      if (statusFilter === "unpublished" && p.status) return false
      if (statusFilter === "discounted" && Number(p.discount || 0) <= 0) return false

      // Search filter
      if (search.trim()) {
        const q = search.toLowerCase()
        const matchName = p.name.toLowerCase().includes(q)
        const matchSku = p.sku ? p.sku.toLowerCase().includes(q) : false
        const matchCategory = p.categoryName ? p.categoryName.toLowerCase().includes(q) : false
        if (!matchName && !matchSku && !matchCategory) return false
      }

      return true
    })
    .sort((a, b) => {
      if (sortPrice === "unit_price,desc") {
        return Number(b.price) - Number(a.price)
      }
      if (sortPrice === "unit_price,asc") {
        return Number(a.price) - Number(b.price)
      }
      return 0
    })

  // Pagination
  const limit = initialLimit || 15
  const totalFiltered = filtered.length
  const totalPages = Math.ceil(totalFiltered / limit) || 1
  const paginatedProducts = filtered.slice((page - 1) * limit, page * limit)

  // Selection handlers
  const handleToggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleToggleSelectAll = () => {
    if (paginatedProducts.every((p) => selectedIds.includes(p.id))) {
      setSelectedIds((prev) => prev.filter((id) => !paginatedProducts.some((p) => p.id === id)))
    } else {
      const pageIds = paginatedProducts.map((p) => p.id)
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])))
    }
  }

  // Toggles
  const handleTogglePublished = async (id: number, current: boolean) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, status: !current } : p)))
    setCounts((prev) => ({
      ...prev,
      published: current ? prev.published - 1 : prev.published + 1,
      unpublished: current ? prev.unpublished + 1 : prev.unpublished - 1,
    }))

    const ok = await togglePreorderPublishedAction(id, !current)
    if (ok) {
      showFeedback("success", "Published product updated successfully")
    } else {
      showFeedback("error", "Failed to update publish status")
    }
  }

  const handleToggleFeatured = async (id: number, current: boolean) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, featured: !current } : p)))

    const ok = await togglePreorderFeaturedAction(id, !current)
    if (ok) {
      showFeedback("success", "Featured product updated successfully")
    } else {
      showFeedback("error", "Failed to update featured status")
    }
  }

  // Delete Action
  const handleConfirmDelete = async () => {
    if (!deleteProduct && !isBulkDelete) return
    setIsProcessing(true)

    try {
      if (isBulkDelete) {
        const ok = await bulkDeletePreorderProductsAction(selectedIds)
        if (ok) {
          setProducts((prev) => prev.filter((p) => !selectedIds.includes(p.id)))
          setSelectedIds([])
          showFeedback("success", "Products deleted successfully")
        } else {
          showFeedback("error", "Failed to delete selected products")
        }
      } else if (deleteProduct) {
        const ok = await deletePreorderProductAction(deleteProduct.id)
        if (ok) {
          setProducts((prev) => prev.filter((p) => p.id !== deleteProduct.id))
          setSelectedIds((prev) => prev.filter((id) => id !== deleteProduct.id))
          showFeedback("success", "Product deleted successfully")
        } else {
          showFeedback("error", "Failed to delete product")
        }
      }
      setDeleteProduct(null)
      setIsBulkDelete(false)
    } finally {
      setIsProcessing(false)
      startTransition(() => router.refresh())
    }
  }

  return (
    <div className="space-y-4">
      {/* 1. Header with Add Button */}
      <PreorderProductsHeader />

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-3 rounded-md text-xs font-semibold border ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          {feedback.text}
        </div>
      )}

      {/* 2. Main Card with Active eCommerce Filter Bar & Table */}
      <div className="card bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
        <PreorderProductsFilterBar
          userType={userType}
          statusFilter={statusFilter}
          sortPrice={sortPrice}
          search={search}
          selectedCount={selectedIds.length}
          counts={counts}
          onUserTypeChange={(val) => {
            setUserType(val)
            setPage(1)
          }}
          onStatusFilterChange={(val) => {
            setStatusFilter(val)
            setPage(1)
          }}
          onSortChange={setSortPrice}
          onSearchChange={(val) => {
            setSearch(val)
            setPage(1)
          }}
          onTriggerBulkDelete={() => setIsBulkDelete(true)}
        />

        <PreorderProductsTable
          products={paginatedProducts}
          selectedIds={selectedIds}
          page={page}
          totalPages={totalPages}
          total={totalFiltered}
          limit={limit}
          onToggleSelect={handleToggleSelect}
          onToggleSelectAll={handleToggleSelectAll}
          onTogglePublished={handleTogglePublished}
          onToggleFeatured={handleToggleFeatured}
          onDeleteProduct={(p) => {
            setIsBulkDelete(false)
            setDeleteProduct(p)
          }}
          onPageChange={setPage}
        />
      </div>

      {/* Delete / Bulk Delete Modal */}
      <PreorderDeleteModal
        product={deleteProduct}
        isBulk={isBulkDelete}
        bulkCount={selectedIds.length}
        isProcessing={isProcessing}
        onClose={() => {
          setDeleteProduct(null)
          setIsBulkDelete(false)
        }}
        onConfirmDelete={handleConfirmDelete}
      />
    </div>
  )
}
