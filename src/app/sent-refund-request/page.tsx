import { redirect } from "next/navigation"

export default function SentRefundRequestRedirect() {
  redirect("/dashboard/refund-requests")
}
