'use client'

import type { VerificationMethod } from '@/store/deposit.store'
import clsx from 'clsx'
import { FileText, Link2 } from 'lucide-react'

interface Props {
  verificationMethod: VerificationMethod
  value: string
  onChange: (val: string) => void
}

export default function TextProofInput({ verificationMethod, value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-2 w-full animate-fade-in-up">
      <label className="text-[10px] font-black text-textMuted uppercase tracking-widest pl-1 flex items-center gap-1.5">
        {verificationMethod === 'SMS' ? <FileText size={12} /> : <Link2 size={12} />}
        {verificationMethod === 'SMS' ? 'Raw SMS Content' : 'Transaction Link URL'}
      </label>
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={verificationMethod === 'SMS' ? 6 : 3}
          placeholder={verificationMethod === 'SMS' ? 'Paste the exact SMS text here...' : 'https://...'}
          className={clsx(
            "w-full rounded-2xl bg-background border border-border px-5 py-4 text-sm font-mono text-textMain placeholder-textMuted/50 resize-none outline-none transition-all duration-200 shadow-sm",
            "hover:border-textMuted focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          )}
        />
        <div className="absolute bottom-3 right-4 opacity-50 pointer-events-none">
          <span className="text-[10px] font-bold text-textMuted uppercase tracking-widest">
            {value.length} chars
          </span>
        </div>
      </div>
    </div>
  )
}
