"use client"

import React, { useState } from "react"
import Image from "next/image"
import { X, PenLine } from "lucide-react"
import { createBlogAction } from "@/app/actions/ecommerce-actions"
import { MediaPickerModal } from "@/components/ui/media-picker-modal"
import type { SeedBlog, SeedBlogCategory } from "@/db/seed/data"

interface CreateBlogModalProps {
  isOpen: boolean
  onClose: () => void
  categories: SeedBlogCategory[]
  onSuccess: (newBlog: SeedBlog) => void
}

export function CreateBlogModal({
  isOpen,
  onClose,
  categories,
  onSuccess,
}: CreateBlogModalProps) {
  const [form, setForm] = useState({
    title: "",
    slug: "",
    categoryId: "",
    shortDescription: "",
    description: "",
    banner: "",
  })
  const [isPickerOpen, setIsPickerOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [createSuccess, setCreateSuccess] = useState(false)

  if (!isOpen) return null

  const handleSlugAutoFill = (title: string) => {
    setForm((f) => ({
      ...f,
      title,
      slug: title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-"),
    }))
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCreating(true)
    try {
      await createBlogAction({
        title: form.title,
        slug: form.slug,
        categoryId: form.categoryId ? parseInt(form.categoryId) : undefined,
        shortDescription: form.shortDescription,
        description: form.description,
        banner: form.banner || undefined,
      })

      const newBlog: SeedBlog = {
        id: `blog-${Date.now()}`,
        title: form.title,
        slug: form.slug,
        category:
          categories.find((c) => String(c.id) === form.categoryId)?.name ||
          "General",
        categorySlug: "general",
        banner: form.banner || "/assets/img/placeholder-rect.jpg",
        shortDescription: form.shortDescription,
        description: form.description,
        published: true,
        createdAt: new Date().toISOString().slice(0, 10),
        viewsCount: 0,
      }

      onSuccess(newBlog)
      setCreateSuccess(true)
      setTimeout(() => {
        setCreateSuccess(false)
        onClose()
        setForm({
          title: "",
          slug: "",
          categoryId: "",
          shortDescription: "",
          description: "",
          banner: "",
        })
      }, 1200)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-5 relative animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
        >
          <X className="w-4 h-4" />
        </button>
        <h3 className="text-base font-bold text-slate-800 mb-4">
          <PenLine className="w-4 h-4 inline mr-1 text-[#d43533]" />
          Create New Blog Article
        </h3>

        {createSuccess ? (
          <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-center text-xs font-semibold">
            Article published successfully!
          </div>
        ) : (
          <form onSubmit={handleCreate} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Article Title *
              </label>
              <input
                required
                type="text"
                placeholder="e.g. Top 10 Fashion Trends of 2026"
                value={form.title}
                onChange={(e) => handleSlugAutoFill(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                URL Slug *
              </label>
              <input
                required
                type="text"
                value={form.slug}
                onChange={(e) =>
                  setForm((f) => ({ ...f, slug: e.target.value }))
                }
                className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs font-mono text-slate-800 focus:outline-none focus:border-[#d43533]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category
              </label>
              <select
                value={form.categoryId}
                onChange={(e) =>
                  setForm((f) => ({ ...f, categoryId: e.target.value }))
                }
                className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533]"
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Short Description *
              </label>
              <textarea
                required
                rows={2}
                placeholder="Brief summary for blog listing and SEO meta..."
                value={form.shortDescription}
                onChange={(e) =>
                  setForm((f) => ({ ...f, shortDescription: e.target.value }))
                }
                className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Description / Content *
              </label>
              <textarea
                required
                rows={5}
                placeholder="Write the full article content here..."
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Featured Banner <span className="text-gray-400 font-normal">(1300x650)</span>
              </label>
              <div className="flex rounded border border-slate-300 overflow-hidden text-xs">
                <button
                  type="button"
                  onClick={() => setIsPickerOpen(true)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 font-medium border-r border-slate-300 transition-colors shrink-0 cursor-pointer"
                >
                  Browse
                </button>
                <div
                  onClick={() => setIsPickerOpen(true)}
                  className="px-3 py-1.5 text-slate-500 bg-white flex-1 cursor-pointer truncate flex items-center"
                >
                  {form.banner ? (
                    <span className="text-slate-800 font-medium truncate">1 File selected</span>
                  ) : (
                    <span className="text-slate-400">Choose File</span>
                  )}
                </div>
              </div>
              {form.banner && (
                <div className="mt-2 relative w-32 h-16 rounded border border-slate-200 overflow-hidden bg-slate-50">
                  <Image
                    src={form.banner}
                    alt="Banner Preview"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, banner: "" }))}
                    className="absolute top-1 right-1 bg-black/60 hover:bg-black text-white rounded-full p-0.5"
                    title="Remove"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 border border-slate-300 text-slate-600 rounded text-xs hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCreating}
                className="px-4 py-1.5 bg-[#d43533] hover:bg-[#b82a28] text-white rounded text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
              >
                {isCreating ? "Publishing..." : "Publish Article"}
              </button>
            </div>
          </form>
        )}
      </div>

      <MediaPickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onSelect={(urls) => {
          if (urls.length > 0) {
            setForm((f) => ({ ...f, banner: urls[0] }))
          }
          setIsPickerOpen(false)
        }}
        title="Select Blog Banner"
      />
    </div>
  )
}
