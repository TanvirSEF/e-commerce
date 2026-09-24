import React from "react"
import { Metadata } from "next"
import Link from "next/link"
import { getProducts } from "@/services/product-service"
import { ProductCard } from "@/components/product/product-card"
import { ChevronRight, Home, ShieldCheck } from "lucide-react"

export const metadata: Metadata = {
  title: "In-House Products | Active eCommerce Official Store",
  description: "Browse 100% genuine products shipped directly from Active eCommerce official warehouse",
}

interface PageProps {
  searchParams: Promise<{ sort?: string; page?: string }>
}

export default async function InhouseProductsPage({ searchParams }: PageProps) {
  const { sort = "newest", page = "1" } = await searchParams
  const pageNum = parseInt(page, 10) || 1

  const { data: productsList, total } = await getProducts({
    sort: sort as any,
    page: pageNum,
    limit: 18,
  })

  return (
    <div className="bg-[#f2f3f8] min-h-screen py-6 sm:py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 pb-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">In-House Official Products</h1>
          </div>
          <nav className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500 mt-2 sm:mt-0">
            <Link href="/" className="hover:text-[#d43533] transition-colors flex items-center gap-1">
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold text-gray-800">In-House</span>
          </nav>
        </div>

        {/* Quality Banner */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 sm:p-5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-emerald-950">100% Genuine Direct Warehouse Inventory</p>
              <p className="text-xs text-emerald-700 mt-0.5">
                Sold, inspected, and guaranteed directly by Active eCommerce official operations.
              </p>
            </div>
          </div>
          <div className="text-xs font-semibold text-emerald-800 bg-white px-3 py-1.5 rounded-lg border border-emerald-200 whitespace-nowrap shadow-sm">
            {total} Products Available
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {productsList.map((product) => (
            <ProductCard
              key={product.id}
              id={String(product.id)}
              name={product.name}
              slug={product.slug}
              thumbnail={product.thumbnail}
              price={product.price}
              originalPrice={product.originalPrice}
              discountPercent={product.discountPercent}
              rating={product.rating}
              reviewCount={product.reviewCount}
              badge="Official"
            />
          ))}
        </div>
      </div>
    </div>
  )
}
