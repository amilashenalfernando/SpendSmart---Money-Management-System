"use client";

import { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Transaction, Type } from "@prisma/client";
import { useCurrency } from "@/components/providers/CurrencyProvider";

interface CategoryPieChartProps {
  transactions: Transaction[];
}

const COLORS = ['#7C3AED', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#8B5CF6', '#64748B'];

export function CategoryPieChart({ transactions }: CategoryPieChartProps) {
  const { formatAmount } = useCurrency();

  const data = useMemo(() => {
    const expenses = transactions.filter(t => t.type === Type.EXPENSE);
    const categoryMap: Record<string, number> = {};
    
    expenses.forEach(t => {
      categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
    });

    return Object.entries(categoryMap)
      .map(([name, value]) => ({ name: name.charAt(0) + name.slice(1).toLowerCase(), value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  if (data.length === 0) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center text-slate-500">
        No expense data for this period
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: any) => formatAmount(Number(value))}
            contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
          />
          <Legend iconType="circle" wrapperStyle={{ fontSize: "12px", paddingTop: "20px" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
