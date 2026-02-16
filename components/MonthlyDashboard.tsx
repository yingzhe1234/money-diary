"use client";

import { useEffect, useMemo, useState } from "react";
import MonthPicker from "@/components/MonthPicker";
import { CATEGORIES } from "@/lib/categories";
import { formatUsdFromCents } from "@/lib/format";
import {
  filterTransactionsByMonth,
  getCurrentMonthYYYYMM,
  groupByCategory,
  groupByMerchant,
  sumAmountCents,
} from "@/lib/analytics";
import { loadTransactions } from "@/lib/storage/transactions";
import type { Transaction } from "@/lib/types";

export default function MonthlyDashboard() {
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthYYYYMM);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    queueMicrotask(() => {
      try {
        setTransactions(loadTransactions());
        setError(null);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Failed to load transactions.");
      }
    });
  }, []);

  const categoryLabelMap = useMemo(
    () => new Map<string, string>(CATEGORIES.map((category) => [category.id, category.label])),
    [],
  );

  const monthTransactions = useMemo(
    () => filterTransactionsByMonth(transactions, selectedMonth),
    [transactions, selectedMonth],
  );

  const totalCents = useMemo(() => sumAmountCents(monthTransactions), [monthTransactions]);
  const categoryRows = useMemo(() => groupByCategory(monthTransactions), [monthTransactions]);
  const merchantRows = useMemo(() => groupByMerchant(monthTransactions), [monthTransactions]);

  function refreshFromStorage() {
    try {
      setTransactions(loadTransactions());
      setError(null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to refresh transactions.");
    }
  }

  return (
    <section className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <MonthPicker onChange={setSelectedMonth} value={selectedMonth} />
          <div className="flex items-center gap-3">
            <p className="text-sm text-slate-600">
              {monthTransactions.length} transactions in this month
            </p>
            <button
              className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              onClick={refreshFromStorage}
              type="button"
            >
              Refresh
            </button>
          </div>
        </div>
        {error ? (
          <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        ) : null}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-medium text-slate-600">Monthly Total Spending</h3>
        <p className="mt-2 text-3xl font-semibold text-slate-900">
          {formatUsdFromCents(totalCents)}
        </p>
      </div>

      {monthTransactions.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
          No transactions for this month yet.
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">Category Breakdown</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-600">
                  <th className="pb-2 font-medium">Category</th>
                  <th className="pb-2 text-right font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {categoryRows.map((row) => (
                  <tr className="border-b border-slate-100 last:border-b-0" key={row.categoryId}>
                    <td className="py-2 text-slate-800">
                      {categoryLabelMap.get(row.categoryId) ?? row.categoryId}
                    </td>
                    <td className="py-2 text-right font-medium text-slate-900">
                      {formatUsdFromCents(row.totalCents)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">Top Merchants</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-600">
                  <th className="pb-2 font-medium">Merchant</th>
                  <th className="pb-2 text-right font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {merchantRows.map((row) => (
                  <tr className="border-b border-slate-100 last:border-b-0" key={row.merchant}>
                    <td className="py-2 text-slate-800">{row.merchant}</td>
                    <td className="py-2 text-right font-medium text-slate-900">
                      {formatUsdFromCents(row.totalCents)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>
      )}
    </section>
  );
}
