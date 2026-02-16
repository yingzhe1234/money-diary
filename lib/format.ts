export function formatUsdFromCents(amountCents: number): string {
  const dollars = amountCents / 100;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(dollars);
}

export function parseDollarsToCents(
  input: string,
): { ok: true; cents: number } | { ok: false; error: string } {
  const trimmed = input.trim();

  if (!trimmed) {
    return { ok: false, error: "Amount is required." };
  }

  if (!/^\d+(\.\d{1,2})?$/.test(trimmed)) {
    return {
      ok: false,
      error: "Please enter dollars and cents (up to 2 decimals). Examples: 12, 12.30, 12.34.",
    };
  }

  const [wholePart, decimalPart = ""] = trimmed.split(".");
  const paddedDecimal = decimalPart.padEnd(2, "0");
  const cents = Number(`${wholePart}${paddedDecimal}`);

  if (!Number.isFinite(cents) || !Number.isInteger(cents) || cents <= 0) {
    return { ok: false, error: "Amount must be greater than 0." };
  }

  return { ok: true, cents };
}
