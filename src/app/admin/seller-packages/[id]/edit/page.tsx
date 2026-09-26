import React from "react"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getSellerPackageById } from "@/services/package-service"
import { SellerPackageEditView } from "./_components/seller-package-edit-view"

interface PageProps {
  params: Promise<{ id: string }>
}

export const metadata: Metadata = {
  title: "Edit Seller Package | Admin Dashboard",
  description: "Modify seller subscription plan parameters",
}

export default async function AdminSellerPackageEditPage({ params }: PageProps) {
  const { id } = await params
  const pkg = await getSellerPackageById(Number(id))

  if (!pkg) {
    notFound()
  }

  return (
    <div className="p-4 md:p-6">
      <SellerPackageEditView packageData={pkg} />
    </div>
  )
}
