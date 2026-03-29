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
        iconColor: "text-emerald-500 dark:text-emerald-400",
        border: "border-emerald-500/20",
        bg: "bg-emerald-500/5 dark:bg-emerald-500/10",
        label: "Deposit Verified",
        note: isGateway
          ? "Your deposit was verified but we could not redirect you to the platform. Please return manually and contact support if your balance is not updated."
          : "Your deposit has been verified and will be credited shortly.",
        noteColor: "text-emerald-600 dark:text-emerald-300",
      };
    case "AMBIGUOUS":
      return {
        icon: Clock,
        iconColor: "text-yellow-500 dark:text-yellow-400",
        border: "border-yellow-500/20",
        bg: "bg-yellow-500/5 dark:bg-yellow-500/10",
        label: "Under Manual Review",
        note: "We couldn't verify your receipt automatically. Our team has been notified and will review it shortly. You'll be notified via SMS/Telegram once resolved.",
        noteColor: "text-yellow-600 dark:text-yellow-300",
      };
    case "FAIL_RETRYABLE":
      return {
        icon: AlertTriangle,
        iconColor: "text-orange-500 dark:text-orange-400",
        border: "border-orange-500/20",
        bg: "bg-orange-500/5 dark:bg-orange-500/10",
        label: "Verification Failed",
        note: "Your proof could not be matched. Double-check the SMS, link, or screenshot and try again.",
        noteColor: "text-orange-600 dark:text-orange-300",
      };
    default:
      return {
        icon: XCircle,
        iconColor: "text-red-500 dark:text-red-400",
        border: "border-red-500/20",
        bg: "bg-red-500/5 dark:bg-red-500/10",
        label: "Verification Failed",
        note: "This deposit could not be processed. Please contact support.",
        noteColor: "text-red-600 dark:text-red-300",
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
    <div className="flex items-start justify-between gap-4 py-3 border-b border-border last:border-0 hover:bg-surfaceHover/30 transition-colors px-2 rounded-lg">
      <span className="text-sm font-medium text-textMuted shrink-0">{label}</span>
      <span
        className={clsx(
          "text-sm font-bold text-textMain text-right break-all",
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
        "rounded-2xl border p-6 md:p-8 space-y-6 animate-fade-in-up",
        meta.border,
        meta.bg,
      )}
    >
      {/* Icon + title */}
      <div className="flex flex-col items-center text-center gap-3">
        <div
          className={clsx(
            "w-16 h-16 rounded-full flex items-center justify-center shadow-sm",
            meta.bg,
            "border",
            meta.border,
          )}
        >
          <Icon size={32} className={meta.iconColor} strokeWidth={2.5} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-textMain tracking-tight">{meta.label}</h2>
          <p className="text-sm font-medium text-textMuted mt-1">
            Deposit · {paymentMethod}
          </p>
        </div>
      </div>

      {/* Details */}
      <div className="rounded-xl bg-surface border border-border px-3 py-1 shadow-sm">
        {amount != null && (
          <Row label="Amount" value={`ETB ${amount.toLocaleString()}`} />
        )}
        {result.depositRequestId && (
          <Row label="Reference" value={result.depositRequestId} mono />
        )}
        {result.reason && <Row label="Reason" value={result.reason} />}
      </div>

      {/* Note */}
      {meta.note && (
        <div className="p-4 rounded-xl bg-background border border-border shadow-inner text-center">
          <p className={clsx("text-sm leading-relaxed font-medium", meta.noteColor)}>
            {meta.note}
          </p>
        </div>
      )}

      {/* Retry button — only for FAIL_RETRYABLE */}
      {canRetry && (
        <button
          onClick={() => {
            setError(null);
            setStep(4); // back to proof step
          }}
          className="btn-secondary w-full flex items-center justify-center gap-2 h-12 text-base mt-2"
        >
          <RotateCcw size={16} strokeWidth={2.5} />
          Try Again
        </button>
      )}

      {/* Gateway fallback — PASS but no redirect happened */}
      {status === "PASS" && isGateway && (
        <a
          href={process.env.NEXT_PUBLIC_PARENT_APP_URL ?? "#"}
          className="btn-secondary w-full flex items-center justify-center text-sm h-12 mt-2"
        >
          ← Return to Platform
        </a>
      )}
    </div>
  );
}
