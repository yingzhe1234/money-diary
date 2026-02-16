export const CATEGORIES = [
  { id: "food", label: "Food & Drink" },
  { id: "groceries", label: "Groceries" },
  { id: "transport", label: "Transport" },
  { id: "housing", label: "Housing" },
  { id: "utilities", label: "Utilities" },
  { id: "health", label: "Health" },
  { id: "shopping", label: "Shopping" },
  { id: "entertainment", label: "Entertainment" },
  { id: "education", label: "Education" },
  { id: "travel", label: "Travel" },
  { id: "subscriptions", label: "Subscriptions" },
  { id: "other", label: "Other" },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];
