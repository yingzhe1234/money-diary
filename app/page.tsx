import TransactionSeedDemo from "@/components/TransactionSeedDemo";

export default function Home() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-slate-900">Add Expense</h2>
      <p className="rounded-lg border border-slate-200 bg-white p-4 text-slate-700">
        Placeholder for the Add Expense flow. Part 2 will implement the transaction form, local
        persistence, and recent transactions list.
      </p>
      <TransactionSeedDemo />
    </div>
  );
}
