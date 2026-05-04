import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { DashboardClient } from "./DashboardClient";
import { startOfMonth, endOfMonth, subMonths } from "date-fns";
import { Type } from "@prisma/client";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect("/login");
  }

  const now = new Date();
  const currentMonthStart = startOfMonth(now);
  const currentMonthEnd = endOfMonth(now);
  const sixMonthsAgo = startOfMonth(subMonths(now, 5));

  // Fetch current month transactions for stats
  const currentMonthTransactions = await prisma.transaction.findMany({
    where: {
      userId: session.user.id,
      date: {
        gte: currentMonthStart,
        lte: currentMonthEnd,
      },
    },
    orderBy: { date: "desc" },
  });

  // Fetch last 6 months for chart
  const sixMonthsTransactions = await prisma.transaction.findMany({
    where: {
      userId: session.user.id,
      date: {
        gte: sixMonthsAgo,
        lte: currentMonthEnd,
      },
    },
  });

  // Calculate stats
  let totalIncome = 0;
  let totalExpenses = 0;
  const categoryTotals: Record<string, number> = {};

  currentMonthTransactions.forEach((t: any) => {
    if (t.type === Type.INCOME) {
      totalIncome += t.amount;
    } else {
      totalExpenses += t.amount;
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    }
  });

  const netBalance = totalIncome - totalExpenses;
  
  let topCategory = "N/A";
  let maxCatAmount = 0;
  Object.entries(categoryTotals).forEach(([cat, amount]) => {
    if (amount > maxCatAmount) {
      maxCatAmount = amount;
      topCategory = cat;
    }
  });

  // Recent 5 transactions
  const recentTransactions = currentMonthTransactions.slice(0, 5);

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
          Good morning, {session.user.name?.split(' ')[0] || 'User'} 👋
        </h1>
        <p className="text-slate-500 mt-1">Here&apos;s what&apos;s happening with your money this month.</p>
      </div>

      <DashboardClient 
        stats={{ totalIncome, totalExpenses, netBalance, topCategory }}
        recentTransactions={recentTransactions}
        chartTransactions={sixMonthsTransactions}
      />
    </div>
  );
}
