import React from "react"
import { Metadata } from "next"
import { CreatePageView } from "./_components/create-page-view"

export const metadata: Metadata = {
  title: "Add New Page | Active eCommerce Admin",
}

export default function AdminCreatePage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      <CreatePageView />
    </div>
  )
}
