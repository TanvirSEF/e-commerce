"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Calendar, User, ArrowRight, BookOpen } from "lucide-react"
import { SeedBlog, SeedBlogCategory } from "@/db/seed/data"

interface BlogsViewProps {
  initialBlogs: SeedBlog[]
  categories: SeedBlogCategory[]
  recentBlogs: SeedBlog[]
}

export function BlogsView({ initialBlogs, categories, recentBlogs }: BlogsViewProps) {
  const [search, setSearch] = useState("")
  const [selectedCat, setSelectedCat] = useState<string | null>(null)

  const filteredBlogs = initialBlogs.filter((b) => {
    if (selectedCat && b.categorySlug !== selectedCat) return false
    if (search.trim()) {
      const q = search.toLowerCase()
      return b.title.toLowerCase().includes(q) || b.shortDescription.toLowerCase().includes(q)
    }
    return true
  })

  return (
    <div className="bg-[#f2f3f8] min-h-screen py-6">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Our Blogs</h1>
            <div className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
              <Link href="/" className="hover:text-primary transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-gray-800 font-semibold">&ldquo;Blog&rdquo;</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Articles Stream */}
          <div className="lg:col-span-3 space-y-6">
            {filteredBlogs.length === 0 ? (
              <div className="bg-white rounded border border-gray-200 p-12 text-center">
                <BookOpen className="size-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No blog posts found matching your query.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredBlogs.map((blog) => (
                  <article
                    key={blog.id}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
                  >
                    {/* Banner Thumbnail */}
                    <Link
                      href={`/blog/${blog.slug}`}
                      className="block h-48 overflow-hidden bg-gray-100 relative"
                    >
                      <img
                        src={blog.banner}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded text-[11px] font-bold bg-primary text-white shadow-xs">
                        {blog.categoryName}
                      </span>
                    </Link>

                    {/* Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Meta */}
                        <div className="flex items-center gap-3 text-[11px] text-gray-400 mb-2">
                          <span className="flex items-center gap-1">
                            <Calendar className="size-3" />
                            {blog.date}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <User className="size-3" />
                            {blog.author}
                          </span>
                        </div>

                        {/* Title */}
                        <h2 className="font-bold text-sm sm:text-base text-gray-900 group-hover:text-primary transition-colors line-clamp-2 mb-2">
                          <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
                        </h2>

                        {/* Excerpt */}
                        <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed mb-4">
                          {blog.shortDescription}
                        </p>
                      </div>

                      {/* Read Link */}
                      <Link
                        href={`/blog/${blog.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline mt-auto pt-3 border-t border-gray-100"
                      >
                        <span>Read Full Blog</span>
                        <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Search Box */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-3">
                Search Articles
              </h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Keywords..."
                  className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-3">
                Blog Categories
              </h3>
              <div className="space-y-1 text-xs">
                <button
                  onClick={() => setSelectedCat(null)}
                  className={`w-full text-left px-2.5 py-1.5 rounded transition-colors ${
                    selectedCat === null
                      ? "bg-primary text-white font-bold"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  All Categories
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCat(c.slug)}
                    className={`w-full text-left px-2.5 py-1.5 rounded transition-colors ${
                      selectedCat === c.slug
                        ? "bg-primary text-white font-bold"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Posts */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-3">
                Recent Posts
              </h3>
              <div className="space-y-3">
                {recentBlogs.map((rb) => (
                  <Link
                    key={rb.id}
                    href={`/blog/${rb.slug}`}
                    className="flex items-center gap-3 group"
                  >
                    <img
                      src={rb.banner}
                      alt={rb.title}
                      className="size-14 rounded object-cover border border-gray-100 shrink-0"
                    />
                    <div>
                      <h4 className="text-xs font-semibold text-gray-800 group-hover:text-primary transition-colors line-clamp-2">
                        {rb.title}
                      </h4>
                      <span className="text-[10px] text-gray-400 mt-0.5 block">{rb.date}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
