"use client";

import { useState } from "react";
import { addTransaction, loadTransactions } from "@/lib/storage/transactions";

export default function TransactionSeedDemo() {
  const [count, setCount] = useState<number>(() => loadTransactions().length);
  const [lastSeededId, setLastSeededId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleSeedDemo() {
    try {
      const tx = addTransaction({
        occurredAt: new Date().toISOString(),
        amountCents: 1299,
        merchantRaw: "Demo Coffee Shop",
        category: "Food & Drink",
        note: "Seed demo transaction",
      });
      setLastSeededId(tx.id);
      setCount(loadTransactions().length);
      setError(null);
    } catch (seedError) {
      setError(seedError instanceof Error ? seedError.message : "Failed to seed demo transaction.");
    }
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4">
      <h3 className="text-base font-semibold text-slate-900">Part 1 Demo</h3>
      <p className="mt-2 text-sm text-slate-700">Transactions in local storage: {count}</p>
      <button
        className="mt-3 rounded bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700"
        onClick={handleSeedDemo}
        type="button"
      >
        Seed Demo Transaction
      </button>
      {lastSeededId ? (
        <p className="mt-2 text-sm text-green-700">Seeded transaction id: {lastSeededId}</p>
      ) : null}
      {error ? <p className="mt-2 text-sm text-red-700">{error}</p> : null}
    </section>
  );
}
