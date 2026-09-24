import React from "react"
import { Metadata } from "next"
import { DynamicPopupCreateView } from "./_components/dynamic-popup-create-view"

export const metadata: Metadata = {
  title: "Create Dynamic Popup | Admin Dashboard",
  description: "Create and publish a new dynamic popup modal campaign",
}

export default function AdminDynamicPopupCreatePage() {
  return (
    <div className="p-4 md:p-6">
      <DynamicPopupCreateView />
    </div>
  )
}
