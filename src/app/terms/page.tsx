import React from "react"
import { Metadata } from "next"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Terms & Conditions | Active eCommerce",
  description: "Terms and conditions of use for Active eCommerce CMS",
}

export default function TermsPage() {
  return (
    <div className="bg-[#f2f3f8] min-h-screen py-6">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Breadcrumb */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 pb-2">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Terms & Conditions</h1>
          <nav className="flex items-center space-x-2 text-xs md:text-sm text-gray-500 mt-2 md:mt-0">
            <Link href="/" className="hover:text-[#d43533] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold text-gray-800">&quot;Terms &amp; conditions&quot;</span>
          </nav>
        </div>

        {/* Policy Content Card */}
        <div className="bg-white border border-gray-200 shadow-sm p-6 md:p-10 space-y-6 text-sm text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">1. Agreement to Terms</h2>
            <p>
              By accessing or using the Active eCommerce platform, you agree to be bound by these Terms and Conditions
              and our Privacy Policy. If you do not agree with any part of these terms, you must not use our website.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">2. User Accounts & Security</h2>
            <p>
              When creating an account on our marketplace, you are responsible for maintaining the confidentiality of
              your login credentials and for all activities that occur under your account. You agree to notify us
              immediately of any unauthorized access or security breach.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">3. Product Information & Pricing</h2>
            <p>
              Prices, discounts, and availability of products are subject to change without prior notice. While we strive
              for 100% accuracy, errors in product descriptions or pricing may occur. Active eCommerce reserves the right
              to correct any inaccuracies or cancel affected orders.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">4. Orders, Payments & Delivery</h2>
            <p>
              Orders placed are subject to acceptance and verification. Available payment methods include Cash on Delivery,
              Mobile Banking (bKash/Nagad), and Debit/Credit Cards. Delivery timelines vary based on shipping destination
              and courier logistics.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">5. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by applicable law, Active eCommerce and its affiliates shall not be liable
              for any indirect, incidental, special, or consequential damages resulting from the use of our services.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
