import React from "react"
import Link from "next/link"
import Image from "next/image"
import { Clock, ChevronRight } from "lucide-react"
import type { HomePreorderItem } from "@/services/home-service"

interface HomePreorderSectionProps {
  preorders?: HomePreorderItem[]
}

export function HomePreorderSection({ preorders = [] }: HomePreorderSectionProps) {
  if (preorders.length === 0) return null

  return (
    <section className="bg-indigo-50/40 py-7">
      <div className="mx-auto max-w-[1240px] px-4">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between border-b border-indigo-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white shadow-sm">
              <Clock className="h-4 w-4 fill-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 sm:text-lg">
                Upcoming Pre-Order Launches
              </h2>
            </div>
            <span className="hidden rounded bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700 uppercase sm:inline-block">
              Priority Allocation
            </span>
          </div>

          <Link
            href="/all-preorder-products"
            className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline"
          >
            <span>View All Pre-orders</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Preorders Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {preorders.map((item) => (
            <div
              key={item.id}
              className="group flex flex-col justify-between rounded-xl border border-indigo-100 bg-white p-4 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
            >
              <div>
                <div className="relative mb-3 h-40 w-full overflow-hidden rounded-lg bg-gray-50">
                  <Image
                    src={item.thumbnail}
                    alt={item.name}
                    fill
                    className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      const target = e.currentTarget
                      if (!target.src.includes("placeholder.jpg")) {
                        target.src = "/assets/img/placeholder.jpg"
                      }
                    }}
                  />
                  <div className="absolute top-2 left-2 rounded bg-indigo-600 px-2 py-0.5 text-[10px] font-bold text-white uppercase shadow-xs">
                    Pre-order
                  </div>
                </div>

                <h3 className="line-clamp-2 text-xs font-bold text-gray-800 transition-colors group-hover:text-indigo-600">
                  <Link href={`/preorder/${item.slug}`}>{item.name}</Link>
                </h3>
              </div>

              <div className="mt-3 border-t border-gray-100 pt-3">
                <div className="flex items-baseline justify-between text-xs">
                  <span className="text-gray-500">Deposit:</span>
                  <span className="font-bold text-indigo-600">
                    ৳{item.prepaymentAmount.toLocaleString()}
                  </span>
                </div>
                <div className="mt-0.5 flex items-baseline justify-between text-xs">
                  <span className="text-gray-400">Total Price:</span>
                  <span className="font-semibold text-gray-700">
                    ৳{item.price.toLocaleString()}
                  </span>
                </div>

                <Link
                  href={`/preorder/${item.slug}`}
                  className="mt-3 inline-flex w-full items-center justify-center rounded-md bg-indigo-600 py-2 text-xs font-bold text-white transition-colors hover:bg-indigo-700"
                >
                  Reserve Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HomePreorderSection
