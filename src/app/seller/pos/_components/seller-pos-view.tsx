"use client"

import React, { useState, useTransition } from "react"
import Link from "next/link"
import { Store, CheckCircle2, AlertCircle, Printer, FileText, Settings } from "lucide-react"
import { createPosSaleAction } from "@/app/actions/ecommerce-actions"
import type { PosProductItem, PosCustomerItem } from "@/services/pos-service"
import type { SeedCategory } from "@/db/seed/data"
import type { PosLineItem } from "@/db/schema"
import { PosCustomerSelector } from "./pos-customer-selector"
import { PosProductCatalog } from "./pos-product-catalog"
import { PosCartPanel } from "./pos-cart-panel"

interface SellerPosViewProps {
  products: PosProductItem[]
  categories: SeedCategory[]
  customers: PosCustomerItem[]
  sellerInfo: {
    shopId: number
    shopName: string
    shopSlug: string
  }
}

export function SellerPosView({
  products,
  categories,
  customers,
  sellerInfo,
}: SellerPosViewProps) {
  // Cart state
  const [cart, setCart] = useState<PosLineItem[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<PosCustomerItem | null>(null)
  const [walkInName, setWalkInName] = useState("Walk-in Customer")
  const [walkInPhone, setWalkInPhone] = useState("")
  const [discountAmount, setDiscountAmount] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState<"Cash" | "Card" | "bKash" | "Offline">("Cash")
  const [paidInput, setPaidInput] = useState("")

  const [lastOrderCode, setLastOrderCode] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  // Add to cart
  const addToCart = (product: PosProductItem) => {
    setCart((prev) => {
      const existing = prev.find((item) => String(item.productId) === String(product.id))
      if (existing) {
        if (existing.quantity >= product.currentStock) {
          setFeedback({
            type: "error",
            text: `Cannot add more. Available stock for "${product.name}" is ${product.currentStock}.`,
          })
          setTimeout(() => setFeedback(null), 3000)
          return prev
        }
        return prev.map((item) =>
          String(item.productId) === String(product.id)
            ? {
                ...item,
                quantity: item.quantity + 1,
                lineTotal: (item.quantity + 1) * item.price,
              }
            : item
        )
      }
      return [
        ...prev,
        {
          productId: product.id,
          productName: product.name,
          thumbnail: product.thumbnailImg,
          price: product.unitPrice,
          quantity: 1,
          lineTotal: product.unitPrice,
        },
      ]
    })
  }

  // Barcode scanner
  const handleBarcodeScan = (barcode: string) => {
    const match = products.find(
      (p) =>
        p.sku?.toLowerCase() === barcode.toLowerCase() ||
        p.name.toLowerCase().includes(barcode.toLowerCase())
    )
    if (match) {
      addToCart(match)
      setFeedback({ type: "success", text: `Added "${match.name}" to cart via barcode.` })
      setTimeout(() => setFeedback(null), 2000)
    } else {
      setFeedback({ type: "error", text: `No product found matching code: "${barcode}"` })
      setTimeout(() => setFeedback(null), 3000)
    }
  }

  // Update quantity
  const updateQuantity = (productId: number | string, delta: number) => {
    const targetProduct = products.find((p) => String(p.id) === String(productId))
    setCart((prev) =>
      prev
        .map((item) => {
          if (String(item.productId) === String(productId)) {
            const nextQty = item.quantity + delta
            if (nextQty <= 0) return null
            if (targetProduct && nextQty > targetProduct.currentStock) {
              setFeedback({
                type: "error",
                text: `Stock limit reached (${targetProduct.currentStock} pcs).`,
              })
              setTimeout(() => setFeedback(null), 2500)
              return item
            }
            return { ...item, quantity: nextQty, lineTotal: nextQty * item.price }
          }
          return item
        })
        .filter(Boolean) as PosLineItem[]
    )
  }

  // Remove item
  const removeItem = (productId: number | string) => {
    setCart((prev) => prev.filter((item) => String(item.productId) !== String(productId)))
  }

  const clearCart = () => setCart([])

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.lineTotal, 0)
  const grandTotal = Math.max(0, subtotal - discountAmount)
  const paidAmount = parseFloat(paidInput) || grandTotal
  const changeAmount = Math.max(0, paidAmount - grandTotal)

  // Submit Sale
  const handleCheckout = () => {
    if (cart.length === 0) {
      setFeedback({ type: "error", text: "Cart is empty. Please add products to checkout." })
      return
    }

    startTransition(async () => {
      const customerName = selectedCustomer ? selectedCustomer.name : walkInName || "Walk-in Customer"
      const customerPhone = selectedCustomer ? selectedCustomer.phone : walkInPhone || "N/A"
      const customerEmail = selectedCustomer ? selectedCustomer.email : undefined

      const res = await createPosSaleAction({
        cashierName: `${sellerInfo.shopName} Counter`,
        customerId: selectedCustomer?.id,
        customerName,
        customerPhone,
        customerEmail,
        sellerId: String(sellerInfo.shopId),
        subtotal,
        tax: 0,
        discount: discountAmount,
        total: grandTotal,
        paymentMethod,
        paidAmount,
        changeAmount,
        items: cart,
      })

      if (res && res.orderCode) {
        setLastOrderCode(res.orderCode)
        setFeedback({
          type: "success",
          text: `POS Order created successfully in database! Invoice #${res.orderCode}`,
        })
        setCart([])
        setPaidInput("")
        setDiscountAmount(0)
      } else {
        setFeedback({ type: "error", text: "Failed to record transaction. Please try again." })
      }
    })
  }

  return (
    <div className="space-y-4">
      {/* Top Header Bar */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
        <div>
          <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Store className="w-5 h-5 text-[#d43533]" />
            Vendor POS Register
          </h1>
          <p className="text-xs text-gray-500">
            {sellerInfo.shopName} &bull; Walk-in retail counter & immediate receipt generator
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/seller/pos-orders"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
          >
            <FileText className="w-3.5 h-3.5 text-gray-500" />
            POS Orders
          </Link>
          <Link
            href="/seller/pos-configuration"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
          >
            <Settings className="w-3.5 h-3.5 text-gray-500" />
            POS Configuration
          </Link>
        </div>
      </div>

      {/* Real-time Alerts */}
      {feedback && (
        <div
          className={`flex items-center justify-between p-3 text-xs rounded-lg border transition-all ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
            )}
            <span className="font-medium">{feedback.text}</span>
          </div>

          {lastOrderCode && (
            <Link
              href={`/pos/receipt/${lastOrderCode}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 bg-emerald-600 text-white px-3 py-1 rounded-md text-xs font-bold shadow-xs hover:bg-emerald-700 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Receipt
            </Link>
          )}
        </div>
      )}

      {/* POS 2-Column Split */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 items-start">
        {/* Left Column: Product Catalog (7 cols) */}
        <div className="lg:col-span-7">
          <PosProductCatalog
            products={products}
            categories={categories}
            onAddToCart={addToCart}
            onBarcodeScan={handleBarcodeScan}
          />
        </div>

        {/* Right Column: Interactive Cart & Tender (5 cols) */}
        <div className="lg:col-span-5">
          <PosCartPanel
            cart={cart}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeItem}
            onClearCart={clearCart}
            customerSelectorNode={
              <PosCustomerSelector
                customers={customers}
                selectedCustomer={selectedCustomer}
                onSelectCustomer={setSelectedCustomer}
                walkInName={walkInName}
                setWalkInName={setWalkInName}
                walkInPhone={walkInPhone}
                setWalkInPhone={setWalkInPhone}
              />
            }
            discountAmount={discountAmount}
            setDiscountAmount={setDiscountAmount}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            paidInput={paidInput}
            setPaidInput={setPaidInput}
            subtotal={subtotal}
            grandTotal={grandTotal}
            paidAmount={paidAmount}
            changeAmount={changeAmount}
            isPending={isPending}
            onCheckout={handleCheckout}
          />
        </div>
      </div>
    </div>
  )
}
