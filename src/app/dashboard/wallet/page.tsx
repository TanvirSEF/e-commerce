import { Metadata } from "next"
import { getWalletBalance, getWalletHistory } from "@/services/wallet-service"
import { WalletView } from "./_components/wallet-view"

export const metadata: Metadata = {
  title: "My Wallet | Active eCommerce CMS",
  description: "Customer wallet balance and recharge transactions.",
}

export default async function WalletPage() {
  const [balance, history] = await Promise.all([
    getWalletBalance(),
    getWalletHistory(),
  ])

  return <WalletView initialBalance={balance} initialHistory={history} />
}
