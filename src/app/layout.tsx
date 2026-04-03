import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "../../providers/QueryProvider";
import { ThemeProvider } from "../../providers/ThemeProvider";

export const metadata: Metadata = {
  title: "LocalPay — Deposit",
  description: "Deposit funds securely into your LocalPay account.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-textMain antialiased">
        <ThemeProvider>
          <QueryProvider>{children}</QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
