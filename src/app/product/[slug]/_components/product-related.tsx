import React from "react"
import { ProductCard, type ProductCardProps } from "@/components/product/product-card"

interface ProductRelatedProps {
  products: ProductCardProps[]
}

export function ProductRelated({ products }: ProductRelatedProps) {
  if (products.length === 0) return null

  return (
    <section className="mt-10 border-t border-gray-100 pt-8">
      <div className="mb-4">
        <h3 className="text-base font-bold text-gray-900 sm:text-lg">
          Related Products
        </h3>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 sm:gap-4">
        {products.map((p) => (
          <ProductCard key={p.id} {...p} />
        ))}
      </div>
    </section>
  )
}

export default ProductRelated
