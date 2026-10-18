"use client"

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react"

export interface LanguageItem {
  id: number
  name: string
  code: string
  appLangCode?: string | null
  rtl: boolean
  status?: boolean
  isDefault?: boolean
  flag?: string
}

export const DEFAULT_LANGUAGES: LanguageItem[] = [
  {
    id: 1,
    name: "English",
    code: "en",
    appLangCode: "en",
    rtl: false,
    flag: "/assets/img/flags/en.png",
  },
  {
    id: 2,
    name: "Bangla",
    code: "bn",
    appLangCode: "bn",
    rtl: false,
    flag: "/assets/img/flags/bd.png",
  },
  {
    id: 3,
    name: "Arabic",
    code: "ar",
    appLangCode: "ar",
    rtl: true,
    flag: "/assets/img/flags/sa.png",
  },
]

// Self-contained translation dictionaries for client-side execution
export const EXTENDED_TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    "All Products": "All Products",
    "Add to Cart": "Add to Cart",
    "Buy Now": "Buy Now",
    "Dashboard": "Dashboard",
    "Cart": "Cart",
    "Checkout": "Checkout",
    "Track Order": "Track Order",
    "Wishlist": "Wishlist",
    "Compare": "Compare",
    "Flash Deals": "Flash Deals",
    "Categories": "Categories",
    "Brands": "Brands",
    "Today's Deal": "Today's Deal",
    "Subtotal": "Subtotal",
    "Shipping": "Shipping",
    "Tax": "Tax",
    "Total": "Total",
    "Apply Coupon": "Apply Coupon",
    "Login": "Login",
    "Register": "Register",
    "Logout": "Logout",
    "Order Confirmed": "Order Confirmed",
    "Continue Shopping": "Continue Shopping",
    "Customer Support": "Customer Support",
    "In-House Products": "In-House Products",
    "Become a Seller !": "Become a Seller !",
    "Login to Seller": "Login to Seller",
    "Apply Now": "Apply Now",
    "Helpline:": "Helpline:",
    "I am shopping for...": "I am shopping for...",
    "Search in active eCommerce...": "Search in active eCommerce...",
    "Home": "Home",
    "All Categories": "All Categories",
    "All Brands": "All Brands",
    "All Sellers": "All Sellers",
    "Coupons": "Coupons",
    "Blogs": "Blogs",
    "Shopping Cart": "Shopping Cart",
    "View Cart": "View Cart",
    "Your Cart is Empty": "Your Cart is Empty",
    "Unit Price": "Unit Price",
    "Quantity": "Quantity",
    "Price": "Price",
    "Welcome,": "Welcome,",
    "Login / Register": "Login / Register",
    "My Account": "My Account",
    "Purchase History": "Purchase History",
    "Sent Refund Request": "Sent Refund Request",
    "Notifications": "Notifications",
    "Classified Ads": "Classified Ads",
  },
  bn: {
    "All Products": "সব পণ্য",
    "Add to Cart": "কার্টে যোগ করুন",
    "Buy Now": "এখনই কিনুন",
    "Dashboard": "ড্যাশবোর্ড",
    "Cart": "কার্ট",
    "Checkout": "চেকআউট",
    "Track Order": "অর্ডার ট্র্যাক করুন",
    "Wishlist": "পছন্দের তালিকা",
    "Compare": "তুলনা",
    "Flash Deals": "ফ্ল্যাশ ডিল",
    "Categories": "ক্যাটাগরি সমূহ",
    "Brands": "ব্র্যান্ড সমূহ",
    "Today's Deal": "আজকের সেরা অফার",
    "Subtotal": "উপমোট",
    "Shipping": "শিপিং খরচ",
    "Tax": "ভ্যাট/ট্যাক্স",
    "Total": "সর্বমোট",
    "Apply Coupon": "কুপন প্রয়োগ করুন",
    "Login": "লগইন",
    "Register": "নিবন্ধন করুন",
    "Logout": "লগআউট",
    "Order Confirmed": "অর্ডার নিশ্চিত হয়েছে",
    "Continue Shopping": "কেনাকাটা চালিয়ে যান",
    "Customer Support": "গ্রাহক সেবা",
    "In-House Products": "ইন-হাউস পণ্য",
    "Become a Seller !": "সেলার হোন !",
    "Login to Seller": "সেলার লগইন",
    "Apply Now": "আবেদন করুন",
    "Helpline:": "হেল্পলাইন:",
    "I am shopping for...": "আমি খুঁজছি...",
    "Search in active eCommerce...": "এক্টিভ ই-কমার্সে খুঁজুন...",
    "Home": "হোম",
    "All Categories": "সব ক্যাটাগরি",
    "All Brands": "সব ব্র্যান্ড",
    "All Sellers": "সব বিক্রেতা",
    "Coupons": "কুপন",
    "Blogs": "ব্লগ",
    "Shopping Cart": "শপিং কার্ট",
    "View Cart": "কার্ট দেখুন",
    "Your Cart is Empty": "আপনার কার্ট খালি",
    "Unit Price": "একক মূল্য",
    "Quantity": "পরিমাণ",
    "Price": "মূল্য",
    "Welcome,": "স্বাগতম,",
    "Login / Register": "লগইন / নিবন্ধন",
    "My Account": "আমার অ্যাকাউন্ট",
    "Purchase History": "ক্রয় ইতিহাস",
    "Sent Refund Request": "রিফান্ড অনুরোধ",
    "Notifications": "বিজ্ঞপ্তি",
    "Classified Ads": "শ্রেণীবদ্ধ বিজ্ঞাপন",
  },
  ar: {
    "All Products": "جميع المنتجات",
    "Add to Cart": "أضف إلى السلة",
    "Buy Now": "اشتري الآن",
    "Dashboard": "لوحة التحكم",
    "Cart": "سلة التسوق",
    "Checkout": "الدفع",
    "Track Order": "تتبع الطلب",
    "Wishlist": "المفضلة",
    "Compare": "المقارنة",
    "Flash Deals": "عروض مذهلة",
    "Categories": "التصنيفات",
    "Brands": "العلامات التجارية",
    "Today's Deal": "صفقة اليوم",
    "Subtotal": "المجموع الفرعي",
    "Shipping": "الشحن",
    "Tax": "الضريبة",
    "Total": "الإجمالي",
    "Apply Coupon": "تطبيق القسيمة",
    "Login": "تسجيل الدخول",
    "Register": "إنشاء حساب",
    "Logout": "تسجيل الخروج",
    "Order Confirmed": "تم تأكيد الطلب",
    "Continue Shopping": "مواصلة التسوق",
    "Customer Support": "خدمة العملاء",
    "In-House Products": "منتجات المتجر",
    "Become a Seller !": "كن بائعاً !",
    "Login to Seller": "تسجيل دخول البائع",
    "Apply Now": "قدم الآن",
    "Helpline:": "خط المساعدة:",
    "I am shopping for...": "أنا أبحث عن...",
    "Search in active eCommerce...": "البحث في المتجر...",
    "Home": "الرئيسية",
    "All Categories": "جميع التصنيفات",
    "All Brands": "جميع العلامات",
    "All Sellers": "جميع البائعين",
    "Coupons": "القسائم",
    "Blogs": "المدونات",
    "Shopping Cart": "سلة التسوق",
    "View Cart": "عرض السلة",
    "Your Cart is Empty": "سلتك فارغة",
    "Unit Price": "سعر الوحدة",
    "Quantity": "الكمية",
    "Price": "السعر",
    "Welcome,": "مرحباً،",
    "Login / Register": "تسجيل الدخول / إنشاء حساب",
    "My Account": "حسابي",
    "Purchase History": "سجل المشتريات",
    "Sent Refund Request": "طلب استرداد",
    "Notifications": "الإشعارات",
    "Classified Ads": "الإعلانات المبوبة",
  },
}

interface LanguageContextType {
  currentLanguage: LanguageItem
  languages: LanguageItem[]
  setLanguage: (code: string) => void
  t: (key: string, fallback?: string) => string
  isRTL: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const STORAGE_KEY = "active_ecom_language"

export function LanguageProvider({
  children,
  initialLanguages = DEFAULT_LANGUAGES,
  initialDefaultCode,
  customTranslations,
}: {
  children: React.ReactNode
  initialLanguages?: LanguageItem[]
  initialDefaultCode?: string
  customTranslations?: Record<string, Record<string, string>>
}) {
  const [languages, setLanguages] = useState<LanguageItem[]>(initialLanguages)
  const defaultLang = useMemo(() => {
    if (initialDefaultCode) {
      const byCode = initialLanguages.find(
        (l) => l.code === initialDefaultCode || l.appLangCode === initialDefaultCode
      )
      if (byCode) return byCode
    }
    return (
      initialLanguages.find((l) => l.isDefault) ||
      initialLanguages[0] ||
      DEFAULT_LANGUAGES[0]
    )
  }, [initialLanguages, initialDefaultCode])

  const [currentLanguage, setCurrentLanguage] = useState<LanguageItem>(defaultLang)
  const isHydrated = React.useRef(false)

  // Sync languages and default when admin updates them
  useEffect(() => {
    if (initialLanguages && initialLanguages.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLanguages(initialLanguages)
      setCurrentLanguage((prev) => {
        const found = initialLanguages.find(
          (l) => l.code === prev.code || l.appLangCode === prev.code
        )
        return found || defaultLang
      })
    }
  }, [initialLanguages, defaultLang])

  // Merge custom translations dynamically from admin DB
  const mergedTranslations = useMemo(() => {
    const combined: Record<string, Record<string, string>> = {}
    for (const [lang, map] of Object.entries(EXTENDED_TRANSLATIONS)) {
      combined[lang] = { ...map }
    }
    if (customTranslations) {
      for (const [lang, map] of Object.entries(customTranslations)) {
        if (!combined[lang]) combined[lang] = {}
        Object.assign(combined[lang], map)
      }
    }
    return combined
  }, [customTranslations])

  // Initialize from localStorage after hydration
  useEffect(() => {
    try {
      const storedCode = localStorage.getItem(STORAGE_KEY)
      if (storedCode) {
        const normalized = storedCode === "bd" ? "bn" : storedCode
        const found = languages.find(
          (l) => l.code === normalized || l.appLangCode === normalized
        )
        if (found) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setCurrentLanguage(found)
        }
      }
    } catch {
      // ignore
    }
    isHydrated.current = true
  }, [languages])

  // Sync document attributes when language changes
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = currentLanguage.code
      document.documentElement.dir = currentLanguage.rtl ? "rtl" : "ltr"
    }
  }, [currentLanguage])

  const setLanguage = useCallback(
    (code: string) => {
      const normalized = code === "bd" ? "bn" : code
      const found = languages.find(
        (l) => l.code === normalized || l.appLangCode === normalized
      )
      if (found) {
        setCurrentLanguage(found)
        try {
          localStorage.setItem(STORAGE_KEY, found.code)
        } catch {
          // ignore
        }
      }
    },
    [languages]
  )

  const t = useCallback(
    (key: string, fallback?: string): string => {
      const dict = mergedTranslations[currentLanguage.code]
      if (dict && dict[key]) {
        return dict[key]
      }
      return fallback !== undefined ? fallback : key
    },
    [currentLanguage.code, mergedTranslations]
  )

  const contextValue = useMemo<LanguageContextType>(
    () => ({
      currentLanguage,
      languages,
      setLanguage,
      t,
      isRTL: Boolean(currentLanguage.rtl),
    }),
    [currentLanguage, languages, setLanguage, t]
  )

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext)
  if (!context) {
    const defaultLang = DEFAULT_LANGUAGES[0]
    return {
      currentLanguage: defaultLang,
      languages: DEFAULT_LANGUAGES,
      setLanguage: () => {},
      t: (key: string, fallback?: string) => (fallback !== undefined ? fallback : key),
      isRTL: false,
    }
  }
  return context
}

export function useTranslation() {
  const { t, currentLanguage, isRTL } = useLanguage()
  return { t, currentLanguage, isRTL }
}
