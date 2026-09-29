"use client"

import React from "react"
import Link from "next/link"
import type { AdminDashboardData } from "@/services/admin-dashboard-service"
import { DashboardKpiCards } from "./dashboard-kpi-cards"
import { DashboardSalesSellers } from "./dashboard-sales-sellers"
import { DashboardOrderStatus } from "./dashboard-order-status"
import { DashboardInhouseAnalytics } from "./dashboard-inhouse-analytics"
import { DashboardTopTabs } from "./dashboard-top-tabs"

interface AdminDashboardViewProps {
  data: AdminDashboardData
}

export function AdminDashboardView({ data }: AdminDashboardViewProps) {
  return (
    <div className="space-y-6">
      {/* Page Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-xs text-slate-500 mt-0.5">Welcome back to Active eCommerce Admin Panel</p>
        </div>
        <div>
          <Link
            href="/admin/products/create"
            className="px-3.5 py-2 bg-[#d43533] hover:bg-[#b82a28] text-white text-xs font-bold rounded shadow-xs transition-colors inline-block"
          >
            + Add New Product
          </Link>
        </div>
      </div>

      {/* 1. Top 4 KPI Cards (Active eCommerce CMS 1:1) */}
      <DashboardKpiCards
        totalCustomers={data.totalCustomers}
        topCustomers={data.topCustomers}
        totalProducts={data.totalProducts}
        totalInhouseProducts={data.totalInhouseProducts}
        totalSellersProducts={data.totalSellersProducts}
        totalCategories={data.totalCategories}
        topCategories={data.topCategories}
        totalBrands={data.totalBrands}
        topBrands={data.topBrands}
      />

      {/* 2. Total Sales & Total Sellers 470px Modules (Active eCommerce CMS 1:1) */}
      <DashboardSalesSellers
        totalSales={data.totalSales}
        saleThisMonth={data.saleThisMonth}
        inhouseSaleThisMonth={data.inhouseSaleThisMonth}
        sellerSaleThisMonth={data.sellerSaleThisMonth}
        yearlySalesStat={data.yearlySalesStat}
        totalSellers={data.totalSellers}
        approvedSellersCount={data.approvedSellersCount}
        pendingSellersCount={data.pendingSellersCount}
        topSellers={data.topSellers}
      />

      {/* 3. Order Status Grid (Confirmed, Processed, Picked Up, Shipped) */}
      <DashboardOrderStatus
        totalConfirmedOrders={data.totalConfirmedOrders}
        totalProcessedOrders={data.totalProcessedOrders}
        totalPickedUpOrders={data.totalPickedUpOrders}
        totalShippedOrders={data.totalShippedOrders}
      />

      {/* 4. In-house Store Revenue & Payment Distribution */}
      <DashboardInhouseAnalytics
        totalInhouseSale={data.totalInhouseSale}
        inhouseProductsCount={data.totalInhouseProducts}
        inhouseRating={data.inhouseProductRating}
        totalInhouseOrders={data.totalInhouseOrders}
        paymentDistribution={data.paymentTypeWiseInhouseSale}
      />

      {/* 5. In-house Top Categories/Brands Tabs & Live Recent Orders Table */}
      <DashboardTopTabs
        topCategories={data.topCategoriesRanked}
        topBrands={data.topBrandsRanked}
        recentOrders={data.recentOrders}
      />
    </div>
  )
}
