"use client"

import React, { useState } from "react"
import { Cloud, HardDrive, Database, CheckCircle, Save, Check, RefreshCw } from "lucide-react"

interface FileSystemSettingsViewProps {
  initialDriver: string
  cloudinaryConfig: {
    cloudName: string
    apiKey: string
    apiSecret: string
  }
}

export function FileSystemSettingsView({
  initialDriver,
  cloudinaryConfig,
}: FileSystemSettingsViewProps) {
  const [driver, setDriver] = useState(initialDriver)
  const [cloudName, setCloudName] = useState(cloudinaryConfig.cloudName)
  const [apiKey, setApiKey] = useState(cloudinaryConfig.apiKey)
  const [apiSecret, setApiSecret] = useState(cloudinaryConfig.apiSecret)
  const [saved, setSaved] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<string | null>(null)

  // AWS State
  const [awsKey, setAwsKey] = useState("")
  const [awsSecret, setAwsSecret] = useState("")
  const [awsRegion, setAwsRegion] = useState("us-east-1")
  const [awsBucket, setAwsBucket] = useState("")

  // Redis State
  const [redisHost, setRedisHost] = useState("127.0.0.1")
  const [redisPort, setRedisPort] = useState("6379")
  const [redisPass, setRedisPass] = useState("")

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleTestCloudinary = async () => {
    setTesting(true)
    setTestResult(null)
    try {
      const res = await fetch("/api/uploader")
      if (res.ok) {
        setTestResult("success")
      } else {
        setTestResult("error")
      }
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
            Configure media uploads, Cloudinary CDN, AWS S3, and cache services
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
          <div
            onClick={() => setDriver("cloudinary")}
            className={`border rounded-xl p-4 cursor-pointer transition-all ${
              driver === "cloudinary"
                ? "border-[#d43533] bg-red-50/30 ring-2 ring-[#d43533]/20"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <Cloud className="w-6 h-6 text-[#d43533]" />
              {driver === "cloudinary" && (
                <span className="px-2 py-0.5 bg-[#d43533] text-white text-[10px] font-bold rounded-full">
                  ACTIVE
                </span>
              )}
            </div>
            <h4 className="text-xs font-bold text-gray-800">Cloudinary CDN (Recommended)</h4>
            <p className="text-[11px] text-gray-500 mt-1">
              Ultra-fast worldwide CDN, automatic image optimization & resizing
            </p>
          </div>

          <div
            onClick={() => setDriver("s3")}
            className={`border rounded-xl p-4 cursor-pointer transition-all ${
              driver === "s3"
                ? "border-[#d43533] bg-red-50/30 ring-2 ring-[#d43533]/20"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <Database className="w-6 h-6 text-amber-600" />
              {driver === "s3" && (
                <span className="px-2 py-0.5 bg-[#d43533] text-white text-[10px] font-bold rounded-full">
                  ACTIVE
                </span>
              )}
            </div>
            <h4 className="text-xs font-bold text-gray-800">AWS S3 / Wasabi</h4>
            <p className="text-[11px] text-gray-500 mt-1">
              Amazon Web Services S3 object storage for enterprise scaling
            </p>
          </div>

          <div
            onClick={() => setDriver("local")}
            className={`border rounded-xl p-4 cursor-pointer transition-all ${
              driver === "local"
                ? "border-[#d43533] bg-red-50/30 ring-2 ring-[#d43533]/20"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <HardDrive className="w-6 h-6 text-slate-600" />
              {driver === "local" && (
                <span className="px-2 py-0.5 bg-[#d43533] text-white text-[10px] font-bold rounded-full">
                  ACTIVE
                </span>
              )}
            </div>
            <h4 className="text-xs font-bold text-gray-800">Local Storage</h4>
            <p className="text-[11px] text-gray-500 mt-1">
              Store uploaded files on web server local disk filesystem
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Cloudinary Cloud Name
              </label>
              <input
                type="text"
                value={cloudName}
                onChange={(e) => setCloudName(e.target.value)}
                placeholder="e.g. wumsaw2a"
                className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-[#d43533]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Cloudinary API Key
              </label>
              <input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="276828639658817"
                className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-[#d43533]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Cloudinary API Secret
              </label>
              <input
                type="password"
                value={apiSecret}
                onChange={(e) => setApiSecret(e.target.value)}
                placeholder="••••••••••••••••••••••••"
                className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-[#d43533]"
              />
            </div>
          </div>

          <div className="pt-2 text-right">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-[#d43533] text-white text-xs font-semibold rounded-lg hover:bg-[#b82d2b] inline-flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" /> Save Cloudinary
            </button>
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
              <input
                type="text"
                value={awsKey}
                onChange={(e) => setAwsKey(e.target.value)}
                placeholder="AKIAIOSFODNN7EXAMPLE"
                className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-[#d43533]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">AWS Secret Access Key</label>
              <input
                type="password"
                value={awsSecret}
                onChange={(e) => setAwsSecret(e.target.value)}
                placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
                className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-[#d43533]"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Region</label>
                <input
                  type="text"
                  value={awsRegion}
                  onChange={(e) => setAwsRegion(e.target.value)}
                  placeholder="us-east-1"
                  className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-[#d43533]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Bucket Name</label>
                <input
                  type="text"
                  value={awsBucket}
                  onChange={(e) => setAwsBucket(e.target.value)}
                  placeholder="my-ecommerce-bucket"
                  className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-[#d43533]"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 text-right">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-slate-800 text-white text-xs font-semibold rounded-lg hover:bg-black inline-flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" /> Save S3 Config
            </button>
          </div>
        </div>
      </div>

      {/* Redis / Cache Configuration */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-gray-800 border-b pb-3">Redis Cache Configuration</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">REDIS_HOST</label>
            <input
              type="text"
              value={redisHost}
              onChange={(e) => setRedisHost(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">REDIS_PORT</label>
            <input
              type="text"
              value={redisPort}
              onChange={(e) => setRedisPort(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">REDIS_PASSWORD</label>
            <input
              type="password"
              value={redisPass}
              onChange={(e) => setRedisPass(e.target.value)}
              placeholder="Optional"
              className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg outline-none"
            />
          </div>
        </div>
        <div className="text-right">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-slate-800 text-white text-xs font-semibold rounded-lg hover:bg-black inline-flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" /> Save Cache
          </button>
        </div>
      </div>
    </div>
  )
}
