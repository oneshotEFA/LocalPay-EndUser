"use client";

import { useEffect } from "react";
import { useDepositStore } from "@/store/deposit.store";
import { ArrowLeft, ShieldCheck, Clock } from "lucide-react";
import ProgressBar from "./ProgressBar";
import StepBank from "./steps/StepBank";
import StepVerMethod from "./steps/StepVerMethod";
import StepProof from "./steps/StepProof";
import StepResult from "./steps/StepResult";

interface User {
  userId: string;
  email: string;
}

export default function DepositFlow({ user }: { user?: User | null }) {
  const { step, amount, reset, gatewaySession } = useDepositStore();
  const isGateway = !!gatewaySession;

  const formattedAmount = amount
    ? amount.toLocaleString(undefined, { minimumFractionDigits: 2 })
    : "0.00";

  return (
    <div className="flex flex-col md:flex-row w-full h-full bg-background overflow-hidden relative">
      {/* ── Left Sidebar (Checkout Summary) ── */}
      <div className="w-full md:w-[320px] lg:w-[400px] bg-surface flex flex-col border-b md:border-b-0 md:border-r border-border shrink-0 md:h-full z-20 transition-all">
        {/* Mobile View: Compressed Header */}
        <div className="md:hidden p-4 flex items-center justify-between shadow-sm">
          <button
            onClick={reset}
            className="flex items-center text-xs font-bold text-textMuted hover:text-textMain"
          >
            <ArrowLeft size={16} className="mr-1" /> Cancel
          </button>
          <div className="text-right">
            <p className="font-black text-textMain tracking-tight">
              ETB {formattedAmount}
            </p>
          </div>
        </div>

        {/* Desktop View: Full Checkout Summary */}
        <div className="hidden md:flex flex-col h-full p-8 lg:p-12 relative overflow-y-auto custom-scrollbar">
          <button
            onClick={reset}
            className="flex items-center text-[11px] font-bold text-textMuted uppercase tracking-widest hover:text-textMain transition-colors mb-12 group w-fit"
          >
            <ArrowLeft
              size={14}
              strokeWidth={2.5}
              className="mr-2 group-hover:-translate-x-1 transition-transform"
            />
            {step === 5 ? "Go Home" : "Cancel and Return"}
          </button>

          <div className="mb-2">
            <p className="text-xs font-bold text-textMuted uppercase tracking-widest truncate mb-2">
              funding to email:{" "}
              {user?.email || "unknown back to the first page critical!!"}
            </p>
            <h1 className="text-5xl lg:text-5xl font-black text-textMain tracking-tighter">
              <span className="text-2xl text-textMuted/50 mr-1 font-bold">
                ETB
              </span>
              {amount ? formattedAmount : "0.00"}
            </h1>
          </div>

          <div className="mt-12 bg-background border border-border rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-border pb-3 mb-3">
              <span className="text-xs font-bold text-textMuted uppercase tracking-widest">
                Order Summary
              </span>
              <div className="flex items-center gap-1.5 bg-surfaceHover px-2 py-0.5 rounded text-[10px] font-bold text-textMuted border border-border">
                <Clock size={10} /> {new Date().toLocaleDateString()}
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm font-medium">
                <span className="text-textMuted">Deposit Amount</span>
                <span className="text-textMain">ETB {formattedAmount}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-medium">
                <span className="text-textMuted">Network Fee</span>
                <span className="text-textMain">Free</span>
              </div>
            </div>
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-border font-black text-lg">
              <span className="text-textMain">Total</span>
              <span className="text-textMain">ETB {formattedAmount}</span>
            </div>
          </div>

          <div className="mt-auto pt-10">
            <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-4 flex items-center gap-3">
              <ShieldCheck size={20} className="text-emerald-500 shrink-0" />
              <div>
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                  Secure Checkout
                </p>
                <p className="text-[10px] text-emerald-600/70 font-medium">
                  Guaranteed encrypted transaction.
                </p>
              </div>
            </div>

            <div className="flex gap-4 mt-6 text-[10px] font-bold text-textMuted uppercase tracking-widest">
              <a
                href="#"
                className="hover:text-textMain transition-colors underline underline-offset-4"
              >
                Terms
              </a>
              <a
                href="#"
                className="hover:text-textMain transition-colors underline underline-offset-4"
              >
                Privacy
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right Content Area ── */}
      <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar relative z-10 bg-background">
        <div className="flex-1 flex flex-col items-center w-full px-4 py-8 md:p-12 lg:p-16">
          <div className="w-full max-w-lg mx-auto flex flex-col">
            {step < 5 && <ProgressBar step={step} total={3} />}

            <div className="w-full relative min-h-[400px] flex flex-col">
              {step === 2 && <StepBank />}
              {step === 3 && <StepVerMethod />}
              {step === 4 && <StepProof />}
              {step === 5 && <StepResult />}
            </div>

            {/* Mobile Navigation hidden since forms will control Back internally */}
            <div className="md:hidden mt-8 flex flex-col gap-3">
              {step === 5 && !isGateway && (
                <button
                  onClick={reset}
                  className="btn-secondary w-full h-12 text-base font-bold shadow-sm"
                >
                  Start a new deposit
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
