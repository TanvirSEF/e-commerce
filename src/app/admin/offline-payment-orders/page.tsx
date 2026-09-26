import { redirect } from "next/navigation"

export default function AdminOfflinePaymentOrdersRedirect() {
  redirect("/admin/orders/offline-payments")
}
