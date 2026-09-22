"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, Plus, Edit, Trash2, CheckCircle2, XCircle } from "lucide-react"

export interface AdminProductRow {
  id: string
  name: string
  slug: string
  category: string
  brand: string
  price: number
  stock: number
  salesCount: number
  published: boolean
  featured: boolean
  thumbnail: string
}

interface AdminProductsViewProps {
  initialProducts: AdminProductRow[]
}

export function AdminProductsView({ initialProducts }: AdminProductsViewProps) {
  const [productsList, setProductsList] = useState<AdminProductRow[]>(initialProducts)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const togglePublished = (id: string) => {
    setProductsList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, published: !p.published } : p))
    )
  }

  const toggleFeatured = (id: string) => {
    setProductsList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, featured: !p.featured } : p))
    )
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProductsList((prev) => prev.filter((p) => p.id !== id))
    }
  }

  const filtered = productsList.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCat =
      selectedCategory === "all" || p.category.toLowerCase().includes(selectedCategory.toLowerCase())
    return matchesSearch && matchesCat
  })

  return (
    <div className="space-y-6">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800">All Products</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage store catalog, stocks, and pricing</p>
        </div>
        <Link
          href="/admin/products/create"
          className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#d43533] text-white text-xs font-bold rounded shadow-xs hover:bg-[#b82a28] transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 border border-slate-200 rounded-sm shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Type name & Enter..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded text-xs text-slate-700 focus:outline-none focus:border-[#d43533]"
          />
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-slate-300 rounded px-3 py-1.5 bg-white text-slate-700 focus:outline-none focus:border-[#d43533]"
          >
            <option value="all">All Categories</option>
            <option value="fashion">Fashion & Clothing</option>
            <option value="computer">Computer & Accessories</option>
            <option value="smartphone">Smartphone Accessories</option>
            <option value="kitchen">Kitchen & Dining</option>
          </select>

          <span className="text-slate-500 font-medium">
            Total: <strong>{filtered.length}</strong> items
          </span>
        </div>
      </div>

      {/* Products Table (Active eCommerce 1:1) */}
      <div className="bg-white border border-slate-200 rounded-sm shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Base Price</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4 text-center">Published</th>
                <th className="py-3 px-4 text-center">Featured</th>
                <th className="py-3 px-4 text-right">Options</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((prod, idx) => (
                <tr key={prod.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 text-slate-400 font-semibold">{idx + 1}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 relative border border-slate-200 rounded-xs flex-shrink-0 bg-white">
                        <Image
                          src={prod.thumbnail}
                          alt={prod.name}
                          fill
                          sizes="40px"
                          className="object-contain p-1"
                        />
                      </div>
                      <div className="min-w-0">
                        <Link
                          href={`/product/${prod.slug}`}
                          target="_blank"
                          className="font-bold text-slate-800 hover:text-[#d43533] line-clamp-1"
                        >
                          {prod.name}
                        </Link>
                        <span className="text-[11px] text-slate-400 block">{prod.brand}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-medium">{prod.category}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">৳{prod.price}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        prod.stock > 10
                          ? "bg-emerald-100 text-emerald-800"
                          : prod.stock > 0
                          ? "bg-amber-100 text-amber-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {prod.stock} in stock
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => togglePublished(prod.id)}
                      className="cursor-pointer"
                      title="Toggle published status"
                    >
                      {prod.published ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" />
                      ) : (
                        <XCircle className="w-4 h-4 text-slate-300 mx-auto" />
                      )}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => toggleFeatured(prod.id)}
                      className="cursor-pointer"
                      title="Toggle featured status"
                    >
                      {prod.featured ? (
                        <span className="inline-block w-3 h-3 rounded-full bg-amber-400 shadow-xs"></span>
                      ) : (
                        <span className="inline-block w-3 h-3 rounded-full bg-slate-200"></span>
                      )}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <Link
                        href={`/admin/products/create?edit=${prod.id}`}
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                        title="Edit"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(prod.id)}
                        className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded cursor-pointer"
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

        {filtered.length === 0 && (
          <div className="p-8 text-center text-slate-500 text-xs">
            No products found matching your filter criteria.
          </div>
        )}
      </div>
    </div>
  )
}
