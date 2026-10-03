"use client"

import React, { useState } from "react"
import { MapPin, Phone, Mail, CheckCircle2 } from "lucide-react"
import { submitContactInquiryAction } from "@/app/actions/ecommerce-actions"
import type { ContactPageData } from "@/services/contact-service"

interface ContactUsViewProps {
  contactData: ContactPageData
}

export function ContactUsView({ contactData }: ContactUsViewProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    content: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.email.trim() || !formData.content.trim()) {
      setErrorMsg("Please fill in all required fields.")
      return
    }

    setSubmitting(true)
    setErrorMsg("")
    try {
      await submitContactInquiryAction({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        subject: "Query Contact",
        content: formData.content.trim(),
      })
      setSubmitted(true)
      setFormData({
        name: "",
        email: "",
        phone: "",
        content: "",
      })
    } catch {
      setErrorMsg("Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="pt-6 my-6 min-h-screen">
      <div className="max-w-[1240px] mx-auto px-4">
        {/* Container with Active eCommerce subtle base-color tint */}
        <div
          className="p-6 md:p-10 border border-gray-100"
          style={{ backgroundColor: "rgba(212, 53, 51, 0.02)" }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Contact Details */}
            <div className="lg:col-span-6 p-2 md:p-4">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {contactData.title}
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mb-8 leading-relaxed">
                {contactData.description}
              </p>

              <div className="space-y-6">
                {/* Address */}
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-lg border border-gray-400/60 flex items-center justify-center shrink-0 text-gray-500 bg-white">
                    <MapPin className="w-5 h-5 text-gray-500" />
                  </div>
                  <div className="ml-4">
                    <span className="text-base sm:text-lg font-bold text-gray-900 block">
                      Address
                    </span>
                    <span className="text-xs sm:text-sm text-gray-500 whitespace-pre-line leading-relaxed">
                      {contactData.address}
                    </span>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-lg border border-gray-400/60 flex items-center justify-center shrink-0 text-gray-500 bg-white">
                    <Phone className="w-5 h-5 text-gray-500" />
                  </div>
                  <div className="ml-4">
                    <span className="text-base sm:text-lg font-bold text-gray-900 block">
                      Phone
                    </span>
                    <a
                      href={`tel:${contactData.phone}`}
                      className="text-xs sm:text-sm text-gray-500 hover:text-[#d43533] transition-colors"
                    >
                      {contactData.phone}
                    </a>
                  </div>
                </div>

                {/* Email Address */}
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-lg border border-gray-400/60 flex items-center justify-center shrink-0 text-gray-500 bg-white">
                    <Mail className="w-5 h-5 text-gray-500" />
                  </div>
                  <div className="ml-4">
                    <span className="text-base sm:text-lg font-bold text-gray-900 block">
                      Email Address
                    </span>
                    <a
                      href={`mailto:${contactData.email}`}
                      className="text-xs sm:text-sm text-gray-500 hover:text-[#d43533] transition-colors"
                    >
                      {contactData.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Inquiry Form */}
            <div className="lg:col-span-6 p-2 md:p-4">
              <div className="bg-white p-6 sm:p-8 border border-gray-200 rounded-md shadow-xs">
                {submitted ? (
                  <div className="py-10 text-center space-y-3">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <h3 className="text-base font-bold text-gray-900">
                      Query has been sent successfully
                    </h3>
                    <p className="text-xs text-gray-500 max-w-sm mx-auto">
                      Thank you for contacting us. Our representative will respond to your email shortly.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="mt-3 px-5 py-2 text-xs font-semibold text-[#d43533] border border-[#d43533] hover:bg-red-50 transition-colors"
                    >
                      Send Another Query
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {errorMsg && (
                      <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-600 rounded-none">
                        {errorMsg}
                      </div>
                    )}

                    {/* Name */}
                    <div>
                      <label className="block text-xs sm:text-sm font-bold text-gray-800 mb-1.5">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Enter Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full text-xs sm:text-sm border border-gray-300 rounded-none px-3.5 py-2.5 focus:outline-none focus:border-[#d43533]"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs sm:text-sm font-bold text-gray-800 mb-1.5">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="Enter Email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full text-xs sm:text-sm border border-gray-300 rounded-none px-3.5 py-2.5 focus:outline-none focus:border-[#d43533]"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-xs sm:text-sm font-bold text-gray-800 mb-1.5">
                        Phone no. (optional)
                      </label>
                      <input
                        type="tel"
                        placeholder="Enter Phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full text-xs sm:text-sm border border-gray-300 rounded-none px-3.5 py-2.5 focus:outline-none focus:border-[#d43533]"
                      />
                    </div>

                    {/* Query */}
                    <div>
                      <label className="block text-xs sm:text-sm font-bold text-gray-800 mb-1.5">
                        Tell us about your query <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={4}
                        required
                        placeholder="Type here..."
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        className="w-full text-xs sm:text-sm border border-gray-300 rounded-none p-3 focus:outline-none focus:border-[#d43533]"
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-[200px] py-3 bg-[#d43533] hover:bg-[#b82a28] text-white text-xs sm:text-sm font-bold rounded-none shadow-xs transition-colors disabled:opacity-50 text-center"
                      >
                        {submitting ? "Submitting..." : "Submit"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
