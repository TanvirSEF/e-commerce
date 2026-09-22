import React from "react"
import { Metadata } from "next"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Privacy Policy | Active eCommerce",
  description: "Privacy policy and data protection guidelines on Active eCommerce CMS",
}

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#f2f3f8] min-h-screen py-6">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 pb-2">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Privacy Policy</h1>
          <nav className="flex items-center space-x-2 text-xs md:text-sm text-gray-500 mt-2 md:mt-0">
            <Link href="/" className="hover:text-[#d43533] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold text-gray-800">&quot;Privacy Policy&quot;</span>
          </nav>
        </div>

        <div className="bg-white border border-gray-200 shadow-sm p-6 md:p-10 space-y-6 text-sm text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us when creating an account, making a purchase, subscribing
              to newsletters, or contacting customer support. This includes name, email, phone number, shipping address,
              and transaction details.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">2. How We Use Your Information</h2>
            <p>
              Your data is utilized strictly to process orders, facilitate courier deliveries, improve platform features,
              send order confirmation notifications, and prevent fraudulent transactions.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">3. Data Sharing & Third Parties</h2>
            <p>
              We never sell or rent your personal data to third parties. We share limited details only with trusted service
              providers required for operational delivery, including shipping couriers and payment gateways.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">4. Cookies & Security</h2>
            <p>
              We implement industry-standard security measures including SSL encryption and session token management to
              safeguard your personal information. Cookies are used to maintain your cart and session state.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
