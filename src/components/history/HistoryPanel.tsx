'use client'

import { useState, useEffect, useCallback } from 'react'
import { fetchHistory } from '@/lib/api'
import { ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react'
import clsx from 'clsx'

type Deposit = {
  id: string
  amount: number
  paymentMethod: string
  status: string
  transactionId: string | null
  rejectionReason: string | null
  createdAt: string
}

const STATUS_META: Record<string, { dot: string; label: string }> = {
  PENDING_RECEIPT:       { dot: 'bg-zinc-500',    label: 'Awaiting receipt' },
  VERIFYING:             { dot: 'bg-blue-400',     label: 'Verifying' },
  VERIFIED:              { dot: 'bg-emerald-400',  label: 'Verified' },
  FUNDED:                { dot: 'bg-emerald-400',  label: 'Funded' },
  REJECTED_RETRYABLE:    { dot: 'bg-orange-400',   label: 'Rejected — retry' },
  REJECTED_HARD:         { dot: 'bg-red-400',      label: 'Rejected' },
  REJECTED_MAX_RETRIES:  { dot: 'bg-red-400',      label: 'Max retries' },
  PENDING_MANUAL_REVIEW: { dot: 'bg-yellow-400',   label: 'Under review' },
  MANUALLY_APPROVED:     { dot: 'bg-emerald-400',  label: 'Approved' },
  MANUALLY_REJECTED:     { dot: 'bg-red-400',      label: 'Rejected by admin' },
}

function formatDate(d: string) {
  return new Date(d).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function DepositCard({ dep, index }: { dep: Deposit; index: number }) {
  const meta = STATUS_META[dep.status] ?? { dot: 'bg-zinc-600', label: dep.status }

  return (
    <div
      className="card-sm p-4 space-y-3 hover:border-zinc-600 transition-colors animate-fade-up"
      style={{ animationDelay: `${index * 0.05}s`, opacity: 0 }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-base font-semibold text-white">
            ETB {dep.amount.toLocaleString()}
          </p>
          <p className="text-xs text-zinc-500 mt-0.5">
            {dep.paymentMethod} · {formatDate(dep.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <div className={clsx('w-1.5 h-1.5 rounded-full', meta.dot)} />
          <span className="text-xs text-zinc-400">{meta.label}</span>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-1">
        {dep.transactionId && (
          <div className="flex gap-2 items-center">
            <span className="text-[10px] text-zinc-600 uppercase tracking-wider w-16 shrink-0">Tx ID</span>
            <span className="text-xs font-mono text-zinc-400 truncate">{dep.transactionId}</span>
          </div>
        )}
        <div className="flex gap-2 items-center">
          <span className="text-[10px] text-zinc-600 uppercase tracking-wider w-16 shrink-0">Ref</span>
          <span className="text-xs font-mono text-zinc-500 truncate">{dep.id}</span>
        </div>
        {dep.rejectionReason && (
          <div className="flex gap-2 items-start">
            <span className="text-[10px] text-zinc-600 uppercase tracking-wider w-16 shrink-0 pt-0.5">Reason</span>
            <span className="text-xs text-red-400">{dep.rejectionReason}</span>
          </div>
        )}
      </div>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="card-sm p-4 space-y-3">
      <div className="flex justify-between">
        <div className="space-y-2">
          <div className="skeleton h-4 w-24" />
          <div className="skeleton h-3 w-36" />
        </div>
        <div className="skeleton h-4 w-20 rounded-full" />
      </div>
      <div className="skeleton h-3 w-full" />
      <div className="skeleton h-3 w-2/3" />
    </div>
  )
}

export default function HistoryPanel() {
  const [page, setPage] = useState(0)
  const [data, setData] = useState<Awaited<ReturnType<typeof fetchHistory>> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async (p: number) => {
    setLoading(true)
    setError('')
    try {
      const res = await fetchHistory(p)
      setData(res)
      setPage(p)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load(0) }, [load])

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Deposit History</h2>
        <button
          onClick={() => load(page)}
          className="btn-ghost py-1.5 px-3 text-xs"
        >
          <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="card-sm p-4 text-xs text-red-400 border-red-500/20">{error}</div>
      )}

      {/* Loading */}
      {loading && (
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && data?.deposits.length === 0 && (
        <div className="card-sm p-12 text-center">
          <p className="text-2xl mb-3">📭</p>
          <p className="text-sm text-zinc-500">No deposits yet.</p>
          <p className="text-xs text-zinc-600 mt-1">Use the Deposit tab to get started.</p>
        </div>
      )}

      {/* List */}
      {!loading && data && data.deposits.length > 0 && (
        <>
          <p className="text-xs text-zinc-600">
            {data.total} deposit{data.total !== 1 ? 's' : ''} total
          </p>

          <div className="space-y-2">
            {data.deposits.map((dep, i) => (
              <DepositCard key={dep.id} dep={dep} index={i} />
            ))}
          </div>

          {/* Pagination */}
          {data.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => load(page - 1)}
                disabled={page === 0}
                className="btn-ghost p-2 disabled:opacity-30"
              >
                <ChevronLeft size={15} />
              </button>
              <span className="text-xs text-zinc-500 px-2">
                {page + 1} / {data.totalPages}
              </span>
              <button
                onClick={() => load(page + 1)}
                disabled={page + 1 >= data.totalPages}
                className="btn-ghost p-2 disabled:opacity-30"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
