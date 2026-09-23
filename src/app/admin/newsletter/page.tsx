import React from "react"
import { getSubscribers } from "@/services/marketing-service"
import { NewsletterComposerView } from "./_components/newsletter-composer-view"

export const metadata = {
  title: "Send Newsletter Broadcast | Admin Panel",
}

export default async function AdminNewsletterPage() {
  const subscribers = await getSubscribers()

  return <NewsletterComposerView subscriberCount={subscribers.length} />
}
