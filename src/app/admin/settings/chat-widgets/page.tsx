import React from "react"
import { Metadata } from "next"
import { getChatWidgetsSettings } from "@/services/settings-service"
import { ChatWidgetsView } from "./_components/chat-widgets-view"

export const metadata: Metadata = {
  title: "Chat Widgets | Admin Dashboard",
  description: "Configure floating WhatsApp and Messenger live chat widgets",
}

export default async function AdminChatWidgetsPage() {
  const settings = await getChatWidgetsSettings()

  return (
    <div className="p-4 md:p-6">
      <ChatWidgetsView initialSettings={settings} />
    </div>
  )
}
