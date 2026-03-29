"use client";

import { Check } from "lucide-react";

const STEPS = [
  { id: 2, label: "Bank" },
  { id: 3, label: "Verify" },
  { id: 4, label: "Proof" },
];

interface Props {
  step: number; 
  total: number;
}

export default function ProgressBar({ step }: Props) {
  // We map internal steps (1-5) to display steps (Amount -> Proof)
  // Internal step 1 = Amount (index 1 of display but actually step 1 internally)
  // Let's normalize it:
  // Usually, `DepositFlow` calls `<ProgressBar step={step} ... />` when step > 1 and step < 5.
  // Wait, in my previous code it rendered for step > 1. Let's make it render for ALL steps (1 to 5)
  // and manage the current index based on `step`.
  
  // The normalized progress index:
  // Step 2 => Bank (Index 0)
  // Step 3 => Method (Index 1)
  // Step 4 => Proof (Index 2)
  // Step 5 => Result (Index 3)

  const activeIndex = step - 2;

  return (
    <div className="w-full max-w-lg mx-auto mb-8">
      {/* Segmented Dashes */}
      <div className="flex items-center justify-between gap-2">
        {STEPS.map((s, i) => {
          const isActive = i === activeIndex;
          const isDone = i < activeIndex;

          return (
            <div key={s.id} className="flex-1 flex flex-col gap-2">
              <div
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  isActive
                    ? "bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.4)]"
                    : isDone
                    ? "bg-blue-600/40"
                    : "bg-surfaceHover border border-border"
                }`}
              />
              <div className="flex items-center gap-1.5 px-1">
                {isDone ? (
                  <div className="w-3 h-3 rounded-full bg-blue-600 flex items-center justify-center">
                    <Check size={8} strokeWidth={4} className="text-white" />
                  </div>
                ) : (
                  <div
                    className={`w-3 h-3 rounded-full border-2 transition-colors duration-300 flex-shrink-0 ${
                      isActive ? "border-blue-600 bg-background" : "border-border bg-surfaceHover"
                    }`}
                  />
                )}
                <span
                  className={`text-[10px] font-bold uppercase tracking-widest transition-colors duration-300 ${
                    isActive ? "text-textMain" : isDone ? "text-textMuted" : "text-textMuted/40"
                  }`}
                >
                  {s.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
