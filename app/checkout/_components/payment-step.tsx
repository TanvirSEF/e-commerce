"use client"

import React from "react"
import Image from "next/image"
import NextLink from "next/link"
import { ArrowLeft, Loader2 } from "lucide-react"

interface PaymentStepProps {
  paymentOption: string
  setPaymentOption: (val: string) => void
  additionalNotes: string
  setAdditionalNotes: (val: string) => void
  agreed: boolean
  setAgreed: (val: boolean) => void
  isSubmitting: boolean
  onSubmitOrder: () => void
}

const PAYMENT_METHODS = [
  { id: "cash_on_delivery", label: "Cash on Delivery", image: "/assets/img/cards/cod.png" },
  { id: "bkash", label: "bKash", image: "/assets/img/cards/bkash.png" },
  { id: "nagad", label: "Nagad", image: "/assets/img/cards/nagad.png" },
  { id: "uddoktapay", label: "UddoktaPay", image: "/assets/img/cards/uddoktapay.png" },
  { id: "sslcommerz", label: "SSLCommerz", image: "/assets/img/cards/sslcommerz.png" },
  { id: "stripe", label: "Cards (Stripe)", image: "/assets/img/cards/stripe.png" },
]

export function PaymentStep({
  paymentOption,
  setPaymentOption,
  additionalNotes,
  setAdditionalNotes,
  agreed,
  setAgreed,
  isSubmitting,
  onSubmitOrder,
}: PaymentStepProps) {
  return (
    <div className="space-y-6">
      {/* Additional Notes */}
      <div>
        <h4 className="text-sm font-bold text-gray-800 mb-1.5">Any additional info?</h4>
        <textarea
          rows={3}
          value={additionalNotes}
          onChange={(e) => setAdditionalNotes(e.target.value)}
          placeholder="Special notes for delivery (e.g. deliver after 5pm, call before delivery)..."
          className="w-full rounded border border-gray-300 p-3 text-xs text-gray-800 focus:border-[#d43533] focus:outline-none"
        />
      </div>

      {/* Payment Options Grid */}
      <div>
        <h4 className="text-sm font-bold text-gray-800 mb-3">Select a payment option</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {PAYMENT_METHODS.map((pm) => {
            const isSelected = paymentOption === pm.id
            return (
              <label
                key={pm.id}
                onClick={() => setPaymentOption(pm.id)}
                className={`flex items-center justify-between p-3.5 rounded border cursor-pointer transition-all ${
                  isSelected
                    ? "border-[#d43533] bg-red-50/20 shadow-sm"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="radio"
                    name="payment_method"
                    checked={isSelected}
                    onChange={() => setPaymentOption(pm.id)}
                    className="h-4 w-4 text-[#d43533] focus:ring-[#d43533]"
                  />
                  <span className="text-xs font-semibold text-gray-800">{pm.label}</span>
                </div>
                <div className="relative h-8 w-14 overflow-hidden rounded bg-gray-50 flex items-center justify-center">
                  <Image
                    src={pm.image}
                    alt={pm.label}
                    width={56}
                    height={32}
                    className="object-contain max-h-8"
                    onError={(e) => {
                      e.currentTarget.style.display = "none"
                    }}
                  />
                </div>
              </label>
            )
          })}
        </div>
      </div>

      {/* Terms and conditions agreement */}
      <div className="border-t border-gray-100 pt-4">
        <label className="flex items-start gap-2.5 text-xs text-gray-600 cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#d43533] focus:ring-[#d43533] cursor-pointer"
          />
          <span>
            I agree to the{" "}
            <NextLink href="/terms" className="font-bold text-gray-900 underline hover:text-[#d43533]">
              terms and conditions
            </NextLink>
            ,{" "}
            <NextLink href="/return-policy" className="font-bold text-gray-900 underline hover:text-[#d43533]">
              return policy
            </NextLink>{" "}
            &{" "}
            <NextLink href="/privacy-policy" className="font-bold text-gray-900 underline hover:text-[#d43533]">
              privacy policy
            </NextLink>
          </span>
        </label>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <NextLink
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-[#d43533] transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Return to shop
        </NextLink>

        <button
          type="button"
          onClick={onSubmitOrder}
          disabled={!agreed || isSubmitting}
          className="inline-flex items-center justify-center gap-2 rounded bg-[#d43533] px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-[#9d1b1a] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Complete Order"
          )}
        </button>
      </div>
    </div>
  )
}
