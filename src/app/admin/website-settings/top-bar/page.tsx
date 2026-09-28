import React from "react"
import { AdminTopBarView } from "./_components/admin-top-bar-view"

export const metadata = {
  title: "Top Bar Settings | Admin Panel",
}

const initialBanners = [
  {
    id: 1,
    text: "🔥 Summer Flash Sale! Up to 60% OFF on Selected Electronics & Apparel.",
    link: "/flash-deals",
    status: true,
    createdAt: "2024-01-10",
  },
  {
    id: 2,
    text: "🚚 Free Nationwide Shipping on all prepaid orders over ৳1,500!",
    link: "/products",
    status: false,
    createdAt: "2024-01-12",
  },
]

const initialConfig = {
  backgroundColor: "#1e293b",
  textColor: "white" as "white" | "dark",
  height: 40,
  link: "/products",
}

export default function AdminTopBarPage() {
  return <AdminTopBarView initialBanners={initialBanners} initialConfig={initialConfig} />
}
