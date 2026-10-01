"use client"

import React, { useState, useTransition } from "react"
import { approveWalletRechargeAction } from "@/app/actions/wallet-admin-actions"

interface Props {
  id: number
  approval: boolean
}

export function WalletApprovalSwitch({ id, approval: initialApproval }: Props) {
  const [approval, setApproval] = useState(initialApproval)
  const [isPending, startTransition] = useTransition()

  const handleChange = () => {
    if (approval) return // can't un-approve
    setApproval(true)
    startTransition(async () => {
      try {
        await approveWalletRechargeAction(id)
      } catch {
        setApproval(false) // revert
      }
    })
  }

  return (
    <label
      className={`relative inline-flex items-center cursor-pointer ${isPending ? "opacity-60" : ""} ${approval ? "cursor-default" : ""}`}
      title={approval ? "Already approved" : "Click to approve"}
    >
      <input
        type="checkbox"
        checked={approval}
        onChange={handleChange}
        className="sr-only peer"
        disabled={isPending || approval}
      />
      <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-[#28a745] after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border after:border-gray-300 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
    </label>
  )
}
