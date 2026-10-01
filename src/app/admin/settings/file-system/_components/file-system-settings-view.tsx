"use client"

import React, { useState, useTransition } from "react"
import { Cloud, HardDrive, Database, CheckCircle, Save, Check, RefreshCw, Loader2 } from "lucide-react"
import { updateFileSystemAction } from "@/app/actions/settings-actions"
import type { FileSystemSettings } from "@/services/settings-service"

interface FileSystemSettingsViewProps {
  initialSettings: FileSystemSettings
}

export function FileSystemSettingsView({ initialSettings }: FileSystemSettingsViewProps) {
  const [driver, setDriver] = useState<FileSystemSettings["driver"]>(initialSettings.driver)
  const [cloudName, setCloudName] = useState(initialSettings.cloudinaryCloudName)
  const [apiKey, setApiKey] = useState(initialSettings.cloudinaryApiKey)
  const [apiSecret, setApiSecret] = useState(initialSettings.cloudinaryApiSecret)
  const [awsKey, setAwsKey] = useState(initialSettings.awsAccessKey)
  const [awsSecret, setAwsSecret] = useState(initialSettings.awsSecretKey)
  const [awsRegion, setAwsRegion] = useState(initialSettings.awsRegion)
  const [awsBucket, setAwsBucket] = useState(initialSettings.awsBucket)

  const [saved, setSaved] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      await updateFileSystemAction({
        driver,
        cloudinaryCloudName: cloudName,
        cloudinaryApiKey: apiKey,
        cloudinaryApiSecret: apiSecret,
        awsAccessKey: awsKey,
        awsSecretKey: awsSecret,
        awsRegion,
        awsBucket,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    })
  }

  const handleTestCloudinary = async () => {
    setTesting(true)
    setTestResult(null)
    try {
      const res = await fetch("/api/uploader")
      setTestResult(res.ok ? "success" : "error")
    } catch {
      setTestResult("error")
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">File System & Storage Configuration</h1>
          <p className="text-xs text-gray-500 mt-1">
            Configure media uploads, Cloudinary CDN, and AWS S3 storage drivers
          </p>
        </div>
        {saved && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold">
            <CheckCircle className="w-4 h-4 text-emerald-500" /> Settings updated successfully
          </span>
        )}
      </div>

      {/* Driver Selector Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-sm font-bold text-gray-800 mb-3">Active Storage Driver</h3>
        <p className="text-xs text-gray-500 mb-4">
          Select where uploaded product images, banners, and documents are stored
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {([
            { key: "cloudinary" as const, icon: <Cloud className="w-6 h-6 text-[#d43533]" />, label: "Cloudinary CDN (Recommended)", desc: "Ultra-fast worldwide CDN, automatic image optimization & resizing" },
            { key: "aws_s3" as const, icon: <Database className="w-6 h-6 text-amber-600" />, label: "AWS S3 / Wasabi", desc: "Amazon Web Services S3 object storage for enterprise scaling" },
            { key: "local" as const, icon: <HardDrive className="w-6 h-6 text-slate-600" />, label: "Local Storage", desc: "Store uploaded files on web server local disk filesystem" },
          ] as const).map(({ key, icon, label, desc }) => (
            <div
              key={key}
              onClick={() => setDriver(key)}
              className={`border rounded-xl p-4 cursor-pointer transition-all ${
                driver === key
                  ? "border-[#d43533] bg-red-50/30 ring-2 ring-[#d43533]/20"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                {icon}
                {driver === key && (
                  <span className="px-2 py-0.5 bg-[#d43533] text-white text-[10px] font-bold rounded-full">ACTIVE</span>
                )}
              </div>
              <h4 className="text-xs font-bold text-gray-800">{label}</h4>
              <p className="text-[11px] text-gray-500 mt-1">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cloudinary Configuration Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <Cloud className="w-5 h-5 text-[#d43533]" />
              <h3 className="text-sm font-bold text-gray-800">Cloudinary Credentials</h3>
            </div>
            <button
              type="button"
              onClick={handleTestCloudinary}
              disabled={testing}
              className="text-xs text-[#d43533] font-semibold hover:underline flex items-center gap-1"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testing ? "animate-spin" : ""}`} />
              Test Connection
            </button>
          </div>

          {testResult === "success" && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-700 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" /> Cloudinary API connected & responding normally.
            </div>
          )}
          {testResult === "error" && (
            <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
              Connection failed. Check your credentials and try again.
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Cloudinary Cloud Name</label>
              <input type="text" value={cloudName} onChange={(e) => setCloudName(e.target.value)} placeholder="e.g. wumsaw2a" className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-[#d43533]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Cloudinary API Key</label>
              <input type="text" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="276828639658817" className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-[#d43533]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Cloudinary API Secret</label>
              <input type="password" value={apiSecret} onChange={(e) => setApiSecret(e.target.value)} placeholder="••••••••••••••••••••••••" className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-[#d43533]" />
            </div>
          </div>
        </div>

        {/* AWS S3 Configuration Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b pb-3">
            <Database className="w-5 h-5 text-amber-600" />
            <h3 className="text-sm font-bold text-gray-800">AWS S3 / Compatible Storage</h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">AWS Access Key ID</label>
              <input type="text" value={awsKey} onChange={(e) => setAwsKey(e.target.value)} placeholder="AKIAIOSFODNN7EXAMPLE" className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-[#d43533]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">AWS Secret Access Key</label>
              <input type="password" value={awsSecret} onChange={(e) => setAwsSecret(e.target.value)} placeholder="wJalrXUtnFEMI/K7MDENG/..." className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-[#d43533]" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Region</label>
                <input type="text" value={awsRegion} onChange={(e) => setAwsRegion(e.target.value)} placeholder="us-east-1" className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-[#d43533]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Bucket Name</label>
                <input type="text" value={awsBucket} onChange={(e) => setAwsBucket(e.target.value)} placeholder="my-ecommerce-bucket" className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-[#d43533]" />
              </div>
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="lg:col-span-2 flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="px-5 py-2.5 bg-[#d43533] hover:bg-[#b82d2b] text-white text-xs font-bold rounded-lg shadow-sm transition-colors inline-flex items-center gap-2 disabled:opacity-60"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isPending ? "Saving..." : "Save Storage Configuration"}
          </button>
        </div>
      </form>
    </div>
  )
}
