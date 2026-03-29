"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Wallet, ClipboardList, LogOut, Loader2, Moon, Sun } from "lucide-react";
import DepositFlow from "@/components/deposit/DepositFlow";
import HistoryPanel from "@/components/history/HistoryPanel";
import { useTheme } from "../../../../providers/ThemeProvider";

type Tab = "deposit" | "history";

interface User {
  userId: string;
  email: string;
}

export default function PortalPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState<Tab>("deposit");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => {
        if (!res.ok) throw new Error("unauthenticated");
        return res.json();
      })
      .then((data: User) => {
        setUser(data);
        setReady(true);
      })
      .catch(() => {
        router.replace("/deposit");
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSignOut() {
    await fetch("/api/auth/session", { method: "DELETE" }).catch(() => {});
    router.replace("/deposit");
  }

  if (!ready) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 size={22} className="text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background text-textMain">
      {/* ── Sidebar (Desktop: Icon-only collapsed) ── */}
      <aside className="hidden md:flex flex-col w-16 border-r border-border bg-surface shrink-0 items-center py-5 z-50">
        <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-sm mb-8 shadow-sm">
          H
        </div>
        
        <div className="flex flex-col gap-4 flex-1 w-full items-center">
          <button
            onClick={() => setTab("deposit")}
            className={`p-2.5 rounded-xl transition-all ${
              tab === "deposit"
                ? "bg-blue-600/10 text-blue-500 scale-105"
                : "text-textMuted hover:bg-surfaceHover hover:text-textMain"
            }`}
            title="Deposit"
          >
            <Wallet size={20} strokeWidth={tab === "deposit" ? 2.5 : 2} />
          </button>
          <button
            onClick={() => setTab("history")}
            className={`p-2.5 rounded-xl transition-all ${
              tab === "history"
                ? "bg-blue-600/10 text-blue-500 scale-105"
                : "text-textMuted hover:bg-surfaceHover hover:text-textMain"
            }`}
            title="History"
          >
            <ClipboardList size={20} strokeWidth={tab === "history" ? 2.5 : 2} />
          </button>
        </div>

        {/* Sidebar Footer Icons */}
        <div className="flex flex-col gap-4 w-full items-center mt-auto">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2.5 rounded-xl text-textMuted hover:bg-surfaceHover hover:text-textMain transition-colors"
            title="Toggle Theme"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            onClick={handleSignOut}
            className="p-2.5 rounded-xl text-textMuted hover:bg-surfaceHover hover:text-red-400 transition-colors"
            title="Sign out"
          >
            <LogOut size={20} />
          </button>
        </div>
      </aside>

      {/* ── Mobile Bottom Nav ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-border bg-surface z-50 flex items-center justify-around h-16 pb-safe">
        <button
          onClick={() => setTab("deposit")}
          className={`flex flex-col items-center justify-center gap-1 w-full h-full ${
            tab === "deposit" ? "text-blue-500" : "text-textMuted"
          }`}
        >
          <Wallet size={20} strokeWidth={tab === "deposit" ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Deposit</span>
        </button>
        <button
          onClick={() => setTab("history")}
          className={`flex flex-col items-center justify-center gap-1 w-full h-full border-l border-border/50 ${
            tab === "history" ? "text-blue-500" : "text-textMuted"
          }`}
        >
          <ClipboardList size={20} strokeWidth={tab === "history" ? 2.5 : 2} />
          <span className="text-[10px] font-medium">History</span>
        </button>
      </nav>

      {/* ── Main Context Container ── */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0 h-screen bg-surface">
        {/* Conditional Topbar ONLY for History */}
        {tab === "history" && (
          <header className="h-16 px-4 md:px-8 border-b border-border bg-surface/50 backdrop-blur shrink-0 flex items-center justify-between sticky top-0 z-40">
            <div className="flex flex-col">
              <h1 className="font-semibold text-lg md:text-xl text-textMain tracking-tight">
                Transaction History
              </h1>
            </div>

            {/* User Info & Mobile Actions */}
            <div className="flex items-center gap-3">
              <span className="hidden sm:block text-xs text-textMuted font-medium truncate max-w-[200px] border-r border-border pr-4">
                {user?.email}
              </span>

              {/* Mobile Actions */}
              <div className="flex md:hidden items-center gap-1">
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="p-2 rounded-lg text-textMuted hover:bg-surfaceHover transition-colors"
                >
                  {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                </button>
                <button
                  onClick={handleSignOut}
                  className="p-2 rounded-lg text-textMuted hover:bg-surfaceHover transition-colors"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          </header>
        )}

        {/* Scrollable Content */}
        {tab === "deposit" ? (
          <main className="flex-1 overflow-hidden w-full h-full animate-fade-in flex flex-col">
            <DepositFlow user={user} />
          </main>
        ) : (
          <main className="flex-1 overflow-y-auto p-4 md:p-8 animate-fade-in custom-scrollbar bg-background">
            <div className="mx-auto w-full max-w-2xl">
              <HistoryPanel />
            </div>
          </main>
        )}
      </div>
    </div>
  );
}
