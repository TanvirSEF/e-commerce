"use client"

import React, { useState } from "react"
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, MessageSquare } from "lucide-react"
import { submitContactInquiryAction } from "@/app/actions/ecommerce-actions"

export function ContactUsView() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "General Inquiry",
    content: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.content) {
      setErrorMsg("Please fill in all required fields.")
      return
    }

    setSubmitting(true)
    setErrorMsg("")
    try {
      await submitContactInquiryAction(formData)
      setSubmitted(true)
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "General Inquiry",
        content: "",
      })
    } catch {
      setErrorMsg("Failed to send message. Please try again later.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-gray-50/50 py-10 min-h-screen">
      <div className="max-w-[1240px] mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <a href="/" className="hover:text-[#d43533]">Home</a>
          <span>/</span>
          <span className="text-gray-900 font-semibold">Contact Us</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Contact Information */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-xs uppercase font-bold text-[#d43533] tracking-wider">Get in Touch</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
                We&apos;re Here to Help You
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
                Have questions regarding orders, courier deliveries, seller onboarding, or product specifications? Reach out through any channel below.
              </p>
            </div>

            {/* Info Cards */}
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-start gap-3.5 shadow-xs">
                <div className="w-10 h-10 rounded-lg bg-red-50 text-[#d43533] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-gray-900">Headquarters Office</h2>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                    House 42, Road 11, Block D, Banani, Dhaka 1213, Bangladesh
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-start gap-3.5 shadow-xs">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-gray-900">Customer Helpline</h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    +880 1700-112233 / +880 9612-445566
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-start gap-3.5 shadow-xs">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-gray-900">Email Inquiries</h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    support@huipper.com / info@huipper.com
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-start gap-3.5 shadow-xs">
                <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-gray-900">Operating Hours</h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Saturday – Thursday: 9:00 AM – 9:00 PM (BST)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
              <div className="flex items-center gap-2 pb-4 border-b border-gray-100">
                <MessageSquare className="w-5 h-5 text-[#d43533]" />
                <h2 className="text-base font-bold text-gray-900">Send Us a Direct Message</h2>
              </div>

              {submitted ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900">Message Received!</h3>
                  <p className="text-xs text-gray-500 max-w-md mx-auto">
                    Thank you for contacting us. Your message has been routed to our customer support representatives. We will reply via email shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="inline-flex items-center px-4 py-2 text-xs font-semibold text-[#d43533] border border-[#d43533] rounded-lg hover:bg-red-50 transition-colors mt-2"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                  {errorMsg && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600">
                      {errorMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Tanvir Ahmed"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#d43533]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. tanvir@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#d43533]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Phone Number (Optional)
                      </label>
                      <input
                        type="tel"
                        placeholder="e.g. +880 1711-XXXXXX"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#d43533]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Inquiry Topic / Subject
                      </label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#d43533] bg-white"
                      >
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Order & Delivery Tracking">Order & Delivery Tracking</option>
                        <option value="Seller Merchant Partnership">Seller Merchant Partnership</option>
                        <option value="Return / Refund Request">Return / Refund Request</option>
                        <option value="Wholesale & Corporate Orders">Wholesale & Corporate Orders</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Your Message / Query <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={5}
                      required
                      placeholder="Please write your detailed question or requirement here..."
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      className="w-full text-xs border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-[#d43533]"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-[#d43533] hover:bg-[#b82a28] text-white text-xs font-bold rounded-lg shadow-sm transition-colors disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                      {submitting ? "Sending Inquiry..." : "Send Message"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
