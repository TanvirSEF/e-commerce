"use client"

import React, { useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Barcode,
  Search,
  Plus,
  Minus,
  Trash2,
  Printer,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Banknote,
  Smartphone,
  User,
  ShoppingBag,
  RotateCcw,
} from "lucide-react"
import { createPosSaleAction } from "@/app/actions/ecommerce-actions"
import type { SeedProduct, SeedCategory } from "@/db/seed/data"
import type { PosLineItem } from "@/db/schema"

interface AdminPosViewProps {
  products: SeedProduct[]
  categories: SeedCategory[]
}

export function AdminPosView({ products, categories }: AdminPosViewProps) {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState("")
  const [search, setSearch] = useState("")
  const [barcodeInput, setBarcodeInput] = useState("")

  // Cart State
  const [cart, setCart] = useState<PosLineItem[]>([])
  const [customerName, setCustomerName] = useState("Walk-in Customer")
  const [customerPhone, setCustomerPhone] = useState("")
  const [discountAmount, setDiscountAmount] = useState(0)
  const [taxPercent, setTaxPercent] = useState(5)
  const [paymentMethod, setPaymentMethod] = useState<"Cash" | "Card" | "bKash">("Cash")
  const [paidInput, setPaidInput] = useState("")

  const [lastOrderCode, setLastOrderCode] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchCat = !selectedCategory || p.categorySlug === selectedCategory
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(search.toLowerCase()))
    return matchCat && matchSearch
  })

  // Add product to POS cart
  const addToCart = (product: SeedProduct) => {
    setCart((prev) => {
      const existing = prev.find((item) => String(item.productId) === String(product.id))
      if (existing) {
        return prev.map((item) =>
          String(item.productId) === String(product.id)
            ? { ...item, quantity: item.quantity + 1, lineTotal: (item.quantity + 1) * item.price }
            : item
        )
      }
      return [
        ...prev,
        {
          productId: product.id,
          productName: product.name,
          thumbnail: product.thumbnail,
          price: product.price,
          quantity: 1,
          lineTotal: product.price,
        },
      ]
    })
  }

  // Barcode enter action
  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!barcodeInput) return
    const match = products.find(
      (p) =>
        p.sku?.toLowerCase() === barcodeInput.toLowerCase() ||
        p.name.toLowerCase().includes(barcodeInput.toLowerCase())
    )
    if (match) {
      addToCart(match)
      setBarcodeInput("")
    } else {
      setFeedback({ type: "error", text: `No product found matching code: "${barcodeInput}"` })
      setTimeout(() => setFeedback(null), 2500)
    }
  }

  // Update item quantity
  const updateQuantity = (productId: number | string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (String(item.productId) === String(productId)) {
            const nextQty = item.quantity + delta
            if (nextQty <= 0) return null
            return { ...item, quantity: nextQty, lineTotal: nextQty * item.price }
          }
          return item
        })
        .filter(Boolean) as PosLineItem[]
    )
  }

  const removeItem = (productId: number | string) => {
    setCart((prev) => prev.filter((item) => String(item.productId) !== String(productId)))
  }

  const clearCart = () => {
    setCart([])
    setDiscountAmount(0)
    setPaidInput("")
    setLastOrderCode(null)
  }

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.lineTotal, 0)
  const taxAmount = (subtotal * taxPercent) / 100
  const grandTotal = Math.max(0, subtotal + taxAmount - discountAmount)
  const paidAmount = parseFloat(paidInput) || grandTotal
  const changeAmount = Math.max(0, paidAmount - grandTotal)

  const handleCheckout = () => {
    if (cart.length === 0) {
      setFeedback({ type: "error", text: "Cart is empty. Add products to bill." })
      return
    }

    startTransition(async () => {
      const res = await createPosSaleAction({
        cashierName: "Admin Cashier",
        customerName,
        customerPhone: customerPhone || "N/A",
        subtotal,
        tax: taxAmount,
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
          text: `Sale completed! Order: ${res.orderCode}`,
        })
        setCart([])
        setPaidInput("")
      } else {
        setFeedback({ type: "error", text: "Failed to record POS transaction" })
      }
    })
  }

  return (
    <div className="space-y-4">
      {/* Top Header Bar */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
        <div>
          <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#d43533]" />
            POS Terminal (Point of Sale)
          </h1>
          <p className="text-xs text-gray-500">Fast in-store checkout and cash register</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/pos-orders"
            className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
          >
            POS Orders
          </Link>
          <Link
            href="/admin/pos-activation"
            className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
          >
            Settings
          </Link>
        </div>
      </div>

      {feedback && (
        <div
          className={`flex items-center justify-between p-3 text-xs rounded-lg border ${
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
            <span>{feedback.text}</span>
          </div>
          {lastOrderCode && (
            <Link
              href={`/pos/receipt/${lastOrderCode}`}
              target="_blank"
              className="inline-flex items-center gap-1 bg-emerald-600 text-white px-3 py-1 rounded text-xs font-bold shadow-xs hover:bg-emerald-700"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Receipt
            </Link>
          )}
        </div>
      )}

      {/* POS Main Workspace: 2 Columns */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 items-start">
        {/* Left Column: 7 cols - Product Catalog & Barcode */}
        <div className="lg:col-span-7 space-y-4">
          {/* Barcode & Search Controls */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-xs space-y-3">
            <form onSubmit={handleBarcodeSubmit} className="relative">
              <Barcode className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Scan Barcode / Type SKU and press Enter..."
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                className="w-full pl-9 pr-24 py-2 text-xs rounded-lg border border-gray-200 focus:border-[#d43533] focus:outline-hidden font-mono"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 bg-gray-900 text-white text-xs font-semibold rounded-md hover:bg-black"
              >
                Scan Add
              </button>
            </form>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs text-gray-700 focus:border-[#d43533] focus:outline-hidden"
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id || c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>

              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Filter product by name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-gray-200 focus:border-[#d43533] focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 max-h-[600px] overflow-y-auto pr-1">
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                onClick={() => addToCart(p)}
                className="group relative cursor-pointer rounded-xl border border-gray-200 bg-white p-2.5 shadow-2xs hover:border-[#d43533] hover:shadow-md transition flex flex-col justify-between"
              >
                <div className="h-24 w-full rounded-lg bg-gray-100 overflow-hidden mb-2 relative">
                  {p.thumbnail ? (
                    <img src={p.thumbnail} alt={p.name} className="h-full w-full object-cover group-hover:scale-105 transition" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-[10px] text-gray-400">No Image</div>
                  )}
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-bold text-white">
                    Stock: {p.stock ?? 25}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-gray-800 line-clamp-2 leading-tight">
                    {p.name}
                  </h4>
                  <div className="mt-1 font-bold text-xs text-[#d43533]">
                    ৳{p.price.toLocaleString("en-BD")}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: 5 cols - POS Register Cart */}
        <div className="lg:col-span-5 rounded-xl border border-gray-200 bg-white shadow-xs p-4 space-y-4">
          {/* Customer Info */}
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <User className="w-4 h-4 text-gray-500" />
            <div className="flex-1 grid grid-cols-2 gap-2">
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Customer Name"
                className="rounded-lg border border-gray-200 px-2 py-1 text-xs text-gray-800 focus:border-[#d43533] focus:outline-hidden"
              />
              <input
                type="text"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Phone (optional)"
                className="rounded-lg border border-gray-200 px-2 py-1 text-xs text-gray-800 focus:border-[#d43533] focus:outline-hidden"
              />
            </div>
            {cart.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                className="p-1.5 text-gray-400 hover:text-red-600 rounded transition"
                title="Clear Cart"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Cart Items List */}
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1 divide-y divide-gray-100">
            {cart.length === 0 ? (
              <div className="py-12 text-center text-xs text-gray-400">
                Cart is empty. Select products on the left or scan a barcode.
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.productId} className="pt-2 flex items-center justify-between gap-2 text-xs">
                  <div className="flex-1 truncate">
                    <div className="font-semibold text-gray-800 truncate">{item.productName}</div>
                    <div className="text-[11px] text-gray-400">৳{item.price} each</div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.productId, -1)}
                      className="h-6 w-6 rounded bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center font-bold text-gray-900">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.productId, 1)}
                      className="h-6 w-6 rounded bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="font-bold text-gray-900 w-16 text-right">
                    ৳{item.lineTotal.toLocaleString("en-BD")}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.productId)}
                    className="text-gray-300 hover:text-red-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Pricing Totals */}
          <div className="border-t border-gray-100 pt-3 space-y-1.5 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-semibold text-gray-900">৳{subtotal.toLocaleString("en-BD")}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Tax (5%):</span>
              <span className="font-semibold text-gray-900">+৳{taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Discount (৳):</span>
              <input
                type="number"
                min="0"
                value={discountAmount || ""}
                onChange={(e) => setDiscountAmount(parseFloat(e.target.value) || 0)}
                placeholder="0"
                className="w-20 rounded border border-gray-200 px-2 py-0.5 text-right text-xs font-mono"
              />
            </div>
            <div className="flex justify-between items-baseline border-t border-gray-200 pt-2 text-sm">
              <span className="font-bold text-gray-900">Total Payable:</span>
              <span className="text-lg font-extrabold text-[#d43533]">
                ৳{grandTotal.toLocaleString("en-BD")}
              </span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
              Payment Method
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod("Cash")}
                className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold border transition ${
                  paymentMethod === "Cash"
                    ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                    : "border-gray-200 bg-white text-gray-700"
                }`}
              >
                <Banknote className="w-3.5 h-3.5" />
                Cash
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("Card")}
                className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold border transition ${
                  paymentMethod === "Card"
                    ? "border-blue-600 bg-blue-50 text-blue-800"
                    : "border-gray-200 bg-white text-gray-700"
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                Card
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("bKash")}
                className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold border transition ${
                  paymentMethod === "bKash"
                    ? "border-pink-600 bg-pink-50 text-pink-800"
                    : "border-gray-200 bg-white text-gray-700"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                bKash
              </button>
            </div>
          </div>

          {/* Paid & Change */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label className="text-[11px] text-gray-500 block mb-1">Paid Amount (৳)</label>
              <input
                type="number"
                placeholder={grandTotal.toString()}
                value={paidInput}
                onChange={(e) => setPaidInput(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-1.5 font-bold font-mono text-gray-900"
              />
            </div>
            <div>
              <label className="text-[11px] text-gray-500 block mb-1">Change Return</label>
              <div className="rounded-lg bg-gray-50 border border-gray-200 px-3 py-1.5 font-bold font-mono text-emerald-600">
                ৳{changeAmount.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Complete Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleCheckout}
              disabled={isPending || cart.length === 0}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#d43533] py-3 text-xs font-bold text-white shadow-md hover:bg-[#b02a28] transition disabled:opacity-50"
            >
              <Printer className="w-4 h-4" />
              {isPending ? "Processing..." : `Complete & Print Invoice (৳${grandTotal.toLocaleString("en-BD")})`}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
