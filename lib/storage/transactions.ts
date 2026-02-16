import type { EditableFields, NewTransactionInput, Transaction } from "@/lib/types";

// Versioned localStorage key for transaction persistence.
export const TRANSACTIONS_STORAGE_KEY = "money-diary:transactions:v1";

function canUseLocalStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function isValidIsoTimestamp(value: string): boolean {
  if (!value.trim()) {
    return false;
  }

  const parsed = Date.parse(value);
  return Number.isFinite(parsed);
}

function normalizeRequiredText(value: string, fieldName: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error(`${fieldName} must be a non-empty string.`);
  }
  return trimmed;
}

function normalizeOptionalNote(note?: string): string | undefined {
  if (typeof note !== "string") {
    return undefined;
  }

  const trimmed = note.trim();
  return trimmed ? trimmed : undefined;
}

function normalizeAmountCents(amountCents: number): number {
  if (!Number.isFinite(amountCents) || !Number.isInteger(amountCents) || amountCents <= 0) {
    throw new Error("amountCents must be a finite integer greater than 0.");
  }
  return amountCents;
}

function normalizeOccurredAt(occurredAt: string): string {
  const trimmed = occurredAt.trim();
  if (!isValidIsoTimestamp(trimmed)) {
    throw new Error("occurredAt must be a valid ISO timestamp.");
  }
  return trimmed;
}

function uuidFallback(): string {
  const template = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";

  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  }

  return template.replace(/[xy]/g, (char) => {
    const random = Math.floor(Math.random() * 16);
    const value = char === "x" ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
}

function generateUuid(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return uuidFallback();
}

function normalizeForCreate(input: NewTransactionInput): Omit<Transaction, "id" | "createdAt"> {
  return {
    occurredAt: normalizeOccurredAt(input.occurredAt),
    amountCents: normalizeAmountCents(input.amountCents),
    currency: "USD",
    merchantRaw: normalizeRequiredText(input.merchantRaw, "merchantRaw"),
    category: normalizeRequiredText(input.category, "category"),
    note: normalizeOptionalNote(input.note),
  };
}

function normalizePatch(patch: Partial<EditableFields>): Partial<EditableFields> {
  const normalized: Partial<EditableFields> = {};

  if (patch.occurredAt !== undefined) {
    normalized.occurredAt = normalizeOccurredAt(patch.occurredAt);
  }
  if (patch.amountCents !== undefined) {
    normalized.amountCents = normalizeAmountCents(patch.amountCents);
  }
  if (patch.merchantRaw !== undefined) {
    normalized.merchantRaw = normalizeRequiredText(patch.merchantRaw, "merchantRaw");
  }
  if (patch.category !== undefined) {
    normalized.category = normalizeRequiredText(patch.category, "category");
  }
  if (patch.note !== undefined) {
    normalized.note = normalizeOptionalNote(patch.note);
  }

  return normalized;
}

function isTransaction(value: unknown): value is Transaction {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Transaction;
  const hasOptionalNote = candidate.note === undefined || typeof candidate.note === "string";

  return (
    typeof candidate.id === "string" &&
    isValidIsoTimestamp(candidate.occurredAt) &&
    Number.isFinite(candidate.amountCents) &&
    Number.isInteger(candidate.amountCents) &&
    candidate.amountCents > 0 &&
    candidate.currency === "USD" &&
    typeof candidate.merchantRaw === "string" &&
    candidate.merchantRaw.trim().length > 0 &&
    typeof candidate.category === "string" &&
    candidate.category.trim().length > 0 &&
    hasOptionalNote &&
    typeof candidate.createdAt === "string" &&
    isValidIsoTimestamp(candidate.createdAt)
  );
}

function sanitizeTransactions(input: unknown): Transaction[] {
  if (!Array.isArray(input)) {
    return [];
  }

  return input.filter(isTransaction).map((tx) => ({
    ...tx,
    merchantRaw: tx.merchantRaw.trim(),
    category: tx.category.trim(),
    note: normalizeOptionalNote(tx.note),
  }));
}

function readRawTransactions(): Transaction[] {
  if (!canUseLocalStorage()) {
    return [];
  }

  try {
    const serialized = window.localStorage.getItem(TRANSACTIONS_STORAGE_KEY);
    if (!serialized) {
      return [];
    }

    return sanitizeTransactions(JSON.parse(serialized));
  } catch {
    return [];
  }
}

export function loadTransactions(): Transaction[] {
  return readRawTransactions();
}

// Call this only in browser contexts; it no-ops on the server.
export function saveTransactions(txs: Transaction[]): void {
  if (!canUseLocalStorage()) {
    return;
  }

  const sanitized = sanitizeTransactions(txs);
  window.localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(sanitized));
}

export function addTransaction(input: NewTransactionInput): Transaction {
  const next: Transaction = {
    id: generateUuid(),
    createdAt: new Date().toISOString(),
    ...normalizeForCreate(input),
  };

  const existing = loadTransactions();
  saveTransactions([...existing, next]);
  return next;
}

export function updateTransaction(id: string, patch: Partial<EditableFields>): Transaction | null {
  const normalizedId = id.trim();
  if (!normalizedId) {
    return null;
  }

  const normalizedPatch = normalizePatch(patch);
  const existing = loadTransactions();
  const index = existing.findIndex((tx) => tx.id === normalizedId);

  if (index < 0) {
    return null;
  }

  const current = existing[index];
  const updated: Transaction = {
    ...current,
    ...normalizedPatch,
    currency: "USD",
    note: normalizeOptionalNote(normalizedPatch.note ?? current.note),
  };

  existing[index] = updated;
  saveTransactions(existing);
  return updated;
}

export function deleteTransaction(id: string): boolean {
  const normalizedId = id.trim();
  if (!normalizedId) {
    return false;
  }

  const existing = loadTransactions();
  const next = existing.filter((tx) => tx.id !== normalizedId);

  if (next.length === existing.length) {
    return false;
  }

  saveTransactions(next);
  return true;
}

export function clearTransactions(): void {
  if (!canUseLocalStorage()) {
    return;
  }

  window.localStorage.removeItem(TRANSACTIONS_STORAGE_KEY);
}
