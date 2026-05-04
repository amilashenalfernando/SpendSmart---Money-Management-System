"use client";

import { useRouter } from "next/navigation";

export function MonthSelector({ defaultMonth }: { defaultMonth: string }) {
  const router = useRouter();

  return (
    <input 
      type="month"
      name="month"
      defaultValue={defaultMonth}
      className="h-10 rounded-lg border border-slate-200 bg-white/80 text-sm px-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
      onChange={(e) => {
        const newMonth = e.target.value;
        if (newMonth) {
          router.push(`/reports?month=${newMonth}`);
        } else {
          router.push(`/reports`);
        }
      }}
    />
  );
}
