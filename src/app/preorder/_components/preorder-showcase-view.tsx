"use client"

import React, { useState, useTransition } from "react"
import Image from "next/image"
import { Clock, CheckCircle2, ShieldCheck, AlertCircle } from "lucide-react"
import { createPreorderOrderAction } from "@/app/actions/ecommerce-actions"
import type { PreorderProduct } from "@/db/schema"

interface PreorderShowcaseViewProps {
  products: PreorderProduct[]
}

export function PreorderShowcaseView({ products }: PreorderShowcaseViewProps) {
  const [selectedProduct, setSelectedProduct] = useState<PreorderProduct | null>(null)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("bKash")
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProduct || !name.trim() || !email.trim()) return

    const total = Number(selectedProduct.price)
    const deposit = Number(selectedProduct.prepaymentAmount)
    const due = total - deposit

    startTransition(async () => {
      try {
        const res = await createPreorderOrderAction({
          productId: selectedProduct.id,
          productName: selectedProduct.name,
          customerName: name.trim(),
          customerEmail: email.trim(),
          quantity: 1,
          totalPrice: String(total),
          prepaymentPaid: String(deposit),
          remainingDue: String(due),
        })
        if (res.success) {
          setFeedback({
            type: "success",
            text: `Pre-order reserved! Your booking code is ${res.orderCode}. Confirmation sent to ${email}.`,
          })
          setSelectedProduct(null)
          setName("")
          setEmail("")
        }
      } catch (err) {
        setFeedback({ type: "error", text: "Failed to reserve pre-order" })
      }
      setTimeout(() => setFeedback(null), 6000)
    })
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-8">
      {/* Hero Header */}
      <div className="rounded-3xl bg-linear-to-r from-gray-900 via-zinc-900 to-stone-900 text-white p-8 md:p-12 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="inline-flex items-center rounded-full bg-red-500/20 border border-red-500/30 px-3 py-1 text-xs font-bold text-red-400">
            Pre-Order Showcase
          </span>
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">
            Upcoming Product Launches &amp; Pre-Orders
          </h1>
          <p className="text-xs md:text-sm text-gray-300 leading-relaxed">
            Reserve the latest flagship tech, consoles, and limited edition items before general release. Pay only a partial deposit today; balance is collected when your unit is packaged for delivery.
          </p>
        </div>
      </div>

      {feedback && (
        <div
          className={`flex items-center gap-2 p-4 text-xs rounded-xl border ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => {
          const daysLeft = Math.max(
            0,
            Math.ceil((new Date(p.releaseDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
          )
          const fillPercent = Math.min(
            100,
            Math.round((p.currentPreorders / p.preorderBatchLimit) * 100)
          )

          return (
            <div
              key={p.id}
              className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="relative h-56 w-full bg-gray-50 border-b border-gray-100">
                  <Image src={p.thumbnail} alt={p.name} fill className="object-cover" />
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1 bg-black/75 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
                      <Clock className="w-3 h-3 text-red-400" /> {daysLeft} Days to Release
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  <div>
                    <span className="text-[11px] font-mono text-gray-400 block">{p.sku}</span>
                    <h2 className="text-base font-bold text-gray-900 line-clamp-1">{p.name}</h2>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-3 space-y-2 text-xs">
                    <div className="flex justify-between items-baseline">
                      <span className="text-gray-500">Full Price:</span>
                      <span className="text-base font-extrabold text-gray-900">${p.price}</span>
                    </div>
                    <div className="flex justify-between items-baseline border-t border-gray-200/60 pt-2">
                      <span className="font-semibold text-emerald-800">Deposit Due Today:</span>
                      <span className="font-bold text-emerald-700 text-sm">${p.prepaymentAmount}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="font-semibold text-gray-700">{p.currentPreorders} Pre-ordered</span>
                      <span className="text-gray-400">{p.preorderBatchLimit} Max Batch</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#d43533] rounded-full transition-all"
                        style={{ width: `${fillPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  type="button"
                  onClick={() => setSelectedProduct(p)}
                  className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#d43533] py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#b82a28] transition-colors"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Pre-Order Now (Pay Deposit)
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Reservation Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <form
            onSubmit={handleBook}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4"
          >
            <div>
              <h3 className="text-base font-bold text-gray-900">
                Reserve: {selectedProduct.name}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Pay <strong>${selectedProduct.prepaymentAmount}</strong> deposit now. The remaining balance of ${(Number(selectedProduct.price) - Number(selectedProduct.prepaymentAmount)).toFixed(2)} is due upon arrival.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Your Full Name</label>
              <input
                type="text"
                required
                placeholder="Tanvir Hasan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-900 focus:border-[#d43533] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-900 focus:border-[#d43533] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Payment Method</label>
              <div className="grid grid-cols-3 gap-2">
                {["bKash", "Nagad", "Credit Card"].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setPaymentMethod(m)}
                    className={`py-2 text-xs font-semibold rounded-lg border text-center transition-colors ${
                      paymentMethod === m
                        ? "border-[#d43533] bg-red-50 text-[#d43533]"
                        : "border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                className="px-4 py-2 text-xs font-medium text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="rounded-lg bg-[#d43533] px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#b82a28] disabled:opacity-50"
              >
                {isPending ? "Confirming..." : "Confirm Pre-Order"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
