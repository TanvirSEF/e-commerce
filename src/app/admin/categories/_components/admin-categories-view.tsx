"use client"

import React, { useState } from "react"
import Image from "next/image"
import { Search, Plus, Trash2, CheckCircle2, XCircle } from "lucide-react"

export interface AdminCategoryItem {
  id: string
  name: string
  slug: string
  icon: string
  featured: boolean
  orderLevel: number
}

interface AdminCategoriesViewProps {
  initialCategories: AdminCategoryItem[]
}

export function AdminCategoriesView({ initialCategories }: AdminCategoriesViewProps) {
  const [categories, setCategories] = useState<AdminCategoryItem[]>(initialCategories)
  const [searchQuery, setSearchQuery] = useState("")
  const [newCatName, setNewCatName] = useState("")

  const toggleFeatured = (id: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, featured: !c.featured } : c))
    )
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      setCategories((prev) => prev.filter((c) => c.id !== id))
    }
  }

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCatName) return

    const slug = newCatName.toLowerCase().replace(/[^a-z0-9]+/g, "-")
    const newCat: AdminCategoryItem = {
      id: `cat-${Date.now()}`,
      name: newCatName,
      slug,
      icon: "/assets/img/placeholder.jpg",
      featured: false,
      orderLevel: categories.length + 1,
    }

    setCategories((prev) => [newCat, ...prev])
    setNewCatName("")
  }

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Categories</h1>
        <p className="text-xs text-slate-500 mt-0.5">Manage store product classification and taxonomy</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* All Categories Table (Col 8) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-sm shadow-xs">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800">All Categories</h2>
            <div className="relative w-48">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533]"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4 text-center">Featured</th>
                  <th className="py-3 px-4 text-center">Order Level</th>
                  <th className="py-3 px-4 text-right">Options</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((cat, idx) => (
                  <tr key={cat.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 text-slate-400 font-semibold">{idx + 1}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 relative border border-slate-200 rounded-xs flex-shrink-0 bg-white">
                          <Image
                            src={cat.icon}
                            alt={cat.name}
                            fill
                            sizes="36px"
                            className="object-contain p-1"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{cat.name}</p>
                          <span className="text-[11px] text-slate-400">/{cat.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => toggleFeatured(cat.id)}
                        className="cursor-pointer"
                        title="Toggle featured"
                      >
                        {cat.featured ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" />
                        ) : (
                          <XCircle className="w-4 h-4 text-slate-300 mx-auto" />
                        )}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-slate-700">
                      {cat.orderLevel}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleDelete(cat.id)}
                        className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded cursor-pointer"
                        title="Delete category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add New Category Quick Form (Col 4) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-sm shadow-xs p-5 self-start">
          <h2 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4">
            Add New Category
          </h2>

          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Category Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="e.g. Smart Electronics"
                className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Order Level</label>
              <input
                type="number"
                defaultValue={0}
                className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category Banner</label>
              <div className="border border-dashed border-slate-300 rounded p-4 text-center bg-slate-50 text-xs text-slate-500">
                Choose banner (200x200)
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#d43533] text-white text-xs font-bold rounded shadow-xs hover:bg-[#b82a28] transition-colors flex items-center justify-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Save Category</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
