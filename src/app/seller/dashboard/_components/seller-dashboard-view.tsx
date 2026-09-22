"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import {
  DollarSign,
  ShoppingBag,
  Package,
  CheckCircle,
  TrendingUp,
  ArrowRight,
  Percent,
} from "lucide-react"
import { formatPrice } from "@/lib/utils"
import type { SellerDashboardStats } from "@/services/seller-service"
import type { SeedProduct } from "@/db/seed/data"

interface SellerDashboardViewProps {
  stats: SellerDashboardStats
  recentProducts: SeedProduct[]
}

export function SellerDashboardView({ stats, recentProducts }: SellerDashboardViewProps) {
  return (
    <div className="space-y-6">
      {/* Welcome Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Seller Dashboard</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Overview of your store performance and sales activity
          </p>
        </div>
        <Link
          href="/seller/products/create"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#d43533] hover:bg-[#b82a28] text-white text-xs font-semibold rounded-md shadow-sm transition-colors"
        >
          <Package className="w-4 h-4" />
          Add New Product
        </Link>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-medium">Total Sales</span>
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-800">{formatPrice(stats.totalSales)}</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">All-time revenue</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-medium">Current Balance</span>
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-[#d43533]">{formatPrice(stats.currentBalance)}</div>
          <div className="text-[11px] text-slate-400 mt-1">Available to withdraw</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-medium">Total Orders</span>
            <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-800">{stats.totalOrders}</div>
          <div className="text-[11px] text-slate-400 mt-1">
            {stats.pendingOrders} pending
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-medium">My Products</span>
            <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-800">{stats.totalProducts}</div>
          <div className="text-[11px] text-slate-400 mt-1">Active in catalog</div>
        </div>
      </div>

      {/* Secondary Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-bold text-slate-800">Order Summary</span>
          </div>
          <div className="space-y-2">
            {[
              { label: "Total Orders", value: stats.totalOrders, color: "text-slate-800" },
              { label: "Successful", value: stats.successfulOrders, color: "text-emerald-700" },
              { label: "Pending", value: stats.pendingOrders, color: "text-amber-700" },
              { label: "Cancelled", value: stats.totalOrders - stats.successfulOrders - stats.pendingOrders, color: "text-red-600" },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between text-xs">
                <span className="text-slate-500">{row.label}</span>
                <span className={`font-bold ${row.color}`}>{row.value}</span>
              </div>
            ))}
          </div>
          <Link
            href="/seller/orders"
            className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 text-xs text-[#d43533] font-semibold hover:underline"
          >
            View All Orders <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Category Commissions */}
        <div className="lg:col-span-2 bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <Percent className="w-4 h-4 text-[#d43533]" />
            <span className="text-sm font-bold text-slate-800">Category-wise Commission</span>
          </div>
          <div className="space-y-3">
            {stats.categoryCommissions.map((cc) => (
              <div key={cc.category} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-xs font-semibold text-slate-700">{cc.category}</div>
                  <div className="text-[11px] text-slate-400">{cc.productsCount} products</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#d43533] rounded-full"
                      style={{ width: `${cc.commission * 8}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-800 w-8 text-right">
                    {cc.commission}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Products */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
          <span className="text-sm font-bold text-slate-800">Recent Products</span>
          <Link href="/seller/products" className="text-xs text-[#d43533] font-semibold hover:underline">
            View All
          </Link>
        </div>
        <div className="divide-y divide-slate-50">
          {recentProducts.map((product) => (
            <div key={product.id} className="flex items-center gap-3 px-4 py-3">
              <div className="relative w-10 h-10 rounded border border-slate-200 overflow-hidden shrink-0">
                <Image src={product.thumbnail} alt={product.name} fill className="object-cover" unoptimized />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-slate-800 truncate">{product.name}</div>
                <div className="text-[11px] text-slate-400">{formatPrice(product.price)}</div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                  product.stock > 5
                    ? "bg-emerald-50 text-emerald-700"
                    : product.stock > 0
                    ? "bg-amber-50 text-amber-700"
                    : "bg-red-50 text-red-700"
                }`}>
                  {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
