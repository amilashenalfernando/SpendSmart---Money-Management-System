"use client";

import { format } from "date-fns";
import { Type } from "@prisma/client";
import { Wallet } from "lucide-react";

interface PDFReportTemplateProps {
  user: { name?: string | null; email?: string | null };
  targetDate: Date;
  currentMonthTransactions: any[];
}

export function PDFReportTemplate({ user, targetDate, currentMonthTransactions }: PDFReportTemplateProps) {
  // Calculate totals
  let totalIncome = 0;
  let totalExpenses = 0;
  
  currentMonthTransactions.forEach((t) => {
    if (t.type === Type.INCOME) totalIncome += t.amount;
    else totalExpenses += t.amount;
  });

  const netBalance = totalIncome - totalExpenses;

  return (
    <div 
      id="pdf-report-template" 
      className="hidden"
    >
      <div className="bg-white p-16 text-slate-900 font-sans w-[850px] min-h-[1200px]">
        {/* Simplified Stable Header */}
        <div className="flex justify-between items-center mb-16 pb-12 border-b border-slate-100">
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-4">
              <div className="bg-blue-600 p-2.5 rounded-xl text-white shadow-lg shadow-blue-200">
                <Wallet size={24} strokeWidth={2.5} />
              </div>
              <span className="font-extrabold text-[32px] text-slate-900 tracking-tighter leading-tight">
                Spend<span className="text-blue-600">Smart</span>
              </span>
            </div>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Monthly Account Statement</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Statement Period</p>
            <p className="text-2xl font-black text-slate-900 uppercase tracking-tight">{format(targetDate, "MMMM yyyy")}</p>
          </div>
        </div>

        {/* Customer & Summary Grid */}
        <div className="grid grid-cols-2 gap-16 mb-16">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-100 pb-1">Customer Details</p>
            <p className="text-xl font-black text-slate-900">{user.name || "Valued User"}</p>
            <p className="text-sm font-medium text-slate-500">{user.email}</p>
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-100 pb-1">Summary Overview</p>
            <div className="space-y-2 mt-2">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-slate-500">Inbound (Income)</span>
                <span className="text-emerald-600 font-bold">+Rs {totalIncome.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm font-medium">
                <span className="text-slate-500">Outbound (Expenses)</span>
                <span className="text-rose-600 font-bold">-Rs {totalExpenses.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-100">
                <span className="text-sm font-black uppercase tracking-tight">Statement Balance</span>
                <span className="text-sm font-black">Rs {netBalance.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction Table */}
        <div className="mb-12">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-100 pb-1">Transaction History</p>
          <table className="w-full">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
                <th className="pb-4 font-black">Date</th>
                <th className="pb-4 font-black">Description</th>
                <th className="pb-4 font-black">Category</th>
                <th className="pb-4 text-right font-black">Amount (LKR)</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {currentMonthTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((t) => (
                <tr key={t.id} className="border-b border-slate-50 group">
                  <td className="py-5 font-bold text-slate-400 whitespace-nowrap">{format(new Date(t.date), "dd MMM")}</td>
                  <td className="py-5 font-black text-slate-900">{t.description || "Uncategorized"}</td>
                  <td className="py-5">
                    <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-slate-100 rounded text-slate-500">
                      {t.category}
                    </span>
                  </td>
                  <td className={`py-5 text-right font-black ${t.type === Type.INCOME ? 'text-emerald-600' : 'text-slate-900'}`}>
                    {t.type === Type.INCOME ? '+' : ''}{t.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {currentMonthTransactions.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-slate-400 font-medium italic">No financial activity recorded for this period.</p>
            </div>
          )}
        </div>

        {/* Footnote */}
        <div className="mt-auto pt-10 border-t border-slate-100 flex justify-between items-end">
          <div className="max-w-[400px]">
            <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase tracking-tighter">
              SpendSmart Statement • Registered User Document • This is a digital record of personal finances and not an official bank document. 
              SpendSmart does not guarantee the accuracy of manual entries.
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Page 1 of 1</p>
          </div>
        </div>
      </div>
    </div>
  );
}
