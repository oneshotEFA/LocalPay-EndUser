"use client";

import { useState } from "react";
import { useHistory } from "@/lib/queries";
import { ChevronLeft, ChevronRight, RefreshCw, Inbox } from "lucide-react";
import DepositCard from "./DepositCard";
import SkeletonCard from "./SkeletonCard";

export default function HistoryPanel() {
  const [page, setPage] = useState(0);

  const { data, isLoading, error, isFetching, refetch } = useHistory(page);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <div>
          <h2 className="text-xl font-bold text-textMain tracking-tight">Deposit History</h2>
          <p className="text-sm text-textMuted mt-0.5 font-medium">Your recent transactions</p>
        </div>
        <button
          onClick={() => refetch()}
          className="btn-ghost py-2 px-3 text-sm h-10 border border-border"
        >
          <RefreshCw size={14} className={isFetching ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl p-4 text-sm font-medium text-red-500 bg-red-500/10 border border-red-500/20">
          {(error as Error).message}
        </div>
      )}

      {/* Loading skeletons */}
      {isLoading && (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && data?.deposits.length === 0 && (
        <div className="card p-12 flex flex-col items-center justify-center text-center border-dashed border-2 bg-transparent shadow-none">
          <div className="w-16 h-16 rounded-full bg-surfaceHover flex items-center justify-center mb-4">
            <Inbox size={24} className="text-textMuted" />
          </div>
          <p className="text-base font-bold text-textMain">No deposits yet</p>
          <p className="text-sm text-textMuted mt-1">
            Navigate to the Deposit tab to make your first transaction.
          </p>
        </div>
      )}

      {/* Deposit list */}
      {!isLoading && data && data.deposits.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-textMuted uppercase tracking-wider">
              {data.total} Deposit{data.total !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="space-y-3">
            {data.deposits.map((dep: any, i: number) => (
              <DepositCard key={dep.id} dep={dep} index={i} />
            ))}
          </div>

          {/* Pagination */}
          {data.totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-4 border-t border-border mt-4">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0 || isFetching}
                className="btn-ghost p-2.5 h-10 w-10 disabled:opacity-30 border border-border"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm font-bold text-textMuted bg-surface px-4 py-2 rounded-lg border border-border">
                Page {page + 1} of {data.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={!data.hasMore || isFetching}
                className="btn-ghost p-2.5 h-10 w-10 disabled:opacity-30 border border-border"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
