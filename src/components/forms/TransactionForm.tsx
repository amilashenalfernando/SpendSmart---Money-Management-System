"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import toast from "react-hot-toast";
import { Type, Category } from "@prisma/client";
import { cn } from "@/lib/utils";

interface TransactionFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  initialData?: any;
}

const CATEGORIES = [
  { value: Category.FOOD, label: "Food", icon: "🍔" },
  { value: Category.TRANSPORT, label: "Transport", icon: "🚗" },
  { value: Category.HOUSING, label: "Housing", icon: "🏠" },
  { value: Category.HEALTH, label: "Health", icon: "💊" },
  { value: Category.EDUCATION, label: "Education", icon: "📚" },
  { value: Category.ENTERTAINMENT, label: "Entertainment", icon: "🎮" },
  { value: Category.SHOPPING, label: "Shopping", icon: "🛍" },
  { value: Category.OTHER, label: "Other", icon: "📦" },
];

export function TransactionForm({ onSuccess, onCancel, initialData }: TransactionFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [type, setType] = useState<Type>(initialData ? initialData.type : Type.EXPENSE);
  const [category, setCategory] = useState<Category>(initialData ? initialData.category : Category.FOOD);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title") as string,
      amount: formData.get("amount") as string,
      date: formData.get("date") as string,
      note: formData.get("note") as string,
      type,
      category,
    };

    try {
      const isEditing = !!initialData;
      const url = isEditing ? `/api/transactions/${initialData.id}` : "/api/transactions";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error();

      toast.success(isEditing ? "Transaction updated!" : "Transaction added!");
      onSuccess();
    } catch {
      toast.error(initialData ? "Error updating transaction" : "Error creating transaction");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Type toggle */}
      <div className="flex bg-slate-100 p-1 rounded-lg">
        <button
          type="button"
          onClick={() => setType(Type.EXPENSE)}
          className={cn(
            "flex-1 py-1.5 text-sm font-medium rounded-md transition-all duration-150",
            type === Type.EXPENSE
              ? "bg-white shadow-sm text-red-600"
              : "text-slate-500 hover:text-slate-700"
          )}
        >
          Expense
        </button>
        <button
          type="button"
          onClick={() => setType(Type.INCOME)}
          className={cn(
            "flex-1 py-1.5 text-sm font-medium rounded-md transition-all duration-150",
            type === Type.INCOME
              ? "bg-white shadow-sm text-green-600"
              : "text-slate-500 hover:text-slate-700"
          )}
        >
          Income
        </button>
      </div>

      <Input label="Title" name="title" required placeholder="Grocery run" defaultValue={initialData?.title} />

      <div className="grid grid-cols-2 gap-4">
        <Input label="Amount" name="amount" type="number" step="0.01" min="0" required placeholder="0.00" defaultValue={initialData?.amount} />
        <Input label="Date" name="date" type="date" required defaultValue={initialData ? new Date(initialData.date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0]} />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Category</label>
        <div className="grid grid-cols-4 gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setCategory(c.value)}
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-lg border text-xs transition-all duration-150",
                category === c.value
                  ? "bg-primary-50 border-primary-300 text-primary-700 shadow-sm"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
              )}
            >
              <span className="text-xl mb-1">{c.icon}</span>
              <span className="truncate w-full text-center">{c.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700">Note (Optional)</label>
        <textarea
          name="note"
          rows={3}
          className="flex w-full rounded-lg border border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm resize-none"
          placeholder="Add any extra details here..."
          defaultValue={initialData?.note || ""}
        />
      </div>

      <div className="flex gap-3 justify-end pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit" isLoading={isLoading}>
          {initialData ? "Update Transaction" : "Save Transaction"}
        </Button>
      </div>
    </form>
  );
}
