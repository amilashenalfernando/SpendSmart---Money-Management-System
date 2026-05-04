"use client";

import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Transaction, Type } from "@prisma/client";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns";
import { useCurrency } from "@/components/providers/CurrencyProvider";

interface SpendingLineChartProps {
  transactions: Transaction[];
  monthDate: Date; // A date object representing the month to display
}

export function SpendingLineChart({ transactions, monthDate }: SpendingLineChartProps) {
  const { formatAmount } = useCurrency();

  const data = useMemo(() => {
    const start = startOfMonth(monthDate);
    const end = endOfMonth(monthDate);
    const days = eachDayOfInterval({ start, end });

    // Ensure we only process expenses and valid dates
    const expenses = transactions.filter(t => t.type === Type.EXPENSE);

    return days.map(day => {
      const amount = expenses
        .filter(t => isSameDay(new Date(t.date), day))
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        date: format(day, "MMM dd"),
        amount,
      };
    });
  }, [transactions, monthDate]);

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: "#64748b" }} 
            dy={10}
            minTickGap={20}
          />
          <YAxis 
            width={80}
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: "#64748b" }} 
            tickFormatter={(value) => formatAmount(value)}
          />
          <Tooltip
            cursor={{ stroke: "#94a3b8", strokeWidth: 1, strokeDasharray: "3 3" }}
            contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
            formatter={(value: any) => [formatAmount(Number(value)), "Daily Spending"]}
          />
          <Line 
            type="monotone" 
            dataKey="amount" 
            stroke="#7C3AED" 
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6, fill: "#7C3AED", stroke: "#fff", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
