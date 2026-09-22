"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Users,
  Package,
  Layers,
  Tag,
  DollarSign,
  ShoppingBag,
  Clock,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  Eye,
} from "lucide-react"

export interface AdminDashboardStats {
  totalCustomers: number
  totalProducts: number
  totalCategories: number
  totalBrands: number
  totalSales: number
  totalOrders: number
  pendingOrders: number
  deliveredOrders: number
  cancelledOrders: number
  recentOrders: {
    id: string
    code: string
    customerName: string
    amount: number
    deliveryStatus: string
    paymentStatus: string
    itemCount: number
    date: string
  }[]
  topProducts: {
    id: string
    name: string
    slug: string
    category: string
    price: number
    salesCount: number
    rating: number
    thumbnail: string
  }[]
}

interface AdminDashboardViewProps {
  stats: AdminDashboardStats
}

export function AdminDashboardView({ stats }: AdminDashboardViewProps) {
  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-xs text-slate-500 mt-0.5">Welcome back to Active eCommerce Admin Panel</p>
        </div>
        <div className="flex items-center space-x-2">
          <Link
            href="/admin/products/create"
            className="px-3.5 py-1.5 bg-[#d43533] text-white text-xs font-bold rounded shadow-xs hover:bg-[#b82a28] transition-colors"
          >
            + Add New Product
          </Link>
        </div>
      </div>

      {/* 1. Top 4 KPI Boxes (Active eCommerce 1:1) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Customers */}
        <div className="bg-white p-5 border border-slate-200 rounded-sm shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-2xl font-black text-slate-800">{stats.totalCustomers}</p>
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
                Total Customers
              </h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Verified accounts</span>
            <span className="font-bold text-slate-700">{stats.totalCustomers}</span>
          </div>
        </div>

        {/* Total Products */}
        <div className="bg-white p-5 border border-slate-200 rounded-sm shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-2xl font-black text-slate-800">{stats.totalProducts}</p>
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
                Total Products
              </h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Published catalog</span>
            <span className="font-bold text-emerald-600">Active</span>
          </div>
        </div>

        {/* Total Categories */}
        <div className="bg-white p-5 border border-slate-200 rounded-sm shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-2xl font-black text-slate-800">{stats.totalCategories}</p>
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
                Total Categories
              </h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Hierarchy levels</span>
            <span className="font-bold text-slate-700">Multi-tier</span>
          </div>
        </div>

        {/* Total Brands */}
        <div className="bg-white p-5 border border-slate-200 rounded-sm shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-2xl font-black text-slate-800">{stats.totalBrands}</p>
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
                Total Brands
              </h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
              <Tag className="w-5 h-5" />
            </div>
          </div>
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Featured brands</span>
            <span className="font-bold text-slate-700">Top Tier</span>
          </div>
        </div>
      </div>

      {/* 2. Sales & Orders Metrics Row (Active eCommerce 1:1) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white p-4 border border-slate-200 rounded-sm shadow-xs">
          <div className="flex items-center space-x-2 text-slate-500 mb-1">
            <DollarSign className="w-4 h-4 text-[#d43533]" />
            <span className="text-xs font-semibold">Total Sale</span>
          </div>
          <p className="text-lg font-bold text-slate-800">৳{stats.totalSales.toLocaleString()}</p>
        </div>

        <div className="bg-white p-4 border border-slate-200 rounded-sm shadow-xs">
          <div className="flex items-center space-x-2 text-slate-500 mb-1">
            <ShoppingBag className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-semibold">Total Orders</span>
          </div>
          <p className="text-lg font-bold text-slate-800">{stats.totalOrders}</p>
        </div>

        <div className="bg-white p-4 border border-slate-200 rounded-sm shadow-xs">
          <div className="flex items-center space-x-2 text-slate-500 mb-1">
            <Clock className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-semibold">Pending</span>
          </div>
          <p className="text-lg font-bold text-amber-600">{stats.pendingOrders}</p>
        </div>

        <div className="bg-white p-4 border border-slate-200 rounded-sm shadow-xs">
          <div className="flex items-center space-x-2 text-slate-500 mb-1">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-semibold">Delivered</span>
          </div>
          <p className="text-lg font-bold text-emerald-600">{stats.deliveredOrders}</p>
        </div>

        <div className="bg-white p-4 border border-slate-200 rounded-sm shadow-xs col-span-2 sm:col-span-1">
          <div className="flex items-center space-x-2 text-slate-500 mb-1">
            <XCircle className="w-4 h-4 text-red-500" />
            <span className="text-xs font-semibold">Cancelled</span>
          </div>
          <p className="text-lg font-bold text-red-600">{stats.cancelledOrders}</p>
        </div>
      </div>

      {/* 3. Main Data Section: Recent Orders & Top Selling Products */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Orders (Col 8) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-sm shadow-xs">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800">Recent Orders</h2>
            <Link
              href="/admin/orders"
              className="text-xs font-semibold text-[#d43533] hover:underline flex items-center gap-0.5"
            >
              View All <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-100 uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Order Code</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Delivery</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats.recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-800">{order.code}</td>
                    <td className="py-3 px-4 text-slate-600">{order.customerName}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">৳{order.amount}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                          order.deliveryStatus === "delivered"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {order.deliveryStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                          order.paymentStatus === "paid"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/admin/orders?code=${order.code}`}
                        className="inline-flex items-center p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded"
                        title="View details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Selling Products (Col 4) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-sm shadow-xs">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800">Top Selling Products</h2>
            <Link
              href="/admin/products"
              className="text-xs font-semibold text-[#d43533] hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {stats.topProducts.slice(0, 5).map((prod) => (
              <div key={prod.id} className="p-3.5 flex items-center space-x-3 hover:bg-slate-50">
                <div className="w-11 h-11 relative border border-slate-200 rounded-xs flex-shrink-0 bg-white">
                  <Image
                    src={prod.thumbnail}
                    alt={prod.name}
                    fill
                    sizes="44px"
                    className="object-contain p-1"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-bold text-slate-800 truncate">{prod.name}</h3>
                  <div className="flex items-center space-x-2 text-[11px] text-slate-500 mt-0.5">
                    <span className="font-semibold text-[#d43533]">৳{prod.price}</span>
                    <span>•</span>
                    <span>{prod.salesCount} sold</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
