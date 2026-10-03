"use client"

import React, { useState } from "react"
import type { SellerDashboardFullData } from "@/services/seller-service"
import { SellerTopCards } from "./seller-top-cards"
import { SellerAnalyticsRow } from "./seller-analytics-row"
import { SellerActionCards } from "./seller-action-cards"
import { SellerTopProducts } from "./seller-top-products"
import { SellerVerificationModal } from "./seller-verification-modal"

interface SellerDashboardViewProps {
  data: SellerDashboardFullData
}

export function SellerDashboardView({ data }: SellerDashboardViewProps) {
  const [verificationModalOpen, setVerificationModalOpen] = useState(false)

  return (
    <div className="space-y-6">
      {/* Row 1: 4 Solid Primary Red Metric Cards */}
      <SellerTopCards
        totalProducts={data.totalProducts}
        rating={data.shopRating}
        followersCount={data.followersCount}
        customFollowers={data.customFollowers}
        totalDeliveredOrders={data.totalDeliveredOrders}
        totalSales={data.totalSales}
        previousMonthSoldAmount={data.previousMonthSoldAmount}
      />

      {/* Row 2: Sales Stat (7-Day Bar Chart), Category Counts, Monthly Orders, Shop Verification */}
      <SellerAnalyticsRow
        last7DaysSales={data.last7DaysSales}
        thisMonthSoldAmount={data.thisMonthSoldAmount}
        previousMonthSoldAmount={data.previousMonthSoldAmount}
        categoryProductCounts={data.categoryProductCounts}
        thisMonthOrders={data.thisMonthOrders}
        verificationStatus={data.shop.verificationStatus}
        onOpenVerificationModal={() => setVerificationModalOpen(true)}
      />

      {/* Row 3: Commission Type & Rate, Money Withdraw, Shop Settings, Payment Settings */}
      <SellerActionCards commissionSetting={data.commissionSetting} />

      {/* Row 4: Top 12 Products */}
      <SellerTopProducts products={data.topProducts} />

      {/* Seller Verification Modal */}
      <SellerVerificationModal
        isOpen={verificationModalOpen}
        shopId={data.shop.id}
        onClose={() => setVerificationModalOpen(false)}
      />
    </div>
  )
}
