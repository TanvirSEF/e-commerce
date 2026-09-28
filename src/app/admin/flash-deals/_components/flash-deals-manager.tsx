"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus, Search, Copy, Check, Trash2, X, ExternalLink } from "lucide-react"
import {
  createFlashDealAction,
  deleteFlashDealAction,
  toggleFlashDealStatusAction,
  toggleFlashDealFeaturedAction,
} from "@/app/actions/ecommerce-actions"
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal"
import { CreateFlashDealModal } from "./create-flash-deal-modal"

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
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [dealToDelete, setDealToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleCopyLink = (slug: string) => {
    const url = `${window.location.origin}/flash-deal/${slug}`
    navigator.clipboard.writeText(url)
    setCopiedSlug(slug)
    setTimeout(() => setCopiedSlug(null), 2000)
  }

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    const nextStatus = !currentStatus
    setDeals((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: nextStatus } : d))
    )
    await toggleFlashDealStatusAction(id, nextStatus)
  }

  const handleToggleFeatured = async (id: string, currentFeatured: boolean) => {
    const nextFeatured = !currentFeatured
    setDeals((prev) =>
      prev.map((d) => (d.id === id ? { ...d, featured: nextFeatured } : d))
    )
    await toggleFlashDealFeaturedAction(id, nextFeatured)
  }

  const handleDeleteClick = (id: string) => {
    setDealToDelete(id)
    setDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!dealToDelete) return
    setIsDeleting(true)
    try {
      await deleteFlashDealAction(dealToDelete)
      setDeals((prev) => prev.filter((d) => d.id !== dealToDelete))
    } catch (err) {
      console.error("Error deleting flash deal:", err)
    } finally {
      setIsDeleting(false)
      setDeleteModalOpen(false)
      setDealToDelete(null)
    }
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
                          onClick={() => handleToggleStatus(deal.id, deal.status)}
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
                          onClick={() => handleToggleFeatured(deal.id, deal.featured)}
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
                            className="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-primary transition-colors cursor-pointer"
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
                            onClick={() => handleDeleteClick(deal.id)}
                            className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
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
      <CreateFlashDealModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onCreated={(deal) => setDeals((prev) => [deal, ...prev])}
      />

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          if (!isDeleting) {
            setDeleteModalOpen(false)
            setDealToDelete(null)
          }
        }}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="Delete Confirmation"
        description="Are you sure you want to delete this flash deal campaign? Featured discounts and home page campaign showcases will be unlinked."
      />
    </div>
  )
}
