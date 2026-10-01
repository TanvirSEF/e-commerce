"use client"

import React, { useState } from "react"
import { ClipboardList, Plus, Trash2, CheckCircle2 } from "lucide-react"

export interface RegistrationFormField {
  id: string
  label: string
  type: "text" | "textarea" | "select" | "file"
  options?: string[]
  required: boolean
}

interface AffiliateFormBuilderProps {
  initialFields: RegistrationFormField[]
  onSave: (fields: RegistrationFormField[]) => Promise<void>
}

export function AffiliateFormBuilder({ initialFields, onSave }: AffiliateFormBuilderProps) {
  const [fields, setFields] = useState<RegistrationFormField[]>(initialFields)
  const [newLabel, setNewLabel] = useState("")
  const [newType, setNewType] = useState<"text" | "textarea" | "select" | "file">("text")
  const [newRequired, setNewRequired] = useState(true)
  const [newOptionsText, setNewOptionsText] = useState("")
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleAddField = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newLabel.trim()) return

    const newField: RegistrationFormField = {
      id: "fld_" + Date.now(),
      label: newLabel.trim(),
      type: newType,
      required: newRequired,
      ...(newType === "select"
        ? {
            options: newOptionsText
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean),
          }
        : {}),
    }

    setFields([...fields, newField])
    setNewLabel("")
    setNewType("text")
    setNewRequired(true)
    setNewOptionsText("")
    setSaved(false)
  }

  const handleRemoveField = (id: string) => {
    setFields(fields.filter((f) => f.id !== id))
    setSaved(false)
  }

  const handleSaveAll = async () => {
    setSaving(true)
    setSaved(false)
    try {
      await onSave(fields)
      setSaved(true)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Affiliate Registration Form Elements</h2>
            <p className="text-xs text-slate-500">
              Customize data fields applicants must complete during the affiliate registration process
            </p>
          </div>
        </div>
      </div>

      {saved && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Affiliate registration form elements updated successfully!
        </div>
      )}

      {/* Existing Fields Table */}
      <div className="border border-slate-200 rounded-lg overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
            <tr>
              <th className="px-4 py-2.5 w-12 text-slate-400">#</th>
              <th className="px-4 py-2.5">Field Title / Label</th>
              <th className="px-4 py-2.5 w-32">Element Type</th>
              <th className="px-4 py-2.5 w-24 text-center">Required</th>
              <th className="px-4 py-2.5 w-20 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {fields.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-6 text-slate-400">
                  No custom form fields defined. Default contact fields will be used.
                </td>
              </tr>
            ) : (
              fields.map((f, idx) => (
                <tr key={f.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-4 py-3 text-slate-400">{idx + 1}</td>
                  <td className="px-4 py-3">
                    <span className="font-semibold text-slate-800">{f.label}</span>
                    {f.options && f.options.length > 0 && (
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Options: {f.options.join(", ")}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="capitalize px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                      {f.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {f.required ? (
                      <span className="text-[11px] font-semibold text-emerald-600">Yes</span>
                    ) : (
                      <span className="text-[11px] text-slate-400">Optional</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleRemoveField(f.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                      title="Remove field"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add New Field Box */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Add New Registration Field
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          <div className="sm:col-span-5 space-y-1">
            <label className="text-[11px] font-semibold text-slate-600">Field Label</label>
            <input
              type="text"
              placeholder="e.g. Portfolio or Profile URL"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-[#d43533]"
            />
          </div>

          <div className="sm:col-span-3 space-y-1">
            <label className="text-[11px] font-semibold text-slate-600">Field Type</label>
            <select
              value={newType}
              onChange={(e) => setNewType(e.target.value as any)}
              className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-[#d43533]"
            >
              <option value="text">Text Input</option>
              <option value="textarea">Multi-line Text</option>
              <option value="select">Dropdown Select</option>
              <option value="file">File Attachment</option>
            </select>
          </div>

          <div className="sm:col-span-2 flex items-center gap-2 pb-2">
            <input
              type="checkbox"
              id="reqCheck"
              checked={newRequired}
              onChange={(e) => setNewRequired(e.target.checked)}
              className="w-4 h-4 rounded text-[#d43533] focus:ring-[#d43533] accent-[#d43533]"
            />
            <label htmlFor="reqCheck" className="text-xs font-medium text-slate-700 cursor-pointer">
              Mandatory
            </label>
          </div>

          <div className="sm:col-span-2">
            <button
              type="button"
              onClick={handleAddField}
              className="w-full py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium rounded flex items-center justify-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add
            </button>
          </div>
        </div>

        {newType === "select" && (
          <div className="space-y-1 pt-1">
            <label className="text-[11px] font-semibold text-slate-600">
              Dropdown Options (comma separated)
            </label>
            <input
              type="text"
              placeholder="e.g. Under 5k, 5k - 20k, 20k+"
              value={newOptionsText}
              onChange={(e) => setNewOptionsText(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-[#d43533]"
            />
          </div>
        )}
      </div>

      <div className="flex justify-end pt-1">
        <button
          type="button"
          onClick={handleSaveAll}
          disabled={saving}
          className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#d43533] hover:bg-red-700 text-white font-medium text-xs rounded-lg transition-colors shadow-sm disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Registration Form Fields"}
        </button>
      </div>
    </div>
  )
}
