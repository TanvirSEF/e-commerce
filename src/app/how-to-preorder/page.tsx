import React from "react"
import { Metadata } from "next"
import Link from "next/link"
import { ChevronRight, HelpCircle, Package, CreditCard, Clock, RotateCcw } from "lucide-react"

export const metadata: Metadata = {
  title: "How to Preorder | Active eCommerce",
  description: "Learn how pre-ordering works, booking deposits, delivery timelines, and order management.",
}

const FAQS = [
  {
    id: 1,
    question: "What is Pre-order?",
    answer:
      "Pre-order allows you to reserve upcoming, exclusive, or high-demand products before they officially launch or reach physical warehouse inventory. By pre-ordering, you secure priority allocation and guaranteed delivery.",
    icon: Package,
  },
  {
    id: 2,
    question: "How do prepayment and final payments work?",
    answer:
      "When placing a preorder, you pay a designated prepayment deposit (typically 20% to 50%) or full price upfront via any supported payment method (bKash, Nagad, Stripe, Card, or Wallet). The remaining balance is collected upon product readiness.",
    icon: CreditCard,
  },
  {
    id: 3,
    question: "When will my preordered items be dispatched?",
    answer:
      "Every preorder product page specifies an estimated arrival or release date. Once goods arrive at our fulfilment center, they are immediately quality-checked and dispatched to your shipping address with live SMS/email tracking.",
    icon: Clock,
  },
  {
    id: 4,
    question: "Can I cancel or refund my preorder?",
    answer:
      "Yes, cancellations are permitted according to seller and storefront preorder policies before the product is dispatched. Once cancelled, your advance payment is refunded to your customer wallet or original payment source.",
    icon: RotateCcw,
  },
]

export default function HowToPreorderPage() {
  return (
    <div className="min-h-screen bg-gray-50/60 py-8">
      <div className="mx-auto max-w-4xl px-4">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-xs text-gray-500">
          <Link href="/" className="hover:text-[#d43533]">
            Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/preorder" className="hover:text-[#d43533]">
            Preorder Launches
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="font-semibold text-gray-800">How to Preorder</span>
        </nav>

        {/* Active eCommerce Signature Header Banner */}
        <div className="rounded-xl bg-[#7A7A99] p-6 text-white shadow-sm md:p-8">
          <div className="flex items-center gap-3">
            <HelpCircle className="h-7 w-7 text-white/80" />
            <h1 className="text-xl font-bold tracking-wide uppercase md:text-2xl">
              How to Preorder ?
            </h1>
          </div>
          <p className="mt-2 text-xs text-white/80 md:text-sm">
            Everything you need to know about placing, paying, and tracking advance product reservations.
          </p>
        </div>

        {/* Step-by-Step Flow Cards */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          <div className="rounded-xl border border-gray-100 bg-white p-5 text-center shadow-xs">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-[#d43533] font-bold text-sm">
              1
            </div>
            <h3 className="mt-3 text-xs font-bold text-gray-900">Select Item</h3>
            <p className="mt-1 text-[11px] text-gray-500">Browse launch catalog and review specs</p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-white p-5 text-center shadow-xs">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-[#d43533] font-bold text-sm">
              2
            </div>
            <h3 className="mt-3 text-xs font-bold text-gray-900">Pay Deposit</h3>
            <p className="mt-1 text-[11px] text-gray-500">Pay required booking fee to lock preorder</p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-white p-5 text-center shadow-xs">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-[#d43533] font-bold text-sm">
              3
            </div>
            <h3 className="mt-3 text-xs font-bold text-gray-900">Receive Updates</h3>
            <p className="mt-1 text-[11px] text-gray-500">Track production & arrival notifications</p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-white p-5 text-center shadow-xs">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-[#d43533] font-bold text-sm">
              4
            </div>
            <h3 className="mt-3 text-xs font-bold text-gray-900">Express Delivery</h3>
            <p className="mt-1 text-[11px] text-gray-500">Delivered directly to your doorstep</p>
          </div>
        </div>

        {/* Accordion FAQ Section */}
        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-xs">
          <h2 className="text-base font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <div className="divide-y divide-gray-100">
            {FAQS.map((faq) => {
              const Icon = faq.icon
              return (
                <div key={faq.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">{faq.question}</h3>
                      <p className="mt-1.5 text-xs text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-6 sm:flex-row shadow-xs">
          <div>
            <h4 className="text-sm font-bold text-gray-900">Ready to explore upcoming releases?</h4>
            <p className="text-xs text-gray-500">Discover exclusive preorders with guaranteed reservation.</p>
          </div>
          <Link
            href="/preorder"
            className="inline-flex items-center gap-2 rounded-lg bg-[#d43533] px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[#b82d2b]"
          >
            <span>Explore Preorder Products</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
