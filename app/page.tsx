"use client";

import { useState } from "react";
import AddExpenseForm from "@/components/AddExpenseForm";
import RecentTransactions from "@/components/RecentTransactions";

export default function Home() {
  const [refreshToken, setRefreshToken] = useState(0);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-slate-900">Add Expense</h2>
      <AddExpenseForm onAdded={() => setRefreshToken((token) => token + 1)} />
      <RecentTransactions
        onDeleted={() => setRefreshToken((token) => token + 1)}
        refreshToken={refreshToken}
      />
    </div>
  );
}
