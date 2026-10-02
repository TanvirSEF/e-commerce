"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search } from "lucide-react"
import type { ConversationItem } from "@/services/conversation-service"

interface ConversationsViewProps {
  initialConversations: ConversationItem[]
}

export function ConversationsView({ initialConversations }: ConversationsViewProps) {
  const [conversations] = useState<ConversationItem[]>(initialConversations)
  const [search, setSearch] = useState("")

  const filtered = conversations.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.shopName.toLowerCase().includes(search.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4">
      {/* 1:1 Active eCommerce CMS Titlebar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900">Conversations</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Select a conversation to view all messages
          </p>
        </div>

        {/* Search */}
        {conversations.length > 0 && (
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search conversations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-1.5 border border-gray-200 rounded focus:border-[#d43533] focus:outline-none"
            />
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        )}
      </div>

      {/* Main Content Body */}
      {filtered.length === 0 ? (
        /* Empty State Matching Active eCommerce 1:1 */
        <div className="rounded border border-gray-200 bg-white p-12 text-center shadow-2xs">
          <div className="relative mx-auto w-40 h-32 mb-4">
            <Image
              src="/assets/img/nothing.svg"
              alt="No conversations"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h3 className="text-base font-bold text-gray-800">There isn&apos;t anything added yet</h3>
          <p className="mt-1 text-xs text-gray-500 max-w-sm mx-auto">
            You don&apos;t have any message threads or seller inquiries yet.
          </p>
          <div className="mt-5">
            <Link
              href="/sellers"
              className="inline-flex items-center gap-1.5 rounded bg-[#d43533] px-5 py-2 text-xs font-bold text-white hover:bg-[#9d1b1a] transition-colors shadow-2xs"
            >
              Browse Stores
            </Link>
          </div>
        </div>
      ) : (
        /* Conversations List Matching conversations/index.blade.php 1:1 */
        <div className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="border border-gray-200 bg-white p-4 sm:p-5 hover:bg-gray-50/80 transition-colors rounded shadow-2xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Left Part: Shop Logo & Name */}
                <div className="flex items-center gap-3.5 sm:w-1/3 shrink-0">
                  {/* Circular Avatar / Shop Logo */}
                  <Link
                    href={`/shop/${item.shopSlug}`}
                    className="relative h-11 w-11 rounded-full border border-gray-200 overflow-hidden bg-gray-50 shrink-0 hover:scale-105 transition-transform"
                  >
                    <Image
                      src={item.shopLogo || "/assets/img/placeholder.jpg"}
                      alt={item.shopName}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        const target = e.currentTarget
                        if (!target.src.includes("placeholder.jpg")) {
                          target.src = "/assets/img/placeholder.jpg"
                        }
                      }}
                    />
                  </Link>

                  {/* Shop Name & Last Message Date */}
                  <div>
                    <Link
                      href={`/shop/${item.shopSlug}`}
                      className="text-xs sm:text-sm font-bold text-gray-900 hover:text-[#d43533] transition-colors block line-clamp-1"
                      title={item.shopName}
                    >
                      {item.shopName}
                    </Link>
                    <span className="text-[11px] text-gray-400 block mt-0.5">
                      {item.lastMessageAt}
                    </span>
                  </div>
                </div>

                {/* Right Part: Title & Message Preview */}
                <div className="flex-1 space-y-1 sm:border-l sm:border-gray-100 sm:pl-4">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/dashboard/conversations/${item.id}`}
                      className="text-xs sm:text-sm font-bold text-gray-900 hover:text-[#d43533] transition-colors line-clamp-1"
                      title={item.title}
                    >
                      {item.title}
                    </Link>
                    {item.unreadCount > 0 && (
                      <span className="rounded bg-rose-600 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shrink-0">
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-1">
                    {item.lastMessage}
                  </p>
                </div>

                {/* View Button */}
                <div className="shrink-0 self-end sm:self-center">
                  <Link
                    href={`/dashboard/conversations/${item.id}`}
                    className="inline-flex items-center rounded border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-gray-700 hover:border-[#3490f3] hover:text-[#3490f3] transition-colors shadow-2xs"
                  >
                    View Thread
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
