import React from "react"

export const metadata = { title: "Conversations | Seller Dashboard" }

export default function SellerConversationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Conversations</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Buyer–seller messaging center — coming soon
        </p>
      </div>
      <div className="bg-white rounded-lg border border-slate-200 p-10 text-center text-slate-400 text-sm">
        No active conversations yet.
      </div>
    </div>
  )
}
