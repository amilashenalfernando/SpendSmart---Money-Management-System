"use client";

import { useState } from "react";
import { Transaction, Type } from "@prisma/client";
import { format } from "date-fns";
import { TrendingUp, TrendingDown, Wallet, Plus, Edit2, Trash2 } from "lucide-react";
import { MonthlyBarChart } from "@/components/charts/MonthlyBarChart";
import { Modal } from "@/components/ui/Modal";
import { TransactionForm } from "@/components/forms/TransactionForm";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/components/providers/CurrencyProvider";
import toast from "react-hot-toast";

const CATEGORY_ICONS: Record<string, string> = {
  FOOD: "🍔", TRANSPORT: "🚗", HOUSING: "🏠", HEALTH: "💊",
  EDUCATION: "📚", ENTERTAINMENT: "🎮", SHOPPING: "🛍", OTHER: "📦"
};

interface DashboardClientProps {
  stats: {
    totalIncome: number;
    totalExpenses: number;
    netBalance: number;
    topCategory: string;
  };
  recentTransactions: Transaction[];
  chartTransactions: Transaction[];
}

export function DashboardClient({ stats, recentTransactions, chartTransactions }: DashboardClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const router = useRouter();
  const { formatAmount } = useCurrency();

  const handleSuccess = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
    router.refresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this transaction?")) return;
    try {
      const res = await fetch(`/api/transactions/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Transaction deleted");
        router.refresh();
      } else {
        toast.error("Failed to delete");
      }
    } catch {
      toast.error("An error occurred");
    }
  };

  return (
    <>
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Income" amount={stats.totalIncome} icon={TrendingUp} colorClass="text-green-600 bg-green-100" />
        <StatCard title="Total Expenses" amount={stats.totalExpenses} icon={TrendingDown} colorClass="text-red-500 bg-red-100" />
        <StatCard
          title="Net Balance"
          amount={stats.netBalance}
          icon={Wallet}
          colorClass={stats.netBalance >= 0 ? "text-primary-600 bg-primary-100" : "text-red-500 bg-red-100"}
        />

        {/* Top category card */}
        <div className="glass-card p-6 flex flex-col justify-between">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-full text-blue-600 bg-blue-100 flex items-center justify-center w-12 h-12 text-xl">
              {stats.topCategory ? CATEGORY_ICONS[stats.topCategory] || "📦" : "➖"}
            </div>
            <h3 className="text-sm font-medium text-slate-500">Top Category</h3>
          </div>
          <span className="text-3xl font-bold text-slate-900 capitalize tracking-tight truncate" title={stats.topCategory || "None"}>
            {stats.topCategory ? stats.topCategory.toLowerCase() : "None"}
          </span>
        </div>
      </div>

      {/* Charts + Recent transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Income vs Expenses (6 Months)</h2>
          <MonthlyBarChart transactions={chartTransactions} />
        </div>

        <div className="glass-card p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900">Recent Transactions</h2>
            <button
              onClick={() => router.push("/transactions")}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              View All
            </button>
          </div>

          {recentTransactions.length > 0 ? (
            <div className="space-y-1 flex-1">
              {recentTransactions.map((t) => (
                <div key={t.id} className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-lg shrink-0">
                      {CATEGORY_ICONS[t.category] || "📦"}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm text-slate-900 truncate">{t.title}</p>
                      <p className="text-xs text-slate-400">{format(new Date(t.date), "MMM d, yyyy")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <span className={cn(
                      "font-semibold text-sm",
                      t.type === Type.INCOME ? "text-green-600" : "text-slate-800"
                    )}>
                      {t.type === Type.INCOME ? "+" : "-"}{formatAmount(t.amount)}
                    </span>
                    <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity gap-1">
                      <button
                        onClick={() => { setEditingTransaction(t); setIsModalOpen(true); }}
                        className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-md transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <div className="w-16 h-16 mb-4 bg-slate-100 rounded-full flex items-center justify-center text-2xl">
                📝
              </div>
              <p className="text-sm font-medium text-slate-500">No recent transactions</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-2 text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors"
              >
                Add your first one
              </button>
            </div>
          )}
        </div>
      </div>

      {/* FAB */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 z-40 w-14 h-14 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center hover:scale-105 transition-all duration-200"
      >
        <Plus size={24} />
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingTransaction(null); }}
        title={editingTransaction ? "Edit Transaction" : "Add Transaction"}
      >
        <TransactionForm
          initialData={editingTransaction}
          onSuccess={handleSuccess}
          onCancel={() => { setIsModalOpen(false); setEditingTransaction(null); }}
        />
      </Modal>
    </>
  );
}

function StatCard({ title, amount, icon: Icon, colorClass }: { title: string; amount: number; icon: React.ElementType; colorClass: string }) {
  const { formatAmount } = useCurrency();
  return (
    <div className="glass-card p-6 flex flex-col justify-between">
      <div className="flex items-center gap-4 mb-4">
        <div className={cn("p-3 rounded-full w-12 h-12 flex items-center justify-center", colorClass)}>
          <Icon size={22} />
        </div>
        <h3 className="text-sm font-medium text-slate-500">{title}</h3>
      </div>
      <p className="text-3xl font-bold text-slate-900 tracking-tight truncate" title={formatAmount(amount)}>
        {formatAmount(amount)}
      </p>
    </div>
  );
}
