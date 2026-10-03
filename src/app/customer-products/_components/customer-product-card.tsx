import React from "react"
import Link from "next/link"
import Image from "next/image"
import { formatPrice } from "@/lib/utils"
import type { ClassifiedProductItem } from "@/services/customer-product-service"

interface CustomerProductCardProps {
  product: ClassifiedProductItem
}

export function CustomerProductCard({ product }: CustomerProductCardProps) {
  const isNew = product.condition.toLowerCase().includes("new")
  const isUsed = product.condition.toLowerCase().includes("used")

  return (
    <div className="border-r border-b border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-lg bg-white relative group">
      <div className="my-3 p-2 text-center">
        <div className="relative">
          {/* Image */}
          <Link
            href={`/customer-product/${product.slug}`}
            className="block relative h-[140px] md:h-[210px] w-full overflow-hidden"
          >
            <Image
              src={product.thumbnailImg || "/assets/img/placeholder.jpg"}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 140px, 210px"
              className="object-contain mx-auto group-hover:scale-105 transition-transform duration-300"
            />
          </Link>

          {/* Condition Badge (absolute top-left pill) */}
          <div className="absolute top-0 left-0 z-10">
            {isNew && (
              <span className="inline-block bg-[#17a2b8] text-white text-[11px] md:text-xs font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                New
              </span>
            )}
            {isUsed && (
              <span className="inline-block bg-gray-500 text-white text-[11px] md:text-xs font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                Used
              </span>
            )}
          </div>
        </div>

        {/* Text Details */}
        <div className="pt-3 text-center">
          <h3 className="font-normal text-xs md:text-sm line-clamp-2 h-[38px] leading-tight text-gray-800 hover:text-[#d43533] transition-colors">
            <Link href={`/customer-product/${product.slug}`} className="block">
              {product.name}
            </Link>
          </h3>

          <div className="text-sm md:text-base mt-2 font-bold text-[#d43533]">
            {formatPrice(product.unitPrice)}
          </div>
        </div>
      </div>
    </div>
  )
}
