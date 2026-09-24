"use client"

import React, { useState, useTransition } from "react"
import Link from "next/link"
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
  Store,
} from "lucide-react"
import { createPosSaleAction } from "@/app/actions/ecommerce-actions"
import type { SeedProduct, SeedCategory } from "@/db/seed/data"
import type { PosLineItem } from "@/db/schema"

interface SellerPosViewProps {
  products: SeedProduct[]
  categories: SeedCategory[]
}

export function SellerPosView({ products, categories }: SellerPosViewProps) {
  const [selectedCategory, setSelectedCategory] = useState("")
  const [search, setSearch] = useState("")
  const [barcodeInput, setBarcodeInput] = useState("")

  // Cart State
  const [cart, setCart] = useState<PosLineItem[]>([])
  const [customerName, setCustomerName] = useState("Walk-in Customer")
  const [customerPhone, setCustomerPhone] = useState("")
  const [discountAmount, setDiscountAmount] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState<"Cash" | "Card" | "bKash">("Cash")
  const [paidInput, setPaidInput] = useState("")

  const [lastOrderCode, setLastOrderCode] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  const filteredProducts = products.filter((p) => {
    const matchCat = !selectedCategory || p.categorySlug === selectedCategory
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(search.toLowerCase()))
    return matchCat && matchSearch
  })

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

  const subtotal = cart.reduce((sum, item) => sum + item.lineTotal, 0)
  const grandTotal = Math.max(0, subtotal - discountAmount)
  const paidAmount = parseFloat(paidInput) || grandTotal
  const changeAmount = Math.max(0, paidAmount - grandTotal)

  const handleCheckout = () => {
    if (cart.length === 0) {
      setFeedback({ type: "error", text: "Cart is empty." })
      return
    }

    startTransition(async () => {
      const res = await createPosSaleAction({
        cashierName: "Store Cashier",
        customerName,
        customerPhone: customerPhone || "N/A",
        sellerId: "active-fashion-outlet",
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
          text: `Vendor sale completed! Order: ${res.orderCode}`,
        })
        setCart([])
        setPaidInput("")
      } else {
        setFeedback({ type: "error", text: "Failed to record transaction" })
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
          <p className="text-xs text-gray-500">In-store walk-in checkout terminal for your physical outlet</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/seller/pos-orders"
            className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
          >
            My POS Orders
          </Link>
          <Link
            href="/seller/pos-configuration"
            className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
          >
            Terminal Settings
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

      {/* POS 2 Columns */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 items-start">
        {/* Left Column: 7 cols */}
        <div className="lg:col-span-7 space-y-4">
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

            <div className="flex items-center gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs text-gray-700"
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
                  placeholder="Filter shop products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-gray-200"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 max-h-[550px] overflow-y-auto pr-1">
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                onClick={() => addToCart(p)}
                className="cursor-pointer rounded-xl border border-gray-200 bg-white p-2.5 shadow-2xs hover:border-[#d43533] transition flex flex-col justify-between"
              >
                <div className="h-24 w-full rounded-lg bg-gray-100 overflow-hidden mb-2">
                  <img src={p.thumbnail} alt={p.name} className="h-full w-full object-cover" />
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

        {/* Right Column: 5 cols */}
        <div className="lg:col-span-5 rounded-xl border border-gray-200 bg-white shadow-xs p-4 space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <User className="w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Customer Name"
              className="flex-1 rounded-lg border border-gray-200 px-2 py-1 text-xs"
            />
            <input
              type="text"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="Phone"
              className="w-28 rounded-lg border border-gray-200 px-2 py-1 text-xs"
            />
          </div>

          {/* Cart Table */}
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1 divide-y divide-gray-100">
            {cart.length === 0 ? (
              <div className="py-8 text-center text-xs text-gray-400">Cart is empty.</div>
            ) : (
              cart.map((item) => (
                <div key={item.productId} className="pt-2 flex items-center justify-between text-xs">
                  <div className="flex-1 truncate mr-2">
                    <div className="font-semibold truncate">{item.productName}</div>
                    <div className="text-[10px] text-gray-400">৳{item.price} each</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.productId, -1)}
                      className="h-5 w-5 rounded bg-gray-100 flex items-center justify-center"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-5 text-center font-bold">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.productId, 1)}
                      className="h-5 w-5 rounded bg-gray-100 flex items-center justify-center"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="font-bold w-14 text-right">৳{item.lineTotal}</div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.productId)}
                    className="text-gray-300 hover:text-red-500 ml-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Pricing */}
          <div className="border-t border-gray-100 pt-2 space-y-1 text-xs">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-semibold">৳{subtotal}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Discount:</span>
              <input
                type="number"
                min="0"
                value={discountAmount || ""}
                onChange={(e) => setDiscountAmount(parseFloat(e.target.value) || 0)}
                placeholder="0"
                className="w-16 rounded border border-gray-200 px-1 py-0.5 text-right font-mono"
              />
            </div>
            <div className="flex justify-between font-bold text-sm pt-1 border-t border-gray-200">
              <span>Payable:</span>
              <span className="text-[#d43533]">৳{grandTotal}</span>
            </div>
          </div>

          {/* Payment */}
          <div className="grid grid-cols-3 gap-2">
            {(["Cash", "Card", "bKash"] as const).map((method) => (
              <button
                key={method}
                type="button"
                onClick={() => setPaymentMethod(method)}
                className={`py-1.5 rounded-lg text-xs font-bold border transition ${
                  paymentMethod === method
                    ? "border-[#d43533] bg-red-50 text-[#d43533]"
                    : "border-gray-200 text-gray-700"
                }`}
              >
                {method}
              </button>
            ))}
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleCheckout}
              disabled={isPending || cart.length === 0}
              className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#d43533] py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#b02a28] transition disabled:opacity-50"
            >
              <Printer className="w-4 h-4" />
              {isPending ? "Processing..." : `Complete & Print (৳${grandTotal})`}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
