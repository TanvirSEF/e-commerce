export const siteConfig = {
  name: process.env.NEXT_PUBLIC_APP_NAME || "Active eCommerce",
  description: "Active eCommerce CMS 1:1 Pixel-Perfect Migration",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  motto: process.env.NEXT_PUBLIC_SITE_MOTTO || "Complete Shopping Solution",
  currency: {
    symbol: process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "৳",
    code: process.env.NEXT_PUBLIC_CURRENCY_CODE || "BDT",
  },
  helpline: process.env.NEXT_PUBLIC_HELPLINE || "+880 1700-000000",
  email: "support@huipper.com",
}
