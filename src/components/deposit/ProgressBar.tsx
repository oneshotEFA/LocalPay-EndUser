'use client'

const LABELS = ['', 'Amount', 'Bank', 'Verify', 'Proof']

interface Props { step: number; total: number }

export default function ProgressBar({ step, total }: Props) {
  const pct = Math.round(((step - 1) / (total - 1)) * 100)
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs text-zinc-500">
        <span className="text-zinc-300">{LABELS[step]}</span>
        <span>{step - 1} / {total - 1}</span>
      </div>
      <div className="h-0.5 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
