"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus, Search, Copy, Check, Trash2, X, ExternalLink } from "lucide-react"
import { createFlashDealAction } from "@/app/actions/ecommerce-actions"

interface FlashDealItem {
  id: string
  title: string
  slug: string
  startDate: number
  endDate: number
  status: boolean
  featured: boolean
  banner?: string
}

interface FlashDealsManagerProps {
  initialDeals: FlashDealItem[]
}

export function FlashDealsManager({ initialDeals }: FlashDealsManagerProps) {
  const [deals, setDeals] = useState<FlashDealItem[]>(initialDeals)
  const [search, setSearch] = useState("")
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)

  // Form state
  const [title, setTitle] = useState("")
  const [startDateStr, setStartDateStr] = useState("")
  const [endDateStr, setEndDateStr] = useState("")
  const [banner, setBanner] = useState("/assets/img/placeholder-rect.jpg")
  const [submitting, setSubmitting] = useState(false)

  const handleCopyLink = (slug: string) => {
    const url = `${window.location.origin}/flash-deal/${slug}`
    navigator.clipboard.writeText(url)
    setCopiedSlug(slug)
    setTimeout(() => setCopiedSlug(null), 2000)
  }

  const handleToggleStatus = (id: string) => {
    setDeals((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: !d.status } : d))
    )
  }

  const handleToggleFeatured = (id: string) => {
    setDeals((prev) =>
      prev.map((d) => (d.id === id ? { ...d, featured: !d.featured } : d))
    )
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this flash deal?")) {
      setDeals((prev) => prev.filter((d) => d.id !== id))
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !startDateStr || !endDateStr) return

    setSubmitting(true)
    const start = new Date(startDateStr).getTime()
    const end = new Date(endDateStr).getTime()

    const res = await createFlashDealAction({
      title,
      banner,
      startDate: start,
      endDate: end,
    })

    setDeals([res.deal, ...deals])
    setSubmitting(false)
    setShowModal(false)
    setTitle("")
    setStartDateStr("")
    setEndDateStr("")
  }

  const filteredDeals = deals.filter((d) =>
    d.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Flash Deals</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage flash sales campaigns, discount timer promos, and featured deals.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded text-xs font-bold bg-primary hover:bg-primary/90 text-white shadow-xs transition-colors"
        >
          <Plus className="size-4" />
          <span>Create New Flash Deal</span>
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-xs overflow-hidden">
        {/* Search */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search flash deals..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-gray-200 rounded focus:outline-none focus:border-primary"
            />
          </div>
          <span className="text-xs text-gray-500">{filteredDeals.length} campaigns</span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/50 text-[11px] uppercase tracking-wider text-gray-500 font-semibold">
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Banner</th>
                <th className="py-3 px-4">Start Date</th>
                <th className="py-3 px-4">End Date</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Featured</th>
                <th className="py-3 px-4 text-center">Page Link</th>
                <th className="py-3 px-4 text-right">Options</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {filteredDeals.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-10 text-gray-400">
                    No flash deal campaigns found.
                  </td>
                </tr>
              ) : (
                filteredDeals.map((deal, idx) => {
                  const isCopied = copiedSlug === deal.slug
                  const startDate = new Date(deal.startDate).toLocaleDateString("en-GB")
                  const endDate = new Date(deal.endDate).toLocaleDateString("en-GB")

                  return (
                    <tr key={deal.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-gray-400">
                        {String(idx + 1).padStart(2, "0")}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-gray-900">{deal.title}</td>
                      <td className="py-3.5 px-4">
                        <img
                          src={deal.banner || "/assets/img/placeholder-rect.jpg"}
                          alt={deal.title}
                          className="h-9 w-20 object-cover rounded border border-gray-200"
                        />
                      </td>
                      <td className="py-3.5 px-4 text-gray-600">{startDate}</td>
                      <td className="py-3.5 px-4 text-gray-600">{endDate}</td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleToggleStatus(deal.id)}
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            deal.status ? "bg-primary" : "bg-gray-200"
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                              deal.status ? "translate-x-4" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleToggleFeatured(deal.id)}
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            deal.featured ? "bg-amber-500" : "bg-gray-200"
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                              deal.featured ? "translate-x-4" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleCopyLink(deal.slug)}
                            className="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-primary transition-colors"
                            title="Copy Campaign URL"
                          >
                            {isCopied ? (
                              <Check className="size-4 text-green-600" />
                            ) : (
                              <Copy className="size-4" />
                            )}
                          </button>
                          <Link
                            href={`/flash-deal/${deal.slug}`}
                            target="_blank"
                            className="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-primary transition-colors"
                            title="Open Preview"
                          >
                            <ExternalLink className="size-4" />
                          </Link>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleDelete(deal.id)}
                            className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Flash Deal Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-sm">Create Flash Deal Campaign</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Campaign Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mega Eid Flash Sale 2026"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs border border-gray-200 rounded p-2.5 focus:border-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={startDateStr}
                    onChange={(e) => setStartDateStr(e.target.value)}
                    className="w-full text-xs border border-gray-200 rounded p-2.5 focus:border-primary focus:outline-none bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    End Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={endDateStr}
                    onChange={(e) => setEndDateStr(e.target.value)}
                    className="w-full text-xs border border-gray-200 rounded p-2.5 focus:border-primary focus:outline-none bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Banner Image URL
                </label>
                <input
                  type="text"
                  value={banner}
                  onChange={(e) => setBanner(e.target.value)}
                  className="w-full text-xs border border-gray-200 rounded p-2.5 focus:border-primary focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded text-xs font-bold bg-primary hover:bg-primary/90 text-white shadow-xs disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Save Campaign"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
