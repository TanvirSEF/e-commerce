import React from "react"
import Image from "next/image"
import { Paperclip, Download, User as UserIcon, ShieldCheck } from "lucide-react"
import type { AdminTicketDetail } from "@/services/ticket-service"

interface TicketThreadListProps {
  ticket: AdminTicketDetail
}

export function TicketThreadList({ ticket }: TicketThreadListProps) {
  return (
    <div className="space-y-6 pt-4">
      <div className="border-b border-slate-200 pb-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Conversation History ({ticket.replies.length + 1} Messages)
        </h2>
      </div>

      <div className="space-y-4">
        {/* All Replies in Chronological Order */}
        {ticket.replies.map((reply) => {
          const isStaff = reply.authorRole === "admin" || reply.authorRole === "support"

          return (
            <div
              key={reply.id}
              className={`p-4 rounded-lg border transition-colors ${
                isStaff
                  ? "bg-slate-50/90 border-slate-200 ml-4 sm:ml-8"
                  : "bg-white border-slate-200 mr-4 sm:mr-8"
              }`}
            >
              {/* Header: Avatar, Name, Role, Timestamp */}
              <div className="flex items-center justify-between gap-3 mb-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 flex items-center justify-center shrink-0">
                    {reply.authorImage ? (
                      <Image
                        src={reply.authorImage}
                        alt={reply.authorName}
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserIcon className="w-4 h-4 text-slate-500" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-800">
                        {reply.authorName}
                      </span>
                      {isStaff && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                          <ShieldCheck className="w-3 h-3" />
                          Support Staff
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 font-mono">{reply.createdAt}</p>
                  </div>
                </div>
              </div>

              {/* Message Body */}
              <div className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed pl-10">
                {reply.reply}
              </div>

              {/* Attachments */}
              {reply.files && reply.files.length > 0 && (
                <div className="mt-3 pl-10 flex flex-wrap gap-2">
                  {reply.files.map((file, fIdx) => (
                    <a
                      key={fIdx}
                      href={file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded shadow-2xs transition-colors"
                    >
                      <Paperclip className="w-3 h-3 text-slate-400" />
                      <span className="max-w-[240px] truncate">
                        {file.split("/").pop() || "Attachment"}
                      </span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          )
        })}

        {/* Customer Original Initial Ticket Inquiry (Anchor of Thread) */}
        <div className="p-4 rounded-lg border border-slate-200 bg-white mr-4 sm:mr-8">
          <div className="flex items-center justify-between gap-3 mb-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 flex items-center justify-center shrink-0">
                {ticket.userImage ? (
                  <Image
                    src={ticket.userImage}
                    alt={ticket.userName}
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserIcon className="w-4 h-4 text-slate-500" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-800">{ticket.userName}</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                    Customer Inquiry
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-mono">{ticket.createdAt}</p>
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-800 whitespace-pre-wrap leading-relaxed pl-10 font-normal">
            {ticket.details}
          </div>

          {/* Customer Attachments */}
          {ticket.files && ticket.files.length > 0 && (
            <div className="mt-3 pl-10 flex flex-wrap gap-2">
              {ticket.files.map((file, fIdx) => (
                <a
                  key={fIdx}
                  href={file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded shadow-2xs transition-colors"
                >
                  <Download className="w-3 h-3 text-slate-400" />
                  <span className="max-w-[240px] truncate">
                    {file.split("/").pop() || "Customer Attachment"}
                  </span>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
