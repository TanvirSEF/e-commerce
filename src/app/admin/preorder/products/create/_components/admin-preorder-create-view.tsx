"use client"

import React, { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { createPreorderProductAction } from "@/app/actions/preorder-actions"
import { CreateProductInfoCard } from "./create-product-info-card"
import { CreateProductMediaCard } from "./create-product-media-card"
import { CreateProductPricingCard } from "./create-product-pricing-card"
import { CreateProductSidebar } from "./create-product-sidebar"

interface AdminPreorderCreateViewProps {
  categories?: { id: string | number; name: string; slug?: string }[]
  brands?: { id: string | number; name: string; slug?: string }[]
}

export function AdminPreorderCreateView({
  categories = [],
  brands = [],
}: AdminPreorderCreateViewProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  // Form states
  const [name, setName] = useState("")
  const [brandId, setBrandId] = useState(
    brands && brands.length > 0 && brands[0]?.id ? String(brands[0].id) : ""
  )
  const [unit, setUnit] = useState("Pc")
  const [minQty, setMinQty] = useState(1)
  const [tags, setTags] = useState("")
  const [barcode, setBarcode] = useState("")

  const [thumbnail, setThumbnail] = useState("/assets/img/placeholder.jpg")
  const [galleryImages, setGalleryImages] = useState<string[]>([])
  const [videoProvider, setVideoProvider] = useState("youtube")
  const [videoLink, setVideoLink] = useState("")

  const [price, setPrice] = useState("99.00")
  const [isPrepayment, setIsPrepayment] = useState(true)
  const [prepaymentAmount, setPrepaymentAmount] = useState("20.00")
  const [preorderBatchLimit, setPreorderBatchLimit] = useState(100)
  const [discount, setDiscount] = useState("0.00")
  const [discountType, setDiscountType] = useState("percent")
  const [isCoupon, setIsCoupon] = useState(false)
  const [couponCode, setCouponCode] = useState("")
  const [couponAmount, setCouponAmount] = useState("0")

  const [selectedCategoryId, setSelectedCategoryId] = useState(
    categories && categories.length > 0 && categories[0]?.id ? String(categories[0].id) : ""
  )
  const [isPublished, setIsPublished] = useState(true)
  const [isFeatured, setIsFeatured] = useState(false)
  const [isAvailable, setIsAvailable] = useState(false)
  const [availableDate, setAvailableDate] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  )
  const [isRefundable, setIsRefundable] = useState(true)
  const [shippingType, setShippingType] = useState<"free" | "flat">("free")
  const [isCod, setIsCod] = useState(true)

  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = (buttonType: "publish" | "unpublish") => {
    if (!name.trim()) {
      setError("Product Name is required.")
      return
    }
    if (!price || Number(price) <= 0) {
      setError("Please specify a valid unit price.")
      return
    }
    if (isPrepayment && (!prepaymentAmount || Number(prepaymentAmount) <= 0)) {
      setError("Prepayment deposit amount is required when Prepayment is enabled.")
      return
    }

    setError(null)
    const selectedCategory = categories.find((c) => String(c.id) === selectedCategoryId)

    startTransition(async () => {
      try {
        const res = await createPreorderProductAction({
          name: name.trim(),
          price: String(price),
          prepaymentAmount: isPrepayment ? String(prepaymentAmount) : "0.00",
          releaseDate: new Date(availableDate),
          preorderBatchLimit: Number(preorderBatchLimit) || 100,
          sku: barcode.trim() || undefined,
          sellerSlug: "inhouse",
          categoryName: selectedCategory?.name || "Consumer Electronics",
          unit: unit.trim() || "Pc",
          minQty: Number(minQty) || 1,
          isRefundable,
          discount: String(discount),
          discountType,
          isAvailable,
          availableDate,
        })

        if (res) {
          setSuccess("Product has been created successfully!")
          setTimeout(() => {
            router.push("/admin/preorder/products")
            router.refresh()
          }, 600)
        } else {
          setError("Failed to create product in database.")
        }
      } catch (err: any) {
        setError(err?.message || "Failed to create pre-order product")
      }
    })
  }

  return (
    <div className="space-y-4">
      {/* Title bar: 1:1 Active eCommerce */}
      <div className="flex items-center justify-between">
        <h5 className="text-base font-bold text-gray-800">Add New Product</h5>
        <Link
          href="/admin/preorder/products"
          className="text-xs text-gray-500 hover:text-gray-900 transition-colors"
        >
          ← Back to Preorder Products
        </Link>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 text-xs rounded-lg border bg-red-50 text-red-800 border-red-200">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 p-3 text-xs rounded-lg border bg-emerald-50 text-emerald-800 border-emerald-200">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{success}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: col-lg-8 */}
        <div className="lg:col-span-8 space-y-5">
          <CreateProductInfoCard
            name={name}
            setName={setName}
            brandId={brandId}
            setBrandId={setBrandId}
            brands={brands}
            unit={unit}
            setUnit={setUnit}
            minQty={minQty}
            setMinQty={setMinQty}
            tags={tags}
            setTags={setTags}
            barcode={barcode}
            setBarcode={setBarcode}
          />

          <CreateProductMediaCard
            thumbnail={thumbnail}
            setThumbnail={setThumbnail}
            galleryImages={galleryImages}
            setGalleryImages={setGalleryImages}
            videoProvider={videoProvider}
            setVideoProvider={setVideoProvider}
            videoLink={videoLink}
            setVideoLink={setVideoLink}
          />

          <CreateProductPricingCard
            price={price}
            setPrice={setPrice}
            isPrepayment={isPrepayment}
            setIsPrepayment={setIsPrepayment}
            prepaymentAmount={prepaymentAmount}
            setPrepaymentAmount={setPrepaymentAmount}
            preorderBatchLimit={preorderBatchLimit}
            setPreorderBatchLimit={setPreorderBatchLimit}
            discount={discount}
            setDiscount={setDiscount}
            discountType={discountType}
            setDiscountType={setDiscountType}
            isCoupon={isCoupon}
            setIsCoupon={setIsCoupon}
            couponCode={couponCode}
            setCouponCode={setCouponCode}
            couponAmount={couponAmount}
            setCouponAmount={setCouponAmount}
          />
        </div>

        {/* Right Column: col-lg-4 */}
        <div className="lg:col-span-4">
          <CreateProductSidebar
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            setSelectedCategoryId={setSelectedCategoryId}
            isPublished={isPublished}
            setIsPublished={setIsPublished}
            isFeatured={isFeatured}
            setIsFeatured={setIsFeatured}
            isAvailable={isAvailable}
            setIsAvailable={setIsAvailable}
            availableDate={availableDate}
            setAvailableDate={setAvailableDate}
            isRefundable={isRefundable}
            setIsRefundable={setIsRefundable}
            shippingType={shippingType}
            setShippingType={setShippingType}
            isCod={isCod}
            setIsCod={setIsCod}
          />
        </div>

        {/* Bottom Toolbar: 1:1 Active eCommerce */}
        <div className="col-span-12 flex justify-end gap-3 pt-2 pb-6">
          <button
            type="button"
            disabled={isPending}
            onClick={() => handleSubmit("unpublish")}
            className="px-4 py-2 rounded text-xs font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 shadow-xs transition-colors disabled:opacity-50"
          >
            Save & Unpublish
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() => handleSubmit("publish")}
            className="px-5 py-2 rounded text-xs font-semibold text-white bg-[#28a745] hover:bg-[#218838] shadow-xs transition-colors disabled:opacity-50"
          >
            {isPending ? "Saving..." : "Save & Publish"}
          </button>
        </div>
      </div>
    </div>
  )
}
