"use client"

import { useState } from "react"
import { Award, ArrowRightLeft, CheckCircle, Clock, X, Info } from "lucide-react"
import { SeedClubPoint } from "@/db/seed/data"
import { convertClubPointsAction } from "@/app/actions/ecommerce-actions"

interface ClubPointsViewProps {
  initialTotalPoints: number
  convertRate: number
  initialHistory: SeedClubPoint[]
}

export function ClubPointsView({
  initialTotalPoints,
  convertRate,
  initialHistory,
}: ClubPointsViewProps) {
  const [totalPoints, setTotalPoints] = useState(initialTotalPoints)
  const [history, setHistory] = useState(initialHistory)
  const [showModal, setShowModal] = useState(false)
  const [pointsToConvert, setPointsToConvert] = useState<number | "">("")
  const [submitting, setSubmitting] = useState(false)

  // 100 points = 10 BDT (0.1 BDT per point)
  const calculatedBDT = typeof pointsToConvert === "number" ? Math.floor(pointsToConvert * (convertRate / 100)) : 0

  const handleConvert = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!pointsToConvert || Number(pointsToConvert) <= 0 || Number(pointsToConvert) > totalPoints) {
      return
    }

    setSubmitting(true)
    const pts = Number(pointsToConvert)
    await convertClubPointsAction("usr_customer_default_01", pts)

    setTotalPoints((prev) => Math.max(0, prev - pts))
    setHistory((prev) =>
      prev.map((item, idx) => (idx === 0 ? { ...item, converted: true } : item))
    )
    setSubmitting(false)
    setShowModal(false)
    setPointsToConvert("")
    alert(`Successfully converted ${pts} Points into ৳${calculatedBDT} Wallet Balance!`)
  }

  return (
    <div className="space-y-6">
      {/* Titlebar */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Earning Club Points</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Earn points when purchasing items and convert them directly into your wallet balance.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Points Card */}
        <div className="bg-[#1f2937] text-white rounded-lg p-6 flex flex-col items-center justify-center text-center shadow-xs">
          <div className="size-12 rounded-full bg-white/10 flex items-center justify-center mb-3 text-amber-400">
            <Award className="size-6" />
          </div>
          <span className="text-xs uppercase font-medium text-gray-300 tracking-wider">
            Available Points
          </span>
          <span className="text-3xl font-extrabold text-white mt-1">
            {totalPoints.toLocaleString()} <span className="text-sm font-normal text-amber-400">pts</span>
          </span>
        </div>

        {/* Convert Action Card */}
        <button
          onClick={() => setShowModal(true)}
          disabled={totalPoints < 100}
          className="bg-white border border-gray-200 hover:border-primary/50 hover:bg-gray-50/50 rounded-lg p-6 flex flex-col items-center justify-center text-center transition-all cursor-pointer group shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="size-12 rounded-full bg-[#1f2937] group-hover:bg-primary text-white flex items-center justify-center mb-3 transition-colors">
            <ArrowRightLeft className="size-6" />
          </div>
          <span className="text-sm font-bold text-gray-800 group-hover:text-primary transition-colors">
            Convert Point To Wallet
          </span>
          <span className="text-[11px] text-gray-400 mt-1">
            {totalPoints < 100 ? "Minimum 100 points needed" : "Instant wallet credit"}
          </span>
        </button>

        {/* Rate Info Card */}
        <div className="bg-amber-50/80 border border-amber-200 rounded-lg p-6 flex flex-col justify-center shadow-xs">
          <div className="flex items-center gap-2 text-amber-800 mb-2">
            <Info className="size-4 shrink-0" />
            <h3 className="font-bold text-xs uppercase tracking-wider">Conversion Rule</h3>
          </div>
          <p className="text-xs text-amber-900 leading-relaxed">
            Exchange Rate: <strong className="font-bold">100 Points = ৳{convertRate}.00</strong>
          </p>
          <p className="text-[11px] text-amber-700/80 mt-1">
            Converted balance is added directly to your wallet and can be spent on any checkout order.
          </p>
        </div>
      </div>

      {/* Points History Table */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-xs overflow-hidden">
        <div className="p-4 sm:px-6 border-b border-gray-200">
          <h2 className="text-sm sm:text-base font-bold text-gray-900">Point Earning History</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/50 text-[11px] uppercase tracking-wider text-gray-500 font-semibold">
                <th className="py-3 px-4 sm:px-6">#</th>
                <th className="py-3 px-4">Order Code</th>
                <th className="py-3 px-4">Points Earned</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 sm:px-6 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {history.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-400">
                    No club points earned yet.
                  </td>
                </tr>
              ) : (
                history.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3.5 px-4 sm:px-6 font-semibold text-gray-400">
                      {String(idx + 1).padStart(2, "0")}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-primary">
                      #{item.orderCode}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-gray-900">
                      +{item.points} pts
                    </td>
                    <td className="py-3.5 px-4 text-gray-600">{item.date}</td>
                    <td className="py-3.5 px-4 sm:px-6 text-right">
                      {item.converted ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-600">
                          <CheckCircle className="size-3 text-green-600" />
                          <span>Converted</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-700">
                          <Clock className="size-3" />
                          <span>Available</span>
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

      {/* Convert Points Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-sm">Convert Points To Wallet</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleConvert} className="p-4 sm:p-6 space-y-4">
              <div>
                <div className="flex justify-between items-center text-xs font-semibold text-gray-700 mb-1">
                  <span>Enter Points to Convert</span>
                  <span className="text-gray-500 font-normal">Available: {totalPoints} pts</span>
                </div>
                <input
                  type="number"
                  min="100"
                  max={totalPoints}
                  step="10"
                  required
                  placeholder="e.g. 100"
                  value={pointsToConvert}
                  onChange={(e) => setPointsToConvert(e.target.value ? Number(e.target.value) : "")}
                  className="w-full text-xs border border-gray-200 rounded p-2.5 focus:border-primary focus:outline-none"
                />
              </div>

              {/* Conversion Calculator Preview */}
              <div className="bg-gray-50 border border-gray-200 rounded p-3 text-xs flex items-center justify-between">
                <span className="text-gray-600">Wallet Credit Amount:</span>
                <span className="font-bold text-base text-green-600">৳{calculatedBDT.toFixed(2)}</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !pointsToConvert || Number(pointsToConvert) > totalPoints}
                  className="px-5 py-2 rounded text-xs font-bold bg-primary hover:bg-primary/90 text-white shadow-xs disabled:opacity-50"
                >
                  {submitting ? "Converting..." : "Confirm Conversion"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
