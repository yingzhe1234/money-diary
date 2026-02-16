"use client";

import { useEffect, useMemo, useState } from "react";
import { CATEGORIES } from "@/lib/categories";
import { formatUsdFromCents } from "@/lib/format";
import { deleteTransaction, loadTransactions } from "@/lib/storage/transactions";
import type { Transaction } from "@/lib/types";

type RecentTransactionsProps = {
  refreshToken: number;
  onDeleted: () => void;
};

function sortAndLimitTransactions(transactions: Transaction[]): Transaction[] {
  return [...transactions]
    .sort((a, b) => {
      const byOccurredAt = Date.parse(b.occurredAt) - Date.parse(a.occurredAt);
      if (byOccurredAt !== 0) {
        return byOccurredAt;
      }
      return Date.parse(b.createdAt) - Date.parse(a.createdAt);
    })
    .slice(0, 10);
}

function formatOccurredDate(occurredAt: string): string {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(occurredAt));
}

export default function RecentTransactions({ refreshToken, onDeleted }: RecentTransactionsProps) {
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    queueMicrotask(() => setMounted(true));
  }, []);

  const categoryLabelMap = useMemo(
    () => new Map<string, string>(CATEGORIES.map((category) => [category.id, category.label])),
    [],
  );

  const loadResult = useMemo(() => {
    void refreshToken;

    if (!mounted) {
      return {
        transactions: [] as Transaction[],
        error: null as string | null,
      };
    }

    try {
      const loaded = loadTransactions();
      return {
        transactions: sortAndLimitTransactions(loaded),
        error: null as string | null,
      };
    } catch (loadError) {
      return {
        transactions: [] as Transaction[],
        error: loadError instanceof Error ? loadError.message : "Failed to load transactions.",
      };
    }
  }, [mounted, refreshToken]);

  function handleDelete(id: string) {
    const deleted = deleteTransaction(id);
    if (deleted) {
      setDeleteError(null);
      onDeleted();
      return;
    }
    setDeleteError("Could not delete transaction.");
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Recent Transactions</h3>
        <span className="text-sm text-slate-600">
          Showing latest {mounted ? loadResult.transactions.length : "—"} entries
        </span>
      </div>

      {loadResult.error ? (
        <p className="mb-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {loadResult.error}
        </p>
      ) : null}
      {deleteError ? (
        <p className="mb-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{deleteError}</p>
      ) : null}

      {loadResult.transactions.length === 0 ? (
        <p className="rounded-md border border-dashed border-slate-300 px-4 py-6 text-sm text-slate-600">
          No transactions yet. Add your first expense above.
        </p>
      ) : (
        <ul className="divide-y divide-slate-200">
          {loadResult.transactions.map((tx) => (
            <li className="flex items-center justify-between gap-4 py-3" key={tx.id}>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-900">{tx.merchantRaw}</p>
                <p className="text-xs text-slate-600">
                  {categoryLabelMap.get(tx.category) ?? tx.category} ·{" "}
                  {formatOccurredDate(tx.occurredAt)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-sm font-semibold text-slate-900">
                  {formatUsdFromCents(tx.amountCents)}
                </p>
                <button
                  className="rounded border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
                  onClick={() => handleDelete(tx.id)}
                  type="button"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
