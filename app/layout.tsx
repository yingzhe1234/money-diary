import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Money Diary",
  description: "Expense tracking MVP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="min-h-screen bg-slate-50">
          <header className="border-b border-slate-200 bg-white">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
              <h1 className="text-lg font-semibold text-slate-900">Money Diary</h1>
              <nav className="flex items-center gap-4 text-sm font-medium text-slate-700">
                <Link className="rounded px-2 py-1 hover:bg-slate-100" href="/">
                  Add Expense
                </Link>
                <Link className="rounded px-2 py-1 hover:bg-slate-100" href="/dashboard">
                  Dashboard
                </Link>
              </nav>
            </div>
          </header>
          <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
