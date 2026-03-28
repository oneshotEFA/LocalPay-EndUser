"use client";

import { useDepositStore } from "@/store/deposit.store";
import {
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import clsx from "clsx";

// PASS but no successUrl redirect = verified but funding failed on their side
// AMBIGUOUS = manual review
// FAIL_RETRYABLE = user can retry
// FAIL_HARD = destructive, contact support

function getMeta(status: string, isGateway: boolean) {
  switch (status) {
    case "PASS":
      return {
        icon: CheckCircle2,
        iconColor: "text-emerald-400",
        border: "border-emerald-500/20",
        bg: "bg-emerald-500/5",
        label: "Deposit Verified",
        note: isGateway
          ? "Your deposit was verified but we could not redirect you to the platform. Please return manually and contact support if your balance is not updated."
          : "Your deposit has been verified and will be credited shortly.",
        noteColor: "text-emerald-300",
      };
    case "AMBIGUOUS":
      return {
        icon: Clock,
        iconColor: "text-yellow-400",
        border: "border-yellow-500/20",
        bg: "bg-yellow-500/5",
        label: "Under Manual Review",
        note: "We couldn't verify your receipt automatically. Our team has been notified and will review it shortly. You'll be notified on Telegram once resolved.",
        noteColor: "text-yellow-300",
      };
    case "FAIL_RETRYABLE":
      return {
        icon: AlertTriangle,
        iconColor: "text-orange-400",
        border: "border-orange-500/20",
        bg: "bg-orange-500/5",
        label: "Verification Failed",
        note: "Your proof could not be matched. Double-check the SMS, link, or screenshot and try again.",
        noteColor: "text-orange-300",
      };
    default:
      return {
        icon: XCircle,
        iconColor: "text-red-400",
        border: "border-red-500/20",
        bg: "bg-red-500/5",
        label: "Verification Failed",
        note: "This deposit could not be processed. Please contact support.",
        noteColor: "text-red-300",
      };
  }
}

function Row({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string | number;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 border-b border-zinc-800 last:border-0">
      <span className="text-xs text-zinc-500 shrink-0">{label}</span>
      <span
        className={clsx(
          "text-xs text-zinc-200 text-right break-all",
          mono && "font-mono",
        )}
      >
        {value}
      </span>
    </div>
  );
}

export default function StepResult() {
  const {
    result,
    amount,
    paymentMethod,
    mode,
    gatewaySession,
    setStep,
    setError,
  } = useDepositStore();

  if (!result) return null;

  const status = result.status ?? "FAIL_HARD";
  const isGateway = !!gatewaySession;
  const meta = getMeta(status, isGateway);
  const Icon = meta.icon;
  const canRetry = status === "FAIL_RETRYABLE";

  return (
    <div
      className={clsx(
        "rounded-2xl border p-6 space-y-5 animate-fade-up",
        meta.border,
        meta.bg,
      )}
    >
      {/* Icon + title */}
      <div className="flex items-center gap-3">
        <div
          className={clsx(
            "w-10 h-10 rounded-full flex items-center justify-center",
            meta.bg,
            "border",
            meta.border,
          )}
        >
          <Icon size={20} className={meta.iconColor} />
        </div>
        <div>
          <h2 className="text-base font-semibold text-white">{meta.label}</h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            {mode === "bulk" ? "Bulk" : "Single"} deposit · {paymentMethod}
          </p>
        </div>
      </div>

      {/* Details */}
      <div className="rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-1">
        {amount != null && (
          <Row label="Amount" value={`ETB ${amount.toLocaleString()}`} />
        )}
        {result.depositRequestId && (
          <Row label="Reference" value={result.depositRequestId} mono />
        )}
        {result.verifiedReceipts?.length > 0 && (
          <Row
            label="Receipts verified"
            value={result.verifiedReceipts.length}
          />
        )}
        {result.failedIndex != null && (
          <Row label="Failed at receipt" value={`#${result.failedIndex}`} />
        )}
        {result.reason && <Row label="Reason" value={result.reason} />}
      </div>

      {/* Note */}
      {meta.note && (
        <p className={clsx("text-xs leading-relaxed", meta.noteColor)}>
          {meta.note}
        </p>
      )}

      {/* Retry button — only for FAIL_RETRYABLE */}
      {canRetry && (
        <button
          onClick={() => {
            setError(null);
            setStep(4); // back to proof step
          }}
          className="btn-secondary w-full flex items-center justify-center gap-2"
        >
          <RotateCcw size={13} />
          Try Again
        </button>
      )}

      {/* Gateway fallback — PASS but no redirect happened */}
      {status === "PASS" && isGateway && (
        <a
          href={process.env.NEXT_PUBLIC_PARENT_APP_URL ?? "#"}
          className="btn-secondary w-full block text-center text-xs"
        >
          ← Return to Platform
        </a>
      )}
    </div>
  );
}
