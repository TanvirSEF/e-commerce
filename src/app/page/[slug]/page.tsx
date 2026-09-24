import React from "react"
import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronRight, Home } from "lucide-react"
import { getPageBySlug } from "@/services/page-service"

interface DynamicPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: DynamicPageProps): Promise<Metadata> {
  const { slug } = await params
  const page = await getPageBySlug(slug)
  if (!page) {
    return { title: "Page Not Found | Active eCommerce" }
  }
  return {
    title: `${page.metaTitle || page.title} | Active eCommerce`,
    description: page.metaDescription || undefined,
    keywords: page.keywords || undefined,
  }
}

export default async function DynamicCustomPage({ params }: DynamicPageProps) {
  const { slug } = await params
  const page = await getPageBySlug(slug)

  if (!page) {
    notFound()
  }

  return (
    <div className="bg-[#f2f3f8] min-h-screen py-6 sm:py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Breadcrumb Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 pb-2">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">{page.title}</h1>
          <nav className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500 mt-2 sm:mt-0">
            <Link href="/" className="hover:text-[#d43533] transition-colors flex items-center gap-1">
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold text-gray-800">&quot;{page.title}&quot;</span>
          </nav>
        </div>

        {/* Dynamic Page Content Card */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 sm:p-10 space-y-6 text-sm text-gray-700 leading-relaxed">
          {page.content ? (
            <div
              className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-700 prose-a:text-[#d43533]"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          ) : (
            <p className="text-gray-400 italic">No content has been published for this page yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}
