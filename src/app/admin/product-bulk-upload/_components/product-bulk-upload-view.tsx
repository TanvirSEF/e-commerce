"use client"

import React, { useState } from "react"
import { bulkUploadProductsAction } from "@/app/actions/ecommerce-actions"
import {
  BulkUploadInstructionsCard,
  type CategoryReferenceItem,
  type BrandReferenceItem,
} from "./bulk-upload-instructions-card"
import {
  BulkUploadFormCard,
  type ParsedProductRow,
} from "./bulk-upload-form-card"
import { CheckCircle2, AlertCircle } from "lucide-react"

interface ProductBulkUploadViewProps {
  categories: CategoryReferenceItem[]
  brands: BrandReferenceItem[]
}

export function ProductBulkUploadView({
  categories,
  brands,
}: ProductBulkUploadViewProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [feedback, setFeedback] = useState<{
    type: "success" | "danger"
    text: string
  } | null>(null)

  const showNotification = (type: "success" | "danger", text: string) => {
    setFeedback({ type, text })
    setTimeout(() => setFeedback(null), 4000)
  }

  const handleUploadSubmit = async (rows: ParsedProductRow[]) => {
    setIsUploading(true)
    try {
      const res = await bulkUploadProductsAction(rows)
      if (res && res.success) {
        showNotification(
          "success",
          `Products imported successfully (${res.count} products added)`
        )
      } else {
        showNotification("danger", "Something went wrong during bulk import.")
      }
    } catch {
      showNotification("danger", "Network error occurred during bulk import.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-5">
      {/* Toast Notification (Active eCommerce 1:1) */}
      {feedback && (
        <div
          className={`flex items-center gap-2 p-3 text-xs rounded-lg border shadow-2xs transition-all ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Card 1: Instructions & Download Demo CSV */}
      <BulkUploadInstructionsCard categories={categories} brands={brands} />

      {/* Card 2: Upload Product File */}
      <BulkUploadFormCard
        onUploadSubmit={handleUploadSubmit}
        isUploading={isUploading}
      />
    </div>
  )
}
