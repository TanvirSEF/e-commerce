import React from "react"
import { Metadata } from "next"
import { getSellerCommissionSettings } from "@/services/settings-service"
import { SellerCommissionHistoryView } from "./_components/seller-commission-history-view"

export const metadata: Metadata = {
  title: "Commission History | Seller Console",
  description: "View platform commission deductions and earnings history",
}

export default async function SellerCommissionHistoryPage() {
  const settings = await getSellerCommissionSettings()

  const sampleRecords = [
    {
      id: 1,
      orderCode: "ORD-20260324-9182",
      orderTotal: 4500,
      adminCommission: 450,
      sellerEarning: 4050,
      commissionRate: 10,
      orderFrom: "web",
      createdAt: "24 Mar 2026, 02:45 PM",
    },
    {
      id: 2,
      orderCode: "ORD-20260323-8831",
      orderTotal: 12800,
      adminCommission: 1280,
      sellerEarning: 11520,
      commissionRate: 10,
      orderFrom: "pos",
      createdAt: "23 Mar 2026, 11:20 AM",
    },
    {
      id: 3,
      orderCode: "ORD-20260321-7294",
      orderTotal: 2600,
      adminCommission: 260,
      sellerEarning: 2340,
      commissionRate: 10,
      orderFrom: "web",
      createdAt: "21 Mar 2026, 05:15 PM",
    },
    {
      id: 4,
      orderCode: "ORD-20260319-6102",
      orderTotal: 8900,
      adminCommission: 890,
      sellerEarning: 8010,
      commissionRate: 10,
      orderFrom: "web",
      createdAt: "19 Mar 2026, 09:30 AM",
    },
    {
      id: 5,
      orderCode: "ORD-20260317-5481",
      orderTotal: 1540,
      adminCommission: 154,
      sellerEarning: 1386,
      commissionRate: 10,
      orderFrom: "web",
      createdAt: "17 Mar 2026, 04:10 PM",
    },
  ]

  return (
    <div className="p-4 md:p-6">
      <SellerCommissionHistoryView
        commissionType={settings.commissionType}
        rate={settings.fixedCommissionRate}
        records={sampleRecords}
      />
    </div>
  )
}
