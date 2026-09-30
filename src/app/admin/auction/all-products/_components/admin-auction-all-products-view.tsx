"use client"

import React, { useState, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import type { AuctionProduct } from "@/db/schema/auction"
import {
  toggleAuctionPublishedAction,
  toggleAuctionFeaturedAction,
  deleteAuctionProductAction,
  bulkDeleteAuctionProductsAction,
  bulkPublishAuctionProductsAction,
  bulkFeaturedAuctionProductsAction,
} from "@/app/actions/auction-actions"
import { AuctionProductsNavTabs } from "./auction-products-nav-tabs"
import { AuctionProductsFilterBar } from "./auction-products-filter-bar"
import { AuctionProductsTable } from "./auction-products-table"
import { CheckCircle2, AlertCircle } from "lucide-react"

interface AdminAuctionAllProductsViewProps {
  products: AuctionProduct[]
  activeType: "all" | "inhouse" | "seller"
  title: string
  counts?: {
    all?: number
    inhouse?: number
    seller?: number
  }
}

export function AdminAuctionAllProductsView({
  products: initialProducts,
  activeType,
  title,
  counts = { all: 0, inhouse: 0, seller: 0 },
}: AdminAuctionAllProductsViewProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentSearch = searchParams.get("search") || ""
  const currentStatus = searchParams.get("status") || "all"

  const [products, setProducts] = useState<AuctionProduct[]>(initialProducts)
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [search, setSearch] = useState(currentSearch)
  const [status, setStatus] = useState(currentStatus)
  const [bulkAction, setBulkAction] = useState("")
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  React.useEffect(() => {
    setProducts(initialProducts)
  }, [initialProducts])

  const showToast = (type: "success" | "error", text: string) => {
    setFeedback({ type, text })
    setTimeout(() => setFeedback(null), 3000)
  }

  const handleSearchSubmit = () => {
    const params = new URLSearchParams(searchParams.toString())
    if (search.trim()) {
      params.set("search", search.trim())
    } else {
      params.delete("search")
    }
    router.push(`?${params.toString()}`)
  }

  const handleStatusChange = (val: string) => {
    setStatus(val)
    const params = new URLSearchParams(searchParams.toString())
    if (val === "all") {
      params.delete("status")
    } else {
      params.set("status", val)
    }
    router.push(`?${params.toString()}`)
  }

  const handleToggleSelectAll = () => {
    if (selectedIds.length === products.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(products.map((p) => p.id))
    }
  }

  const handleToggleSelectOne = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const handleTogglePublished = (id: number, current: boolean) => {
    startTransition(async () => {
      const ok = await toggleAuctionPublishedAction(id, !current)
      if (ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, status: !current } : p))
        )
        showToast("success", "Published status updated.")
      } else {
        showToast("error", "Failed to update published status.")
      }
    })
  }

  const handleToggleFeatured = (id: number, current: boolean) => {
    startTransition(async () => {
      const ok = await toggleAuctionFeaturedAction(id, !current)
      if (ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, featured: !current } : p))
        )
        showToast("success", "Featured status updated.")
      } else {
        showToast("error", "Failed to update featured status.")
      }
    })
  }

  const handleDeleteProduct = (id: number) => {
    if (!window.confirm("Are you sure you want to delete this auction product?")) return
    startTransition(async () => {
      const ok = await deleteAuctionProductAction(id)
      if (ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id))
        setSelectedIds((prev) => prev.filter((i) => i !== id))
        showToast("success", "Auction product deleted successfully.")
        router.refresh()
      } else {
        showToast("error", "Failed to delete product.")
      }
    })
  }

  const handleBulkActionApply = () => {
    if (!bulkAction || selectedIds.length === 0) return
    startTransition(async () => {
      if (bulkAction === "delete") {
        if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} auction products?`)) return
        const ok = await bulkDeleteAuctionProductsAction(selectedIds)
        if (ok) {
          setProducts((prev) => prev.filter((p) => !selectedIds.includes(p.id)))
          setSelectedIds([])
          setBulkAction("")
          showToast("success", "Selected products deleted successfully.")
          router.refresh()
        }
      } else if (bulkAction === "publish") {
        const ok = await bulkPublishAuctionProductsAction(selectedIds)
        if (ok) {
          setProducts((prev) =>
            prev.map((p) => (selectedIds.includes(p.id) ? { ...p, status: true } : p))
          )
          setSelectedIds([])
          setBulkAction("")
          showToast("success", "Selected products marked published.")
        }
      } else if (bulkAction === "featured") {
        const ok = await bulkFeaturedAuctionProductsAction(selectedIds)
        if (ok) {
          setProducts((prev) =>
            prev.map((p) => (selectedIds.includes(p.id) ? { ...p, featured: true } : p))
          )
          setSelectedIds([])
          setBulkAction("")
          showToast("success", "Selected products marked featured.")
        }
      }
    })
  }

  return (
    <div className="space-y-4">
      {/* Title bar */}
      <div className="flex items-center justify-between">
        <h5 className="text-base font-bold text-gray-800">{title}</h5>
      </div>

      {feedback && (
        <div
          className={`flex items-center gap-2 p-3 text-xs rounded-lg border ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Main card */}
      <div className="card rounded-2 border border-gray-200 bg-white shadow-xs overflow-hidden">
        {/* Nav Tabs */}
        <AuctionProductsNavTabs activeType={activeType} counts={counts} />

        {/* Filter Bar */}
        <AuctionProductsFilterBar
          search={search}
          onSearchChange={setSearch}
          onSearchSubmit={handleSearchSubmit}
          status={status}
          onStatusChange={handleStatusChange}
          bulkAction={bulkAction}
          onBulkActionChange={setBulkAction}
          onBulkActionApply={handleBulkActionApply}
          selectedCount={selectedIds.length}
        />

        {/* Table */}
        <AuctionProductsTable
          products={products}
          selectedIds={selectedIds}
          onToggleSelectAll={handleToggleSelectAll}
          onToggleSelectOne={handleToggleSelectOne}
          onTogglePublished={handleTogglePublished}
          onToggleFeatured={handleToggleFeatured}
          onDeleteProduct={handleDeleteProduct}
        />
      </div>
    </div>
  )
}
