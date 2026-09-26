"use client"

import Link from "next/link"
import { Calendar, User, ArrowLeft, Share2, Tag } from "lucide-react"
import { SeedBlog } from "@/db/seed/data"

interface BlogDetailViewProps {
  blog: SeedBlog
  recentBlogs: SeedBlog[]
}

export function BlogDetailView({ blog, recentBlogs }: BlogDetailViewProps) {
  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({ title: blog.title, url: window.location.href })
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <div className="bg-[#f2f3f8] min-h-screen py-6">
      <div className="max-w-7xl mx-auto px-4">
        {/* Back link & breadcrumbs */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-primary transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to All Blogs</span>
          </Link>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 transition-colors shadow-xs"
          >
            <Share2 className="size-3.5" />
            <span>Share</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Article Content */}
          <article className="lg:col-span-3 bg-white border border-gray-200 rounded-lg p-6 sm:p-8 shadow-xs">
            {/* Category Pill */}
            <span className="inline-block px-3 py-1 rounded text-xs font-bold bg-red-100 text-primary uppercase mb-3">
              {blog.categoryName}
            </span>

            {/* Title */}
            <h1 className="text-xl sm:text-3xl font-extrabold text-gray-900 leading-tight mb-4">
              {blog.title}
            </h1>

            {/* Meta */}
            <div className="flex items-center gap-4 text-xs text-gray-500 pb-6 border-b border-gray-100 mb-6">
              <span className="flex items-center gap-1.5">
                <Calendar className="size-3.5 text-gray-400" />
                {blog.date}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <User className="size-3.5 text-gray-400" />
                {blog.author}
              </span>
            </div>

            {/* Banner Image */}
            <div className="w-full h-64 sm:h-96 rounded-lg overflow-hidden mb-6 bg-gray-100 border border-gray-200">
              <img
                src={blog.banner}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Lead paragraph */}
            <p className="text-sm sm:text-base font-semibold text-gray-700 leading-relaxed mb-6 italic border-l-4 border-primary pl-4">
              {blog.shortDescription}
            </p>

            {/* Body text */}
            <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed space-y-4 text-sm">
              <p>{blog.description}</p>
              <p>
                Whether you are upgrading your setup or looking for dependable product recommendations, keeping quality and reliability at the forefront guarantees satisfaction with every purchase. Stay tuned to our blog for more curated shopping guides and product spotlights.
              </p>
            </div>
          </article>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-3 flex items-center gap-1.5">
                <Tag className="size-3.5 text-primary" />
                <span>Related Articles</span>
              </h3>
              <div className="space-y-3">
                {recentBlogs
                  .filter((b) => b.id !== blog.id)
                  .map((rb) => (
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
