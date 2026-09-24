import React from "react"
import { Metadata } from "next"
import { ContactUsView } from "./_components/contact-us-view"

export const metadata: Metadata = {
  title: "Contact Us | Active eCommerce CMS",
  description: "Get in touch with customer service, headquarters address, phone numbers, and support inquiries.",
}

export default function ContactUsPage() {
  return <ContactUsView />
}
