export { cn } from "cn"

export interface FormatPriceOptions {
  symbol?: string
  exchangeRate?: number
  symbolPosition?: "first" | "last"
  decimals?: number
}

export function formatPrice(amount: number, options?: FormatPriceOptions): string {
  const num = Number(amount || 0)
  const rate = options?.exchangeRate && options.exchangeRate > 0 ? options.exchangeRate : 1
  const symbol = options?.symbol !== undefined ? options.symbol : "৳"
  const decimals = options?.decimals !== undefined ? options.decimals : symbol === "৳" ? 0 : 2
  const converted = num / rate

  const formatted = converted.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })

  if (options?.symbolPosition === "last") {
    return `${formatted} ${symbol}`
  }
  return `${symbol}${formatted}`
}
