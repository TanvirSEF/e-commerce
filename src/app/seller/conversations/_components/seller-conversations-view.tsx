"use client"

import React, { useState } from "react"
import Image from "next/image"
import { MessageSquare, Loader2 } from "lucide-react"
import { fetchSellerConversationThreadAction } from "@/app/actions/seller-actions"
import type { SellerConversationRow, SellerConversationMessageItem } from "@/services/seller-panel-service"
import { SellerConversationThread } from "./seller-conversation-thread"

interface SellerConversationsViewProps {
  initialConversations: SellerConversationRow[]
}

export function SellerConversationsView({
  initialConversations,
}: SellerConversationsViewProps) {
  const [conversations, setConversations] = useState<SellerConversationRow[]>(initialConversations)
  const [activeConvId, setActiveConvId] = useState<number | null>(null)
  const [activeThreadData, setActiveThreadData] = useState<{
    conversation: { id: number; title: string; partnerName: string; partnerAvatar: string | null }
    messages: SellerConversationMessageItem[]
  } | null>(null)
  const [loadingThreadId, setLoadingThreadId] = useState<number | null>(null)

  const handleOpenConversation = async (conv: SellerConversationRow) => {
    setActiveConvId(conv.id)
    setLoadingThreadId(conv.id)

    const res = await fetchSellerConversationThreadAction(conv.id)
    setLoadingThreadId(null)

    if (res.success && res.data?.conversation) {
      setActiveThreadData({
        conversation: res.data.conversation,
        messages: res.data.messages,
      })
      // Mark as read in state
      setConversations((prev) =>
        prev.map((c) => (c.id === conv.id ? { ...c, isUnread: false } : c))
      )
    }
  }

  const handleMessageSent = (lastMsg: string) => {
    if (!activeConvId) return
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConvId
          ? { ...c, lastMessage: lastMsg, lastMessageAt: new Date().toISOString() }
          : c
      )
    )
  }

  const formatDateTime = (iso: string) => {
    try {
      const d = new Date(iso)
      const hours = String(d.getHours()).padStart(2, "0")
      const minutes = String(d.getMinutes()).padStart(2, "0")
      const day = String(d.getDate()).padStart(2, "0")
      const month = String(d.getMonth() + 1).padStart(2, "0")
      const year = d.getFullYear()
      return `${hours}:${minutes} ${day}-${month}-${year}`
    } catch {
      return iso
    }
  }

  // Active chat thread view matching conversations/show.blade.php
  if (activeThreadData && activeConvId) {
    return (
      <SellerConversationThread
        conversationId={activeThreadData.conversation.id}
        title={activeThreadData.conversation.title}
        partnerName={activeThreadData.conversation.partnerName}
        partnerAvatar={activeThreadData.conversation.partnerAvatar}
        initialMessages={activeThreadData.messages}
        onBack={() => {
          setActiveConvId(null)
          setActiveThreadData(null)
        }}
        onMessageSent={handleMessageSent}
      />
    )
  }

  // Conversations index list matching resources/views/seller/conversations/index.blade.php
  return (
    <div className="space-y-4">
      {/* Titlebar matching aiz-titlebar */}
      <div className="mt-2 mb-4">
        <h4 className="text-xl font-bold text-gray-800">Conversations</h4>
      </div>

      <div className="card bg-white border border-gray-200 rounded-sm shadow-xs overflow-hidden">
        <div className="p-4 md:p-6">
          {conversations.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <MessageSquare className="w-10 h-10 mx-auto text-gray-300 mb-2" />
              <p className="text-sm font-medium">No conversations found</p>
              <p className="text-xs text-gray-400 mt-1">
                Messages from customers regarding your shop products will appear here.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {conversations.map((c) => {
                const isLoading = loadingThreadId === c.id
                return (
                  <li
                    key={c.id}
                    onClick={() => handleOpenConversation(c)}
                    className="py-4 first:pt-0 last:pb-0 hover:bg-gray-50/70 transition-colors px-2 -mx-2 rounded cursor-pointer group"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      {/* Avatar */}
                      <div className="shrink-0">
                        <div className="w-10 h-10 relative rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                          <Image
                            src={c.partnerAvatar || "/assets/img/avatar-placeholder.png"}
                            alt={c.partnerName}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>

                      {/* Partner Name & Date */}
                      <div className="sm:w-52 shrink-0">
                        <p className="text-xs">
                          <span className="font-semibold text-gray-900 block">
                            {c.partnerName}
                          </span>
                          <span className="text-[11px] text-gray-400 block mt-0.5 font-mono">
                            {formatDateTime(c.lastMessageAt)}
                          </span>
                        </p>
                      </div>

                      {/* Title & Preview */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-gray-900 group-hover:text-[#d43533] transition-colors truncate">
                            {c.title}
                          </span>
                          {c.isUnread && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#d43533] text-white shrink-0">
                              New
                            </span>
                          )}
                          {isLoading && (
                            <Loader2 className="w-3 h-3 animate-spin text-[#d43533]" />
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1 truncate">
                          {c.lastMessage}
                        </p>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
