"use client";

import { useState, useRef } from "react";
import { useDepositStore } from "@/store/deposit.store";
import { submitSingleDeposit } from "@/lib/api";
import { fetchExtractedText } from "@/lib/extraction";
import { Loader2, ArrowLeft } from "lucide-react";
import TextProofInput from "./TextProofInput";
import ScreenshotUpload from "./ScreenshotUpload";
import ErrorBox from "../../ui/ErrorBox";

const FAKE_STEPS = [
  "Securing connection...",
  "Extracting receipt parameters...",
  "Parsing transaction details...",
  "Authenticating with backend...",
  "Finalizing verification...",
];

export default function StepProof() {
  const {
    verificationMethod,
    paymentMethod,
    amount,
    gatewaySession,
    setRawProof,
    setScreenshotFile,
    setResult,
    setStep,
    setLoading,
    setError,
    loading,
    error,
  } = useDepositStore();

  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [accountNumber, setAccountNumber] = useState("");
  const [loadingText, setLoadingText] = useState("");
  const isSubmittingRef = useRef(false);

  function handleFile(f: File) {
    setFile(f);
    setScreenshotFile(f);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(f);
  }

  function clearFile() {
    setFile(null);
    setPreview(null);
  }

  async function submit() {
    setError(null);

    if (verificationMethod === "SCREENSHOT" && !file) {
      setError("Please upload a screenshot.");
      return;
    }
    if (verificationMethod === "SCREENSHOT" && !accountNumber.trim()) {
      setError("Please enter your sender account number.");
      return;
    }
    if (
      (verificationMethod === "SMS" || verificationMethod === "LINK") &&
      !text.trim()
    ) {
      setError("Please paste the required text.");
      return;
    }

    setLoading(true);
    isSubmittingRef.current = true;

    const runSimulation = async () => {
      for (let i = 0; i < FAKE_STEPS.length; i++) {
        if (!isSubmittingRef.current) break;
        setLoadingText(FAKE_STEPS[i]);
        if (i < FAKE_STEPS.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 800));
        }
      }
    };

    try {
      const simPromise = runSimulation();
      const apiPromise = (async () => {
        let proofText = text.trim();
        let effectiveMethod = verificationMethod!;

        if (verificationMethod === "SCREENSHOT" && file) {
          try {
            proofText = await fetchExtractedText(file, file.name);
            effectiveMethod = "SMS";
          } catch (err: any) {
            throw new Error(
              err?.message ??
                "Failed to read the screenshot. Please try again.",
            );
          }
        }
        console.log(gatewaySession?.clientId);
        return await submitSingleDeposit({
          amount: amount!,
          paymentMethod: paymentMethod!,
          verificationMethod: effectiveMethod,
          rawProof: proofText || undefined,
          accountNumber: accountNumber.trim() || undefined,
          checkoutId: gatewaySession?.checkoutId,
          clientId: gatewaySession?.clientId,
        });
      })();

      const [, result] = await Promise.all([simPromise, apiPromise]);

      if (gatewaySession && result.successUrl) {
        window.location.href = result.successUrl;
        return;
      }

      setResult(result);
      setStep(5);
    } catch (e: any) {
      setError(e.message);
    } finally {
      isSubmittingRef.current = false;
      setLoading(false);
    }
  }

  const LABELS: Record<string, { title: string; desc: string }> = {
    LINK: {
      title: "Provide Link",
      desc: "Paste the raw transaction URL below.",
    },
    SMS: {
      title: "Provide SMS",
      desc: "Paste the exact message body below.",
    },
    SCREENSHOT: {
      title: "Upload Screenshot",
      desc: "Drop your clear receipt screenshot below.",
    },
  };
  const label = LABELS[verificationMethod!] ?? { title: "", desc: "" };

  return (
    <div className="flex flex-col w-full animate-fade-in-up stagger">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => setStep(3)}
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surfaceHover text-textMuted hover:text-textMain transition-colors shrink-0 outline-none focus:ring-2 focus:ring-blue-500/50 ring-offset-2 ring-offset-background"
          aria-label="Go back"
        >
          <ArrowLeft size={16} strokeWidth={2.5} />
        </button>
        <div className="flex-1">
          <h2 className="text-2xl font-black text-textMain tracking-tight">
            {label.title}
          </h2>
          <p className="text-sm font-medium text-textMuted mt-1">
            {label.desc}
          </p>
        </div>
      </div>

      <div className="card shadow-sm border-border p-5 md:p-6 mb-8 relative z-0">
        {(verificationMethod === "SMS" || verificationMethod === "LINK") && (
          <TextProofInput
            verificationMethod={verificationMethod}
            value={text}
            onChange={(val) => {
              setText(val);
              setRawProof(val);
            }}
          />
        )}

        {verificationMethod === "SCREENSHOT" && (
          <ScreenshotUpload
            preview={preview}
            fileName={file?.name ?? null}
            onFile={handleFile}
            onClear={clearFile}
            accountNumber={accountNumber}
            onAccountNumberChange={setAccountNumber}
          />
        )}

        {error && (
          <div className="mt-6">
            <ErrorBox message={error} />
          </div>
        )}

        <button
          onClick={submit}
          disabled={loading}
          className="btn-primary w-full h-14 text-base font-bold shadow-md mt-6 flex items-center justify-center gap-2 relative overflow-hidden group"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2 animate-pulse">
              <Loader2 size={18} className="animate-spin text-white/80" />
              <span className="font-mono text-sm tracking-tight">
                {loadingText}
              </span>
            </div>
          ) : (
            "Submit Proof"
          )}
        </button>
      </div>
    </div>
  );
}
