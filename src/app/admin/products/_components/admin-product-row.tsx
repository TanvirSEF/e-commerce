"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Eye, Edit, Copy, Trash2, CheckCircle2, XCircle, ShoppingBag } from "lucide-react"

export interface AdminProductRowData {
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
  todaysDeal: boolean
  addedBy: string
  thumbnail: string
}

interface AdminProductRowProps {
  product: AdminProductRowData
  index: number
  onTogglePublished: (id: string, current: boolean) => Promise<void>
  onToggleFeatured: (id: string, current: boolean) => Promise<void>
  onToggleTodaysDeal: (id: string, current: boolean) => Promise<void>
  onDuplicate: (id: string) => Promise<void>
  onDelete: (id: string) => void
}

export function AdminProductRowItem({
  product,
  index,
  onTogglePublished,
  onToggleFeatured,
  onToggleTodaysDeal,
  onDuplicate,
  onDelete,
}: AdminProductRowProps) {
  const [isDuplicating, setIsDuplicating] = useState(false)

  const handleDuplicate = async () => {
    setIsDuplicating(true)
    try {
      await onDuplicate(product.id)
    } finally {
      setIsDuplicating(false)
    }
  }

  return (
    <tr className="hover:bg-slate-50/75 transition-colors">
      <td className="py-3 px-4 text-slate-400 font-semibold">{index}</td>

      {/* Product Name & Thumbnail */}
      <td className="py-3 px-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 relative border border-slate-200 rounded-sm shrink-0 bg-white overflow-hidden">
            {product.thumbnail ? (
              <Image
                src={product.thumbnail}
                alt={product.name}
                fill
                sizes="40px"
                className="object-contain p-0.5"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400">
                No Img
              </div>
            )}
          </div>
          <div className="min-w-0 max-w-xs">
            <Link
              href={`/product/${product.slug}`}
              target="_blank"
              className="font-bold text-slate-800 hover:text-[#d43533] line-clamp-1 text-xs"
              title={product.name}
            >
              {product.name}
            </Link>
            <div className="flex items-center space-x-1.5 text-[11px] text-slate-400">
              <span>{product.category}</span>
              {product.brand && (
                <>
                  <span>•</span>
                  <span>{product.brand}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </td>

      {/* Added By */}
      <td className="py-3 px-4">
        <span
          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
            product.addedBy === "admin" || !product.addedBy
              ? "bg-slate-100 text-slate-700"
              : "bg-purple-100 text-purple-700"
          }`}
        >
          {product.addedBy === "admin" || !product.addedBy ? "Inhouse" : product.addedBy}
        </span>
      </td>

      {/* Num of Sale & Stock */}
      <td className="py-3 px-4">
        <div className="flex items-center space-x-1 text-slate-700 font-semibold">
          <ShoppingBag className="w-3 h-3 text-slate-400" />
          <span>{product.salesCount || 0} times</span>
        </div>
        <div className="text-[10px] text-slate-400 mt-0.5">{product.stock} in stock</div>
      </td>

      {/* Base Price */}
      <td className="py-3 px-4 font-bold text-slate-900 font-mono">
        ৳{product.price.toLocaleString("en-BD")}
      </td>

      {/* Todays Deal Switch */}
      <td className="py-3 px-4 text-center">
        <button
          type="button"
          onClick={() => onToggleTodaysDeal(product.id, product.todaysDeal)}
          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
            product.todaysDeal ? "bg-[#d43533]" : "bg-gray-200"
          }`}
          title="Toggle Today's Deal"
        >
          <span
            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
              product.todaysDeal ? "translate-x-4" : "translate-x-0"
            }`}
          />
        </button>
      </td>

      {/* Published Switch */}
      <td className="py-3 px-4 text-center">
        <button
          type="button"
          onClick={() => onTogglePublished(product.id, product.published)}
          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
            product.published ? "bg-emerald-500" : "bg-gray-200"
          }`}
          title="Toggle Published Status"
        >
          <span
            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
              product.published ? "translate-x-4" : "translate-x-0"
            }`}
          />
        </button>
      </td>

      {/* Featured Status Toggle */}
      <td className="py-3 px-4 text-center">
        <button
          type="button"
          onClick={() => onToggleFeatured(product.id, product.featured)}
          className="cursor-pointer p-1"
          title="Toggle Featured Status"
        >
          {product.featured ? (
            <span className="inline-block w-3.5 h-3.5 rounded-full bg-amber-400 shadow-xs ring-2 ring-amber-100" />
          ) : (
            <span className="inline-block w-3.5 h-3.5 rounded-full bg-slate-200" />
          )}
        </button>
      </td>

      {/* Options Dropdown/Actions */}
      <td className="py-3 px-4 text-right">
        <div className="flex items-center justify-end space-x-1">
          <Link
            href={`/product/${product.slug}`}
            target="_blank"
            className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition"
            title="View Live on Store"
          >
            <Eye className="w-3.5 h-3.5" />
          </Link>
          <Link
            href={`/admin/products/create?edit=${product.id}`}
            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition"
            title="Edit Product"
          >
            <Edit className="w-3.5 h-3.5" />
          </Link>
          <button
            type="button"
            onClick={handleDuplicate}
            disabled={isDuplicating}
            className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded transition cursor-pointer disabled:opacity-50"
            title="Clone / Duplicate Product"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(product.id)}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition cursor-pointer"
            title="Delete Product"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </tr>
  )
}
