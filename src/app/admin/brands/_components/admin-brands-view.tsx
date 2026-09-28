"use client"

import React, { useState } from "react"
import Image from "next/image"
import { Search, Plus, Trash2, CheckCircle2, XCircle, Loader2 } from "lucide-react"
import {
  createBrandAction,
  deleteBrandAction,
  toggleBrandTopAction,
} from "@/app/actions/ecommerce-actions"
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal"

export interface AdminBrandItem {
  id: string
  name: string
  slug: string
  logo: string
  top: boolean
  productCount: number
}

interface AdminBrandsViewProps {
  initialBrands: AdminBrandItem[]
}

export function AdminBrandsView({ initialBrands }: AdminBrandsViewProps) {
  const [brands, setBrands] = useState<AdminBrandItem[]>(initialBrands)
  const [searchQuery, setSearchQuery] = useState("")
  const [newBrandName, setNewBrandName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [brandToDelete, setBrandToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const toggleTop = async (id: string, currentTop: boolean) => {
    const nextTop = !currentTop
    setBrands((prev) =>
      prev.map((b) => (b.id === id ? { ...b, top: nextTop } : b))
    )
    await toggleBrandTopAction(id, nextTop)
  }

  const handleDeleteClick = (id: string) => {
    setBrandToDelete(id)
    setDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!brandToDelete) return
    setIsDeleting(true)
    try {
      await deleteBrandAction(brandToDelete)
      setBrands((prev) => prev.filter((b) => b.id !== brandToDelete))
    } catch (err) {
      console.error("Error deleting brand:", err)
    } finally {
      setIsDeleting(false)
      setDeleteModalOpen(false)
      setBrandToDelete(null)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newBrandName.trim()) return

    setIsSubmitting(true)
    try {
      const res = await createBrandAction({
        name: newBrandName.trim(),
        top: false,
      })
      if (res.success && res.brand) {
        setBrands((prev) => [
          {
            id: res.brand!.id,
            name: res.brand!.name,
            slug: res.brand!.slug,
            logo: res.brand!.logo || "/assets/img/placeholder.jpg",
            top: res.brand!.top || false,
            productCount: 0,
          },
          ...prev,
        ])
        setNewBrandName("")
      }
    } catch (err) {
      console.error("Error creating brand:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const filtered = brands.filter((b) =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Brands</h1>
        <p className="text-xs text-slate-500 mt-0.5">Manage product manufacturers and brand affiliations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* All Brands Table (Col 8) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-sm shadow-xs">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800">All Brands</h2>
            <div className="relative w-48">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search brand..."
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
                  <th className="py-3 px-4">Logo</th>
                  <th className="py-3 px-4 text-center">Top Brand</th>
                  <th className="py-3 px-4 text-right">Options</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((brand, idx) => (
                  <tr key={brand.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 text-slate-400 font-semibold">{idx + 1}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">{brand.name}</td>
                    <td className="py-3.5 px-4">
                      <div className="w-10 h-10 relative border border-slate-200 rounded-xs bg-white">
                        <Image
                          src={brand.logo}
                          alt={brand.name}
                          fill
                          sizes="40px"
                          className="object-contain p-1"
                        />
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => toggleTop(brand.id, brand.top)}
                        className="cursor-pointer"
                        title="Toggle top brand"
                      >
                        {brand.top ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" />
                        ) : (
                          <XCircle className="w-4 h-4 text-slate-300 mx-auto" />
                        )}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleDeleteClick(brand.id)}
                        className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded cursor-pointer"
                        title="Delete brand"
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

        {/* Add New Brand Quick Form (Col 4) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-sm shadow-xs p-5 self-start">
          <h2 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4">
            Add New Brand
          </h2>

          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Brand Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={newBrandName}
                onChange={(e) => setNewBrandName(e.target.value)}
                placeholder="e.g. Sony, Samsung"
                className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Brand Logo</label>
              <div className="border border-dashed border-slate-300 rounded p-4 text-center bg-slate-50 text-xs text-slate-500">
                Default brand logo will be assigned
              </div>
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
                  <span>Save Brand</span>
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
            setBrandToDelete(null)
          }
        }}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="Delete Confirmation"
        description="Are you sure you want to delete this brand? Products linked to this brand will have their brand association unlinked."
      />
    </div>
  )
}
