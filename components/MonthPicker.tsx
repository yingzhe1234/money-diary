"use client";

type MonthPickerProps = {
  value: string;
  onChange: (nextMonth: string) => void;
};

export default function MonthPicker({ value, onChange }: MonthPickerProps) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-800" htmlFor="month-picker">
        Month
      </label>
      <input
        className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-slate-200 focus:ring"
        id="month-picker"
        onChange={(event) => onChange(event.target.value)}
        type="month"
        value={value}
      />
    </div>
  );
}
