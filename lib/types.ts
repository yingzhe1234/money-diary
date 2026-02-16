export type Currency = "USD";

export type Transaction = {
  id: string;
  occurredAt: string;
  amountCents: number;
  currency: Currency;
  merchantRaw: string;
  category: string;
  note?: string;
  createdAt: string;
};

export type NewTransactionInput = {
  occurredAt: string;
  amountCents: number;
  merchantRaw: string;
  category: string;
  note?: string;
};

export type EditableFields = Pick<
  Transaction,
  "occurredAt" | "amountCents" | "merchantRaw" | "category" | "note"
>;
