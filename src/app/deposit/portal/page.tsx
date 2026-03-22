'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'
import { fetchMe } from '@/lib/api'
import DepositFlow from '@/components/deposit/DepositFlow'
import HistoryPanel from '@/components/history/HistoryPanel'
import { Wallet, ClipboardList, LogOut, Loader2 } from 'lucide-react'

type Tab = 'deposit' | 'history'

export default function PortalPage() {
  const router = useRouter()
  const { user, sessionToken, setSession, clearSession } = useAuthStore()
  const [tab, setTab] = useState<Tab>('deposit')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!sessionToken) { router.replace('/deposit'); return }
    if (user) { setReady(true); return }
    fetchMe()
      .then((u) => { setSession(sessionToken, u); setReady(true) })
      .catch(() => { clearSession(); router.replace('/deposit') })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (!ready) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 size={22} className="text-blue-400 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">

      {/* ── Header ── */}
      <header className="border-b border-zinc-800 px-5 h-14 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          {/* Logo mark */}
          <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center text-white font-bold text-xs">
            H
          </div>
          <span className="text-white font-semibold text-sm tracking-tight">HabeshaUnlocker</span>
        </div>
        <div className="flex items-center gap-3">
          {user?.firstName && (
            <span className="hidden sm:block text-xs text-zinc-500">
              {user.firstName}
            </span>
          )}
          <button
            onClick={() => { clearSession(); router.replace('/deposit') }}
            className="btn-ghost py-1.5 px-3 text-xs text-zinc-500 hover:text-white"
          >
            <LogOut size={13} />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </header>

      {/* ── Tab bar ── */}
      <div className="border-b border-zinc-800 px-5 shrink-0">
        <div className="flex">
          {([
            { key: 'deposit' as Tab, label: 'Deposit', icon: Wallet },
            { key: 'history' as Tab, label: 'History', icon: ClipboardList },
          ]).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-4 py-3.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
                tab === key
                  ? 'border-blue-500 text-white'
                  : 'border-transparent text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <main className="flex-1 w-full max-w-xl mx-auto px-4 py-6">
        {tab === 'deposit' ? <DepositFlow /> : <HistoryPanel />}
      </main>
    </div>
  )
}
