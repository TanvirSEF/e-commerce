"use client"

import React, { useState, useTransition } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, Plus } from "lucide-react"
import { BlogTable } from "./blog-table"
import type { AdminBlogsResponse } from "@/types/blog"

interface BlogsListContainerProps {
  initialData: AdminBlogsResponse
  currentSearch?: string
  currentStatus?: string
}

export function BlogsListContainer({
  initialData,
  currentSearch = "",
  currentStatus = "all",
}: BlogsListContainerProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(currentSearch)
  const [isPending, startTransition] = useTransition()

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (searchTerm.trim()) {
      params.set("search", searchTerm.trim())
    } else {
      params.delete("search")
    }
    startTransition(() => {
      router.push(`/admin/blogs?${params.toString()}`)
    })
  }

  const handleStatusFilter = (statusKey: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (statusKey !== "all") {
      params.set("status", statusKey)
    } else {
      params.delete("status")
    }
    startTransition(() => {
      router.push(`/admin/blogs?${params.toString()}`)
    })
  }

  const activeTab = currentStatus || "all"

  return (
    <div className="space-y-4">
      {/* 1:1 Active eCommerce Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-xl font-bold text-slate-800">All Posts</h1>

        <Link
          href="/admin/blogs/create"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#d43533] hover:bg-[#b82a28] text-white text-xs font-semibold rounded-md shadow-xs transition-colors w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Post</span>
        </Link>
      </div>

      {/* 1:1 Active eCommerce Main Card */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        {/* Card Header matching backend/blog_system/blog/index.blade.php */}
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <h5 className="text-base font-bold text-slate-800">All blog posts</h5>
            <span className="text-xs text-slate-500">
              ({initialData.total} Total Articles)
            </span>
          </div>

          {/* Search: Type & Enter */}
          <form onSubmit={handleSearchSubmit} className="w-full md:w-72">
            <div className="relative">
              <input
                type="text"
                name="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Type & Enter"
                className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#d43533]"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </form>
        </div>

        {/* Quick Filter Navigation Tabs */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border-b border-slate-200 text-xs overflow-x-auto">
          <button
            type="button"
            onClick={() => handleStatusFilter("all")}
            className={`px-3 py-1 rounded font-medium transition-colors ${
              activeTab === "all"
                ? "bg-white text-slate-800 shadow-xs font-semibold border border-slate-200"
                : "text-slate-600 hover:text-slate-800"
            }`}
          >
            All Articles ({initialData.total})
          </button>

          <button
            type="button"
            onClick={() => handleStatusFilter("published")}
            className={`px-3 py-1 rounded font-medium transition-colors inline-flex items-center gap-1.5 ${
              activeTab === "published"
                ? "bg-emerald-50 text-[#28a745] shadow-xs font-semibold border border-emerald-200"
                : "text-slate-600 hover:text-[#28a745]"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Published ({initialData.publishedCount})
          </button>

          <button
            type="button"
            onClick={() => handleStatusFilter("draft")}
            className={`px-3 py-1 rounded font-medium transition-colors inline-flex items-center gap-1.5 ${
              activeTab === "draft"
                ? "bg-slate-200 text-slate-800 shadow-xs font-semibold border border-slate-300"
                : "text-slate-600 hover:text-slate-800"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-slate-500" />
            Drafts ({initialData.draftCount})
          </button>

          {isPending && (
            <span className="ml-auto text-[11px] text-slate-400 animate-pulse">
              Filtering articles...
            </span>
          )}
        </div>

        {/* aiz-table */}
        <BlogTable blogs={initialData.blogs} />
      </div>
    </div>
  )
}
