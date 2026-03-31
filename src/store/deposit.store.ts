import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type PaymentMethod = "CBE" | "TELEBIRR" | "EBIRR" | "ABYSSINIA" | "NIB";
export type VerificationMethod = "LINK" | "SCREENSHOT" | "SMS";

export interface GatewaySession {
  checkoutId: string;
  invoiceId: string;
  amount: number;
  expiresAt?: number; // timestamp ms
  clientId: string;
}

export interface DepositState {
  step: number;
  amount: number | null;
  paymentMethod: PaymentMethod | null;
  verificationMethod: VerificationMethod | null;
  rawProof: string | null;
  screenshotFile: File | null;
  result: any | null;
  loading: boolean;
  error: string | null;
  gatewaySession: GatewaySession | null;
  setStep: (s: number) => void;
  setAmount: (a: number) => void;
  setPaymentMethod: (p: PaymentMethod) => void;
  setVerificationMethod: (v: VerificationMethod) => void;
  setRawProof: (r: string) => void;
  setScreenshotFile: (f: File) => void;
  setResult: (r: any) => void;
  setLoading: (l: boolean) => void;
  setError: (e: string | null) => void;
  setGatewaySession: (s: GatewaySession | null) => void;
  reset: () => void;
}

const initial = {
  step: 2,
  amount: null,
  paymentMethod: null,
  verificationMethod: null,
  rawProof: null,
  screenshotFile: null,
  result: null,
  loading: false,
  error: null,
  gatewaySession: null,
};

const SESSION_TTL_MS = 20 * 60 * 1000; // 20 minutes

export const useDepositStore = create<DepositState>()(
  persist(
    (set, get) => ({
      ...initial,
      setStep: (step) => set({ step }),
      setAmount: (amount) => set({ amount }),
      setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
      setVerificationMethod: (verificationMethod) =>
        set({ verificationMethod }),
      setRawProof: (rawProof) => set({ rawProof }),
      setScreenshotFile: (screenshotFile) => set({ screenshotFile }),
      setResult: (result) => set({ result }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      setGatewaySession: (gatewaySession) => {
        // attach expiry when setting
        if (gatewaySession) {
          set({
            gatewaySession: {
              ...gatewaySession,
              expiresAt: Date.now() + SESSION_TTL_MS,
            },
            amount: gatewaySession.amount,
          });
        } else {
          set({ gatewaySession: null });
        }
      },
      reset: () => set(initial),
    }),
    {
      name: "deposit-gateway-session",
      storage: createJSONStorage(() => sessionStorage),
      // only persist gateway-relevant fields — not loading/error/file state
      partialize: (state) => ({
        gatewaySession: state.gatewaySession,
        amount: state.amount,
        step: state.step,
      }),
      // on rehydrate, check if session expired
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        const s = state.gatewaySession;
        if (s && Date.now() > (s.expiresAt ?? 0)) {
          state.setGatewaySession(null);
          state.reset();
        }
      },
    },
  ),
);
