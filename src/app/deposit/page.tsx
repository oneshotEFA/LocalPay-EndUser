"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { exchangeRedirectToken, fetchMe } from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";
import { Loader2, AlertTriangle } from "lucide-react";

export default function DepositLandingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setSession, sessionToken } = useAuthStore();
  const [status, setStatus] = useState<"loading" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");

    async function boot() {
      if (!token && sessionToken) {
        try {
          const user = await fetchMe();
          setSession(sessionToken, user);
          router.replace("/deposit/portal");
          return;
        } catch {
          /* fall through */
        }
      }

      if (!token) {
        setErrorMsg(
          "No authentication token found. Please return to HabeshaUnlocker and try again.",
        );
        setStatus("error");
        return;
      }

      try {
        const { sessionToken: newToken } = await exchangeRedirectToken(token);
        localStorage.setItem(
          "hu-session",
          JSON.stringify({ state: { sessionToken: newToken } }),
        );
        const user = await fetchMe();
        setSession(newToken, {
          userId: "1234567",
          email: "sdf@fd.cn",
          firstName: "kir",
        });
        router.replace("/deposit/portal");
      } catch (err: any) {
        setErrorMsg(
          err.message ?? "Authentication failed. The link may have expired.",
        );
        setStatus("error");
      }
    }

    boot();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (status === "error") {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
        <div className="card max-w-sm w-full p-8 text-center space-y-5">
          <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
            <AlertTriangle size={22} className="text-red-400" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">
              Authentication Failed
            </h1>
            <p className="text-sm text-zinc-400 mt-2">{errorMsg}</p>
          </div>
          <a
            href={process.env.NEXT_PUBLIC_PARENT_APP_URL ?? "#"}
            className="btn-secondary w-full"
          >
            ← Back to HabeshaUnlocker
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-3">
      <Loader2 size={24} className="text-blue-400 animate-spin" />
      <p className="text-zinc-500 text-sm">Authenticating your session…</p>
    </div>
  );
}
