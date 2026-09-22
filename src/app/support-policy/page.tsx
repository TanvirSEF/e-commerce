import React from "react"
import { Metadata } from "next"
import Link from "next/link"
import { ChevronRight, Phone, Mail, Clock } from "lucide-react"

export const metadata: Metadata = {
  title: "Support Policy | Active eCommerce",
  description: "Customer service and technical support policy on Active eCommerce CMS",
}

export default function SupportPolicyPage() {
  return (
    <div className="bg-[#f2f3f8] min-h-screen py-6">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 pb-2">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Support Policy</h1>
          <nav className="flex items-center space-x-2 text-xs md:text-sm text-gray-500 mt-2 md:mt-0">
            <Link href="/" className="hover:text-[#d43533] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold text-gray-800">&quot;Support Policy&quot;</span>
          </nav>
        </div>

        <div className="bg-white border border-gray-200 shadow-sm p-6 md:p-10 space-y-6 text-sm text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">1. Dedicated Support Channels</h2>
            <p className="mb-4">
              Our customer success team is available round-the-clock to assist you with order inquiries, product details,
              returns, and warranty claims.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border p-4 rounded text-center bg-gray-50">
                <Phone className="w-5 h-5 mx-auto text-[#d43533] mb-2" />
                <span className="font-bold text-xs text-gray-900 block">Helpline</span>
                <span className="text-xs text-gray-600">+880 1700-000000</span>
              </div>
              <div className="border p-4 rounded text-center bg-gray-50">
                <Mail className="w-5 h-5 mx-auto text-[#d43533] mb-2" />
                <span className="font-bold text-xs text-gray-900 block">Email Support</span>
                <span className="text-xs text-gray-600">support@huipper.com</span>
              </div>
              <div className="border p-4 rounded text-center bg-gray-50">
                <Clock className="w-5 h-5 mx-auto text-[#d43533] mb-2" />
                <span className="font-bold text-xs text-gray-900 block">Working Hours</span>
                <span className="text-xs text-gray-600">Sat – Thu, 9 AM – 10 PM</span>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">2. Response Time Commitment</h2>
            <p>
              We strive to respond to all email inquiries and customer support tickets within <strong>2 to 4 business hours</strong>.
              For urgent order cancellations or delivery updates, please reach out directly via our helpline.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">3. Dispute Resolution</h2>
            <p>
              In the event of an unresolvable merchant dispute, Active eCommerce management will step in as an impartial
              mediator to ensure fair resolution under consumer protection regulations.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
