"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, ChevronRight, ArrowRight } from "lucide-react"
import type { SeedBlog, SeedBlogCategory } from "@/db/seed/data"

interface BlogsViewProps {
  initialBlogs: SeedBlog[]
  categories: SeedBlogCategory[]
  recentBlogs: SeedBlog[]
}

export function BlogsView({ initialBlogs = [], categories = [], recentBlogs = [] }: BlogsViewProps) {
  const [search, setSearch] = useState("")
  const [selectedCats, setSelectedCats] = useState<string[]>([])

  const handleToggleCategory = (catSlug: string) => {
    setSelectedCats((prev) =>
      prev.includes(catSlug) ? prev.filter((s) => s !== catSlug) : [...prev, catSlug]
    )
  }

  const filteredBlogs = initialBlogs.filter((b) => {
    if (selectedCats.length > 0 && !selectedCats.includes(b.categorySlug)) {
      return false
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      return (
        b.title.toLowerCase().includes(q) ||
        b.shortDescription.toLowerCase().includes(q) ||
        (b.categoryName && b.categoryName.toLowerCase().includes(q))
      )
    }
    return true
  })

  return (
    <section className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-[1240px] px-4">
        {/* Breadcrumb Header Bar (1:1 with listing.blade.php) */}
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
              Blogs
            </h1>
          </div>
          <nav className="flex items-center gap-1.5 text-xs text-gray-500">
            <Link href="/" className="transition-colors hover:text-[#d43533]">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-semibold text-gray-800">&quot;Blog&quot;</span>
          </nav>
        </div>

        {/* 2-Column Layout: Main Content (col-xl-9) + Sidebar (col-xl-3) */}
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Main Blogs Stream */}
          <div className="flex-1">
            {filteredBlogs.length === 0 ? (
              <div className="rounded-lg border border-gray-200 bg-white p-12 text-center shadow-xs">
                <h3 className="text-base font-bold text-gray-700">No Blog Posts Found</h3>
                <p className="mt-1 text-xs text-gray-500">
                  Try adjusting your search keywords or category filters.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {filteredBlogs.map((blog) => (
                  <article
                    key={blog.id}
                    className="group flex flex-col overflow-hidden border border-gray-200 bg-white p-3.5 shadow-none transition-all duration-300 hover:shadow-md"
                  >
                    {/* Banner Image */}
                    <Link
                      href={`/blog/${blog.slug}`}
                      className="relative block h-[180px] w-full overflow-hidden bg-gray-100"
                    >
                      <Image
                        src={blog.banner || "/assets/img/placeholder-rect.jpg"}
                        alt={blog.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </Link>

                    {/* Blog Content */}
                    <div className="flex flex-1 flex-col justify-between pt-3 pb-1">
                      <div>
                        {/* Title */}
                        <h2 className="mb-2 h-[42px] line-clamp-2 text-sm font-bold text-gray-900 transition-colors group-hover:text-[#d43533] sm:text-base">
                          <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
                        </h2>

                        {/* Excerpt */}
                        <p className="mb-3 h-[58px] line-clamp-3 text-xs leading-relaxed text-gray-500">
                          {blog.shortDescription}
                        </p>

                        {/* Meta */}
                        <div className="mb-1 text-[11px] text-gray-400">
                          {blog.date}
                        </div>
                        {blog.categoryName && (
                          <div className="mb-3 text-[11px] font-semibold text-[#3490f3]">
                            {blog.categoryName}
                          </div>
                        )}
                      </div>

                      {/* Read Full Blog Action Link */}
                      <div className="mt-3 border-t border-gray-100 pt-3">
                        <Link
                          href={`/blog/${blog.slug}`}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#d43533] transition-colors hover:text-[#9d1b1a]"
                        >
                          <span>Read Full Blog</span>
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          {/* Right Sidebar (col-xl-3) */}
          <div className="w-full shrink-0 space-y-5 lg:w-[280px]">
            {/* Search Box */}
            <div className="border border-gray-200 bg-white p-3.5">
              <div className="relative flex">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="w-full border border-gray-200 py-2.5 pr-9 pl-3 text-xs focus:border-[#d43533] focus:outline-none"
                />
                <button
                  type="button"
                  className="absolute top-1/2 right-2.5 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Search blogs"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Categories Checkbox Filter Box */}
            <div className="border border-gray-200 bg-white">
              <div className="border-b border-gray-100 p-3.5">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Categories
                </h3>
              </div>
              <div className="space-y-2 p-3.5 text-xs">
                {categories.map((cat) => (
                  <label
                    key={cat.id}
                    className="flex cursor-pointer items-center gap-2 text-gray-700 transition-colors hover:text-[#d43533]"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCats.includes(cat.slug)}
                      onChange={() => handleToggleCategory(cat.slug)}
                      className="h-3.5 w-3.5 rounded border-gray-300 text-[#d43533] focus:ring-[#d43533]"
                    />
                    <span className="truncate">{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Recent Posts Box */}
            <div className="border border-gray-200 bg-white p-3.5">
              <div className="mb-3 border-b border-gray-100 pb-2">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Recent Posts
                </h3>
              </div>
              <div className="space-y-3">
                {recentBlogs.map((rb) => (
                  <Link
                    key={rb.id}
                    href={`/blog/${rb.slug}`}
                    className="group flex items-start gap-2.5"
                  >
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden bg-gray-100">
                      <Image
                        src={rb.banner || "/assets/img/placeholder-rect.jpg"}
                        alt={rb.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="line-clamp-2 text-xs font-semibold text-gray-800 transition-colors group-hover:text-[#d43533]">
                        {rb.title}
                      </h4>
                      <span className="mt-1 block text-[10px] text-gray-400">
                        {rb.date}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BlogsView
