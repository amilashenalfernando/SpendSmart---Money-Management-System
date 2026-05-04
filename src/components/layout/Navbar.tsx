"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Wallet } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

export function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-4 flex items-center justify-between bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm">
      <Link href="/" className="flex items-center gap-2.5 group">
        <div className="bg-blue-600 p-2.5 rounded-xl text-white transition-all duration-300 shadow-lg shadow-blue-200">
          <Wallet size={22} strokeWidth={2.5} />
        </div>
        <span className="font-extrabold text-2xl tracking-tight text-slate-900">
          Spend<span className="text-blue-600">Smart</span>
        </span>
      </Link>

      <div className="flex items-center gap-4">
        {status === "loading" ? (
          <div className="w-20 h-10 bg-slate-100 animate-pulse rounded-xl" />
        ) : session ? (
          <>
            <Link href="/dashboard" className="hidden sm:block">
              <Button variant="ghost" className="font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50">Dashboard</Button>
            </Link>
            <Button variant="outline" onClick={() => signOut()} className="rounded-xl border-slate-200 font-semibold hover:bg-slate-50">
              Sign Out
            </Button>
          </>
        ) : (
          <>
            <Link href="/login" className="hidden sm:block">
              <Button variant="ghost" className="font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50">Log In</Button>
            </Link>
            <Link href="/register">
              <Button className="rounded-xl px-6 font-bold shadow-md shadow-blue-200">Get Started</Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
