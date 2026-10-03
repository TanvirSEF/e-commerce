"use client"

import React, { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { ArrowLeft, Send, Loader2 } from "lucide-react"
import { sendSellerConversationMessageAction } from "@/app/actions/seller-actions"
import type { SellerConversationMessageItem } from "@/services/seller-panel-service"

interface SellerConversationThreadProps {
  conversationId: number
  title: string
  partnerName: string
  partnerAvatar: string | null
  initialMessages: SellerConversationMessageItem[]
  onBack: () => void
  onMessageSent: (lastMsg: string) => void
}

export function SellerConversationThread({
  conversationId,
  title,
  partnerName,
  partnerAvatar,
  initialMessages,
  onBack,
  onMessageSent,
}: SellerConversationThreadProps) {
  const [messages, setMessages] = useState<SellerConversationMessageItem[]>(initialMessages)
  const [replyText, setReplyText] = useState("")
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyText.trim()) return

    const textToSend = replyText.trim()
    setReplyText("")
    setIsSending(true)

    const res = await sendSellerConversationMessageAction(conversationId, textToSend)
    setIsSending(false)

    if (res.success && res.data) {
      const newMsg: SellerConversationMessageItem = {
        id: res.data.id,
        conversationId,
        senderId: res.data.senderId,
        senderName: "You",
        senderAvatar: null,
        message: textToSend,
        isSelf: true,
        createdAt: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, newMsg])
      onMessageSent(textToSend)
    }
  }

  const formatTime = (isoString: string) => {
    try {
      const d = new Date(isoString)
      const hours = String(d.getHours()).padStart(2, "0")
      const minutes = String(d.getMinutes()).padStart(2, "0")
      const day = String(d.getDate()).padStart(2, "0")
      const month = String(d.getMonth() + 1).padStart(2, "0")
      const year = d.getFullYear()
      return `${hours}:${minutes} ${day}-${month}-${year}`
    } catch {
      return isoString
    }
  }

  return (
    <div className="card bg-white border border-gray-200 rounded-sm shadow-xs overflow-hidden flex flex-col min-h-[550px]">
      {/* Titlebar / Header matching conversations/show.blade.php */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white shrink-0">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h5 className="text-sm font-semibold text-gray-900 leading-tight">
              #{title}
            </h5>
            <span className="text-[11px] text-gray-500">
              Between you and <span className="font-medium text-gray-700">{partnerName}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Messages Feed matching frontend/partials/messages.blade.php */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-gray-50/40">
        {messages.map((msg) => (
          <div key={msg.id}>
            {msg.isSelf ? (
              /* Self / Seller message (aligned right) */
              <div className="flex flex-row-reverse items-start gap-2.5 max-w-xl ml-auto">
                <div className="w-8 h-8 rounded-full bg-[#d43533] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                  S
                </div>
                <div className="flex-1 text-right">
                  <div className="inline-block px-4 py-2.5 bg-white border border-gray-200 rounded text-xs text-gray-800 shadow-xs text-left">
                    {msg.message}
                  </div>
                  <span className="block text-[10px] text-gray-400 mt-1 font-mono">
                    {formatTime(msg.createdAt)}
                  </span>
                </div>
              </div>
            ) : (
              /* Customer message (aligned left) */
              <div className="flex items-start gap-2.5 max-w-xl mr-auto">
                <div className="w-8 h-8 relative rounded-full overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                  <Image
                    src={msg.senderAvatar || partnerAvatar || "/assets/img/avatar-placeholder.png"}
                    alt={partnerName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="inline-block px-4 py-2.5 bg-white border border-gray-200 rounded text-xs text-gray-800 shadow-xs">
                    {msg.message}
                  </div>
                  <span className="block text-[10px] text-gray-400 mt-1 font-mono">
                    {formatTime(msg.createdAt)}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Reply Box matching show.blade.php */}
      <div className="p-4 border-t border-gray-200 bg-white shrink-0">
        <form onSubmit={handleSend} className="space-y-3">
          <textarea
            rows={3}
            required
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Type your reply"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:border-[#d43533] focus:outline-none text-xs text-gray-800"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSending}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#d43533] hover:bg-[#b82a28] text-white rounded text-xs font-medium transition-colors"
            >
              {isSending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
