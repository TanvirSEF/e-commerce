"use client"

import React, { useState, useTransition } from "react"
import {
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
  toggleCategoryFeaturedAction,
  toggleCategoryHotAction,
} from "@/app/actions/ecommerce-actions"
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal"
import { AdminCategoriesTable, type AdminCategoryItem } from "./admin-categories-table"
import { AdminCategoryForm } from "./admin-category-form"
import { CheckCircle2, AlertCircle } from "lucide-react"

export type { AdminCategoryItem }

interface AdminCategoriesViewProps {
  initialCategories: AdminCategoryItem[]
}

export function AdminCategoriesView({ initialCategories }: AdminCategoriesViewProps) {
  const [categories, setCategories] = useState<AdminCategoryItem[]>(initialCategories)
  const [editingCategory, setEditingCategory] = useState<AdminCategoryItem | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState<"all" | "physical" | "digital">("all")

  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [catToDelete, setCatToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [, startTransition] = useTransition()

  const showToast = (type: "success" | "error", text: string) => {
    setFeedback({ type, text })
    setTimeout(() => setFeedback(null), 3000)
  }

  const handleToggleFeatured = async (id: string, currentStatus: boolean) => {
    const nextStatus = !currentStatus
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, featured: nextStatus } : c))
    )
    startTransition(async () => {
      const res = await toggleCategoryFeaturedAction(id, nextStatus)
      if (res.success) {
        showToast("success", `Category ${nextStatus ? "marked as featured" : "removed from featured"}`)
      } else {
        showToast("error", "Failed to update category featured status")
      }
    })
  }

  const handleToggleHot = async (id: string, currentStatus: boolean) => {
    const nextStatus = !currentStatus
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, hot: nextStatus } : c))
    )
    startTransition(async () => {
      const res = await toggleCategoryHotAction(id, nextStatus)
      if (res.success) {
        showToast("success", `Category ${nextStatus ? "marked as hot" : "removed from hot"}`)
      } else {
        showToast("error", "Failed to update category hot status")
      }
    })
  }

  const handleSave = async (data: {
    name: string
    parentId?: number | null
    orderLevel?: number
    banner?: string
    icon?: string
    coverImage?: string
    digital?: boolean
    metaTitle?: string
    metaDescription?: string
    metaKeywords?: string
  }) => {
    setIsSubmitting(true)
    try {
      if (editingCategory) {
        const res = await updateCategoryAction(editingCategory.id, data)
        if (res.success && res.category) {
          const updated = res.category
          setCategories((prev) =>
            prev.map((c) =>
              c.id === editingCategory.id
                ? {
                    ...c,
                    name: updated.name,
                    slug: updated.slug,
                    icon: updated.icon,
                    banner: updated.banner,
                    coverImage: updated.coverImage,
                    digital: updated.digital,
                    orderLevel: updated.orderLevel,
                    parentId: updated.parentId || null,
                    metaTitle: updated.metaTitle,
                    metaDescription: updated.metaDescription,
                    metaKeywords: updated.metaKeywords,
                  }
                : c
            )
          )
          showToast("success", `Category "${updated.name}" updated successfully!`)
          setEditingCategory(null)
        } else {
          showToast("error", "Failed to update category")
        }
      } else {
        const res = await createCategoryAction({
          name: data.name,
          digital: data.digital,
          parentId: data.parentId ? Number(data.parentId) : undefined,
          orderLevel: data.orderLevel || 0,
          banner: data.banner,
          icon: data.icon,
          coverImage: data.coverImage,
          metaTitle: data.metaTitle,
          metaDescription: data.metaDescription,
          metaKeywords: data.metaKeywords,
          featured: false,
          hot: false,
        })
        if (res.success && res.category) {
          const created = res.category
          setCategories((prev) => [
            {
              id: created.id,
              name: created.name,
              slug: created.slug,
              icon: created.icon || "/assets/img/placeholder.jpg",
              banner: created.banner || "/assets/img/placeholder-rect.jpg",
              coverImage: created.coverImage,
              digital: created.digital,
              featured: created.featured || false,
              hot: created.hot || false,
              orderLevel: created.orderLevel || 0,
              parentId: created.parentId || null,
              metaTitle: created.metaTitle,
              metaDescription: created.metaDescription,
              metaKeywords: created.metaKeywords,
            },
            ...prev,
          ])
          showToast("success", `Category "${created.name}" created successfully!`)
        } else {
          showToast("error", "Failed to create category")
        }
      }
    } catch (err) {
      console.error("Error saving category:", err)
      showToast("error", "An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteClick = (id: string) => {
    setCatToDelete(id)
    setDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!catToDelete) return
    setIsDeleting(true)
    try {
      await deleteCategoryAction(catToDelete)
      setCategories((prev) => prev.filter((c) => c.id !== catToDelete))
      showToast("success", "Category deleted successfully")
    } catch (err) {
      console.error("Error deleting category:", err)
      showToast("error", "Failed to delete category")
    } finally {
      setIsDeleting(false)
      setDeleteModalOpen(false)
      setCatToDelete(null)
    }
  }

  const filtered = categories.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase())
    if (!matchesSearch) return false
    if (activeTab === "physical") return !c.digital
    if (activeTab === "digital") return !!c.digital
    return true
  })

  return (
    <div className="space-y-6">
      {/* Title Bar */}
      <div>
        <h1 className="text-xl font-bold text-slate-800">Categories Manager</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage product categories, subcategories hierarchy, and store taxonomy (Active eCommerce 1:1)
        </p>
      </div>

      {/* Category Tabs (Active eCommerce 1:1) */}
      <div className="flex items-center gap-1 border-b border-slate-200 bg-white px-4 rounded-t-lg shadow-2xs">
        <button
          type="button"
          onClick={() => setActiveTab("all")}
          className={`px-4 py-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === "all"
              ? "border-[#d43533] text-[#d43533]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          All Categories
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("physical")}
          className={`px-4 py-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === "physical"
              ? "border-[#d43533] text-[#d43533]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Physical Categories
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("digital")}
          className={`px-4 py-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === "digital"
              ? "border-[#d43533] text-[#d43533]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Digital Categories
        </button>
      </div>

      {feedback && (
        <div
          className={`flex items-center gap-2 p-3 text-xs rounded-lg border shadow-2xs ${
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

      {/* 2-Column Active eCommerce Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Col 8: Categories Table */}
        <div className="lg:col-span-8">
          <AdminCategoriesTable
            categories={filtered}
            allCategories={categories}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onToggleFeatured={handleToggleFeatured}
            onToggleHot={handleToggleHot}
            onEditClick={(cat) => setEditingCategory(cat)}
            onDeleteClick={handleDeleteClick}
          />
        </div>

        {/* Col 4: Create / Edit Form Card */}
        <div className="lg:col-span-4 sticky top-20">
          <AdminCategoryForm
            allCategories={categories}
            editingCategory={editingCategory}
            onSave={handleSave}
            onCancelEdit={() => setEditingCategory(null)}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          if (!isDeleting) {
            setDeleteModalOpen(false)
            setCatToDelete(null)
          }
        }}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="Delete Category Confirmation"
        description="Are you sure you want to delete this category? Products belonging to this category will need re-categorization."
      />
    </div>
  )
}
