import React from "react"
import { Metadata } from "next"
import { db } from "@/db"
import { users } from "@/db/schema"
import { getSubscribers } from "@/services/marketing-service"
import { NewsletterComposerView } from "./_components/newsletter-composer-view"

export const metadata: Metadata = {
  title: "Send Newsletter Broadcast | Admin Panel",
}

export default async function AdminNewsletterPage() {
  const [subscribersList, userRows] = await Promise.all([
    getSubscribers(),
    db.select({ id: users.id, email: users.email, name: users.name }).from(users).limit(500),
  ])

  return (
    <NewsletterComposerView
      users={userRows}
      subscribers={subscribersList.map((s) => ({ id: String(s.id), email: s.email }))}
    />
  )
}
