"use client";

import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { Search, Plus, Trash2, Download, Edit2 } from "lucide-react";
import { Transaction, Type, Category } from "@prisma/client";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { TransactionForm } from "@/components/forms/TransactionForm";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/components/providers/CurrencyProvider";

const CATEGORY_ICONS: Record<string, string> = {
  FOOD: "🍔", TRANSPORT: "🚗", HOUSING: "🏠", HEALTH: "💊",
  EDUCATION: "📚", ENTERTAINMENT: "🎮", SHOPPING: "🛍", OTHER: "📦"
};

const selectCls = "h-10 rounded-lg border border-slate-200 bg-white/80 text-sm px-3 focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-700 shadow-sm";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [month, setMonth] = useState<string>("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { formatAmount } = useCurrency();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.append("search", debouncedSearch);
      if (category) params.append("category", category);
      if (type) params.append("type", type);
      if (month) params.append("month", month);
      params.append("page", page.toString());
      params.append("limit", "10");

      const res = await fetch(`/api/transactions?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setTransactions(data.transactions);
        setTotalPages(data.pagination.totalPages);
      }
    } catch {
      toast.error("Failed to load transactions");
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, category, type, month, page]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this transaction?")) return;
    try {
      const res = await fetch(`/api/transactions/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Transaction deleted");
        fetchTransactions();
      } else {
        toast.error("Failed to delete");
      }
    } catch {
      toast.error("An error occurred");
    }
  };

  const handleExportCSV = () => {
    if (transactions.length === 0) return;
    const headers = ["Date", "Title", "Category", "Type", "Amount", "Note"];
    const csvData = transactions.map(t => [
      format(new Date(t.date), "yyyy-MM-dd"),
      `"${t.title.replace(/"/g, '""')}"`,
      t.category,
      t.type,
      t.amount,
      `"${(t.note || "").replace(/"/g, '""')}"`
    ].join(","));

    const csvContent = [headers.join(","), ...csvData].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `transactions_${format(new Date(), "yyyyMMdd")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Transactions</h1>
          <p className="text-slate-500 mt-1">Manage and track your expense history.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleExportCSV}>
            <Download size={16} className="mr-2" /> Export
          </Button>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus size={16} className="mr-2" /> Add Transaction
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 sm:p-5 mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search size={16} className="text-slate-400" />
          </div>
          <input
            type="text"
            className="w-full h-10 pl-9 pr-3 rounded-lg border border-slate-200 bg-white/80 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-3 flex-wrap">
          <select className={selectCls} value={type} onChange={(e) => { setType(e.target.value); setPage(1); }}>
            <option value="">All Types</option>
            <option value={Type.EXPENSE}>Expense</option>
            <option value={Type.INCOME}>Income</option>
          </select>

          <select className={selectCls} value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}>
            <option value="">All Categories</option>
            {Object.keys(Category).map(c => (
              <option key={c} value={c}>{c.charAt(0) + c.slice(1).toLowerCase()}</option>
            ))}
          </select>

          <input
            type="month"
            className={selectCls}
            value={month}
            onChange={(e) => { setMonth(e.target.value); setPage(1); }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Title</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium text-right">Amount</th>
                <th className="px-6 py-4 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-20" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-32" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-24" /></td>
                    <td className="px-6 py-4 flex justify-end"><div className="h-4 bg-slate-200 rounded w-16" /></td>
                    <td className="px-6 py-4 text-center"><div className="h-4 bg-slate-200 rounded w-8 mx-auto" /></td>
                  </tr>
                ))
              ) : transactions.length > 0 ? (
                transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4 text-slate-500">{format(new Date(t.date), "MMM dd, yyyy")}</td>
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {t.title}
                      {t.note && <span className="block text-xs font-normal text-slate-400 mt-0.5 truncate max-w-[200px]">{t.note}</span>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-600">
                        <span>{CATEGORY_ICONS[t.category]}</span>
                        <span className="capitalize">{t.category.toLowerCase()}</span>
                      </div>
                    </td>
                    <td className={cn(
                      "px-6 py-4 text-right font-semibold",
                      t.type === Type.INCOME ? "text-green-600" : "text-slate-900"
                    )}>
                      {t.type === Type.INCOME ? "+" : "-"}{formatAmount(t.amount)}
                    </td>
                    <td className="px-6 py-4 text-center space-x-1">
                      <button
                        onClick={() => { setEditingTransaction(t); setIsModalOpen(true); }}
                        className="text-slate-400 hover:text-blue-500 transition-colors p-2 rounded-lg hover:bg-blue-50 inline-flex items-center justify-center"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50 inline-flex items-center justify-center"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center text-2xl">🔍</div>
                    <p className="text-slate-500 font-medium">No transactions found.</p>
                    <p className="text-slate-400 text-sm mt-1">Try adjusting your filters.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))}>
              Previous
            </Button>
            <span className="text-sm text-slate-500">Page {page} of {totalPages}</span>
            <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>
              Next
            </Button>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingTransaction(null); }}
        title={editingTransaction ? "Edit Transaction" : "Add Transaction"}
      >
        <TransactionForm
          initialData={editingTransaction}
          onSuccess={() => { setIsModalOpen(false); setEditingTransaction(null); fetchTransactions(); }}
          onCancel={() => { setIsModalOpen(false); setEditingTransaction(null); }}
        />
      </Modal>
    </div>
  );
}
