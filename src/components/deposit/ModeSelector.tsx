'use client'

import { useDepositStore, DepositMode } from '@/store/deposit.store'
import { FileText, Layers } from 'lucide-react'
import clsx from 'clsx'

const MODES: { key: DepositMode; label: string; sub: string; icon: React.ElementType }[] = [
  { key: 'single', label: 'Single Deposit', sub: 'One receipt', icon: FileText },
  { key: 'bulk',   label: 'Bulk Deposit',   sub: 'Multiple receipts', icon: Layers },
]

export default function ModeSelector() {
  const { mode, setMode } = useDepositStore()

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-white">Make a Deposit</h2>
        <p className="text-sm text-zinc-500 mt-0.5">Choose deposit type to get started.</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {MODES.map(({ key, label, sub, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setMode(key)}
            className={clsx(
              'card p-4 text-left transition-all duration-150 hover:border-zinc-600 active:scale-[0.98]',
              mode === key && 'border-blue-500 bg-blue-500/5',
            )}
          >
            <div className={clsx(
              'w-8 h-8 rounded-lg flex items-center justify-center mb-3',
              mode === key ? 'bg-blue-500 text-white' : 'bg-zinc-800 text-zinc-400',
            )}>
              <Icon size={15} />
            </div>
            <div className="text-sm font-medium text-white">{label}</div>
            <div className="text-xs text-zinc-500 mt-0.5">{sub}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
