"use client";

import { useState } from "react";
import { addTransaction } from "@/lib/storage/transactions";
import { CATEGORIES } from "@/lib/categories";
import { parseDollarsToCents } from "@/lib/format";

type AddExpenseFormProps = {
  onAdded: () => void;
};

type FormErrors = {
  amountDollars?: string;
  occurredDate?: string;
  merchantRaw?: string;
  category?: string;
  form?: string;
};

type FormState = {
  amountDollars: string;
  occurredDate: string;
  merchantRaw: string;
  category: string;
  note: string;
};

function getTodayLocalDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isValidDateInput(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);
  const candidate = new Date(year, month - 1, day);
  return (
    candidate.getFullYear() === year &&
    candidate.getMonth() === month - 1 &&
    candidate.getDate() === day
  );
}

export default function AddExpenseForm({ onAdded }: AddExpenseFormProps) {
  const [formState, setFormState] = useState<FormState>({
    amountDollars: "",
    occurredDate: getTodayLocalDateString(),
    merchantRaw: "",
    category: CATEGORIES[0].id,
    note: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setFormState((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined, form: undefined }));
    setSuccessMessage(null);
  }

  function validate(): { ok: true; cents: number } | { ok: false } {
    const nextErrors: FormErrors = {};
    const parsedAmount = parseDollarsToCents(formState.amountDollars);

    if (!parsedAmount.ok) {
      nextErrors.amountDollars = parsedAmount.error;
    }

    if (!formState.merchantRaw.trim()) {
      nextErrors.merchantRaw = "Merchant is required.";
    }

    if (!formState.category.trim()) {
      nextErrors.category = "Category is required.";
    }

    if (!isValidDateInput(formState.occurredDate)) {
      nextErrors.occurredDate = "Please provide a valid date.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0 || !parsedAmount.ok) {
      return { ok: false };
    }

    return { ok: true, cents: parsedAmount.cents };
  }

  function resetAfterSuccess() {
    setFormState((current) => ({
      ...current,
      amountDollars: "",
      merchantRaw: "",
      note: "",
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const validation = validate();
    if (!validation.ok) {
      return;
    }

    setIsSubmitting(true);
    try {
      const [year, month, day] = formState.occurredDate.split("-").map(Number);
      // Use local noon before converting to ISO to avoid timezone date shifting around midnight.
      const occurredAt = new Date(year, month - 1, day, 12, 0, 0).toISOString();

      addTransaction({
        occurredAt,
        amountCents: validation.cents,
        merchantRaw: formState.merchantRaw.trim(),
        category: formState.category.trim(),
        note: formState.note.trim() || undefined,
      });

      setErrors({});
      setSuccessMessage("Expense saved.");
      resetAfterSuccess();
      onAdded();
    } catch (error) {
      setErrors({
        form: error instanceof Error ? error.message : "Failed to save expense.",
      });
      setSuccessMessage(null);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">Add Expense</h3>

      {successMessage ? (
        <p className="mt-3 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
          {successMessage}
        </p>
      ) : null}
      {errors.form ? (
        <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{errors.form}</p>
      ) : null}

      <form className="mt-4 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-800" htmlFor="amountDollars">
            Amount (USD)
          </label>
          <input
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-200 focus:ring"
            id="amountDollars"
            inputMode="decimal"
            onChange={(event) => updateField("amountDollars", event.target.value)}
            placeholder="12.34"
            type="text"
            value={formState.amountDollars}
          />
          {errors.amountDollars ? (
            <p className="mt-1 text-xs text-red-600">{errors.amountDollars}</p>
          ) : null}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-800" htmlFor="occurredDate">
            Date
          </label>
          <input
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-200 focus:ring"
            id="occurredDate"
            onChange={(event) => updateField("occurredDate", event.target.value)}
            type="date"
            value={formState.occurredDate}
          />
          {errors.occurredDate ? (
            <p className="mt-1 text-xs text-red-600">{errors.occurredDate}</p>
          ) : null}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-800" htmlFor="merchantRaw">
            Merchant
          </label>
          <input
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-200 focus:ring"
            id="merchantRaw"
            onChange={(event) => updateField("merchantRaw", event.target.value)}
            placeholder="Coffee shop"
            type="text"
            value={formState.merchantRaw}
          />
          {errors.merchantRaw ? (
            <p className="mt-1 text-xs text-red-600">{errors.merchantRaw}</p>
          ) : null}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-800" htmlFor="category">
            Category
          </label>
          <select
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-slate-200 focus:ring"
            id="category"
            onChange={(event) => updateField("category", event.target.value)}
            value={formState.category}
          >
            {CATEGORIES.map((category) => (
              <option key={category.id} value={category.id}>
                {category.label}
              </option>
            ))}
          </select>
          {errors.category ? <p className="mt-1 text-xs text-red-600">{errors.category}</p> : null}
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-800" htmlFor="note">
            Note (optional)
          </label>
          <textarea
            className="min-h-24 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-200 focus:ring"
            id="note"
            onChange={(event) => updateField("note", event.target.value)}
            placeholder="Add any details"
            value={formState.note}
          />
        </div>

        <div className="md:col-span-2">
          <button
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Saving..." : "Save Expense"}
          </button>
        </div>
      </form>
    </section>
  );
}
