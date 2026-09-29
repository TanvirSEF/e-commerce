"use client"

import React, { useState } from "react"
import type {
  TopCustomerItem,
  CategorySalesItem,
  BrandSalesItem,
} from "@/services/admin-dashboard-service"

interface DashboardKpiCardsProps {
  totalCustomers: number
  topCustomers: TopCustomerItem[]
  totalProducts: number
  totalInhouseProducts: number
  totalSellersProducts: number
  totalCategories: number
  topCategories: CategorySalesItem[]
  totalBrands: number
  topBrands: BrandSalesItem[]
}

function SafeAvatar({ src, alt }: { src: string; alt: string }) {
  const [error, setError] = useState(false)
  return (
    <img
      src={error ? "/assets/img/avatar-place.png" : src}
      alt={alt}
      onError={() => setError(true)}
      className="w-full h-full object-cover"
    />
  )
}

export function DashboardKpiCards({
  totalCustomers,
  topCustomers,
  totalProducts,
  totalInhouseProducts,
  totalSellersProducts,
  totalCategories,
  topCategories,
  totalBrands,
  topBrands,
}: DashboardKpiCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Customer */}
      <div className="bg-white p-5 border border-slate-200 rounded-sm shadow-xs flex flex-col justify-between min-h-[220px]">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight mb-1">{totalCustomers}</h1>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Customer</h3>
          </div>
          <div className="text-slate-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" className="fill-current text-slate-300">
              <path d="M21,13.75a1.25,1.25,0,0,0,2.5,0,7.508,7.508,0,0,0-4.068-6.667,4.375,4.375,0,1,0-6.865,0A7.508,7.508,0,0,0,8.5,13.75a1.25,1.25,0,0,0,2.5,0,5,5,0,0,1,10,0ZM14.125,4.375A1.875,1.875,0,1,1,16,6.25,1.877,1.877,0,0,1,14.125,4.375ZM10.932,24.083a4.375,4.375,0,1,0-6.865,0A7.508,7.508,0,0,0,0,30.75a1.25,1.25,0,0,0,2.5,0,5,5,0,0,1,10,0,1.25,1.25,0,0,0,2.5,0A7.508,7.508,0,0,0,10.932,24.083ZM5.625,21.375A1.875,1.875,0,1,1,7.5,23.25,1.877,1.877,0,0,1,5.625,21.375Zm22.307,2.708a4.375,4.375,0,1,0-6.865,0A7.508,7.508,0,0,0,17,30.75a1.25,1.25,0,0,0,2.5,0,5,5,0,0,1,10,0,1.25,1.25,0,0,0,2.5,0A7.508,7.508,0,0,0,27.932,24.083Zm-5.307-2.708A1.875,1.875,0,1,1,24.5,23.25,1.877,1.877,0,0,1,22.625,21.375Zm0,0" />
            </svg>
          </div>
        </div>

        <div>
          <div className="flex items-center text-xs font-semibold text-slate-700 mb-2">
            <span className="w-2 h-2 rounded-full bg-red-500 mr-2 shrink-0"></span>
            <span>Top Customers</span>
          </div>
          <div className="flex items-center -space-x-2 overflow-hidden">
            {topCustomers.length > 0 ? (
              topCustomers.map((cust) => (
                <div
                  key={cust.id}
                  className="inline-block h-9 w-9 rounded-full ring-2 ring-white overflow-hidden bg-slate-100"
                  title={`${cust.name} (৳${cust.totalSpent.toLocaleString()})`}
                >
                  <SafeAvatar src={cust.avatar} alt={cust.name} />
                </div>
              ))
            ) : (
              <span className="text-xs text-slate-400">No customer purchase data</span>
            )}
          </div>
        </div>
      </div>

      {/* 2. Total Products */}
      <div className="bg-white p-5 border border-slate-200 rounded-sm shadow-xs flex flex-col justify-between min-h-[220px]">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight mb-1">{totalProducts}</h1>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Products</h3>
          </div>
          <div className="text-slate-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="27.429" viewBox="0 0 32 27.429" className="fill-current text-slate-300">
              <path d="M30.857,0H1.143A1.143,1.143,0,0,0,0,1.143V8a1.143,1.143,0,0,0,1.143,1.143H2.286V26.286A1.143,1.143,0,0,0,3.429,27.429H28.571a1.143,1.143,0,0,0,1.143-1.143V9.143h1.143A1.143,1.143,0,0,0,32,8V1.143A1.143,1.143,0,0,0,30.857,0ZM27.429,25.143H4.571v-16H27.429Zm2.286-18.286H2.286V2.286H29.714Z" />
              <path d="M11.143,12.286H18A1.143,1.143,0,0,0,18,10H11.143a1.143,1.143,0,0,0,0,2.286Z" />
            </svg>
          </div>
        </div>

        <div className="space-y-1.5 pt-2 border-t border-slate-50 text-xs">
          <div className="flex items-center justify-between">
            <span className="flex items-center text-slate-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 shrink-0"></span>
              In-house Products
            </span>
            <span className="font-bold text-slate-800">{totalInhouseProducts}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center text-slate-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-blue-500 mr-2 shrink-0"></span>
              Sellers Products
            </span>
            <span className="font-bold text-slate-800">{totalSellersProducts}</span>
          </div>
        </div>
      </div>

      {/* 3. Total Categories */}
      <div className="bg-white p-5 border border-slate-200 rounded-sm shadow-xs flex flex-col justify-between min-h-[220px]">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight mb-1">{totalCategories}</h1>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Categories</h3>
          </div>
          <div className="text-slate-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300">
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
          </div>
        </div>

        <div className="space-y-1 pt-2 border-t border-slate-50 text-xs">
          {topCategories.map((cat, idx) => {
            const dotColor = idx === 0 ? "bg-red-500" : idx === 1 ? "bg-amber-500" : "bg-blue-500"
            return (
              <div key={cat.id} className="flex items-center justify-between">
                <span className="flex items-center text-slate-600 truncate max-w-[130px]" title={cat.name}>
                  <span className={`w-3.5 h-1 rounded-full ${dotColor} mr-2 shrink-0`}></span>
                  <span className="truncate">{cat.name}</span>
                </span>
                <span className="font-bold text-slate-800">৳{cat.total.toLocaleString()}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* 4. Total Brands */}
      <div className="bg-white p-5 border border-slate-200 rounded-sm shadow-xs flex flex-col justify-between min-h-[220px]">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight mb-1">{totalBrands}</h1>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Brands</h3>
          </div>
          <div className="text-slate-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
              <line x1="7" y1="7" x2="7.01" y2="7" />
            </svg>
          </div>
        </div>

        <div className="space-y-1 pt-2 border-t border-slate-50 text-xs">
          {topBrands.map((b, idx) => {
            const dotColor = idx === 0 ? "bg-emerald-500" : idx === 1 ? "bg-blue-500" : "bg-cyan-500"
            return (
              <div key={b.id} className="flex items-center justify-between">
                <span className="flex items-center text-slate-600 truncate max-w-[130px]" title={b.name}>
                  <span className={`w-2 h-2 rounded-full ${dotColor} mr-2 shrink-0`}></span>
                  <span className="truncate">{b.name}</span>
                </span>
                <span className="font-bold text-slate-800">৳{b.total.toLocaleString()}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
