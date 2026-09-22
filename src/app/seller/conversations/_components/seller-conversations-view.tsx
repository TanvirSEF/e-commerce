"use client"

import React, { useState } from "react"
import {
  MessageSquare,
  Send,
  User,
  Search,
} from "lucide-react"
import { sendMessageAction } from "@/app/actions/ecommerce-actions"
import type { ConversationItem, MessageItem } from "@/services/conversation-service"

interface SellerConversationsViewProps {
  initialConversations: ConversationItem[]
  initialMessages: MessageItem[]
}

export function SellerConversationsView({
  initialConversations,
  initialMessages,
}: SellerConversationsViewProps) {
  const [conversations] = useState<ConversationItem[]>(initialConversations)
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
      senderId: "seller",
      senderName: "You (Seller)",
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
        senderId: "seller_01",
        message: newMsg.message,
      })
    } finally {
      setIsSending(false)
    }
  }

  const filteredConversations = conversations.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.customerName.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Customer Inquiries & Messages</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Communicate directly with buyers who have questions about your products
        </p>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden flex flex-col md:flex-row min-h-[580px]">
        {/* Left: Customer conversations list */}
        <div className="w-full md:w-80 border-r border-slate-200 flex flex-col shrink-0">
          <div className="p-3.5 border-b border-slate-100 bg-slate-50/50">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search inquiries..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded text-xs focus:outline-none focus:border-[#d43533]"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredConversations.map((c) => {
              const isActive = c.id === activeConvId
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveConvId(c.id)}
                  className={`w-full text-left p-3.5 transition-colors flex items-start gap-3 ${
                    isActive ? "bg-red-50/60 border-l-4 border-[#d43533]" : "hover:bg-slate-50"
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                    <User className="w-4 h-4 text-slate-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="font-bold text-xs text-slate-900 truncate">
                        {c.customerName}
                      </span>
                      <span className="text-[10px] text-slate-400 shrink-0">{c.lastMessageAt}</span>
                    </div>
                    <div className="text-[11px] text-slate-700 font-medium truncate">{c.title}</div>
                    <div className="text-[11px] text-slate-400 truncate mt-0.5">{c.lastMessage}</div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Right: Message Thread */}
        <div className="flex-1 flex flex-col bg-[#fcfcfd]">
          {activeConv ? (
            <>
              {/* Header */}
              <div className="p-4 border-b border-slate-200 bg-white flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">{activeConv.title}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                    <span>Customer:</span>
                    <span className="font-semibold text-slate-800">{activeConv.customerName}</span>
                    {activeConv.customerEmail && <span>({activeConv.customerEmail})</span>}
                  </div>
                </div>
              </div>

              {/* Thread Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {messages.map((m) => {
                  const isMe = m.senderId === "seller" || m.isSender
                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col max-w-[80%] ${
                        isMe ? "ml-auto items-end" : "mr-auto items-start"
                      }`}
                    >
                      <div className="text-[10px] text-slate-400 mb-0.5 px-1">
                        {m.senderName} • {m.date}
                      </div>
                      <div
                        className={`p-3 rounded-lg text-xs leading-relaxed ${
                          isMe
                            ? "bg-[#d43533] text-white rounded-br-xs"
                            : "bg-white border border-slate-200 text-slate-800 rounded-bl-xs shadow-xs"
                        }`}
                      >
                        {m.message}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Reply Form */}
              <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex gap-2">
                <input
                  type="text"
                  placeholder="Reply to customer inquiry..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded text-xs focus:outline-none focus:border-[#d43533]"
                />
                <button
                  type="submit"
                  disabled={isSending || !text.trim()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#d43533] hover:bg-[#b82a28] text-white text-xs font-semibold rounded shadow-sm disabled:opacity-50 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  Reply
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 text-xs">
              <MessageSquare className="w-10 h-10 mb-2 stroke-1 text-slate-300" />
              <p className="font-semibold text-slate-600">Select an inquiry</p>
              <p className="mt-1">Customer questions about your shop products will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
