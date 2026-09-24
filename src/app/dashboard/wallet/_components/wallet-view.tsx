"use client"

import { useState } from "react"
import { Wallet, Plus, Building2, CheckCircle, Clock, X } from "lucide-react"
import { SeedWalletTransaction } from "@/db/seed/data"
import { rechargeWalletAction } from "@/app/actions/ecommerce-actions"

interface WalletViewProps {
  initialBalance: number
  initialHistory: SeedWalletTransaction[]
}

export function WalletView({ initialBalance, initialHistory }: WalletViewProps) {
  const [balance, setBalance] = useState(initialBalance)
  const [history, setHistory] = useState(initialHistory)
  const [modalType, setModalType] = useState<"online" | "offline" | null>(null)

  // Form states
  const [amount, setAmount] = useState<number | "">("")
  const [paymentMethod, setPaymentMethod] = useState("bKash Online")
  const [offlineMethod, setOfflineMethod] = useState("bKash Manual")
  const [senderNumber, setSenderNumber] = useState("")
  const [txnId, setTxnId] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleRecharge = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || Number(amount) <= 0) return

    setSubmitting(true)
    const isOffline = modalType === "offline"
    const chosenMethod = isOffline ? offlineMethod : paymentMethod
    const details = isOffline
      ? `Sender: ${senderNumber} | TrxID: ${txnId}`
      : undefined

    const res = await rechargeWalletAction({
      amount: Number(amount),
      paymentMethod: isOffline ? `${offlineMethod} (Trx: ${txnId})` : paymentMethod,
      paymentDetails: details,
      offlinePayment: isOffline,
    })

    const newTxn: SeedWalletTransaction = {
      id: `w-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      amount: Number(amount),
      paymentMethod: isOffline ? `${offlineMethod} (Trx: ${txnId})` : paymentMethod,
      status: isOffline ? "pending" : "approved",
    }

    setHistory([newTxn, ...history])
    if (!isOffline) {
      setBalance(res.newBalance)
    }

    setSubmitting(false)
    setModalType(null)
    setAmount("")
    setSenderNumber("")
    setTxnId("")
  }

  return (
    <div className="space-y-6">
      {/* Titlebar */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">My Wallet</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          View your balance, recharge credits, and track deposit transactions.
        </p>
      </div>

      {/* Cards Row: Balance, Online Recharge, Offline Recharge */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Wallet Balance Card */}
        <div className="bg-[#1f2937] text-white rounded-lg p-6 flex flex-col items-center justify-center text-center shadow-xs">
          <div className="size-12 rounded-full bg-white/10 flex items-center justify-center mb-3 text-amber-400">
            <Wallet className="size-6" />
          </div>
          <span className="text-xs uppercase font-medium text-gray-300 tracking-wider">
            Wallet Balance
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            ৳{balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>

        {/* Online Recharge Card */}
        <button
          onClick={() => setModalType("online")}
          className="bg-white border border-gray-200 hover:border-primary/50 hover:bg-gray-50/50 rounded-lg p-6 flex flex-col items-center justify-center text-center transition-all cursor-pointer group shadow-xs"
        >
          <div className="size-12 rounded-full bg-[#1f2937] group-hover:bg-primary text-white flex items-center justify-center mb-3 transition-colors">
            <Plus className="size-6" />
          </div>
          <span className="text-sm font-bold text-gray-800 group-hover:text-primary transition-colors">
            Recharge Wallet
          </span>
          <span className="text-[11px] text-gray-400 mt-1">Instant via bKash, Nagad, Card</span>
        </button>

        {/* Offline Recharge Card */}
        <button
          onClick={() => setModalType("offline")}
          className="bg-white border border-gray-200 hover:border-primary/50 hover:bg-gray-50/50 rounded-lg p-6 flex flex-col items-center justify-center text-center transition-all cursor-pointer group shadow-xs"
        >
          <div className="size-12 rounded-full bg-[#1f2937] group-hover:bg-primary text-white flex items-center justify-center mb-3 transition-colors">
            <Building2 className="size-6" />
          </div>
          <span className="text-sm font-bold text-gray-800 group-hover:text-primary transition-colors">
            Offline Recharge Wallet
          </span>
          <span className="text-[11px] text-gray-400 mt-1">Manual bank deposit / receipt</span>
        </button>
      </div>

      {/* Wallet Recharge History Table */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-xs overflow-hidden">
        <div className="p-4 sm:px-6 border-b border-gray-200">
          <h2 className="text-sm sm:text-base font-bold text-gray-900">Wallet Recharge History</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/50 text-[11px] uppercase tracking-wider text-gray-500 font-semibold">
                <th className="py-3 px-4 sm:px-6">#</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4 sm:px-6 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {history.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-400">
                    No recharge records found.
                  </td>
                </tr>
              ) : (
                history.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3.5 px-4 sm:px-6 font-semibold text-gray-400">
                      {String(idx + 1).padStart(2, "0")}
                    </td>
                    <td className="py-3.5 px-4 text-gray-700">{item.date}</td>
                    <td className="py-3.5 px-4 font-bold text-gray-900">
                      ৳{item.amount.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-gray-600">{item.paymentMethod}</td>
                    <td className="py-3.5 px-4 sm:px-6 text-right">
                      {item.status === "approved" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-green-100 text-green-700">
                          <CheckCircle className="size-3" />
                          <span>Approved</span>
                        </span>
                      )}
                      {item.status === "pending" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-700">
                          <Clock className="size-3" />
                          <span>Pending</span>
                        </span>
                      )}
                      {item.status === "recharged_by_admin" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-700">
                          <CheckCircle className="size-3" />
                          <span>Recharged By Admin</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recharge Modal */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-sm">
                {modalType === "online" ? "Recharge Wallet (Instant)" : "Offline Wallet Recharge"}
              </h3>
              <button
                onClick={() => setModalType(null)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleRecharge} className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Amount (৳) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="50"
                  step="50"
                  required
                  placeholder="e.g. 1000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : "")}
                  className="w-full text-xs border border-gray-200 rounded p-2.5 focus:border-primary focus:outline-none"
                />
              </div>

              {modalType === "online" ? (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Select Gateway
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full text-xs border border-gray-200 rounded p-2.5 focus:border-primary focus:outline-none bg-white"
                  >
                    <option value="bKash Online">bKash Online Payment</option>
                    <option value="Nagad">Nagad Instant</option>
                    <option value="Credit / Debit Card">Credit / Debit Card (Visa, MC)</option>
                  </select>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Select Offline Payment Channel <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={offlineMethod}
                      onChange={(e) => setOfflineMethod(e.target.value)}
                      className="w-full text-xs border border-gray-200 rounded p-2.5 focus:border-primary focus:outline-none bg-white"
                    >
                      <option value="bKash Manual (Send Money)">bKash Manual (Send Money)</option>
                      <option value="Nagad Manual (Cash Out)">Nagad Manual (Send Money / Cash Out)</option>
                      <option value="Bank Wire / Deposit">Bank Wire (DBBL / City Bank)</option>
                    </select>
                  </div>

                  {offlineMethod.includes("bKash") && (
                    <div className="bg-rose-50 border border-rose-200 p-3 rounded text-[11px] text-rose-900 space-y-1">
                      <p className="font-semibold text-rose-800">bKash Account Instructions:</p>
                      <p>Send Money to Personal No: <span className="font-bold text-gray-900">01711-223344</span></p>
                      <p className="text-[10px] text-gray-500">Please enter your bKash sender number and the TrxID received via SMS below.</p>
                    </div>
                  )}

                  {offlineMethod.includes("Nagad") && (
                    <div className="bg-amber-50 border border-amber-200 p-3 rounded text-[11px] text-amber-900 space-y-1">
                      <p className="font-semibold text-amber-800">Nagad Account Instructions:</p>
                      <p>Send Money to Personal No: <span className="font-bold text-gray-900">01812-998877</span></p>
                      <p className="text-[10px] text-gray-500">Please enter your Nagad sender number and the TrxID received via SMS below.</p>
                    </div>
                  )}

                  {offlineMethod.includes("Bank") && (
                    <div className="bg-gray-50 border border-gray-200 p-3 rounded text-[11px] text-gray-600 space-y-1">
                      <p className="font-semibold text-gray-800">Bank Wire / Deposit Details:</p>
                      <p>Bank: <span className="font-medium text-gray-900">Dutch Bangla Bank Ltd (Uttara Branch)</span></p>
                      <p>Account Name: <span className="font-medium text-gray-900">Active eCommerce CMS Ltd</span></p>
                      <p>Account No: <span className="font-bold text-gray-900">115.120.987654</span></p>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Sender Phone / Account No <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 01711-XXXXXX or Account No"
                      value={senderNumber}
                      onChange={(e) => setSenderNumber(e.target.value)}
                      className="w-full text-xs border border-gray-200 rounded p-2.5 focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Transaction ID (TrxID) / Deposit Slip No <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. BKH982310 or DBBL-SLIP-4820"
                      value={txnId}
                      onChange={(e) => setTxnId(e.target.value)}
                      className="w-full text-xs border border-gray-200 rounded p-2.5 focus:border-primary focus:outline-none"
                    />
                  </div>
                </>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="px-4 py-2 rounded text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded text-xs font-bold bg-primary hover:bg-primary/90 text-white shadow-xs disabled:opacity-50"
                >
                  {submitting ? "Processing..." : "Confirm Recharge"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
