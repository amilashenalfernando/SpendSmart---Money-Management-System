import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { BarChart3, Target, TrendingUp } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Background decoration */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-primary-100/50 to-transparent dark:from-primary-900/20 pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-400/20 dark:bg-primary-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-40 -left-40 w-96 h-96 bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <Navbar />

      <main className="flex-grow pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full z-10">
        <div className="text-center max-w-3xl mx-auto mt-16 mb-24">
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6">
            Take control of <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-500">
              your money
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto">
            SpendSmart is a modern, intuitive expense tracker that helps you visualize your spending, set budgets, and achieve your financial goals.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto text-lg px-8">
                Get Started
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8">
                Demo Login
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="glass-card p-8 flex flex-col items-center text-center group hover:-translate-y-1 transition-transform duration-300">
            <div className="w-14 h-14 bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <TrendingUp size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Track Expenses</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Easily log your daily expenses and income. Categorize them to see exactly where your money goes.
            </p>
          </div>

          <div className="glass-card p-8 flex flex-col items-center text-center group hover:-translate-y-1 transition-transform duration-300">
            <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <BarChart3 size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Visualize Spending</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Beautiful interactive charts that give you clear insights into your financial habits and trends over time.
            </p>
          </div>

          <div className="glass-card p-8 flex flex-col items-center text-center group hover:-translate-y-1 transition-transform duration-300">
            <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Target size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Set Budgets</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Set monthly spending limits for different categories and get notified when you're close to exceeding them.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
