"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Wallet } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

export function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-6 py-3 flex items-center justify-between shadow-sm">
      <Link href="/" className="flex items-center gap-2 group">
        <div className="bg-primary-600 p-2 rounded-lg text-white group-hover:scale-105 transition-transform duration-150 shadow-sm">
          <Wallet size={20} />
        </div>
        <span className="font-bold text-xl tracking-tight text-slate-900">
          SpendSmart
        </span>
      </Link>

      <div className="flex items-center gap-3">
        {status === "loading" ? (
          <div className="w-20 h-10 bg-slate-100 animate-pulse rounded-lg" />
        ) : session ? (
          <>
            <Link href="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            <Button variant="outline" onClick={() => signOut()}>
              Sign Out
            </Button>
          </>
        ) : (
          <>
            <Link href="/login" className="hidden sm:block">
              <Button variant="ghost">Log In</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
