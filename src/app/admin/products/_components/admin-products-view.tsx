"use client"

import React, { useState, useTransition } from "react"
import Link from "next/link"
import { Plus, CheckCircle2, AlertCircle } from "lucide-react"
import {
  deleteProductAction,
  toggleProductPublishedAction,
  toggleProductFeaturedAction,
  toggleProductTodaysDealAction,
  duplicateProductAction,
} from "@/app/actions/ecommerce-actions"
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal"
import { AdminProductRowItem, type AdminProductRowData } from "./admin-product-row"
import { AdminProductsPagination } from "./admin-products-pagination"
import { AdminProductsFilterBar } from "./admin-products-filter-bar"

export type { AdminProductRowData }

interface AdminProductsViewProps {
  initialProducts: AdminProductRowData[]
  categories: { id: number | string; name: string; slug: string }[]
  totalCount: number
}

export function AdminProductsView({
  initialProducts,
  categories,
  totalCount: _totalCount,
}: AdminProductsViewProps) {
  const [productsList, setProductsList] = useState<AdminProductRowData[]>(initialProducts)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedSeller, setSelectedSeller] = useState("all")
  const [selectedSort, setSelectedSort] = useState("newest")
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 15

  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [, startTransition] = useTransition()

  const showToast = (type: "success" | "error", text: string) => {
    setFeedback({ type, text })
    setTimeout(() => setFeedback(null), 3500)
  }

  // Toggles
  const togglePublished = async (id: string, currentStatus: boolean) => {
    const nextStatus = !currentStatus
    setProductsList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, published: nextStatus } : p))
    )
    startTransition(async () => {
      const res = await toggleProductPublishedAction(id, nextStatus)
      if (res.success) {
        showToast("success", `Product ${nextStatus ? "published" : "unpublished"} successfully`)
      } else {
        showToast("error", "Failed to update published status")
      }
    })
  }

  const toggleFeatured = async (id: string, currentStatus: boolean) => {
    const nextStatus = !currentStatus
    setProductsList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, featured: nextStatus } : p))
    )
    startTransition(async () => {
      const res = await toggleProductFeaturedAction(id, nextStatus)
      if (res.success) {
        showToast("success", `Product ${nextStatus ? "marked as featured" : "removed from featured"}`)
      }
    })
  }

  const toggleTodaysDeal = async (id: string, currentStatus: boolean) => {
    const nextStatus = !currentStatus
    setProductsList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, todaysDeal: nextStatus } : p))
    )
    startTransition(async () => {
      const res = await toggleProductTodaysDealAction(id, nextStatus)
      if (res.success) {
        showToast("success", `Today's Deal ${nextStatus ? "activated" : "deactivated"}`)
      }
    })
  }

  const handleDuplicate = async (id: string) => {
    startTransition(async () => {
      const res = await duplicateProductAction(id)
      if (res.success && res.product) {
        const p = res.product
        const newRow: AdminProductRowData = {
          id: String(p.id),
          name: p.name,
          slug: p.slug,
          category: categories.find((c) => String(c.id) === String(p.categoryId))?.name || "General",
          brand: "N/A",
          price: Number(p.unitPrice),
          stock: p.currentStock || 0,
          salesCount: 0,
          published: false,
          featured: false,
          todaysDeal: false,
          addedBy: p.addedBy || "admin",
          thumbnail: p.thumbnailImg || "/assets/img/placeholder.jpg",
        }
        setProductsList((prev) => [newRow, ...prev])
        showToast("success", `Product duplicated as draft: "${p.name}"`)
      } else {
        showToast("error", "Failed to duplicate product")
      }
    })
  }

  const handleDeleteClick = (id: string) => {
    setProductToDelete(id)
    setDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!productToDelete) return
    setIsDeleting(true)
    try {
      await deleteProductAction(productToDelete)
      setProductsList((prev) => prev.filter((p) => p.id !== productToDelete))
      showToast("success", "Product permanently deleted from store catalog")
    } catch (err) {
      console.error("Error deleting product:", err)
      showToast("error", "Failed to delete product")
    } finally {
      setIsDeleting(false)
      setDeleteModalOpen(false)
      setProductToDelete(null)
    }
  }

  // Filter & Sort
  const filtered = productsList.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCat =
      selectedCategory === "all" ||
      p.categorySlug === selectedCategory ||
      p.category.toLowerCase().replace(/[^a-z0-9]/g, "").includes(selectedCategory.toLowerCase().replace(/[^a-z0-9]/g, ""))
    const matchesSeller =
      selectedSeller === "all" ||
      (selectedSeller === "inhouse" ? p.addedBy === "admin" || !p.addedBy : p.addedBy !== "admin" && !!p.addedBy)

    return matchesSearch && matchesCat && matchesSeller
  })

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (selectedSort === "price-asc") return a.price - b.price
    if (selectedSort === "price-desc") return b.price - a.price
    if (selectedSort === "sales") return b.salesCount - a.salesCount
    if (selectedSort === "stock") return b.stock - a.stock
    return 0 // default newest order preserved
  })

  // Pagination
  const totalPages = Math.ceil(sorted.length / pageSize) || 1
  const paginated = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  return (
    <div className="space-y-5">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800">All Products</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage store catalog, inventory stocks, prices, and vendor products
          </p>
        </div>
        <Link
          href="/admin/products/create"
          className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#d43533] text-white text-xs font-bold rounded shadow-xs hover:bg-[#b82a28] transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
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

      <AdminProductsFilterBar
        searchQuery={searchQuery}
        onSearchChange={(val) => {
          setSearchQuery(val)
          setCurrentPage(1)
        }}
        selectedCategory={selectedCategory}
        onCategoryChange={(val) => {
          setSelectedCategory(val)
          setCurrentPage(1)
        }}
        selectedSeller={selectedSeller}
        onSellerChange={(val) => {
          setSelectedSeller(val)
          setCurrentPage(1)
        }}
        selectedSort={selectedSort}
        onSortChange={(val) => setSelectedSort(val)}
        categories={categories}
        totalResults={filtered.length}
      />

      {/* Products Table (1:1 Active eCommerce Columns) */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Added By</th>
                <th className="py-3 px-4">Num of Sale</th>
                <th className="py-3 px-4">Base Price</th>
                <th className="py-3 px-4 text-center">Todays Deal</th>
                <th className="py-3 px-4 text-center">Published</th>
                <th className="py-3 px-4 text-center">Featured</th>
                <th className="py-3 px-4 text-right">Options</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    No products found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                paginated.map((prod, idx) => (
                  <AdminProductRowItem
                    key={prod.id}
                    product={prod}
                    index={(currentPage - 1) * pageSize + idx + 1}
                    onTogglePublished={togglePublished}
                    onToggleFeatured={toggleFeatured}
                    onToggleTodaysDeal={toggleTodaysDeal}
                    onDuplicate={handleDuplicate}
                    onDelete={handleDeleteClick}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <AdminProductsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={sorted.length}
          pageSize={pageSize}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          if (!isDeleting) {
            setDeleteModalOpen(false)
            setProductToDelete(null)
          }
        }}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="Delete Product Confirmation"
        description="Are you sure you want to permanently delete this product? All variants, stocks, and media links will be deleted."
      />
    </div>
  )
}
