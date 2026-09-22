import React from "react"
import { Metadata } from "next"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Return Policy | Active eCommerce",
  description: "Product return, replacement and refund policy for Active eCommerce CMS",
}

export default function ReturnPolicyPage() {
  return (
    <div className="bg-[#f2f3f8] min-h-screen py-6">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 pb-2">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Return & Refund Policy</h1>
          <nav className="flex items-center space-x-2 text-xs md:text-sm text-gray-500 mt-2 md:mt-0">
            <Link href="/" className="hover:text-[#d43533] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold text-gray-800">&quot;Return Policy&quot;</span>
          </nav>
        </div>

        <div className="bg-white border border-gray-200 shadow-sm p-6 md:p-10 space-y-6 text-sm text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">1. Eligibility for Returns</h2>
            <p>
              Items may be returned within <strong>7 days</strong> of delivery if they are defective, damaged upon arrival,
              incorrect item received, or significantly different from the product description. The product must be unused,
              with original packaging and price tags intact.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">2. Non-Returnable Items</h2>
            <p>
              Certain categories such as perishable items, innerwear/undergarments, customized personalized goods, and
              digital downloadable products are not eligible for returns due to hygiene and software license constraints.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">3. Refund Process</h2>
            <p>
              Once your returned item is received and inspected at our quality assurance hub, refunds will be credited
              back to your original payment method or Active eCommerce customer wallet within <strong>5–7 business days</strong>.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
