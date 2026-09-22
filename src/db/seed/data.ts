export interface SeedCategory {
  id: string
  name: string
  slug: string
  icon: string
  banner: string
  featured: boolean
  orderLevel: number
  itemCount: number
}

export interface SeedBrand {
  id: string
  name: string
  slug: string
  logo: string
  top: boolean
  productCount: number
}

export interface SeedProduct {
  id: string
  name: string
  slug: string
  sku: string
  categorySlug: string
  brandSlug: string
  price: number
  originalPrice: number
  discountPercent: number
  rating: number
  reviewCount: number
  salesCount: number
  stock: number
  unit: string
  thumbnail: string
  images: string[]
  colors: { name: string; hex: string }[]
  sizes: string[]
  featured: boolean
  todaysDeal: boolean
  sellerName: string
  sellerSlug: string
  description: string
  specifications: { label: string; value: string }[]
  reviews: { id: string; userName: string; date: string; rating: number; comment: string }[]
}

export const SEED_CATEGORIES: SeedCategory[] = [
  {
    id: "cat-1",
    name: "Men Clothing & Fashion",
    slug: "men-clothing-fashion",
    icon: "/assets/img/placeholder.jpg",
    banner: "/assets/img/placeholder-rect.jpg",
    featured: true,
    orderLevel: 1,
    itemCount: 142,
  },
  {
    id: "cat-2",
    name: "Women Clothing & Fashion",
    slug: "women-clothing-fashion",
    icon: "/assets/img/placeholder.jpg",
    banner: "/assets/img/placeholder-rect.jpg",
    featured: true,
    orderLevel: 2,
    itemCount: 198,
  },
  {
    id: "cat-3",
    name: "Computer & Accessories",
    slug: "computer-accessories",
    icon: "/assets/img/placeholder.jpg",
    banner: "/assets/img/placeholder-rect.jpg",
    featured: true,
    orderLevel: 3,
    itemCount: 89,
  },
  {
    id: "cat-4",
    name: "Smartphone Accessories",
    slug: "smartphone-accessories",
    icon: "/assets/img/placeholder.jpg",
    banner: "/assets/img/placeholder-rect.jpg",
    featured: true,
    orderLevel: 4,
    itemCount: 114,
  },
  {
    id: "cat-5",
    name: "Car & Motorbike Accessories",
    slug: "car-accessories",
    icon: "/assets/img/placeholder.jpg",
    banner: "/assets/img/placeholder-rect.jpg",
    featured: true,
    orderLevel: 5,
    itemCount: 46,
  },
  {
    id: "cat-6",
    name: "Kitchen & Dining",
    slug: "kitchen-dining",
    icon: "/assets/img/placeholder.jpg",
    banner: "/assets/img/placeholder-rect.jpg",
    featured: true,
    orderLevel: 6,
    itemCount: 75,
  },
  {
    id: "cat-7",
    name: "Household Appliances",
    slug: "household-appliances",
    icon: "/assets/img/placeholder.jpg",
    banner: "/assets/img/placeholder-rect.jpg",
    featured: false,
    orderLevel: 7,
    itemCount: 62,
  },
  {
    id: "cat-8",
    name: "Fitness & Outdoor",
    slug: "fitness-outdoor",
    icon: "/assets/img/placeholder.jpg",
    banner: "/assets/img/placeholder-rect.jpg",
    featured: false,
    orderLevel: 8,
    itemCount: 38,
  },
]

export const SEED_BRANDS: SeedBrand[] = [
  { id: "brand-1", name: "Apple", slug: "apple", logo: "/assets/img/placeholder.jpg", top: true, productCount: 34 },
  { id: "brand-2", name: "Nike", slug: "nike", logo: "/assets/img/placeholder.jpg", top: true, productCount: 52 },
  { id: "brand-3", name: "Adidas", slug: "adidas", logo: "/assets/img/placeholder.jpg", top: true, productCount: 41 },
  { id: "brand-4", name: "Xiaomi", slug: "xiaomi", logo: "/assets/img/placeholder.jpg", top: true, productCount: 29 },
  { id: "brand-5", name: "Samsung", slug: "samsung", logo: "/assets/img/placeholder.jpg", top: true, productCount: 47 },
  { id: "brand-6", name: "Sony", slug: "sony", logo: "/assets/img/placeholder.jpg", top: true, productCount: 23 },
  { id: "brand-7", name: "Philips", slug: "philips", logo: "/assets/img/placeholder.jpg", top: true, productCount: 18 },
  { id: "brand-8", name: "Dell", slug: "dell", logo: "/assets/img/placeholder.jpg", top: true, productCount: 16 },
  { id: "brand-9", name: "Denim", slug: "denim", logo: "/assets/img/placeholder.jpg", top: true, productCount: 31 },
]

export const SEED_PRODUCTS: SeedProduct[] = [
  {
    id: "prod-1",
    name: "Classic Men's Casual Shirt - Slim Fit 100% Pure Cotton",
    slug: "classic-mens-casual-shirt",
    sku: "SHIRT-CTN-001",
    categorySlug: "men-clothing-fashion",
    brandSlug: "nike",
    price: 1250,
    originalPrice: 1650,
    discountPercent: 24,
    rating: 4.8,
    reviewCount: 35,
    salesCount: 120,
    stock: 25,
    unit: "pc",
    thumbnail: "/assets/img/placeholder.jpg",
    images: ["/assets/img/placeholder.jpg", "/assets/img/placeholder-rect.jpg"],
    colors: [
      { name: "Navy Blue", hex: "#1e3a8a" },
      { name: "Pure White", hex: "#ffffff" },
      { name: "Crimson Red", hex: "#dc2626" },
      { name: "Charcoal Black", hex: "#1f2937" },
    ],
    sizes: ["M", "L", "XL", "XXL"],
    featured: true,
    todaysDeal: false,
    sellerName: "Active Fashion Outlet",
    sellerSlug: "active-fashion-outlet",
    description: "Crafted from 100% premium combed long-staple cotton, this slim-fit casual shirt offers breathable comfort throughout the day.",
    specifications: [
      { label: "Material", value: "100% Combed Cotton" },
      { label: "Fit Type", value: "Slim Fit" },
      { label: "Collar", value: "Spread Collar" },
      { label: "Care Instructions", value: "Machine Wash Warm" },
    ],
    reviews: [
      { id: "rev-1", userName: "Tanvir Ahmed", date: "2 days ago", rating: 5, comment: "Excellent fabric quality and perfect fitting." },
    ],
  },
  {
    id: "prod-2",
    name: "T800 Ultra Smartwatch with Bluetooth Calling & Heart Rate",
    slug: "t800-ultra-smartwatch",
    sku: "WATCH-T800-01",
    categorySlug: "smartphone-accessories",
    brandSlug: "apple",
    price: 999,
    originalPrice: 1999,
    discountPercent: 50,
    rating: 4.9,
    reviewCount: 48,
    salesCount: 310,
    stock: 45,
    unit: "pc",
    thumbnail: "/assets/img/placeholder.jpg",
    images: ["/assets/img/placeholder.jpg"],
    colors: [
      { name: "Orange", hex: "#ea580c" },
      { name: "Black", hex: "#111827" },
      { name: "Silver", hex: "#94a3b8" },
    ],
    sizes: ["49mm"],
    featured: true,
    todaysDeal: true,
    sellerName: "Gadget Hub BD",
    sellerSlug: "gadget-hub-bd",
    description: "Full touchscreen smart fitness watch with IP68 waterproof rating, heart rate, sleep monitor, and wireless magnetic charger.",
    specifications: [
      { label: "Display", value: "1.99 inch HD IPS Display" },
      { label: "Battery Life", value: "Up to 5 Days" },
      { label: "Water Resistance", value: "IP68" },
    ],
    reviews: [
      { id: "rev-2", userName: "Rashidul Islam", date: "1 week ago", rating: 5, comment: "Best value for money smartwatch!" },
    ],
  },
  {
    id: "prod-3",
    name: "M10 Wireless TWS Bluetooth Earbuds with Digital LED Display",
    slug: "m10-wireless-earbuds",
    sku: "AUDIO-M10-TWS",
    categorySlug: "smartphone-accessories",
    brandSlug: "xiaomi",
    price: 450,
    originalPrice: 900,
    discountPercent: 50,
    rating: 4.7,
    reviewCount: 82,
    salesCount: 450,
    stock: 80,
    unit: "pc",
    thumbnail: "/assets/img/placeholder.jpg",
    images: ["/assets/img/placeholder.jpg"],
    colors: [{ name: "Black", hex: "#111827" }],
    sizes: ["Standard"],
    featured: true,
    todaysDeal: true,
    sellerName: "Gadget Hub BD",
    sellerSlug: "gadget-hub-bd",
    description: "Bluetooth 5.1 true wireless earbuds with 2000mAh emergency powerbank charging case and clear stereo bass sound.",
    specifications: [
      { label: "Bluetooth", value: "5.1 Dual Mode" },
      { label: "Case Battery", value: "2000mAh Power Bank" },
      { label: "Playtime", value: "4-5 Hours per charge" },
    ],
    reviews: [],
  },
  {
    id: "prod-4",
    name: "Foldable Laptop Stand Aluminum Adjustable Height Cooling Holder",
    slug: "foldable-laptop-stand-aluminum",
    sku: "ACC-STAND-04",
    categorySlug: "computer-accessories",
    brandSlug: "samsung",
    price: 650,
    originalPrice: 1100,
    discountPercent: 41,
    rating: 4.9,
    reviewCount: 29,
    salesCount: 95,
    stock: 30,
    unit: "pc",
    thumbnail: "/assets/img/placeholder.jpg",
    images: ["/assets/img/placeholder.jpg"],
    colors: [{ name: "Silver", hex: "#94a3b8" }, { name: "Space Gray", hex: "#4b5563" }],
    sizes: ["Universal (10-17 inch)"],
    featured: false,
    todaysDeal: false,
    sellerName: "Inhouse Products",
    sellerSlug: "inhouse-products",
    description: "Sturdy aluminum alloy construction with anti-slip silicone pads and 6 height adjustment angles for ergonomic typing.",
    specifications: [
      { label: "Material", value: "Sandblasted Aluminum Alloy" },
      { label: "Angles", value: "6 Ergonomic Levels" },
    ],
    reviews: [],
  },
  {
    id: "prod-5",
    name: "Multi-Pocket Travel Backpack with USB Charging Port Waterproof",
    slug: "travel-backpack-usb-charging",
    sku: "BAG-TRV-05",
    categorySlug: "men-clothing-fashion",
    brandSlug: "nike",
    price: 1350,
    originalPrice: 2200,
    discountPercent: 39,
    rating: 4.6,
    reviewCount: 19,
    salesCount: 65,
    stock: 18,
    unit: "pc",
    thumbnail: "/assets/img/placeholder.jpg",
    images: ["/assets/img/placeholder.jpg"],
    colors: [{ name: "Black", hex: "#111827" }, { name: "Grey", hex: "#6b7280" }],
    sizes: ["35L Large"],
    featured: false,
    todaysDeal: false,
    sellerName: "Active Fashion Outlet",
    sellerSlug: "active-fashion-outlet",
    description: "Water-resistant Oxford fabric travel laptop bag with hidden anti-theft back pocket and external USB charge interface.",
    specifications: [
      { label: "Capacity", value: "35 Liters" },
      { label: "Laptop Sleeve", value: "Fits up to 15.6 inch" },
    ],
    reviews: [],
  },
  {
    id: "prod-6",
    name: "Mechanical Gaming Keyboard RGB Backlit with Blue Switches",
    slug: "mechanical-gaming-keyboard-rgb",
    sku: "KB-MECH-RGB-06",
    categorySlug: "computer-accessories",
    brandSlug: "sony",
    price: 2200,
    originalPrice: 2800,
    discountPercent: 21,
    rating: 4.8,
    reviewCount: 37,
    salesCount: 140,
    stock: 22,
    unit: "pc",
    thumbnail: "/assets/img/placeholder.jpg",
    images: ["/assets/img/placeholder.jpg"],
    colors: [{ name: "Black", hex: "#111827" }, { name: "White", hex: "#ffffff" }],
    sizes: ["104 Keys Full Layout"],
    featured: true,
    todaysDeal: false,
    sellerName: "Inhouse Products",
    sellerSlug: "inhouse-products",
    description: "Tactile clicky blue switches with customizable per-key RGB backlighting effects and braided gold-plated USB cable.",
    specifications: [
      { label: "Switch Type", value: "Outemu Blue Mechanical" },
      { label: "Keycaps", value: "Double-Shot Injection ABS" },
    ],
    reviews: [],
  },
  {
    id: "prod-7",
    name: "Philips Rice Cooker 0.6L Compact Non-Stick Inner Pot",
    slug: "philips-rice-cooker-06l",
    sku: "APP-RC-PHILIPS-07",
    categorySlug: "kitchen-dining",
    brandSlug: "philips",
    price: 3450,
    originalPrice: 4200,
    discountPercent: 18,
    rating: 4.8,
    reviewCount: 42,
    salesCount: 180,
    stock: 15,
    unit: "pc",
    thumbnail: "/assets/img/placeholder.jpg",
    images: ["/assets/img/placeholder.jpg"],
    colors: [{ name: "White", hex: "#ffffff" }],
    sizes: ["0.6L"],
    featured: true,
    todaysDeal: true,
    sellerName: "Home Essentials",
    sellerSlug: "home-essentials",
    description: "Automatic keep-warm function with durable 5-layer non-stick pot for fluffy rice and energy saving cooking.",
    specifications: [
      { label: "Power", value: "300W" },
      { label: "Capacity", value: "0.6 Liters (up to 3 persons)" },
    ],
    reviews: [],
  },
  {
    id: "prod-8",
    name: "Philips Mixer Grinder HL7555/00 600W with 3 Stainless Steel Jars",
    slug: "philips-mixer-grinder-hl755500",
    sku: "APP-MG-PHILIPS-08",
    categorySlug: "kitchen-dining",
    brandSlug: "philips",
    price: 4950,
    originalPrice: 5900,
    discountPercent: 16,
    rating: 4.7,
    reviewCount: 28,
    salesCount: 90,
    stock: 12,
    unit: "pc",
    thumbnail: "/assets/img/placeholder.jpg",
    images: ["/assets/img/placeholder.jpg"],
    colors: [{ name: "White/Lavender", hex: "#e0e7ff" }],
    sizes: ["3 Jars Set"],
    featured: false,
    todaysDeal: false,
    sellerName: "Home Essentials",
    sellerSlug: "home-essentials",
    description: "Powerful 600W copper motor with specialized blades for quick batter grinding, wet paste, and dry spices.",
    specifications: [
      { label: "Motor", value: "600 Watt Heavy Duty" },
      { label: "Jars", value: "1.5L Wet, 1L Multipurpose, 0.4L Chutney" },
    ],
    reviews: [],
  },
  {
    id: "prod-9",
    name: "AirPods Max Wireless Over-Ear Active Noise Cancelling Headphones",
    slug: "apple-airpods-max",
    sku: "AUDIO-APMAX-09",
    categorySlug: "smartphone-accessories",
    brandSlug: "apple",
    price: 68500,
    originalPrice: 75000,
    discountPercent: 9,
    rating: 4.9,
    reviewCount: 65,
    salesCount: 30,
    stock: 8,
    unit: "pc",
    thumbnail: "/assets/img/placeholder.jpg",
    images: ["/assets/img/placeholder.jpg"],
    colors: [
      { name: "Space Gray", hex: "#374151" },
      { name: "Silver", hex: "#e5e7eb" },
      { name: "Sky Blue", hex: "#38bdf8" },
    ],
    sizes: ["One Size"],
    featured: true,
    todaysDeal: false,
    sellerName: "Gadget Hub BD",
    sellerSlug: "gadget-hub-bd",
    description: "Apple-designed dynamic driver delivers high-fidelity audio with industry-leading Active Noise Cancellation and Transparency mode.",
    specifications: [
      { label: "Audio Technology", value: "Active Noise Cancellation + Spatial Audio" },
      { label: "Battery", value: "Up to 20 hours" },
    ],
    reviews: [],
  },
]

export const SEED_FLASH_DEALS = [
  {
    id: "fd-1",
    title: "Flash Sale 2026",
    slug: "flash-sale-2026",
    startDate: Date.now() - 86400000,
    endDate: Date.now() + 172800000,
    status: true,
    featured: true,
    banner: "/assets/img/placeholder-rect.jpg",
  },
]

export interface SeedShop {
  id: string
  name: string
  slug: string
  logo: string
  topBanner: string
  sliders: string[]
  address: string
  phone: string
  rating: number
  reviewCount: number
  followersCount: number
  verificationStatus: boolean
  memberSince: string
  facebook?: string
  instagram?: string
  twitter?: string
  youtube?: string
}

export const SEED_SHOPS: SeedShop[] = [
  {
    id: "shop-1",
    name: "Active Fashion Outlet",
    slug: "active-fashion-outlet",
    logo: "/assets/img/placeholder.jpg",
    topBanner: "/assets/img/placeholder-rect.jpg",
    sliders: ["/assets/img/placeholder-rect.jpg"],
    address: "Plot 12, Road 4, Sector 7, Uttara, Dhaka",
    phone: "+880 1711 000111",
    rating: 4.8,
    reviewCount: 142,
    followersCount: 520,
    verificationStatus: true,
    memberSince: "15 Jan 2023",
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    twitter: "https://x.com",
  },
  {
    id: "shop-2",
    name: "Gadget Hub BD",
    slug: "gadget-hub-bd",
    logo: "/assets/img/placeholder.jpg",
    topBanner: "/assets/img/placeholder-rect.jpg",
    sliders: ["/assets/img/placeholder-rect.jpg"],
    address: "Multiplan Centre, Level 5, Elephant Road, Dhaka",
    phone: "+880 1819 223344",
    rating: 4.9,
    reviewCount: 230,
    followersCount: 1250,
    verificationStatus: true,
    memberSince: "10 Feb 2022",
    facebook: "https://facebook.com",
    youtube: "https://youtube.com",
    twitter: "https://x.com",
  },
  {
    id: "shop-3",
    name: "Inhouse Products",
    slug: "inhouse-products",
    logo: "/assets/img/placeholder.jpg",
    topBanner: "/assets/img/placeholder-rect.jpg",
    sliders: ["/assets/img/placeholder-rect.jpg"],
    address: "Gulshan-1 Avenue, Dhaka-1212",
    phone: "+880 1912 345678",
    rating: 4.7,
    reviewCount: 98,
    followersCount: 890,
    verificationStatus: true,
    memberSince: "01 Dec 2021",
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
  },
  {
    id: "shop-4",
    name: "Home Essentials",
    slug: "home-essentials",
    logo: "/assets/img/placeholder.jpg",
    topBanner: "/assets/img/placeholder-rect.jpg",
    sliders: ["/assets/img/placeholder-rect.jpg"],
    address: "Mirpur 10 Circle, Dhaka",
    phone: "+880 1622 998877",
    rating: 4.6,
    reviewCount: 64,
    followersCount: 310,
    verificationStatus: false,
    memberSince: "20 Mar 2024",
    facebook: "https://facebook.com",
  },
]

export interface SeedCoupon {
  id: string
  code: string
  type: "cart_base" | "product_base"
  discount: number
  discountType: "percent" | "amount"
  minBuy: number
  maxDiscount: number
  startDate: number
  endDate: number
  status: boolean
  shopSlug?: string
}

export const SEED_COUPONS: SeedCoupon[] = [
  {
    id: "c-1",
    code: "SUMMER20",
    type: "cart_base",
    discount: 20,
    discountType: "percent",
    minBuy: 1000,
    maxDiscount: 500,
    startDate: Date.now() - 86400000 * 5,
    endDate: Date.now() + 86400000 * 30,
    status: true,
  },
  {
    id: "c-2",
    code: "HUIPPER100",
    type: "cart_base",
    discount: 100,
    discountType: "amount",
    minBuy: 1500,
    maxDiscount: 100,
    startDate: Date.now() - 86400000 * 10,
    endDate: Date.now() + 86400000 * 20,
    status: true,
  },
  {
    id: "c-3",
    code: "FASHION15",
    type: "cart_base",
    discount: 15,
    discountType: "percent",
    minBuy: 2000,
    maxDiscount: 600,
    startDate: Date.now() - 86400000 * 2,
    endDate: Date.now() + 86400000 * 15,
    status: true,
    shopSlug: "active-fashion-outlet",
  },
  {
    id: "c-4",
    code: "GADGET500",
    type: "cart_base",
    discount: 500,
    discountType: "amount",
    minBuy: 10000,
    maxDiscount: 500,
    startDate: Date.now() - 86400000 * 1,
    endDate: Date.now() + 86400000 * 45,
    status: true,
    shopSlug: "gadget-hub-bd",
  },
]

export interface SeedWalletTransaction {
  id: string
  date: string
  amount: number
  paymentMethod: string
  status: "approved" | "pending" | "recharged_by_admin"
}

export const SEED_WALLET_TRANSACTIONS: SeedWalletTransaction[] = [
  {
    id: "w-1",
    date: "2026-09-20",
    amount: 5000,
    paymentMethod: "bKash Online",
    status: "approved",
  },
  {
    id: "w-2",
    date: "2026-09-15",
    amount: 1200,
    paymentMethod: "Bank Transfer",
    status: "recharged_by_admin",
  },
  {
    id: "w-3",
    date: "2026-09-10",
    amount: 3000,
    paymentMethod: "Nagad",
    status: "approved",
  },
  {
    id: "w-4",
    date: "2026-09-02",
    amount: 2500,
    paymentMethod: "Offline Slip #1042",
    status: "pending",
  },
]

export interface SeedClubPoint {
  id: string
  orderCode: string
  points: number
  converted: boolean
  date: string
}

export const SEED_CLUB_POINTS: SeedClubPoint[] = [
  {
    id: "cp-1",
    orderCode: "20260920-101122",
    points: 85,
    converted: false,
    date: "2026-09-20",
  },
  {
    id: "cp-2",
    orderCode: "20260918-091433",
    points: 120,
    converted: false,
    date: "2026-09-18",
  },
  {
    id: "cp-3",
    orderCode: "20260905-081044",
    points: 200,
    converted: true,
    date: "2026-09-05",
  },
]

export interface SeedSupportTicket {
  id: string
  code: string
  subject: string
  details: string
  status: "pending" | "open" | "solved"
  date: string
  replies: {
    id: string
    senderName: string
    senderRole: "customer" | "support"
    message: string
    date: string
  }[]
}

export const SEED_SUPPORT_TICKETS: SeedSupportTicket[] = [
  {
    id: "t-1",
    code: "100234",
    subject: "Delivery delay for Order #20260920-101122",
    details: "I placed an order 3 days ago and the delivery status has not updated yet. Please assist.",
    status: "open",
    date: "2026-09-21 14:30",
    replies: [
      {
        id: "tr-1",
        senderName: "Customer Support",
        senderRole: "support",
        message: "Hello! We apologize for the delay. The rider picked up your parcel today and it is out for delivery.",
        date: "2026-09-21 16:45",
      },
    ],
  },
  {
    id: "t-2",
    code: "100189",
    subject: "Inquiry regarding return policy on electronics",
    details: "Can I replace an earphone if the left earbud stops working within 7 days?",
    status: "solved",
    date: "2026-09-15 10:15",
    replies: [
      {
        id: "tr-2",
        senderName: "Technical Desk",
        senderRole: "support",
        message: "Yes! All electronic accessories have a 7-day hassle-free replacement warranty.",
        date: "2026-09-15 11:00",
      },
    ],
  },
]

export interface SeedBlogCategory {
  id: string
  name: string
  slug: string
}

export interface SeedBlog {
  id: string
  title: string
  slug: string
  shortDescription: string
  description: string
  categoryName: string
  categorySlug: string
  banner: string
  date: string
  author: string
}

export const SEED_BLOG_CATEGORIES: SeedBlogCategory[] = [
  { id: "bc-1", name: "Fashion & Trends", slug: "fashion-trends" },
  { id: "bc-2", name: "Technology & Gadgets", slug: "technology-gadgets" },
  { id: "bc-3", name: "Lifestyle & Living", slug: "lifestyle-living" },
  { id: "bc-4", name: "Shopping Tips", slug: "shopping-tips" },
]

export const SEED_BLOGS: SeedBlog[] = [
  {
    id: "b-1",
    title: "10 Essential Gadgets Every Remote Worker Needs in 2026",
    slug: "10-essential-gadgets-remote-worker-2026",
    shortDescription: "Discover the top productivity boosters and smart desktop accessories to elevate your daily home office experience.",
    description: "Working remotely has become the standard for modern professionals. Having the right tools and ergonomic peripherals not only enhances your daily workflow efficiency but also protects your physical well-being. From active noise-cancelling headphones to wireless charging stations and ultrawide monitors, here is our ultimate gear checklist for 2026.",
    categoryName: "Technology & Gadgets",
    categorySlug: "technology-gadgets",
    banner: "/assets/img/placeholder-rect.jpg",
    date: "18 Sep 2026",
    author: "Editorial Team",
  },
  {
    id: "b-2",
    title: "The Ultimate Guide to Seasonal Fashion & Sustainable Fabrics",
    slug: "ultimate-guide-seasonal-fashion-sustainable-fabrics",
    shortDescription: "Explore eco-friendly wardrobe staples, organic cotton blends, and modern minimalist outfit styling.",
    description: "Sustainable fashion is more than a trend—it's a conscious choice towards enduring quality. In this article, our stylists break down the essential pieces you need for versatile seasonal layering, breathable pure cottons, and timeless colors that never go out of style.",
    categoryName: "Fashion & Trends",
    categorySlug: "fashion-trends",
    banner: "/assets/img/placeholder-rect.jpg",
    date: "12 Sep 2026",
    author: "Fashion Editor",
  },
  {
    id: "b-3",
    title: "How to Maximize Your Savings During Flash Sales and Festival Promos",
    slug: "how-to-maximize-savings-flash-sales",
    shortDescription: "Smart coupon stacking tricks, wallet cashbacks, and early-bird checkout tips to get the highest discounts.",
    description: "Online flash sales offer incredible price drops, but items go out of stock in minutes. Learn the best strategies: setting wishlist alerts, pre-filling shipping addresses, combining store vouchers with bank payment discounts, and collecting club points for extra savings.",
    categoryName: "Shopping Tips",
    categorySlug: "shopping-tips",
    banner: "/assets/img/placeholder-rect.jpg",
    date: "05 Sep 2026",
    author: "Smart Shopper",
  },
]


