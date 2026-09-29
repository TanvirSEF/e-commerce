"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import { Plus, Check, Loader2, X } from "lucide-react"
import { createBrandAction, updateBrandAction } from "@/app/actions/ecommerce-actions"
import { MediaPickerModal } from "@/components/ui/media-picker-modal"
import { AdminBrandItem } from "./admin-brands-view"

interface AdminBrandFormProps {
  editingBrand: AdminBrandItem | null
  onCancelEdit: () => void
  onSubmitSuccess: (brand: AdminBrandItem, isEdit: boolean, message: string) => void
  onError: (message: string) => void
}

export function AdminBrandForm({
  editingBrand,
  onCancelEdit,
  onSubmitSuccess,
  onError,
}: AdminBrandFormProps) {
  const [name, setName] = useState("")
  const [logo, setLogo] = useState("")
  const [metaTitle, setMetaTitle] = useState("")
  const [metaDescription, setMetaDescription] = useState("")
  const [isPickerOpen, setIsPickerOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Sync state when entering or exiting edit mode
  useEffect(() => {
    if (editingBrand) {
      setName(editingBrand.name || "")
      setLogo(editingBrand.logo || "")
      setMetaTitle(editingBrand.name ? `${editingBrand.name} - Official Products` : "")
      setMetaDescription(editingBrand.name ? `Shop authentic ${editingBrand.name} items online` : "")
    } else {
      setName("")
      setLogo("")
      setMetaTitle("")
      setMetaDescription("")
    }
  }, [editingBrand])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      onError("Brand name is required.")
      return
    }

    setIsSubmitting(true)
    try {
      if (editingBrand) {
        const res = await updateBrandAction(editingBrand.id, {
          name: name.trim(),
          logo: logo || undefined,
        })
        if (res.success && res.brand) {
          onSubmitSuccess(
            {
              id: res.brand.id,
              name: res.brand.name,
              slug: res.brand.slug,
              logo: res.brand.logo || "/assets/img/placeholder.jpg",
              top: res.brand.top || false,
              productCount: editingBrand.productCount,
            },
            true,
            `Brand "${res.brand.name}" updated successfully!`
          )
        } else {
          onError("Failed to update brand. Please try again.")
        }
      } else {
        const res = await createBrandAction({
          name: name.trim(),
          logo: logo || undefined,
          top: false,
        })
        if (res.success && res.brand) {
          onSubmitSuccess(
            {
              id: res.brand.id,
              name: res.brand.name,
              slug: res.brand.slug,
              logo: res.brand.logo || "/assets/img/placeholder.jpg",
              top: res.brand.top || false,
              productCount: 0,
            },
            false,
            `Brand "${res.brand.name}" created successfully!`
          )
          setName("")
          setLogo("")
          setMetaTitle("")
          setMetaDescription("")
        } else {
          onError("Failed to create brand. Please try again.")
        }
      }
    } catch (err) {
      console.error("Error saving brand:", err)
      onError("An unexpected error occurred while saving the brand.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white border border-slate-200 rounded-sm shadow-xs p-5 self-start">
      {/* Header */}
      <div className="border-b border-slate-100 pb-3 mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-800">
            {editingBrand ? "Edit Brand" : "Add New Brand"}
          </h2>
          {editingBrand && (
            <span className="inline-block mt-0.5 text-[10px] bg-amber-100 text-amber-800 font-semibold px-1.5 py-0.5 rounded">
              Editing: {editingBrand.name}
            </span>
          )}
        </div>

        {editingBrand && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="text-xs text-slate-500 hover:text-slate-800 underline font-medium cursor-pointer"
          >
            Cancel Edit
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Brand Name */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Brand Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Samsung, Apple, Nike"
            className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533] transition-colors"
          />
        </div>

        {/* Logo Picker */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Logo <span className="text-slate-400 font-normal">(120x80)</span>
          </label>
          <div className="flex rounded border border-slate-300 overflow-hidden text-xs">
            <button
              type="button"
              onClick={() => setIsPickerOpen(true)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 font-medium border-r border-slate-300 transition-colors shrink-0 cursor-pointer"
            >
              Browse
            </button>
            <div
              onClick={() => setIsPickerOpen(true)}
              className="px-3 py-2 text-slate-500 bg-white flex-1 cursor-pointer truncate flex items-center"
            >
              {logo ? (
                <span className="text-slate-800 font-medium truncate">1 File selected</span>
              ) : (
                <span className="text-slate-400">Choose File</span>
              )}
            </div>
          </div>

          {logo && (
            <div className="mt-2.5 relative w-24 h-16 rounded border border-slate-200 overflow-hidden bg-slate-50 shadow-2xs">
              <Image
                src={logo}
                alt="Brand Logo Preview"
                fill
                className="object-contain p-1"
              />
              <button
                type="button"
                onClick={() => setLogo("")}
                className="absolute top-1 right-1 bg-black/70 hover:bg-black text-white rounded-full p-0.5 cursor-pointer transition-colors"
                title="Remove logo"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Meta Title */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Meta Title
          </label>
          <input
            type="text"
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            placeholder="Meta Title"
            className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533] transition-colors"
          />
        </div>

        {/* Meta Description */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Meta Description
          </label>
          <textarea
            rows={3}
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            placeholder="Meta Description"
            className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533] transition-colors resize-none"
          />
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 bg-[#d43533] text-white text-xs font-bold rounded shadow-xs hover:bg-[#b82a28] transition-colors flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>{editingBrand ? "Updating Brand..." : "Saving Brand..."}</span>
              </>
            ) : editingBrand ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Update Brand</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Save Brand</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onSelect={(urls) => {
          if (urls.length > 0) {
            setLogo(urls[0])
          }
          setIsPickerOpen(false)
        }}
        title="Select Brand Logo"
      />
    </div>
  )
}
