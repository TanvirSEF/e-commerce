export { cn } from "cn"

export function formatPrice(amount: number): string {
  return `৳${Number(amount || 0).toLocaleString("en-BD", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}
