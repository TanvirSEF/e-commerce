import React from "react"
import { getSitemapLastGenerated } from "@/services/settings-service"
import { AdminSitemapView } from "./_components/admin-sitemap-view"

export const metadata = {
  title: "Sitemap Generator | Admin Panel",
}

export const dynamic = "force-dynamic"

export default async function AdminSitemapPage() {
  const lastGenerated = await getSitemapLastGenerated()

  return <AdminSitemapView initialLastGenerated={lastGenerated} />
}
