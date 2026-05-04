import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { DashboardClient } from "./DashboardClient";
import { startOfMonth, endOfMonth, subMonths, format } from "date-fns";
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
  
  let topCategory = "";
  let maxCatAmount = 0;
  Object.entries(categoryTotals).forEach(([cat, amount]) => {
    if (amount > maxCatAmount) {
      maxCatAmount = amount;
      topCategory = cat;
    }
  });

  // Recent transactions
  const recentTransactions = currentMonthTransactions.slice(0, 10);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="p-6 md:p-10 max-w-[1500px] mx-auto w-full min-h-screen bg-slate-50/50">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
            {getGreeting()}, <span className="text-blue-600">{session.user.name?.split(' ')[0] || 'there'}</span>
          </h1>
          <p className="text-slate-500 mt-3 text-lg font-medium">Your financial overview for this month.</p>
        </div>
        <div className="flex items-center gap-3 px-5 py-2.5 bg-white rounded-2xl border border-slate-100 shadow-sm">
           <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
           <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">{format(now, "EEEE, do MMMM yyyy")}</span>
        </div>
      </div>

      <DashboardClient 
        stats={{ totalIncome, totalExpenses, netBalance, topCategory }}
        recentTransactions={recentTransactions}
        chartTransactions={sixMonthsTransactions}
      />
    </div>
  );
}
