"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, MessageSquare, Send } from "lucide-react"
import { sendConversationMessageAction } from "@/app/actions/conversation-actions"
import type { ConversationItem, MessageItem } from "@/services/conversation-service"

interface ConversationThreadViewProps {
  conversation: ConversationItem
  initialMessages: MessageItem[]
  currentUserId: string
}

export function ConversationThreadView({
  conversation,
  initialMessages,
  currentUserId,
}: ConversationThreadViewProps) {
  const [messages, setMessages] = useState<MessageItem[]>(initialMessages)
  const [replyText, setReplyText] = useState("")
  const [isSending, setIsSending] = useState(false)

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyText.trim() || isSending) return

    const messageContent = replyText.trim()
    const numericConvId = parseInt(conversation.id, 10)

    // Optimistic UI update
    const optimisticMsg: MessageItem = {
      id: `opt-${Date.now()}`,
      conversationId: conversation.id,
      senderId: currentUserId,
      senderName: "You",
      senderAvatar: "/assets/img/avatar-place.png",
      message: messageContent,
      isSender: true,
      date:
        new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) +
        " " +
        new Date().toLocaleDateString("en-GB"),
      rawDate: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, optimisticMsg])
    setReplyText("")
    setIsSending(true)

    try {
      await sendConversationMessageAction(numericConvId, messageContent)
    } catch {
      // Revert if error
      setMessages(initialMessages)
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* 1:1 Active eCommerce CMS Titlebar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/conversations"
            className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors"
            title="Back to conversations"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900">
            Conversations With{" "}
            <Link
              href={`/shop/${conversation.shopSlug}`}
              className="text-[#3490f3] hover:underline"
            >
              {conversation.shopName}
            </Link>
          </h1>
        </div>
      </div>

      {/* Main Card */}
      <div className="rounded border border-gray-200 bg-white shadow-2xs overflow-hidden">
        {/* Card Header matching conversations/show.blade.php 1:1 */}
        <div className="border-b border-gray-100 bg-gray-50/80 p-4 sm:p-5">
          <h2 className="text-sm font-bold text-gray-900 mb-1">{conversation.title}</h2>
          <p className="text-xs text-gray-500 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-gray-400" />
            Between you and{" "}
            <span className="font-semibold text-gray-700">{conversation.shopName}</span>
          </p>
        </div>

        {/* Card Body: Messages Thread matching messages.blade.php 1:1 */}
        <div className="p-4 sm:p-6 space-y-4 max-h-[500px] overflow-y-auto bg-white">
          {messages.length === 0 ? (
            <div className="text-center py-10 text-gray-400 text-xs">
              No messages in this thread yet. Send a message below to start chatting.
            </div>
          ) : (
            messages.map((m) => {
              const isMe = m.isSender || m.senderId === currentUserId
              return (
                <div key={m.id} className="block mb-4">
                  {isMe ? (
                    /* Customer Message (Right-Aligned) */
                    <div className="flex flex-row-reverse items-start gap-3">
                      <div className="relative h-8 w-8 rounded-full border border-gray-200 overflow-hidden bg-gray-100 shrink-0">
                        <Image
                          src={m.senderAvatar || "/assets/img/avatar-place.png"}
                          alt="You"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="max-w-[75%] sm:max-w-[65%] space-y-1">
                        <div className="rounded border border-blue-100 bg-blue-50/70 p-3 text-xs text-gray-800 text-right leading-relaxed whitespace-pre-wrap">
                          {m.message}
                        </div>
                        <span className="block text-[10px] text-gray-400 text-right">
                          {m.date}
                        </span>
                      </div>
                    </div>
                  ) : (
                    /* Seller / Shop Message (Left-Aligned) */
                    <div className="flex items-start gap-3">
                      <div className="relative h-8 w-8 rounded-full border border-gray-200 overflow-hidden bg-gray-100 shrink-0">
                        <Image
                          src={m.senderAvatar || conversation.shopLogo || "/assets/img/placeholder.jpg"}
                          alt={conversation.shopName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="max-w-[75%] sm:max-w-[65%] space-y-1">
                        <div className="rounded border border-gray-200 bg-gray-50/90 p-3 text-xs text-gray-800 leading-relaxed whitespace-pre-wrap">
                          {m.message}
                        </div>
                        <span className="block text-[10px] text-gray-400">
                          {m.date}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>

        {/* Card Footer: Send Reply Form matching show.blade.php 1:1 */}
        <div className="border-t border-gray-100 p-4 sm:p-5 bg-gray-50/50">
          <form onSubmit={handleSend} className="space-y-3">
            <textarea
              rows={3}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type your reply..."
              required
              className="w-full rounded border border-gray-200 p-3 text-xs text-gray-800 focus:border-[#d43533] focus:outline-none bg-white transition-colors"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSending || !replyText.trim()}
                className="inline-flex items-center gap-1.5 rounded bg-[#d43533] px-6 py-2 text-xs font-bold text-white hover:bg-[#9d1b1a] transition-colors disabled:opacity-50 shadow-2xs cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                {isSending ? "Sending..." : "Send"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
