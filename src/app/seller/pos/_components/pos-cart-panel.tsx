"use client"

import React from "react"
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Printer,
  CreditCard,
  Banknote,
  Smartphone,
  Coins,
} from "lucide-react"
import type { PosLineItem } from "@/db/schema"

interface PosCartPanelProps {
  cart: PosLineItem[]
  onUpdateQuantity: (productId: number | string, delta: number) => void
  onRemoveItem: (productId: number | string) => void
  onClearCart: () => void
  customerSelectorNode: React.ReactNode
  discountAmount: number
  setDiscountAmount: (val: number) => void
  paymentMethod: "Cash" | "Card" | "bKash" | "Offline"
  setPaymentMethod: (method: "Cash" | "Card" | "bKash" | "Offline") => void
  paidInput: string
  setPaidInput: (val: string) => void
  subtotal: number
  grandTotal: number
  paidAmount: number
  changeAmount: number
  isPending: boolean
  onCheckout: () => void
}

export function PosCartPanel({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  customerSelectorNode,
  discountAmount,
  setDiscountAmount,
  paymentMethod,
  setPaymentMethod,
  paidInput,
  setPaidInput,
  subtotal,
  grandTotal,
  paidAmount,
  changeAmount,
  isPending,
  onCheckout,
}: PosCartPanelProps) {
  const paymentIcons = {
    Cash: <Banknote className="w-3.5 h-3.5" />,
    Card: <CreditCard className="w-3.5 h-3.5" />,
    bKash: <Smartphone className="w-3.5 h-3.5" />,
    Offline: <Coins className="w-3.5 h-3.5" />,
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-xs p-4 space-y-4">
      {/* Customer Selector Top Area */}
      {customerSelectorNode}

      {/* Cart Items Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800">
          <ShoppingBag className="w-4 h-4 text-[#d43533]" />
          Order Items ({cart.length})
        </div>
        {cart.length > 0 && (
          <button
            type="button"
            onClick={onClearCart}
            className="text-[11px] font-semibold text-gray-400 hover:text-red-500 transition"
          >
            Clear Cart
          </button>
        )}
      </div>

      {/* Cart Table list */}
      <div className="space-y-2 max-h-56 overflow-y-auto pr-1 divide-y divide-gray-100 text-xs">
        {cart.length === 0 ? (
          <div className="py-8 text-center text-xs text-gray-400">
            No items in cart. Click a product on the left to add.
          </div>
        ) : (
          cart.map((item) => (
            <div key={item.productId} className="pt-2 flex items-center justify-between">
              <div className="flex-1 truncate mr-2">
                <div className="font-semibold text-gray-900 truncate">{item.productName}</div>
                <div className="text-[10px] text-gray-400">
                  ৳{item.price.toLocaleString("en-BD")} each
                </div>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onUpdateQuantity(item.productId, -1)}
                  className="h-5 w-5 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center justify-center transition"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-6 text-center font-bold font-mono">{item.quantity}</span>
                <button
                  type="button"
                  onClick={() => onUpdateQuantity(item.productId, 1)}
                  className="h-5 w-5 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center justify-center transition"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              {/* Line Total */}
              <div className="font-bold w-16 text-right font-mono text-gray-900">
                ৳{item.lineTotal.toLocaleString("en-BD")}
              </div>

              {/* Delete Button */}
              <button
                type="button"
                onClick={() => onRemoveItem(item.productId)}
                className="text-gray-300 hover:text-red-500 ml-2 transition"
                aria-label="Remove item"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Pricing Summary */}
      <div className="border-t border-gray-100 pt-3 space-y-1.5 text-xs">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal:</span>
          <span className="font-semibold font-mono text-gray-900">
            ৳{subtotal.toLocaleString("en-BD")}
          </span>
        </div>

        <div className="flex justify-between items-center text-gray-600">
          <span>Discount (৳):</span>
          <input
            type="number"
            min="0"
            value={discountAmount || ""}
            onChange={(e) => setDiscountAmount(Math.max(0, parseFloat(e.target.value) || 0))}
            placeholder="0"
            className="w-20 rounded border border-gray-200 px-2 py-0.5 text-right font-mono text-xs focus:border-[#d43533] focus:outline-hidden"
          />
        </div>

        <div className="flex justify-between items-center font-bold text-sm pt-2 border-t border-gray-200">
          <span className="text-gray-900">Grand Total:</span>
          <span className="text-[#d43533] font-mono text-base">
            ৳{grandTotal.toLocaleString("en-BD")}
          </span>
        </div>
      </div>

      {/* Payment Options */}
      <div className="space-y-2 pt-1 border-t border-gray-100">
        <span className="text-[11px] font-bold text-gray-700 block">Payment Method</span>
        <div className="grid grid-cols-4 gap-1.5">
          {(["Cash", "Card", "bKash", "Offline"] as const).map((method) => (
            <button
              key={method}
              type="button"
              onClick={() => setPaymentMethod(method)}
              className={`py-2 px-1 rounded-lg text-xs font-bold border flex flex-col items-center gap-1 transition ${
                paymentMethod === method
                  ? "border-[#d43533] bg-red-50 text-[#d43533]"
                  : "border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {paymentIcons[method]}
              <span className="text-[10px]">{method}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tender & Change calculation if Cash */}
      {paymentMethod === "Cash" && (
        <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-gray-50 border border-gray-200 text-xs">
          <div>
            <label className="text-[10px] font-semibold text-gray-500 block mb-0.5">
              Paid Amount (৳)
            </label>
            <input
              type="number"
              min="0"
              placeholder={String(grandTotal)}
              value={paidInput}
              onChange={(e) => setPaidInput(e.target.value)}
              className="w-full rounded border border-gray-200 px-2 py-1 font-mono text-xs focus:outline-hidden focus:border-[#d43533]"
            />
          </div>
          <div>
            <span className="text-[10px] font-semibold text-gray-500 block mb-0.5">
              Change Return
            </span>
            <div className="py-1 font-bold font-mono text-emerald-700 text-xs">
              ৳{changeAmount.toLocaleString("en-BD")}
            </div>
          </div>
        </div>
      )}

      {/* Checkout Submit Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onCheckout}
          disabled={isPending || cart.length === 0}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#d43533] py-3 text-xs font-bold text-white shadow-md hover:bg-[#b02a28] transition disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        >
          <Printer className="w-4 h-4" />
          {isPending
            ? "Recording Transaction..."
            : `Complete & Print (৳${grandTotal.toLocaleString("en-BD")})`}
        </button>
      </div>
    </div>
  )
}
