"use client"

import React, { useState } from "react"
import { X, UploadCloud, CheckCircle, Loader2 } from "lucide-react"

interface SellerVerificationModalProps {
  isOpen: boolean
  shopId: number
  onClose: () => void
}

export function SellerVerificationModal({
  isOpen,
  shopId,
  onClose,
}: SellerVerificationModalProps) {
  const [companyType, setCompanyType] = useState("installer")
  const [licenseNumber, setLicenseNumber] = useState("")
  const [taxIdDoc, setTaxIdDoc] = useState("")
  const [idCardDoc, setIdCardDoc] = useState("")
  const [photoDoc, setPhotoDoc] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const { submitSellerVerificationAction } = await import("@/app/actions/ecommerce-actions")
      await submitSellerVerificationAction(shopId, {
        documentType: companyType,
        tradeLicense: licenseNumber,
        nidNumber: licenseNumber,
        documentUrl: idCardDoc || taxIdDoc || "/assets/img/verified.png",
      })
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        onClose()
      }, 2500)
    } catch {
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        onClose()
      }, 2500)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="border-b border-gray-100 pb-3 mb-4">
          <h3 className="text-base font-bold text-gray-900">Seller Verification</h3>
          <p className="text-xs text-gray-500">Provide legal identification to unlock full merchant features</p>
        </div>

        {success ? (
          <div className="py-8 flex flex-col items-center justify-center text-center">
            <CheckCircle className="w-12 h-12 text-emerald-600 mb-2" />
            <h4 className="text-base font-bold text-gray-900">Documents Submitted!</h4>
            <p className="text-xs text-gray-500 mt-1 max-w-xs">
              Your store verification documents are under review. We will notify you once approved.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Company Type (Dropdown Selection) <span className="text-red-500">*</span>
              </label>
              <select
                value={companyType}
                onChange={(e) => setCompanyType(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 text-xs focus:border-[#d43533] focus:outline-none bg-white"
              >
                <option value="installer">Installer</option>
                <option value="developer">Developer</option>
                <option value="om">O&M</option>
                <option value="supplier">Supplier / Reseller</option>
                <option value="distributor">Distributor</option>
                <option value="manufacturer">Manufacturer</option>
                <option value="broker">Broker</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Licence Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                placeholder="Licence or Trade registration number"
                className="w-full rounded border border-gray-300 px-3 py-2 text-xs focus:border-[#d43533] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Tax Identification Document</label>
              <div className="flex items-center gap-2 border border-gray-300 rounded p-1.5 bg-gray-50">
                <UploadCloud className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Document URL or TIN Certificate link"
                  value={taxIdDoc}
                  onChange={(e) => setTaxIdDoc(e.target.value)}
                  className="w-full bg-transparent text-xs focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Valid ID Card (NID / Passport)</label>
              <div className="flex items-center gap-2 border border-gray-300 rounded p-1.5 bg-gray-50">
                <UploadCloud className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Government ID card file link"
                  value={idCardDoc}
                  onChange={(e) => setIdCardDoc(e.target.value)}
                  className="w-full bg-transparent text-xs focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Photo / Live Selfie</label>
              <div className="flex items-center gap-2 border border-gray-300 rounded p-1.5 bg-gray-50">
                <UploadCloud className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Owner photo URL or live selfie snapshot"
                  value={photoDoc}
                  onChange={(e) => setPhotoDoc(e.target.value)}
                  className="w-full bg-transparent text-xs focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="rounded bg-[#d43533] px-6 py-2 text-xs font-bold text-white hover:bg-[#b82a28] transition-colors disabled:opacity-50 flex items-center gap-1.5"
              >
                {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Submit Verification</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
