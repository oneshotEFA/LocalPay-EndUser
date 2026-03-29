'use client'

import { useRef, useState } from 'react'
import { Upload, X, ShieldCheck, User } from 'lucide-react'
import clsx from 'clsx'

interface Props {
  preview: string | null
  fileName: string | null
  onFile: (file: File) => void
  onClear: () => void
  accountNumber: string
  onAccountNumberChange: (value: string) => void
}

export default function ScreenshotUpload({
  preview,
  fileName,
  onFile,
  onClear,
  accountNumber='',
  onAccountNumberChange,
}: Props) {
  const [dragOver, setDragOver] = useState(false)
  const [touched, setTouched] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const accountError = touched && accountNumber.trim().length === 0

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in-up">
      {/* ── Account Number Input ── */}
      <div className="flex flex-col gap-2 relative">
        <label className="text-[10px] font-black text-textMuted uppercase tracking-widest pl-1 flex items-center gap-1.5">
          <User size={12} /> Sender Account Number
        </label>
        <div className="relative">
          <input
            type="text"
            value={accountNumber}
            onChange={(e) => onAccountNumberChange(e.target.value)}
            onBlur={() => setTouched(true)}
            placeholder="e.g. 1000123456789"
            className={clsx(
              "w-full rounded-xl bg-background border px-4 py-3.5 text-base font-bold text-textMain placeholder-textMuted/50 outline-none transition-all duration-200 shadow-sm",
              accountError
                ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
                : "border-border hover:border-textMuted focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
            )}
          />
        </div>
        {accountError && (
          <p className="text-[11px] font-medium text-red-500 pl-1">This field is required before uploading.</p>
        )}
      </div>

      {/* ── Upload Area ── */}
      {preview ? (
        <div className="relative rounded-2xl overflow-hidden border border-border shadow-md bg-background group">
          <img src={preview} alt="Preview" className="w-full object-contain max-h-64" />
          <button
            onClick={onClear}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/80 backdrop-blur border border-border flex items-center justify-center hover:bg-surfaceHover transition-colors shadow-sm opacity-0 group-hover:opacity-100 duration-200"
            title="Remove"
          >
            <X size={16} className="text-textMain" />
          </button>
          <div className="absolute bottom-0 inset-x-0 bg-background/90 backdrop-blur pl-4 pr-12 py-3 border-t border-border flex items-center justify-between">
            <p className="text-xs font-medium text-textMain truncate">{fileName}</p>
            <ShieldCheck size={16} className="text-emerald-500 shrink-0" />
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault()
            if (accountNumber.trim()) setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragOver(false)
            if (!accountNumber.trim()) { setTouched(true); return }
            const f = e.dataTransfer.files[0]
            if (f) onFile(f)
          }}
          onClick={() => {
            if (!accountNumber.trim()) { setTouched(true); return }
            fileRef.current?.click()
          }}
          className={clsx(
            "border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center gap-4 transition-all duration-300 relative overflow-hidden group outline-none",
            !accountNumber.trim()
              ? "border-border bg-surface/50 opacity-60 cursor-not-allowed"
              : dragOver
              ? "border-blue-500 bg-blue-500/5 cursor-pointer scale-[1.02] shadow-inner"
              : "border-border hover:border-blue-400 hover:bg-surfaceHover/50 cursor-pointer shadow-sm hover:shadow-md",
          )}
        >
          <div className={clsx(
            "w-14 h-14 rounded-full flex items-center justify-center transition-colors duration-300 shadow-sm",
            !accountNumber.trim() ? "bg-background text-textMuted" : dragOver ? "bg-blue-600 text-white" : "bg-background text-textMuted group-hover:bg-blue-50 group-hover:text-blue-600 dark:group-hover:bg-blue-500/10 dark:group-hover:text-blue-400"
          )}>
            <Upload size={24} strokeWidth={2.5} className={dragOver ? "animate-bounce" : ""} />
          </div>
          <div className="text-center relative z-10">
            <p className="text-base font-bold text-textMain">Drop your receipt screenshot here</p>
            <p className="text-xs font-medium text-textMuted mt-1.5 flex items-center justify-center gap-2">
              <span>PNG, JPG up to 10MB</span>
              <span className="w-1 h-1 rounded-full bg-border" />
              <span className="group-hover:text-blue-500 transition-colors">Browse files</span>
            </p>
          </div>
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) onFile(f)
        }}
      />
    </div>
  )
}