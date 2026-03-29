"use client";

import clsx from "clsx";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

type Deposit = {
  id: string;
  amount: number;
  paymentMethod: string;
  status: string;
  transactionId: string | null;
  rejectionReason: string | null;
  createdAt: string;
};

const STATUS_META: Record<string, { dot: string; bg: string; text: string; label: string }> = {
  PENDING_RECEIPT: { dot: "bg-textMuted", bg: "bg-surfaceHover", text: "text-textMuted", label: "Awaiting receipt" },
  VERIFYING: { dot: "bg-blue-500", bg: "bg-blue-500/10", text: "text-blue-500 dark:text-blue-400", label: "Verifying" },
  VERIFIED: { dot: "bg-emerald-500", bg: "bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400", label: "Verified" },
  FUNDED: { dot: "bg-emerald-500", bg: "bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400", label: "Funded" },
  REJECTED_RETRYABLE: { dot: "bg-orange-500", bg: "bg-orange-500/10", text: "text-orange-600 dark:text-orange-400", label: "Rejected — retry" },
  REJECTED_HARD: { dot: "bg-red-500", bg: "bg-red-500/10", text: "text-red-500 dark:text-red-400", label: "Rejected" },
  REJECTED_MAX_RETRIES: { dot: "bg-red-500", bg: "bg-red-500/10", text: "text-red-500 dark:text-red-400", label: "Max retries" },
  PENDING_MANUAL_REVIEW: { dot: "bg-yellow-500", bg: "bg-yellow-500/10", text: "text-yellow-600 dark:text-yellow-400", label: "Under review" },
  MANUALLY_APPROVED: { dot: "bg-emerald-500", bg: "bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400", label: "Approved" },
  MANUALLY_REJECTED: { dot: "bg-red-500", bg: "bg-red-500/10", text: "text-red-500 dark:text-red-400", label: "Rejected by admin" },
};

function formatDate(d: string) {
  return new Date(d).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function CopyableId({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex items-center gap-2 group">
      <span className="text-[10px] font-bold text-textMuted uppercase tracking-wider w-12 shrink-0">{label}</span>
      <div 
        onClick={copy}
        className="flex items-center gap-1.5 px-2 py-0.5 rounded cursor-pointer hover:bg-surfaceHover transition-colors"
        title="Click to copy"
      >
        <span className="text-xs font-mono font-medium text-textMain truncate max-w-[150px] md:max-w-xs">{value}</span>
        {copied ? (
          <Check size={12} className="text-green-500 shrink-0" />
        ) : (
          <Copy size={12} className="text-textMuted opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
        )}
      </div>
    </div>
  );
}

export default function DepositCard({ dep, index }: { dep: Deposit; index: number }) {
  const meta = STATUS_META[dep.status] ?? { dot: "bg-textMuted", bg: "bg-surfaceHover", text: "text-textMuted", label: dep.status };

  return (
    <div
      className="card p-4 md:p-5 space-y-4 hover:border-textMuted hover:shadow-md transition-all animate-fade-in-up"
      style={{ animationDelay: `${index * 0.05}s`, animationFillMode: 'both' }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-lg font-black text-textMain tracking-tight">
            ETB {dep.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <span className="text-xs font-bold text-textMuted bg-surface px-2 py-0.5 rounded-md border border-border">
              {dep.paymentMethod}
            </span>
            <span className="text-[11px] font-medium text-textMuted">
              {formatDate(dep.createdAt)}
            </span>
          </div>
        </div>
        
        <div className={clsx("flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border shrink-0 shadow-sm", meta.bg)}>
          <div className={clsx("w-1.5 h-1.5 rounded-full shadow-sm", meta.dot)} />
          <span className={clsx("text-[10px] font-bold uppercase tracking-wide", meta.text)}>{meta.label}</span>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-1 pt-2 mt-2 border-t border-border border-dashed">
        {dep.transactionId && <CopyableId label="Tx ID" value={dep.transactionId} />}
        <CopyableId label="Ref" value={dep.id} />
        
        {dep.rejectionReason && (
          <div className="flex items-start gap-2 mt-2 p-2 rounded-lg bg-red-500/5 border border-red-500/10">
            <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider w-12 shrink-0 pt-0.5">Reason</span>
            <span className="text-xs font-medium text-red-500/90">{dep.rejectionReason}</span>
          </div>
        )}
      </div>
    </div>
  );
}
