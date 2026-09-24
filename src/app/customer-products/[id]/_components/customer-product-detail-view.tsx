"use client"

import React, { useState } from "react"
import Link from "next/link"
import { type ClassifiedProductItem } from "@/services/customer-product-service"
import { formatPrice } from "@/lib/utils"
import {
  ChevronRight,
  Home,
  Phone,
  Mail,
  MapPin,
  Calendar,
  ShieldAlert,
  ShieldCheck,
  Tag,
  Share2,
  Check,
} from "lucide-react"

interface CustomerProductDetailViewProps {
  product: ClassifiedProductItem
}

export function CustomerProductDetailView({ product }: CustomerProductDetailViewProps) {
  const [copied, setCopied] = useState(false)
  const [showPhone, setShowPhone] = useState(false)

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="bg-[#f2f3f8] min-h-screen py-6 sm:py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Breadcrumb */}
        <nav className="mb-4 flex items-center space-x-2 text-xs sm:text-sm text-gray-500">
          <Link href="/" className="hover:text-[#d43533] transition-colors flex items-center gap-1">
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/customer-products" className="hover:text-[#d43533] transition-colors">
            Classified Ads
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-gray-800 line-clamp-1">{product.name}</span>
        </nav>

        {/* Main Grid: Left Gallery/Info, Right Seller & Safety */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Image Card */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm p-4 sm:p-6">
              <div className="aspect-[4/3] w-full bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center relative border border-gray-100">
                <img
                  src={product.thumbnailImg || "/assets/img/placeholder.jpg"}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
                <span className="absolute top-3 left-3 px-3 py-1 bg-[#d43533] text-white text-xs font-bold rounded-md shadow-sm">
                  {product.condition}
                </span>
              </div>

              {/* Title & Price Header */}
              <div className="mt-6 border-t border-gray-100 pt-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug">
                      {product.name}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mt-2">
                      <span className="flex items-center gap-1">
                        <Tag className="w-3.5 h-3.5 text-gray-400" />
                        {product.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        {product.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        Posted: {product.date}
                      </span>
                    </div>
                  </div>

                  <div className="sm:text-right">
                    <p className="text-2xl sm:text-3xl font-extrabold text-[#d43533]">
                      {formatPrice(product.unitPrice)}
                    </p>
                    <span className="text-[11px] text-gray-400 font-medium">Negotiable directly with seller</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-3">
              <h2 className="text-base font-bold text-gray-800 border-b pb-2">Description &amp; Details</h2>
              <div className="text-xs sm:text-sm text-gray-700 leading-relaxed space-y-2">
                <p>
                  Original customer product listing posted on Active eCommerce Classifieds marketplace.
                  Item condition is verified as <strong className="text-gray-900">{product.condition}</strong>.
                </p>
                <p>
                  Located in <strong className="text-gray-900">{product.location}</strong>. Prospective buyers
                  can contact the seller directly using the verified telephone number or email address provided.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column (4 Cols): Seller Contact & Safety Rules */}
          <div className="lg:col-span-4 space-y-6">
            {/* Seller Contact Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
              <div className="border-b pb-3 flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-800">Seller Information</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Verified Member
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-red-100 text-[#d43533] font-bold text-lg flex items-center justify-center flex-shrink-0">
                  {product.customerName.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-800">{product.customerName}</h4>
                  <p className="text-xs text-gray-500">{product.location}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                {showPhone ? (
                  <a
                    href={`tel:${product.customerPhone}`}
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call: {product.customerPhone}</span>
                  </a>
                ) : (
                  <button
                    onClick={() => setShowPhone(true)}
                    className="w-full py-2.5 px-4 bg-[#d43533] hover:bg-[#b82d2b] text-white font-bold text-xs rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Show Seller Phone Number</span>
                  </button>
                )}

                {product.customerEmail && (
                  <a
                    href={`mailto:${product.customerEmail}?subject=Inquiry regarding: ${product.name}`}
                    className="w-full py-2.5 px-4 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold text-xs rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span>Send Email Inquiry</span>
                  </a>
                )}

                <button
                  onClick={handleShare}
                  className="w-full py-2 px-4 border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-medium rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copied ? "Link Copied!" : "Share this ad"}</span>
                </button>
              </div>
            </div>

            {/* Safety Tips Card */}
            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>Active eCommerce Safety Tips</span>
              </div>
              <ul className="text-xs text-amber-800 space-y-2 list-disc list-inside leading-relaxed">
                <li>Meet the seller in person in a well-lit, public location.</li>
                <li>Carefully inspect and test the item before making payment.</li>
                <li>Never send money in advance through bKash, Nagad, or wire transfer.</li>
                <li>Be wary of deals that appear unrealistically cheap.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
