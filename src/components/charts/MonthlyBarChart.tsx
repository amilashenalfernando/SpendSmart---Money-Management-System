"use client";

import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Transaction, Type } from "@prisma/client";
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";
import { useCurrency } from "@/components/providers/CurrencyProvider";

interface MonthlyBarChartProps {
  transactions: Transaction[];
}

export function MonthlyBarChart({ transactions }: MonthlyBarChartProps) {
  const { formatAmount } = useCurrency();

  const data = useMemo(() => {
    const months = Array.from({ length: 6 }).map((_, i) => {
      const d = subMonths(new Date(), 5 - i);
      return {
        month: format(d, "MMM yyyy"),
        start: startOfMonth(d),
        end: endOfMonth(d),
        income: 0,
        expense: 0,
      };
    });

    transactions.forEach((t) => {
      const tDate = new Date(t.date);
      for (const m of months) {
        if (isWithinInterval(tDate, { start: m.start, end: m.end })) {
          if (t.type === Type.INCOME) m.income += t.amount;
          else m.expense += t.amount;
          break;
        }
      }
    });

    return months;
  }, [transactions]);

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis 
            dataKey="month" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: "#64748b" }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: "#64748b" }} 
            tickFormatter={(value) => formatAmount(value)}
          />
          <Tooltip
            cursor={{ fill: "transparent" }}
            contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
            formatter={(value: any) => formatAmount(Number(value))}
          />
          <Legend iconType="circle" wrapperStyle={{ fontSize: "12px", paddingTop: "20px" }} />
          <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
          <Bar dataKey="expense" name="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
