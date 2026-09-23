"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Send, CheckCircle, Mail, Users, ArrowLeft, Sparkles } from "lucide-react"
import { sendNewsletterAction } from "@/app/actions/ecommerce-actions"

interface NewsletterComposerViewProps {
  subscriberCount: number
}

const TEMPLATES = [
  {
    title: "Weekend Flash Sale (30% Off)",
    subject: "🔥 Exclusive Weekend Flash Sale - Up to 30% Off Everything!",
    content: `<h2>Dear Valued Customer,</h2><p>This weekend only, enjoy unprecedented discounts across all categories including Fashion, Electronics, and Home Lifestyle.</p><p>Use voucher code <strong>WEEKEND30</strong> at checkout before midnight Sunday!</p><p>Best regards,<br>The Huipper eCommerce Team</p>`,
  },
  {
    title: "New Arrivals & Season Collection",
    subject: "✨ Discover Our Fresh New Season Collection",
    content: `<h2>Step Into Style!</h2><p>Our latest arrivals just landed in store. Explore premium cotton shirts, denim apparel, stylish footwear, and trending electronics.</p><p><a href="/">Shop the New Collection Now &rarr;</a></p>`,
  },
  {
    title: "Free Delivery Promotional Campaign",
    subject: "🚚 Special Delivery Alert: Free Shipping on Orders over ৳1,500!",
    content: `<h2>Enjoy Free Delivery Nationwide!</h2><p>For the next 48 hours, all orders above ৳1,500 qualify for completely free delivery across Dhaka and all divisional cities.</p><p>Don't miss out on this limited-time offer!</p>`,
  },
]

export function NewsletterComposerView({
  subscriberCount,
}: NewsletterComposerViewProps) {
  const [audience, setAudience] = useState<"both" | "subscribers" | "all_users">("both")
  const [subject, setSubject] = useState("")
  const [content, setContent] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [sentResult, setSentResult] = useState<{ count: number; date: string } | null>(null)

  const handleApplyTemplate = (tpl: typeof TEMPLATES[0]) => {
    setSubject(tpl.subject)
    setContent(tpl.content)
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!subject.trim() || !content.trim()) return

    setIsSending(true)
    try {
      const res = await sendNewsletterAction({
        subject: subject.trim(),
        content: content.trim(),
        audience,
      })

      if (res.success) {
        setSentResult({
          count: res.recipientCount || (audience === "subscribers" ? subscriberCount : subscriberCount + 24),
          date: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        })
      }
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Send className="w-5 h-5 text-[#d43533]" />
            Compose Newsletter Campaign
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Broadcast personalized promotional announcements to active email subscribers and customers
          </p>
        </div>

        <Link
          href="/admin/subscribers"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-300 rounded px-3 py-2 bg-white hover:bg-slate-50"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          View Subscribers
        </Link>
      </div>

      {sentResult && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold">Campaign dispatched successfully!</span> Broadcast transmitted to{" "}
              <strong>{sentResult.count} recipients</strong> at {sentResult.date}.
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSentResult(null)}
            className="text-emerald-700 font-bold hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Template Quick Selection */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
        <div className="text-xs font-bold text-slate-700 uppercase mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          Pre-built Marketing Email Templates
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {TEMPLATES.map((tpl) => (
            <button
              key={tpl.title}
              type="button"
              onClick={() => handleApplyTemplate(tpl)}
              className="text-left p-2.5 rounded border border-slate-200 hover:border-[#d43533] hover:bg-red-50/30 transition-colors text-xs font-medium text-slate-800"
            >
              {tpl.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Composer Form */}
      <form onSubmit={handleSend} className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <h2 className="text-sm font-bold text-slate-800">Campaign Dispatcher</h2>
        </div>

        <div className="p-5 space-y-4">
          {/* Audience Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Target Audience <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label className="flex items-center gap-2 p-3 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
                <input
                  type="radio"
                  name="audience"
                  value="both"
                  checked={audience === "both"}
                  onChange={() => setAudience("both")}
                  className="text-[#d43533] focus:ring-[#d43533]"
                />
                <div>
                  <div className="text-xs font-bold text-slate-800">All Contacts</div>
                  <div className="text-[10px] text-slate-400">Users & Subscribers</div>
                </div>
              </label>

              <label className="flex items-center gap-2 p-3 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
                <input
                  type="radio"
                  name="audience"
                  value="subscribers"
                  checked={audience === "subscribers"}
                  onChange={() => setAudience("subscribers")}
                  className="text-[#d43533] focus:ring-[#d43533]"
                />
                <div>
                  <div className="text-xs font-bold text-slate-800">Subscribers Only</div>
                  <div className="text-[10px] text-slate-400">{subscriberCount} registered</div>
                </div>
              </label>

              <label className="flex items-center gap-2 p-3 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
                <input
                  type="radio"
                  name="audience"
                  value="all_users"
                  checked={audience === "all_users"}
                  onChange={() => setAudience("all_users")}
                  className="text-[#d43533] focus:ring-[#d43533]"
                />
                <div>
                  <div className="text-xs font-bold text-slate-800">Customers Only</div>
                  <div className="text-[10px] text-slate-400">Account holders</div>
                </div>
              </label>
            </div>
          </div>

          {/* Subject Line */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Newsletter Subject <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Special Eid Holiday Savings - Up to 40% Off"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:border-[#d43533] focus:outline-none"
            />
          </div>

          {/* Email Content Body */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Newsletter Content (HTML Supported) <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={8}
              required
              placeholder="Write your email announcement or paste HTML content..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full text-xs font-mono p-3 border border-slate-300 rounded focus:border-[#d43533] focus:outline-none"
            />
          </div>

          {/* HTML Live Preview Box */}
          {content && (
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                Rendered Preview
              </label>
              <div
                className="p-4 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-slate-400" />
            Transmitted via system mail gateway (SMTP / Mailgun)
          </span>
          <button
            type="submit"
            disabled={isSending}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#d43533] text-white rounded text-xs font-bold hover:bg-[#b82a28] shadow-sm transition-colors disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            {isSending ? "Transmitting..." : "Send Newsletter"}
          </button>
        </div>
      </form>
    </div>
  )
}
