"use client"

import React, { useState } from "react"
import Link from "next/link"
import {
  BookOpen,
  Search,
  Plus,
  Trash2,
  Eye,
  ToggleLeft,
  ToggleRight,
  X,
  PenLine,
  Tag,
} from "lucide-react"
import {
  toggleBlogStatusAction,
  deleteBlogAction,
} from "@/app/actions/ecommerce-actions"
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal"
import { CreateBlogModal } from "./create-blog-modal"
import type { SeedBlog, SeedBlogCategory } from "@/db/seed/data"

interface BlogsAdminViewProps {
  initialBlogs: SeedBlog[]
  categories: SeedBlogCategory[]
}

export function BlogsAdminView({ initialBlogs, categories }: BlogsAdminViewProps) {
  const [blogs, setBlogs] = useState<SeedBlog[]>(initialBlogs)
  const [searchTerm, setSearchTerm] = useState("")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [blogToDelete, setBlogToDelete] = useState<SeedBlog | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const filtered = blogs.filter(
    (b) =>
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.category || b.categoryName || "").toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleToggleStatus = async (blog: SeedBlog) => {
    const numericId = parseInt(blog.id.replace(/\D/g, "")) || 1
    await toggleBlogStatusAction(numericId, true)
  }

  const handleDeleteClick = (blog: SeedBlog) => {
    setBlogToDelete(blog)
    setDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!blogToDelete) return
    setIsDeleting(true)
    try {
      const numericId = parseInt(blogToDelete.id.replace(/\D/g, "")) || 1
      await deleteBlogAction(numericId)
      setBlogs((prev) => prev.filter((b) => b.id !== blogToDelete.id))
    } catch (err) {
      console.error("Error deleting blog:", err)
    } finally {
      setIsDeleting(false)
      setDeleteModalOpen(false)
      setBlogToDelete(null)
    }
  }

  const handleCreateSuccess = (newBlog: SeedBlog) => {
    setBlogs((prev) => [newBlog, ...prev])
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Blog Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Create, publish, and manage all blog articles and news posts
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#d43533] hover:bg-[#b82a28] text-white text-xs font-semibold rounded-md shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create New Article
        </button>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-50 text-[#d43533] flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Total Articles</div>
            <div className="text-xl font-bold text-slate-800">{blogs.length}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Blog Categories</div>
            <div className="text-xl font-bold text-slate-800">{categories.length}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Published Posts</div>
            <div className="text-xl font-bold text-slate-800">{blogs.length}</div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533]"
          />
        </div>
      </div>

      {/* Blog Posts Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[11px] tracking-wider">
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Article Title</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Author</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Options</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((blog, idx) => (
                <tr key={blog.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-medium text-slate-500">{idx + 1}</td>
                  <td className="py-3.5 px-4 max-w-xs">
                    <div className="font-bold text-slate-800 line-clamp-2">{blog.title}</div>
                    <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                      {blog.shortDescription}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-[11px] font-medium capitalize">
                      {blog.categoryName}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-medium">{blog.author}</td>
                  <td className="py-3.5 px-4 text-slate-500 text-[11px]">{blog.date}</td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => handleToggleStatus(blog)}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                    >
                      <ToggleRight className="w-3.5 h-3.5" />
                      Published
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/blog/${blog.slug}`}
                        target="_blank"
                        className="p-1.5 text-slate-400 hover:text-blue-600 rounded hover:bg-blue-50 transition-colors"
                        title="Preview"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(blog)}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <CreateBlogModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        categories={categories}
        onSuccess={handleCreateSuccess}
      />

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
        description="Are you sure you want to delete this blog article? The published page and SEO link will be removed."
      />
    </div>
  )
}
