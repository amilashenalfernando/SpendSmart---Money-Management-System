"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wallet, LayoutDashboard, ReceiptText, PieChart, Settings, LogOut, Menu, X, ArrowLeftRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { signOut } from "next-auth/react";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Transactions", href: "/transactions", icon: ArrowLeftRight },
  { name: "Reports", href: "/reports", icon: PieChart },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const closeSidebar = () => {
    if (isOpen) setIsOpen(false);
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-40 p-2.5 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-slate-200/50 md:hidden transition-all active:scale-95"
      >
        <Menu size={22} className="text-slate-700" />
      </button>

      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 shadow-2xl md:shadow-none",
          "bg-white border-r border-slate-100",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="h-24 flex items-center justify-between px-8 border-b border-slate-50">
          <Link href="/dashboard" className="flex items-center gap-3" onClick={closeSidebar}>
            <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-200">
              <Wallet size={20} strokeWidth={2.5} />
            </div>
            <span className="font-extrabold text-2xl text-slate-900 tracking-tight">
              Spend<span className="text-blue-600">Smart</span>
            </span>
          </Link>
          <button onClick={closeSidebar} className="md:hidden text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-50 transition-all">
            <X size={22} />
          </button>
        </div>

        {/* Nav items */}
        <div className="flex-1 overflow-y-auto py-8 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={closeSidebar}
                className={cn(
                  "flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-[15px] font-semibold transition-all duration-200 group",
                  isActive
                    ? "bg-blue-600 text-white shadow-xl shadow-blue-600/20"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <item.icon
                  size={20}
                  className={cn(
                    "transition-colors duration-200",
                    isActive ? "text-white" : "text-slate-400 group-hover:text-blue-500"
                  )}
                />
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Bottom Section */}
        <div className="p-6 border-t border-slate-50 bg-slate-50/30">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-3.5 w-full px-5 py-4 rounded-2xl text-[15px] font-bold text-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group"
          >
            <div className="p-1.5 rounded-lg bg-red-100/50 group-hover:bg-red-100 transition-colors">
              <LogOut size={18} />
            </div>
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
