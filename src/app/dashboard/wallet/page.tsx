import { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerSession } from "@/lib/auth/session-helper"
import { getWalletBalance, getWalletHistory } from "@/services/wallet-service"
import { WalletView } from "./_components/wallet-view"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "My Wallet | Active eCommerce CMS",
  description: "Customer wallet balance and recharge transactions.",
}

export default async function WalletPage() {
  const session = await getServerSession()
  if (!session?.user?.id) {
    redirect("/login")
  }

  const [balance, history] = await Promise.all([
    getWalletBalance(session.user.id),
    getWalletHistory(session.user.id),
  ])

  return <WalletView initialBalance={balance} initialHistory={history} />
}
