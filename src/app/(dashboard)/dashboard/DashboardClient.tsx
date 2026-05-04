"use client";

import { useState } from "react";
import { Transaction, Type } from "@prisma/client";
import { format } from "date-fns";
import { TrendingUp, TrendingDown, Wallet, Plus, Edit2, Trash2, ArrowRight, PieChart, Landmark } from "lucide-react";
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

  const savingsRate = stats.totalIncome > 0 
    ? Math.round((stats.netBalance / stats.totalIncome) * 100) 
    : 0;

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
    <div className="space-y-8">
      {/* Top Banner / Total Balance */}
      <div className="relative overflow-hidden rounded-[2rem] bg-slate-900 p-8 md:p-10 text-white shadow-2xl">
        <div className="absolute top-0 right-0 p-32 bg-blue-600/20 rounded-full blur-[120px] -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 p-24 bg-indigo-600/10 rounded-full blur-[100px] -ml-20 -mb-20"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <p className="text-blue-400 font-bold uppercase tracking-widest text-[10px] mb-2">Available Balance</p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
              {formatAmount(stats.netBalance)}
            </h1>
            <div className="flex items-center gap-4 text-slate-400">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                <span className="text-xs font-medium text-slate-200">System Healthy</span>
              </div>
              <p className="text-xs font-medium">Updated just now</p>
            </div>
          </div>
          
          <div className="flex flex-col gap-4 w-full md:w-auto">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95 text-sm"
            >
              <Plus size={18} strokeWidth={3} /> Add Transaction
            </button>
          </div>
        </div>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 group">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 group-hover:scale-110 transition-transform duration-500">
              <TrendingUp size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Income</p>
              <h3 className="text-xl font-bold text-slate-900">{formatAmount(stats.totalIncome)}</h3>
            </div>
          </div>
          <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
             <div className="h-full bg-blue-500 rounded-full" style={{ width: '100%' }}></div>
          </div>
        </div>

        <div className="glass-card p-6 group">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center border border-red-100 group-hover:scale-110 transition-transform duration-500">
              <TrendingDown size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Expenses</p>
              <h3 className="text-xl font-bold text-slate-900">{formatAmount(stats.totalExpenses)}</h3>
            </div>
          </div>
          <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
             <div 
                className="h-full bg-red-500 rounded-full" 
                style={{ width: `${stats.totalIncome > 0 ? (stats.totalExpenses / stats.totalIncome) * 100 : 0}%` }}
             ></div>
          </div>
        </div>

        <div className="glass-card p-6 group">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 group-hover:scale-110 transition-transform duration-500">
              <Landmark size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Remaining (Savings)</p>
              <h3 className="text-xl font-bold text-slate-900">{formatAmount(stats.netBalance)}</h3>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-slate-400">{savingsRate}% of Income</p>
            <div className="w-20 h-1 bg-slate-100 rounded-full overflow-hidden">
               <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${savingsRate}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts + Recent transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Financial Overview</h2>
            <div className="flex gap-2">
              <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-50 border border-blue-100 text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Income
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-red-50 border border-red-100 text-[10px] font-bold text-red-600 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Expenses
              </div>
            </div>
          </div>
          <div className="h-[280px]">
            <MonthlyBarChart transactions={chartTransactions} />
          </div>
        </div>

        <div className="glass-card p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
            <button
              onClick={() => router.push("/transactions")}
              className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:text-blue-600 transition-all active:scale-90"
            >
              <ArrowRight size={20} />
            </button>
          </div>

          <div className="flex-1 space-y-3">
            {recentTransactions.slice(0, 6).map((t) => (
              <div key={t.id} className="group flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-50 hover:border-blue-100 hover:shadow-xl hover:shadow-blue-500/5 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-xl shrink-0 group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors">
                    {CATEGORY_ICONS[t.category] || "📦"}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-slate-900 truncate">{t.title}</p>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{format(new Date(t.date), "MMM d")}</p>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <p className={cn(
                    "font-bold text-sm",
                    t.type === Type.INCOME ? "text-blue-600" : "text-slate-900"
                  )}>
                    {t.type === Type.INCOME ? "+" : "-"}{formatAmount(t.amount)}
                  </p>
                </div>
              </div>
            ))}
            
            {recentTransactions.length === 0 && (
               <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl mb-4 opacity-50">
                    📉
                  </div>
                  <p className="text-slate-400 font-bold text-sm">No activity yet</p>
               </div>
            )}
          </div>

          <button
             onClick={() => setIsModalOpen(true)}
             className="mt-8 w-full py-4 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 group"
          >
             <Plus size={18} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-300" /> New Transaction
          </button>
        </div>
      </div>

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
    </div>
  );
}
