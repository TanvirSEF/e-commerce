"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Loader2, Check } from "lucide-react"
import { MediaPickerModal } from "@/components/ui/media-picker-modal"
import { BlogSeoFields } from "./blog-seo-fields"
import { createBlogAction, updateBlogAction } from "@/app/actions/blog-actions"
import type { AdminBlogItem, BlogCategoryItem, BlogInputData } from "@/types/blog"

interface BlogFormProps {
  initialData?: AdminBlogItem
  categories: BlogCategoryItem[]
  isEdit?: boolean
}

export function BlogForm({ initialData, categories, isEdit = false }: BlogFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isBannerPickerOpen, setIsBannerPickerOpen] = useState(false)

  const [formData, setFormData] = useState<BlogInputData>({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    categoryId: initialData?.categoryId ?? (categories[0]?.id || null),
    shortDescription: initialData?.shortDescription || "",
    description: initialData?.description || "",
    banner: initialData?.banner || "",
    status: initialData?.status ?? true,
    metaTitle: initialData?.metaTitle || "",
    metaImg: initialData?.metaImg || "",
    metaDescription: initialData?.metaDescription || "",
    metaKeywords: initialData?.metaKeywords || "",
  })

  const handleTitleChange = (val: string) => {
    setFormData((prev) => {
      const updated = { ...prev, title: val }
      if (!isEdit || !prev.slug) {
        updated.slug = val
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .trim()
          .replace(/\s+/g, "-")
      }
      return updated
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      if (isEdit && initialData) {
        const res = await updateBlogAction(initialData.id, formData)
        if (res.success) {
          setSuccessMessage(res.message || "Blog updated successfully!")
          setTimeout(() => router.push("/admin/blogs"), 800)
        } else {
          setErrorMessage(res.message || "Failed to update blog post.")
        }
      } else {
        const res = await createBlogAction(formData)
        if (res.success) {
          setSuccessMessage(res.message || "Blog created successfully!")
          setTimeout(() => router.push("/admin/blogs"), 800)
        } else {
          setErrorMessage(res.message || "Failed to create blog post.")
        }
      }
    } catch (err) {
      setErrorMessage((err as Error).message || "An unexpected error occurred.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div>
        <Link
          href="/admin/blogs"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#d43533] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to All Posts
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <h5 className="text-base font-bold text-slate-800">Blog Information</h5>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-xs">
          {successMessage && (
            <div className="p-3 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}
          {errorMessage && (
            <div className="p-3 rounded bg-rose-50 border border-rose-200 text-rose-800">
              {errorMessage}
            </div>
          )}

          {/* Blog Title */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center">
            <label className="md:col-span-3 font-semibold text-slate-700">
              Blog Title <span className="text-rose-500">*</span>
            </label>
            <div className="md:col-span-9">
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Blog Title"
                className="w-full px-3 py-2 border border-slate-300 rounded text-slate-800 focus:outline-none focus:border-[#d43533]"
              />
            </div>
          </div>

          {/* Category */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center">
            <label className="md:col-span-3 font-semibold text-slate-700">
              Category <span className="text-rose-500">*</span>
            </label>
            <div className="md:col-span-9">
              <select
                required
                value={formData.categoryId ? String(formData.categoryId) : ""}
                onChange={(e) =>
                  setFormData({ ...formData, categoryId: e.target.value ? parseInt(e.target.value) : null })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded text-slate-800 bg-white focus:outline-none focus:border-[#d43533]"
              >
                <option value="">-- Select Category --</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.categoryName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Slug */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center">
            <label className="md:col-span-3 font-semibold text-slate-700">
              Slug <span className="text-rose-500">*</span>
            </label>
            <div className="md:col-span-9">
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="Slug"
                className="w-full px-3 py-2 border border-slate-300 rounded text-slate-800 font-mono text-xs focus:outline-none focus:border-[#d43533]"
              />
            </div>
          </div>

          {/* Banner */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-start">
            <label className="md:col-span-3 font-semibold text-slate-700 pt-2">
              Banner <span className="text-[11px] text-slate-400 font-normal">(1300x650)</span>
            </label>
            <div className="md:col-span-9 space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.banner || ""}
                  onChange={(e) => setFormData({ ...formData, banner: e.target.value })}
                  placeholder="Paste banner image URL or browse from media"
                  className="flex-1 px-3 py-2 border border-slate-300 rounded text-slate-800 focus:outline-none focus:border-[#d43533]"
                />
                <button
                  type="button"
                  onClick={() => setIsBannerPickerOpen(true)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded border border-slate-300 transition-colors"
                >
                  Browse
                </button>
              </div>
              {formData.banner && (
                <div className="relative w-36 h-20 rounded border border-slate-200 overflow-hidden bg-slate-50">
                  <Image src={formData.banner} alt="Banner Preview" fill className="object-cover" />
                </div>
              )}
            </div>
          </div>

          {/* Short Description */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-start">
            <label className="md:col-span-3 font-semibold text-slate-700 pt-2">
              Short Description <span className="text-rose-500">*</span>
            </label>
            <div className="md:col-span-9">
              <textarea
                required
                rows={3}
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                placeholder="Enter a brief summary for blog listing preview..."
                className="w-full px-3 py-2 border border-slate-300 rounded text-slate-800 focus:outline-none focus:border-[#d43533]"
              />
            </div>
          </div>

          {/* Description */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-start">
            <label className="md:col-span-3 font-semibold text-slate-700 pt-2">Description</label>
            <div className="md:col-span-9">
              <textarea
                rows={6}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Write full article body text..."
                className="w-full px-3 py-2 border border-slate-300 rounded text-slate-800 focus:outline-none focus:border-[#d43533] leading-relaxed"
              />
            </div>
          </div>

          {/* Decomposed SEO Fields */}
          <BlogSeoFields formData={formData} setFormData={setFormData} />

          {/* Submit Button */}
          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-6 py-2 bg-[#d43533] hover:bg-[#b82a28] text-white text-xs font-semibold rounded shadow-xs transition-colors disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{isEdit ? "Update Post" : "Save"}</span>
            </button>
          </div>
        </form>
      </div>

      <MediaPickerModal
        isOpen={isBannerPickerOpen}
        onClose={() => setIsBannerPickerOpen(false)}
        onSelect={(urls) => {
          if (urls.length > 0) setFormData((prev) => ({ ...prev, banner: urls[0] }))
        }}
        title="Select Banner Image"
      />
    </div>
  )
}
