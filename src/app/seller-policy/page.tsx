import React from "react"
import { Metadata } from "next"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Seller Policy | Active eCommerce",
  description: "Merchant guidelines, commission terms, product compliance, and payout policy for sellers.",
}

export default function SellerPolicyPage() {
  return (
    <div className="bg-[#f2f3f8] min-h-screen py-6">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Breadcrumb Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 pb-2">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Seller Policy</h1>
          <nav className="flex items-center space-x-2 text-xs md:text-sm text-gray-500 mt-2 md:mt-0">
            <Link href="/" className="hover:text-[#d43533] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold text-gray-800">&quot;Seller Policy&quot;</span>
          </nav>
        </div>

        {/* Policy Body */}
        <div className="bg-white border border-gray-200 shadow-sm p-6 md:p-10 space-y-6 text-sm text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">1. Seller Registration & Verification</h2>
            <p>
              To become an authorized vendor on Active eCommerce CMS, merchants must complete the seller application form,
              submitting official trade licenses, national identity credentials, and tax identification numbers (TIN/BIN).
              Accounts undergo administrative review within <strong>24 to 48 business hours</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">2. Commission Structure & Payout Schedules</h2>
            <p>
              Vendors may operate under either standard category-level commissions or subscribed seller package tiers.
              Withdrawal requests are processed weekly or monthly via authorized bank accounts or digital merchant wallets,
              provided the seller account maintains the minimum payout threshold.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">3. Product Listing Standards & Prohibited Items</h2>
            <p>
              All products must feature authentic high-resolution images, honest descriptions, accurate inventory counts,
              and correct retail pricing. Counterfeit items, hazardous substances, prescription medications, and unauthorized
              intellectual property infringements result in immediate store suspension and legal compliance action.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">4. Order Fulfillment & Shipping SLA</h2>
            <p>
              Sellers are obligated to pack and mark confirmed orders as ready for pickup within <strong>24 hours</strong>.
              Failure to dispatch orders within the agreed Service Level Agreement (SLA) negatively impacts the store rating
              and may incur automated platform cancellation penalties.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">5. Returns, Customer Inquiries & Disputes</h2>
            <p>
              Vendors must respond to customer queries and product questions in good faith. If a customer initiates an approved
              return due to defective merchandise or wrong item delivery, the merchant will be debited the return logistics cost
              and product refund amount.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
