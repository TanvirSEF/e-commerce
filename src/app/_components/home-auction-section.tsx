import React from "react"
import Link from "next/link"
import Image from "next/image"
import { Gavel, ChevronRight } from "lucide-react"
import type { HomeAuctionItem } from "@/services/home-service"

interface HomeAuctionSectionProps {
  auctions?: HomeAuctionItem[]
}

export function HomeAuctionSection({ auctions = [] }: HomeAuctionSectionProps) {
  if (auctions.length === 0) return null

  return (
    <section className="bg-white py-7">
      <div className="mx-auto max-w-[1240px] px-4">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-600 text-white shadow-sm">
              <Gavel className="h-4 w-4 fill-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 sm:text-lg">
                Live Auctions & Bidding
              </h2>
            </div>
            <span className="hidden rounded bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700 uppercase sm:inline-block">
              Bid to Win
            </span>
          </div>

          <Link
            href="/auction-products"
            className="flex items-center gap-1 text-xs font-semibold text-rose-600 hover:underline"
          >
            <span>View All Auctions</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Auctions Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {auctions.map((item) => (
            <div
              key={item.id}
              className="group flex flex-col justify-between rounded-xl border border-gray-100 bg-white p-4 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-rose-200 hover:shadow-md"
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
                  <div className="absolute top-2 left-2 rounded bg-rose-600 px-2 py-0.5 text-[10px] font-bold text-white uppercase shadow-xs">
                    Live Bid
                  </div>
                </div>

                <h3 className="line-clamp-2 text-xs font-bold text-gray-800 transition-colors group-hover:text-rose-600">
                  <Link href={`/auction-product/${item.slug}`}>{item.name}</Link>
                </h3>
              </div>

              <div className="mt-3 border-t border-gray-100 pt-3">
                <div className="flex items-baseline justify-between text-xs">
                  <span className="text-gray-500">Current Bid:</span>
                  <span className="font-extrabold text-rose-600">
                    ৳{item.currentBid.toLocaleString()}
                  </span>
                </div>
                <div className="mt-0.5 flex items-baseline justify-between text-xs">
                  <span className="text-gray-400">Starting At:</span>
                  <span className="font-semibold text-gray-600">
                    ৳{item.startingBid.toLocaleString()}
                  </span>
                </div>

                <Link
                  href={`/auction-product/${item.slug}`}
                  className="mt-3 inline-flex w-full items-center justify-center rounded-md bg-rose-600 py-2 text-xs font-bold text-white transition-colors hover:bg-rose-700"
                >
                  Place Bid
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HomeAuctionSection
