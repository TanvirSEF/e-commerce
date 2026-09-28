"use client"

import React, { useState } from "react"
import Image from "next/image"
import { Search, Plus, Trash2, CheckCircle2, XCircle, Loader2, X } from "lucide-react"
import {
  createCategoryAction,
  deleteCategoryAction,
  toggleCategoryFeaturedAction,
} from "@/app/actions/ecommerce-actions"
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal"
import { MediaPickerModal } from "@/components/ui/media-picker-modal"

export interface AdminCategoryItem {
  id: string
  name: string
  slug: string
  icon: string
  featured: boolean
  orderLevel: number
}

interface AdminCategoriesViewProps {
  initialCategories: AdminCategoryItem[]
}

export function AdminCategoriesView({ initialCategories }: AdminCategoriesViewProps) {
  const [categories, setCategories] = useState<AdminCategoryItem[]>(initialCategories)
  const [searchQuery, setSearchQuery] = useState("")
  const [newCatName, setNewCatName] = useState("")
  const [orderLevel, setOrderLevel] = useState<number>(0)
  const [banner, setBanner] = useState("")
  const [icon, setIcon] = useState("")
  const [pickerTarget, setPickerTarget] = useState<"banner" | "icon" | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [catToDelete, setCatToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const toggleFeatured = async (id: string, currentStatus: boolean) => {
    const nextStatus = !currentStatus
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, featured: nextStatus } : c))
    )
    await toggleCategoryFeaturedAction(id, nextStatus)
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
    } catch (err) {
      console.error("Error deleting category:", err)
    } finally {
      setIsDeleting(false)
      setDeleteModalOpen(false)
      setCatToDelete(null)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCatName.trim()) return

    setIsSubmitting(true)
    try {
      const res = await createCategoryAction({
        name: newCatName.trim(),
        banner: banner || undefined,
        icon: icon || undefined,
        orderLevel: orderLevel || 0,
        featured: false,
      })
      if (res.success && res.category) {
        setCategories((prev) => [
          {
            id: res.category!.id,
            name: res.category!.name,
            slug: res.category!.slug,
            icon: res.category!.icon || icon || "/assets/img/placeholder.jpg",
            featured: res.category!.featured || false,
            orderLevel: res.category!.orderLevel || 0,
          },
          ...prev,
        ])
        setNewCatName("")
        setOrderLevel(0)
        setBanner("")
        setIcon("")
      }
    } catch (err) {
      console.error("Error creating category:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Categories</h1>
        <p className="text-xs text-slate-500 mt-0.5">Manage store product classification and taxonomy</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* All Categories Table (Col 8) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-sm shadow-xs">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800">All Categories</h2>
            <div className="relative w-48">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533]"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4 text-center">Featured</th>
                  <th className="py-3 px-4 text-center">Order Level</th>
                  <th className="py-3 px-4 text-right">Options</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((cat, idx) => (
                  <tr key={cat.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 text-slate-400 font-semibold">{idx + 1}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 relative border border-slate-200 rounded-xs flex-shrink-0 bg-white">
                          <Image
                            src={cat.icon}
                            alt={cat.name}
                            fill
                            sizes="36px"
                            className="object-contain p-1"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{cat.name}</p>
                          <span className="text-[11px] text-slate-400">/{cat.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => toggleFeatured(cat.id, cat.featured)}
                        className="cursor-pointer"
                        title="Toggle featured"
                      >
                        {cat.featured ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" />
                        ) : (
                          <XCircle className="w-4 h-4 text-slate-300 mx-auto" />
                        )}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-slate-700">
                      {cat.orderLevel}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleDeleteClick(cat.id)}
                        className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded cursor-pointer"
                        title="Delete category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add New Category Quick Form (Col 4) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-sm shadow-xs p-5 self-start">
          <h2 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4">
            Add New Category
          </h2>

          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Category Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="e.g. Smart Electronics"
                className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Order Level</label>
              <input
                type="number"
                value={orderLevel}
                onChange={(e) => setOrderLevel(parseInt(e.target.value, 10) || 0)}
                className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Banner <span className="text-gray-400 font-normal">(200x200)</span>
              </label>
              <div className="flex rounded border border-slate-300 overflow-hidden text-xs">
                <button
                  type="button"
                  onClick={() => setPickerTarget("banner")}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 font-medium border-r border-slate-300 transition-colors shrink-0 cursor-pointer"
                >
                  Browse
                </button>
                <div
                  onClick={() => setPickerTarget("banner")}
                  className="px-3 py-2 text-slate-500 bg-white flex-1 cursor-pointer truncate flex items-center"
                >
                  {banner ? (
                    <span className="text-slate-800 font-medium truncate">1 File selected</span>
                  ) : (
                    <span className="text-slate-400">Choose File</span>
                  )}
                </div>
              </div>
              {banner && (
                <div className="mt-2 relative w-20 h-14 rounded border border-slate-200 overflow-hidden bg-slate-50">
                  <Image
                    src={banner}
                    alt="Category Banner Preview"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setBanner("")}
                    className="absolute top-1 right-1 bg-black/60 hover:bg-black text-white rounded-full p-0.5"
                    title="Remove"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Icon <span className="text-gray-400 font-normal">(32x32)</span>
              </label>
              <div className="flex rounded border border-slate-300 overflow-hidden text-xs">
                <button
                  type="button"
                  onClick={() => setPickerTarget("icon")}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 font-medium border-r border-slate-300 transition-colors shrink-0 cursor-pointer"
                >
                  Browse
                </button>
                <div
                  onClick={() => setPickerTarget("icon")}
                  className="px-3 py-2 text-slate-500 bg-white flex-1 cursor-pointer truncate flex items-center"
                >
                  {icon ? (
                    <span className="text-slate-800 font-medium truncate">1 File selected</span>
                  ) : (
                    <span className="text-slate-400">Choose File</span>
                  )}
                </div>
              </div>
              {icon && (
                <div className="mt-2 relative w-12 h-12 rounded border border-slate-200 overflow-hidden bg-slate-50">
                  <Image
                    src={icon}
                    alt="Category Icon Preview"
                    fill
                    className="object-contain p-1"
                  />
                  <button
                    type="button"
                    onClick={() => setIcon("")}
                    className="absolute top-1 right-1 bg-black/60 hover:bg-black text-white rounded-full p-0.5"
                    title="Remove"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 bg-[#d43533] text-white text-xs font-bold rounded shadow-xs hover:bg-[#b82a28] transition-colors flex items-center justify-center space-x-1 cursor-pointer disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Save Category</span>
                </>
              )}
            </button>
          </form>
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
        title="Delete Confirmation"
        description="Are you sure you want to delete this category? Products belonging to this category will need re-categorization."
      />

      <MediaPickerModal
        isOpen={pickerTarget !== null}
        onClose={() => setPickerTarget(null)}
        onSelect={(urls) => {
          if (urls.length > 0) {
            if (pickerTarget === "banner") setBanner(urls[0])
            if (pickerTarget === "icon") setIcon(urls[0])
          }
          setPickerTarget(null)
        }}
        title={pickerTarget === "icon" ? "Select Category Icon" : "Select Category Banner"}
      />
    </div>
  )
}
