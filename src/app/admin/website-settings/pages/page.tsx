import React from "react"
import { Metadata } from "next"
import { getAllPages } from "@/services/page-service"
import { PagesView } from "./_components/pages-view"

export const metadata: Metadata = {
  title: "Website Pages | Active eCommerce Admin",
}

export default async function AdminPagesPage() {
  const pagesList = await getAllPages()

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <PagesView initialPages={pagesList} />
    </div>
  )
}
