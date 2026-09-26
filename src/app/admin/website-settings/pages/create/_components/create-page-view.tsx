"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createCustomPageAction } from "@/app/actions/ecommerce-actions"
import { ArrowLeft, Save, FileText, Search } from "lucide-react"

export function CreatePageView() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [content, setContent] = useState("")
  const [metaTitle, setMetaTitle] = useState("")
  const [metaDescription, setMetaDescription] = useState("")
  const [keywords, setKeywords] = useState("")
  const [metaImage, setMetaImage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setTitle(val)
    if (!slug || slug === title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-")) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "")
      )
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !slug.trim() || !content.trim()) {
      setErrorMsg("Title, Link Slug, and Page Content are required.")
      return
    }

    setIsSubmitting(true)
    setErrorMsg("")

    try {
      await createCustomPageAction({
        title,
        slug,
        content,
        metaTitle: metaTitle || title,
        metaDescription,
        keywords,
        metaImage,
      })
      router.push("/admin/website-settings/pages")
      router.refresh()
    } catch {
      setErrorMsg("Failed to create page. Please verify that the slug is unique.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/website-settings/pages"
            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Add New Page</h1>
            <p className="text-xs text-gray-500 mt-0.5">Active eCommerce CMS Standard Custom Page Creator</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/website-settings/pages"
            className="px-4 py-2 border border-gray-300 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-5 py-2 bg-[#d43533] hover:bg-[#b82d2b] text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? "Saving Page..." : "Save Page"}
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
          {errorMsg}
        </div>
      )}

      {/* Page Content Card */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2 bg-[#fafbfc]">
          <FileText className="w-4 h-4 text-[#d43533]" />
          <h2 className="font-semibold text-gray-800 text-sm">Page Content</h2>
        </div>
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            <label className="sm:col-span-3 text-xs font-semibold text-gray-700">
              Title <span className="text-red-500">*</span>
            </label>
            <div className="sm:col-span-9">
              <input
                type="text"
                value={title}
                onChange={handleTitleChange}
                placeholder="e.g. Terms of Service, About Company"
                className="w-full text-xs px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#d43533] focus:border-[#d43533] outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            <label className="sm:col-span-3 text-xs font-semibold text-gray-700">
              Link Slug <span className="text-red-500">*</span>
            </label>
            <div className="sm:col-span-9">
              <div className="flex items-center rounded-lg border border-gray-300 overflow-hidden focus-within:ring-1 focus-within:ring-[#d43533] focus-within:border-[#d43533]">
                <span className="px-3 py-2 bg-gray-100 text-gray-500 text-xs border-r border-gray-300 font-mono">
                  /page/
                </span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
                  placeholder="custom-page-slug"
                  className="w-full text-xs px-3 py-2.5 outline-none font-mono text-gray-700"
                  required
                />
              </div>
              <p className="text-[11px] text-gray-400 mt-1">Use lowercase letters, numbers, and hyphens only.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-start">
            <label className="sm:col-span-3 text-xs font-semibold text-gray-700 pt-2">
              Add Content <span className="text-red-500">*</span>
            </label>
            <div className="sm:col-span-9">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={10}
                placeholder="Write the HTML or text content for this page..."
                className="w-full text-xs px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#d43533] focus:border-[#d43533] outline-none leading-relaxed font-sans"
                required
              />
              <p className="text-[11px] text-gray-400 mt-1">Supports standard text, paragraphs, and HTML elements.</p>
            </div>
          </div>
        </div>
      </div>

      {/* SEO Fields Card */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2 bg-[#fafbfc]">
          <Search className="w-4 h-4 text-emerald-600" />
          <h2 className="font-semibold text-gray-800 text-sm">SEO Meta Fields</h2>
        </div>
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            <label className="sm:col-span-3 text-xs font-semibold text-gray-700">Meta Title</label>
            <div className="sm:col-span-9">
              <input
                type="text"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder="Custom meta page title for search engines"
                className="w-full text-xs px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#d43533] focus:border-[#d43533] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-start">
            <label className="sm:col-span-3 text-xs font-semibold text-gray-700 pt-2">Meta Description</label>
            <div className="sm:col-span-9">
              <textarea
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                rows={3}
                placeholder="Brief summary for Google search results snippet..."
                className="w-full text-xs px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#d43533] focus:border-[#d43533] outline-none leading-relaxed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            <label className="sm:col-span-3 text-xs font-semibold text-gray-700">Keywords</label>
            <div className="sm:col-span-9">
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="ecommerce, return, refund, delivery (comma separated)"
                className="w-full text-xs px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#d43533] focus:border-[#d43533] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            <label className="sm:col-span-3 text-xs font-semibold text-gray-700">Meta Image URL</label>
            <div className="sm:col-span-9">
              <input
                type="url"
                value={metaImage}
                onChange={(e) => setMetaImage(e.target.value)}
                placeholder="https://example.com/images/meta-banner.jpg"
                className="w-full text-xs px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#d43533] focus:border-[#d43533] outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
