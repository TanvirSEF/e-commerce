import React from "react"
import Link from "next/link"
import Image from "next/image"

const BANNERS_2COL = [
  {
    title: "Super Gadget Deals",
    subtitle: "Latest Smart Tech & Accessories",
    link: "/products?category=consumer-electronics",
    image: "/assets/img/placeholder-rect.jpg",
    badge: "Limited Stock",
    bgGradient: "from-blue-600/80 to-indigo-900/80",
  },
  {
    title: "Trendy Fashion Week",
    subtitle: "Flat 40% OFF on Casuals & Formal Wear",
    link: "/products?category=men-clothing-fashion",
    image: "/assets/img/placeholder-rect.jpg",
    badge: "New Arrival",
    bgGradient: "from-red-600/80 to-amber-900/80",
  },
]

export function PromoBanners() {
  return (
    <section className="bg-white py-6">
      <div className="mx-auto max-w-[1240px] px-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {BANNERS_2COL.map((b, idx) => (
            <Link
              key={idx}
              href={b.link}
              className="group relative block h-[160px] overflow-hidden rounded-lg sm:h-[190px]"
            >
              <Image
                src={b.image}
                alt={b.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className={`absolute inset-0 bg-gradient-to-r ${b.bgGradient}`} />

              <div className="absolute inset-0 flex flex-col justify-center p-6 text-white sm:p-8">
                <span className="mb-2 max-w-max rounded bg-white/20 px-2.5 py-0.5 text-[10px] font-bold text-white uppercase backdrop-blur-sm">
                  {b.badge}
                </span>
                <h3 className="text-lg font-bold sm:text-xl">{b.title}</h3>
                <p className="mt-1 text-xs text-white/80">{b.subtitle}</p>
                <div className="mt-3">
                  <span className="inline-block text-xs font-bold text-white underline underline-offset-4 group-hover:text-[#ffc519]">
                    Shop Now →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PromoBanners
