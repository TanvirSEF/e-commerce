import React from "react"
import type { Metadata } from "next"
import { getContactPageContent } from "@/services/contact-service"
import { ContactUsView } from "./_components/contact-us-view"

export const dynamic = "force-dynamic"

export async function generateMetadata(): Promise<Metadata> {
  const data = await getContactPageContent()
  return {
    title: data.metaTitle,
    description: data.metaDescription,
  }
}

export default async function ContactUsPage() {
  const contactData = await getContactPageContent()

  return <ContactUsView contactData={contactData} />
}
