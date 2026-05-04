import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { MonthlyBarChart } from "@/components/charts/MonthlyBarChart";
import { CategoryPieChart } from "@/components/charts/CategoryPieChart";
import { SpendingLineChart } from "@/components/charts/SpendingLineChart";
import { startOfMonth, endOfMonth, subMonths, format } from "date-fns";
import { MonthSelector } from "@/components/ui/MonthSelector";

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: { month?: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect("/login");
  }

  // Determine target month from search params or default to current
  let targetDate = new Date();
  if (searchParams.month) {
    targetDate = new Date(`${searchParams.month}-01T00:00:00.000Z`);
  }

  const currentMonthStart = startOfMonth(targetDate);
  const currentMonthEnd = endOfMonth(targetDate);
  const sixMonthsAgo = startOfMonth(subMonths(targetDate, 5));

  // Fetch current month transactions for Pie and Line charts
  const currentMonthTransactions = await prisma.transaction.findMany({
    where: {
      userId: session.user.id,
      date: {
        gte: currentMonthStart,
        lte: currentMonthEnd,
      },
    },
  });

  // Fetch last 6 months for Bar chart
  const sixMonthsTransactions = await prisma.transaction.findMany({
    where: {
      userId: session.user.id,
      date: {
        gte: sixMonthsAgo,
        lte: currentMonthEnd,
      },
    },
  });

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Reports</h1>
          <p className="text-slate-500 mt-1">Deep dive into your financial habits.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <MonthSelector defaultMonth={format(targetDate, "yyyy-MM")} />
        </div>
      </div>

      <div className="space-y-8">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900">Income vs Expenses</h2>
            <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              Last 6 Months
            </span>
          </div>
          <MonthlyBarChart transactions={sixMonthsTransactions} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-900">Expense Breakdown</h2>
              <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                {format(targetDate, "MMMM yyyy")}
              </span>
            </div>
            <CategoryPieChart transactions={currentMonthTransactions} />
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-900">Daily Spending</h2>
              <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                {format(targetDate, "MMMM yyyy")}
              </span>
            </div>
            <SpendingLineChart transactions={currentMonthTransactions} monthDate={targetDate} />
          </div>
        </div>
      </div>
    </div>
  );
}
