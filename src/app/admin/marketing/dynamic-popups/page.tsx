import React from "react"
import { Metadata } from "next"
import { getAllDynamicPopups } from "@/services/dynamic-popup-service"
import { DynamicPopupsView } from "./_components/dynamic-popups-view"

export const metadata: Metadata = {
  title: "Dynamic Popups | Admin Dashboard",
  description: "Manage dynamic popups and promotional modal campaigns",
}

export default async function AdminDynamicPopupsPage() {
  const popups = await getAllDynamicPopups()

  const formattedPopups = popups.map((p) => ({
    id: p.id,
    title: p.title,
    summary: p.summary || "",
    banner: p.bannerUrl,
    btnText: p.btnText || "Shop Now",
    btnBackgroundColor: p.btnBackgroundColor || "#d43533",
    btnTextColor: p.btnTextColor || "white",
    btnLink: p.link || "#",
    status: p.status,
    createdAt: p.createdAt,
  }))

  return (
    <div className="p-4 md:p-6">
      <DynamicPopupsView initialPopups={formattedPopups} />
    </div>
  )
}
