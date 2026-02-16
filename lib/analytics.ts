import type { Transaction } from "@/lib/types";

export function getCurrentMonthYYYYMM(now: Date = new Date()): string {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

function toLocalYYYYMM(isoTimestamp: string): string | null {
  const date = new Date(isoTimestamp);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

export function filterTransactionsByMonth(txs: Transaction[], monthYYYYMM: string): Transaction[] {
  return txs.filter((tx) => toLocalYYYYMM(tx.occurredAt) === monthYYYYMM);
}

export function sumAmountCents(txs: Transaction[]): number {
  return txs.reduce((sum, tx) => sum + tx.amountCents, 0);
}

export function groupByCategory(
  txs: Transaction[],
): Array<{ categoryId: string; totalCents: number }> {
  const totals = new Map<string, number>();

  for (const tx of txs) {
    const categoryId = tx.category.trim();
    if (!categoryId) {
      continue;
    }
    totals.set(categoryId, (totals.get(categoryId) ?? 0) + tx.amountCents);
  }

  return Array.from(totals.entries())
    .map(([categoryId, totalCents]) => ({ categoryId, totalCents }))
    .sort((a, b) => b.totalCents - a.totalCents);
}

export function groupByMerchant(
  txs: Transaction[],
): Array<{ merchant: string; totalCents: number }> {
  const totals = new Map<string, number>();

  for (const tx of txs) {
    const merchant = tx.merchantRaw.trim();
    if (!merchant) {
      continue;
    }
    totals.set(merchant, (totals.get(merchant) ?? 0) + tx.amountCents);
  }

  return Array.from(totals.entries())
    .map(([merchant, totalCents]) => ({ merchant, totalCents }))
    .sort((a, b) => b.totalCents - a.totalCents);
}
