"use client"

import React, { useState } from "react"
import Link from "next/link"
import {
  MessageSquare,
  Send,
  Store,
  ExternalLink,
  User,
  Clock,
  Search,
} from "lucide-react"
import { sendMessageAction } from "@/app/actions/ecommerce-actions"
import type { ConversationItem, MessageItem } from "@/services/conversation-service"

interface ConversationsViewProps {
  initialConversations: ConversationItem[]
  initialMessages: MessageItem[]
}

export function ConversationsView({
  initialConversations,
  initialMessages,
}: ConversationsViewProps) {
  const [conversations, setConversations] = useState<ConversationItem[]>(initialConversations)
  const [activeConvId, setActiveConvId] = useState<string>(
    initialConversations[0]?.id || ""
  )
  const [messages, setMessages] = useState<MessageItem[]>(initialMessages)
  const [text, setText] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [search, setSearch] = useState("")

  const activeConv = conversations.find((c) => c.id === activeConvId)

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim() || !activeConvId) return

    const newMsg: MessageItem = {
      id: `msg-${Date.now()}`,
      conversationId: activeConvId,
      senderId: "customer",
      senderName: "You",
      message: text.trim(),
      isSender: true,
      date: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages((prev) => [...prev, newMsg])
    setText("")
    setIsSending(true)

    try {
      await sendMessageAction({
        conversationId: activeConvId,
        senderId: "usr_customer_01",
        message: newMsg.message,
      })
    } finally {
      setIsSending(false)
    }
  }

  const filteredConversations = conversations.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.shopName.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[560px]">
      {/* Left List */}
      <div className="w-full md:w-80 border-r border-gray-200 flex flex-col shrink-0">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#d43533]" />
            Conversations
          </h2>
          <div className="relative mt-2">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded text-xs focus:outline-none focus:border-[#d43533]"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
          {filteredConversations.map((c) => {
            const isActive = c.id === activeConvId
            return (
              <button
                key={c.id}
                onClick={() => setActiveConvId(c.id)}
                className={`w-full text-left p-3.5 transition-colors flex items-start gap-3 ${
                  isActive ? "bg-red-50/60 border-l-4 border-[#d43533]" : "hover:bg-gray-50"
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs shrink-0">
                  <Store className="w-4 h-4 text-[#d43533]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="font-bold text-xs text-gray-900 truncate">
                      {c.shopName}
                    </span>
                    <span className="text-[10px] text-gray-400 shrink-0">{c.lastMessageAt}</span>
                  </div>
                  <div className="text-[11px] text-gray-700 font-medium truncate">{c.title}</div>
                  <div className="text-[11px] text-gray-400 truncate mt-0.5">{c.lastMessage}</div>
                </div>
              </button>
            )
          })}

          {filteredConversations.length === 0 && (
            <div className="p-6 text-center text-xs text-gray-400">
              No conversations found.
            </div>
          )}
        </div>
      </div>

      {/* Right Chat Thread */}
      <div className="flex-1 flex flex-col bg-[#fcfcfd]">
        {activeConv ? (
          <>
            {/* Thread Header */}
            <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-800">{activeConv.title}</h3>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                  <span>Talking with:</span>
                  <span className="font-semibold text-gray-800">{activeConv.shopName}</span>
                </div>
              </div>
              <Link
                href={`/shop/${activeConv.shopSlug}`}
                target="_blank"
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-gray-600 border border-gray-200 rounded hover:bg-gray-50 transition-colors"
              >
                <Store className="w-3 h-3" />
                Visit Store
                <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
              </Link>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {messages.map((m) => {
                const isMe = m.senderId === "customer" || m.isSender
                return (
                  <div
                    key={m.id}
                    className={`flex flex-col max-w-[80%] ${
                      isMe ? "ml-auto items-end" : "mr-auto items-start"
                    }`}
                  >
                    <div className="text-[10px] text-gray-400 mb-0.5 px-1">
                      {m.senderName} • {m.date}
                    </div>
                    <div
                      className={`p-3 rounded-lg text-xs leading-relaxed ${
                        isMe
                          ? "bg-[#d43533] text-white rounded-br-xs"
                          : "bg-white border border-gray-200 text-gray-800 rounded-bl-xs shadow-xs"
                      }`}
                    >
                      {m.message}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Reply Input Bar */}
            <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-200 flex gap-2">
              <input
                type="text"
                placeholder="Type your message to the seller..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded text-xs focus:outline-none focus:border-[#d43533]"
              />
              <button
                type="submit"
                disabled={isSending || !text.trim()}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#d43533] hover:bg-[#b82a28] text-white text-xs font-semibold rounded shadow-sm disabled:opacity-50 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                Send
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-400 text-xs">
            <MessageSquare className="w-10 h-10 mb-2 stroke-1 text-gray-300" />
            <p className="font-semibold text-gray-600">Select a conversation</p>
            <p className="mt-1">Messages between you and verified sellers will appear here.</p>
          </div>
        )}
      </div>
    </div>
  )
}
