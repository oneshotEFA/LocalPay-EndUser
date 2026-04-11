"use client";

import { useDepositStore } from "@/store/deposit.store";
import { useReceivingAccounts } from "@/lib/queries";
import { Loader2, Copy, Check, ArrowRight } from "lucide-react";
import { useState, Fragment } from "react";
import clsx from "clsx";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        copy();
      }}
      className="ml-2 p-1.5 rounded-lg hover:bg-border transition-colors shrink-0 outline-none focus:ring-2 focus:ring-blue-500/50"
      title="Copy"
    >
      {copied ? (
        <Check size={14} className="text-green-500" />
      ) : (
        <Copy size={13} className="text-textMuted" />
      )}
    </button>
  );
}

export default function StepBank() {
  const { paymentMethod, setPaymentMethod, setStep, gatewaySession } =
    useDepositStore();

  const { data, isLoading, error } = useReceivingAccounts(
    gatewaySession?.clientId ?? "",
    gatewaySession?.checkoutId ?? "",
  );

  // ✅ FIX 1: normalize safely (THIS was your crash root cause)
  const accounts = Array.isArray(data) ? data : [];

  // Selected matched account (safe now)
  const activeAccount = accounts.find((a) => a.paymentMethod === paymentMethod);

  const renderDetailsPanel = () => (
    <>
      <p className="text-[10px] font-black text-textMuted tracking-widest uppercase mb-3 px-1">
        Receiving Account Details
      </p>

      <div className="card p-4 md:p-5 bg-background shadow-inner border border-border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mb-5">
          <div className="space-y-1 md:space-y-0">
            <p className="text-[10px] font-bold text-textMuted uppercase tracking-wider md:mb-1">
              Account Name
            </p>

            <p className="text-sm md:text-base font-bold text-textMain px-3 py-2.5 md:py-1.5 bg-surfaceHover rounded-lg border border-border/50 truncate">
              {activeAccount?.accountName || "-"}
            </p>
          </div>

          <div className="space-y-1 md:space-y-0">
            <p className="text-[10px] font-bold text-textMuted uppercase tracking-wider md:mb-1">
              Account Number
            </p>

            <div className="flex items-center justify-between px-3 py-2 bg-surfaceHover rounded-lg border border-border/50">
              <p className="text-base md:text-lg font-mono font-black text-textMain tracking-tight">
                {activeAccount?.accountNumber || "-"}
              </p>
              <CopyButton text={activeAccount?.accountNumber || ""} />
            </div>
          </div>
        </div>

        <button
          onClick={() => setStep(3)}
          disabled={!paymentMethod || isLoading || !activeAccount}
          className="btn-primary w-full h-14 text-base font-bold flex items-center justify-center gap-2 group shadow-md disabled:opacity-50"
        >
          Confirm & Proceed
          <ArrowRight
            size={18}
            strokeWidth={2.5}
            className="group-hover:translate-x-1 transition-transform"
          />
        </button>
      </div>
    </>
  );

  return (
    <div className="flex flex-col w-full animate-fade-in-up stagger">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1">
          <h2 className="text-xl md:text-2xl font-black text-textMain tracking-tight">
            Select Payment Method
          </h2>
          <p className="text-sm font-medium text-textMuted mt-1">
            Choose how you want to pay with LocalPay.
          </p>
        </div>
      </div>

      {/* LOADING */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-textMuted text-sm">
          <Loader2 size={24} className="animate-spin text-blue-500" />
          Loading available banks...
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div className="rounded-xl p-4 text-sm font-medium text-red-500 bg-red-500/10 border border-red-500/20 mb-6">
          {(error as Error).message}
        </div>
      )}

      {/* EMPTY STATE FIX (only safe check) */}
      {!isLoading && !error && accounts.length === 0 && (
        <div className="rounded-xl p-4 text-sm font-medium text-red-500 bg-red-500/10 border border-red-500/20 mb-6">
          No available banks found. Please contact support or try again later.
        </div>
      )}

      {/* MAIN UI (UNCHANGED STRUCTURE) */}
      {!isLoading && !error && accounts.length > 0 && (
        <>
          <div className="card border-border shadow-sm p-3 md:p-6 mb-8 relative z-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {accounts.map((account, index) => {
                const isSelected = account.paymentMethod === paymentMethod;
                const isRecommended = index === 1;

                return (
                  <Fragment key={account.paymentMethod}>
                    <button
                      onClick={() =>
                        setPaymentMethod(account.paymentMethod as string)
                      }
                      className={clsx(
                        "relative group flex items-center md:flex-col md:justify-center p-4 rounded-xl transition-all duration-200 outline-none w-full",
                        "border shadow-sm hover:shadow-md",
                        "md:aspect-[4/3]",
                        isSelected
                          ? "border-blue-500 bg-blue-600/5 ring-1 ring-blue-500"
                          : "border-border bg-background hover:border-textMuted",
                      )}
                    >
                      {isRecommended && !isSelected && (
                        <span className="absolute -top-2 md:left-1/2 md:-translate-x-1/2 right-4 md:right-auto bg-yellow-400 text-yellow-900 text-[8px] font-black px-2 py-0.5 rounded-full tracking-widest uppercase shadow-sm whitespace-nowrap z-10">
                          Top Choice
                        </span>
                      )}

                      {isSelected && (
                        <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                          <Check
                            size={10}
                            strokeWidth={4}
                            className="text-white"
                          />
                        </div>
                      )}

                      <div
                        className={clsx(
                          "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform duration-300 md:mb-4 outline outline-1 outline-border",
                          isSelected
                            ? "scale-110 outline-blue-500/50"
                            : "group-hover:scale-105",
                        )}
                      >
                        <img
                          src={
                            account.bankLogoUrl.length > 0
                              ? account.bankLogoUrl
                              : "/placeholder-bank.png"
                          }
                          alt={`${account.paymentMethod} logo`}
                          className="w-full h-full object-cover rounded-2xl"
                        />
                      </div>

                      <span
                        className={clsx(
                          "text-sm md:text-xs -mt-1 font-bold md:text-center w-full truncate px-4 md:px-1 flex-1 text-left",
                          isSelected ? "text-textMain" : "text-textMuted",
                        )}
                      >
                        {account.paymentMethod}
                      </span>
                    </button>

                    {isSelected && activeAccount && (
                      <div className="md:hidden animate-fade-in-up mb-2">
                        {renderDetailsPanel()}
                      </div>
                    )}
                  </Fragment>
                );
              })}
            </div>
          </div>

          {activeAccount && (
            <div className="hidden md:block animate-fade-in-up">
              {renderDetailsPanel()}
            </div>
          )}
        </>
      )}
    </div>
  );
}
