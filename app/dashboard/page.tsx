import MonthlyDashboard from "@/components/MonthlyDashboard";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-slate-900">Monthly Dashboard</h2>
      <MonthlyDashboard />
    </div>
  );
}
