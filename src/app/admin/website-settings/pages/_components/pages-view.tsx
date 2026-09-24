"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { type Page } from "@/db/schema/pages"
import { deleteCustomPageAction } from "@/app/actions/ecommerce-actions"
import { Plus, Edit2, Trash2, ExternalLink, Globe, AlertCircle } from "lucide-react"

interface PagesViewProps {
  initialPages: Page[]
}

export function PagesView({ initialPages }: PagesViewProps) {
  const router = useRouter()
  const [pagesList, setPagesList] = useState<Page[]>(initialPages)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    setErrorMsg("")
    try {
      const ok = await deleteCustomPageAction(deleteId)
      if (ok) {
        setPagesList((prev) => prev.filter((p) => p.id !== deleteId))
        setDeleteId(null)
        router.refresh()
      } else {
        setErrorMsg("Failed to delete page. System default pages cannot be deleted.")
      }
    } catch {
      setErrorMsg("An unexpected error occurred.")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Website Pages</h1>
          <p className="text-xs text-gray-500 mt-1">Manage system pages and create custom content pages</p>
        </div>
        <Link
          href="/admin/website-settings/pages/create"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#d43533] hover:bg-[#b82d2b] text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add New Page
        </Link>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Pages Table Card */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="font-semibold text-gray-800 text-sm">All Pages ({pagesList.length})</h2>
          <span className="text-xs text-gray-400">Active eCommerce CMS Standard</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f8f9fa] border-b border-gray-200 text-gray-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">URL Slug</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pagesList.map((item, index) => {
                const isCustom = item.type === "custom_page"
                const pageUrl = item.slug === "home" ? "/" : `/page/${item.slug}`

                return (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 text-center text-gray-400 font-medium">{index + 1}</td>
                    <td className="py-3 px-4 font-semibold text-gray-800">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span>{item.title}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-blue-600 hover:underline">
                      <Link href={pageUrl} target="_blank" className="flex items-center gap-1.5">
                        <span>{pageUrl}</span>
                        <ExternalLink className="w-3 h-3 text-gray-400" />
                      </Link>
                    </td>
                    <td className="py-3 px-4">
                      {isCustom ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Custom Page
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                          System Page
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={pageUrl}
                          target="_blank"
                          title="Preview"
                          className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        {isCustom && (
                          <button
                            onClick={() => setDeleteId(item.id)}
                            title="Delete"
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Delete Custom Page?</h3>
              <p className="text-xs text-gray-500 mt-1">
                Are you sure you want to delete this custom page? This action cannot be reversed.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                disabled={isDeleting}
                className="px-4 py-2 border border-gray-300 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
              >
                {isDeleting ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
