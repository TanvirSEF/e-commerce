"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { Eye, Edit, Trash2 } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import type { PreorderProduct } from "@/db/schema"

interface PreorderProductRowProps {
  product: PreorderProduct
  isSelected: boolean
  onToggleSelect: (id: number) => void
  onTogglePublished: (id: number, current: boolean) => void
  onToggleFeatured: (id: number, current: boolean) => void
  onDeleteProduct: (product: PreorderProduct) => void
}

export function PreorderProductRow({
  product,
  isSelected,
  onToggleSelect,
  onTogglePublished,
  onToggleFeatured,
  onDeleteProduct,
}: PreorderProductRowProps) {
  const hasDiscount = Number(product.discount || 0) > 0
  const isOwnerInhouse = product.sellerSlug === "inhouse"

  const formatDate = (dateVal: Date | string | null | undefined) => {
    if (!dateVal) return ""
    const d = new Date(dateVal)
    const day = String(d.getDate()).padStart(2, "0")
    const month = String(d.getMonth() + 1).padStart(2, "0")
    const year = d.getFullYear()
    return `${day}.${month}.${year}`
  }

  return (
    <tr className="hover:bg-slate-50/80 transition-colors">
      {/* Select Checkbox */}
      <td className="py-3 px-3 text-center align-top pt-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(product.id)}
          className="rounded border-slate-300 text-[#d43533] focus:ring-0 cursor-pointer h-3.5 w-3.5"
        />
      </td>

      {/* Thumbnail Image */}
      <td className="py-3 px-3 align-top pt-3.5">
        <div className="w-12 h-12 rounded bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center flex-shrink-0">
          <Image
            src={product.thumbnail || "/assets/img/placeholder.jpg"}
            alt={product.name}
            width={48}
            height={48}
            className="w-full h-full object-cover"
          />
        </div>
      </td>

      {/* Product Details 1: Name, Category, Owner, Date */}
      <td className="py-3 px-3 align-top">
        <div className="space-y-1">
          <Link
            href={`/product/${product.slug}`}
            target="_blank"
            className="font-semibold text-slate-800 hover:text-[#d43533] line-clamp-2 leading-tight"
            title={product.name}
          >
            {product.name}
          </Link>

          <div className="text-[11px] text-slate-500">
            Category:{" "}
            <span className="font-semibold text-slate-700">
              {product.categoryName || "Consumer Electronics"}
            </span>
          </div>

          <div className="flex flex-col text-[11px]">
            <span className="text-blue-600 font-medium">
              {isOwnerInhouse ? "In-house" : "Seller Store"}
            </span>
            <span className="text-slate-500 font-semibold text-[10px]">
              Product Created : {formatDate(product.createdAt)}
            </span>
          </div>
        </div>
      </td>

      {/* Product Details 2: Min Qty & Refund */}
      <td className="py-3 px-3 align-top space-y-2 text-[11px]">
        <div>
          <div className="text-slate-400">Min Purchase Qty</div>
          <div className="font-bold text-slate-700">
            {product.minQty || 1} {product.unit || "Pc"}
          </div>
        </div>
        <div>
          <div className="text-slate-400">Refund</div>
          <div className="font-bold text-slate-700">
            {product.isRefundable ? "Refundable" : "Not Refundable"}
          </div>
        </div>
      </td>

      {/* Price & Prepayment */}
      <td className="py-3 px-3 align-top space-y-1.5">
        <div>
          <div className="text-[10px] text-slate-400 uppercase font-medium">Price</div>
          <div className="font-bold text-slate-800 flex items-center gap-1.5">
            <span>
              {formatPrice(Number(product.price))} / {product.unit || "Pc"}
            </span>
            <span className="px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
              Fixed
            </span>
          </div>
        </div>

        <div>
          <div className="text-[10px] text-slate-400 uppercase font-medium">Prepayment</div>
          <div className="font-bold text-slate-800 flex items-center gap-1.5">
            <span>{formatPrice(Number(product.prepaymentAmount))}</span>
            <span className="px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">
              Needed
            </span>
          </div>
        </div>
      </td>

      {/* Discount */}
      <td className="py-3 px-3 align-top">
        {hasDiscount ? (
          <span className="inline-block px-2.5 py-1 rounded bg-blue-50 text-blue-700 text-xs font-bold">
            -{product.discountType === "flat" ? formatPrice(Number(product.discount || 0)) : `${product.discount}%`}
          </span>
        ) : (
          <span className="text-slate-300">-</span>
        )}
      </td>

      {/* Availability */}
      <td className="py-3 px-3 align-top">
        {product.isAvailable ? (
          <span className="inline-block px-2 py-1 rounded bg-emerald-50 text-emerald-700 text-xs font-bold">
            Available now
          </span>
        ) : (
          <div className="space-y-0.5">
            <div className="text-[11px] text-slate-500 font-medium">
              {product.availableDate || formatDate(product.releaseDate)}
            </div>
            <span className="inline-block px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-bold">
              Approx
            </span>
          </div>
        )}
      </td>

      {/* Orders: PreOrder & Final Order */}
      <td className="py-3 px-3 align-top space-y-1.5 text-[11px]">
        <div>
          <div className="text-slate-400">PreOrder</div>
          <div className="font-bold text-slate-800">
            {product.currentPreorders || 0}
          </div>
        </div>
        <div>
          <div className="text-slate-400">Final Order</div>
          <div className="font-bold text-slate-800">
            {product.finalOrders || 0}
          </div>
        </div>
      </td>

      {/* Status: Publish & Featured switches */}
      <td className="py-3 px-3 align-top">
        <div className="flex flex-col items-center gap-2">
          <div className="text-center">
            <span className="block text-[10px] text-slate-400 uppercase font-medium mb-1">
              Publish
            </span>
            <button
              type="button"
              onClick={() => onTogglePublished(product.id, product.status)}
              className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                product.status ? "bg-emerald-500" : "bg-slate-300"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${
                  product.status ? "translate-x-3" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <div className="text-center">
            <span className="block text-[10px] text-slate-400 uppercase font-medium mb-1">
              Featured
            </span>
            <button
              type="button"
              onClick={() => onToggleFeatured(product.id, product.featured)}
              className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                product.featured ? "bg-emerald-500" : "bg-slate-300"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${
                  product.featured ? "translate-x-3" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </td>

      {/* Actions (Active eCommerce 1:1) */}
      <td className="py-3 px-3 align-top text-right whitespace-nowrap">
        <div className="flex items-center justify-end gap-1.5 pt-1">
          {/* View */}
          <Link
            href={`/product/${product.slug}`}
            target="_blank"
            className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center transition-colors"
            title="View"
          >
            <Eye className="w-3.5 h-3.5" />
          </Link>

          {/* Edit */}
          <Link
            href={`/admin/preorder/products/create`}
            className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition-colors"
            title="Edit"
          >
            <Edit className="w-3.5 h-3.5" />
          </Link>

          {/* Delete */}
          <button
            type="button"
            onClick={() => onDeleteProduct(product)}
            className="w-7 h-7 rounded-full bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center transition-colors"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </tr>
  )
}
