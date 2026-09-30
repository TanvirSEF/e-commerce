"use client"

import React from "react"
import { History, Bell } from "lucide-react"
import { type CustomNotification } from "@/db/schema"

interface NotificationHistoryTableProps {
  history: CustomNotification[]
}

export function NotificationHistoryTable({
  history,
}: NotificationHistoryTableProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-xs p-6 space-y-4">
      <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
        <History className="w-4 h-4 text-gray-600" />
        <span>Broadcast History ({history.length})</span>
      </h2>

      {history.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
          <p className="text-xs">No notifications have been sent yet.</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
          {history.map((n) => {
            const dateStr = n.createdAt
              ? new Date(n.createdAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "Just now"

            return (
              <div
                key={n.id}
                className="p-3.5 border border-gray-100 rounded-lg hover:border-gray-200 bg-gray-50/50 space-y-1.5 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-red-50 text-[#d43533]">
                    {n.notificationType || "General"}
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium">
                    {dateStr}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-gray-900 leading-snug">
                  {n.title}
                </h4>
                <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                  {n.content}
                </p>
                {n.link && (
                  <div className="pt-1">
                    <a
                      href={n.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-blue-600 hover:underline break-all"
                    >
                      {n.link}
                    </a>
                  </div>
                )}
                <div className="text-[10px] text-gray-400 pt-1">
                  Sent to {n.recipientCount || 1} customer(s)
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
