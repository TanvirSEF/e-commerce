import React from "react"
import { Metadata } from "next"
import { AdminPreorderCreateView } from "./_components/admin-preorder-create-view"

export const metadata: Metadata = {
  title: "Add Pre-Order Product | Admin Dashboard",
  description: "Register a new preorder launch with release dates and deposit",
}

export default function AdminPreorderCreatePage() {
  return (
    <div className="p-4 md:p-6">
      <AdminPreorderCreateView />
    </div>
  )
}
