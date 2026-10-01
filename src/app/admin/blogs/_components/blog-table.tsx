"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Pen, Trash2, ExternalLink, ChevronLeft, ChevronRight, FileText } from "lucide-react"
import { BlogStatusSwitch } from "./blog-status-switch"
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal"
import { deleteBlogAction } from "@/app/actions/blog-actions"
import type { AdminBlogItem } from "@/types/blog"

interface BlogTableProps {
  blogs: AdminBlogItem[]
  pageSize?: number
}

export function BlogTable({ blogs, pageSize = 15 }: BlogTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [blogToDelete, setBlogToDelete] = useState<AdminBlogItem | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const totalPages = Math.ceil(blogs.length / pageSize) || 1
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, blogs.length)
  const currentBlogs = blogs.slice(startIndex, endIndex)

  const handleDeleteClick = (blog: AdminBlogItem) => {
    setBlogToDelete(blog)
    setDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!blogToDelete) return
    setIsDeleting(true)
    try {
      await deleteBlogAction(blogToDelete.id)
    } finally {
      setIsDeleting(false)
      setDeleteModalOpen(false)
      setBlogToDelete(null)
    }
  }

  return (
    <div className="card-body p-0">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[11px] tracking-wider">
              <th className="py-3 px-4 w-12">#</th>
              <th className="py-3 px-4">Title</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Short Description</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Options</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {currentBlogs.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-1.5">
                    <p className="text-sm font-medium text-slate-500">No blog posts found</p>
                    <p className="text-xs text-slate-400">No articles match your search or filter criteria.</p>
                  </div>
                </td>
              </tr>
            ) : (
              currentBlogs.map((blog, idx) => (
                <tr key={blog.id} className="hover:bg-slate-50/70 transition-colors">
                  {/* # */}
                  <td className="py-3.5 px-4 font-mono text-slate-500 font-medium">
                    {startIndex + idx + 1}
                  </td>

                  {/* Title with thumbnail */}
                  <td className="py-3.5 px-4 max-w-sm">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-9 rounded bg-slate-100 overflow-hidden shrink-0 border border-slate-200 flex items-center justify-center">
                        {blog.banner ? (
                          <Image
                            src={blog.banner}
                            alt={blog.title}
                            width={48}
                            height={36}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FileText className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                      <div>
                        <Link
                          href={`/admin/blogs/${blog.id}/edit`}
                          className="font-bold text-slate-800 hover:text-[#d43533] line-clamp-1 transition-colors"
                          title={blog.title}
                        >
                          {blog.title}
                        </Link>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                          <span className="font-mono">slug: {blog.slug}</span>
                          <span>•</span>
                          <Link
                            href={`/blog/${blog.slug}`}
                            target="_blank"
                            className="inline-flex items-center gap-0.5 text-blue-600 hover:underline"
                          >
                            <span>Preview</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-4">
                    <span className="inline-block px-2.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded text-[11px] font-semibold">
                      {blog.categoryName || "--"}
                    </span>
                  </td>

                  {/* Short Description */}
                  <td className="py-3.5 px-4 max-w-xs">
                    <p className="text-slate-600 line-clamp-2 text-xs leading-relaxed">
                      {blog.shortDescription}
                    </p>
                  </td>

                  {/* Status Toggle */}
                  <td className="py-3.5 px-4">
                    <BlogStatusSwitch blogId={blog.id} initialStatus={blog.status} />
                  </td>

                  {/* Options */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center justify-end gap-1.5">
                      <Link
                        href={`/admin/blogs/${blog.id}/edit`}
                        className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-colors shadow-xs"
                        title="Edit Article"
                      >
                        <Pen className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleDeleteClick(blog)}
                        className="w-7 h-7 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white flex items-center justify-center transition-colors shadow-xs"
                        title="Delete Article"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {blogs.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-slate-200 bg-white">
          <div className="text-xs text-slate-500">
            Showing <span className="font-semibold text-slate-700">{startIndex + 1}</span> to{" "}
            <span className="font-semibold text-slate-700">{endIndex}</span> of{" "}
            <span className="font-semibold text-slate-700">{blogs.length}</span> entries
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <span className="px-3 py-1 text-xs font-medium text-slate-700">
                Page {currentPage} of {totalPages}
              </span>

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* 1:1 Active eCommerce Deletion Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          if (!isDeleting) {
            setDeleteModalOpen(false)
            setBlogToDelete(null)
          }
        }}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="Delete Confirmation"
        description="Are you sure you want to delete this blog post? The published article and its search engine link will be removed."
      />
    </div>
  )
}
