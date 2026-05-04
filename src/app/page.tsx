import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { BarChart3, Target, TrendingUp, ArrowRight, Wallet, PieChart, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative bg-mesh">
      <Navbar />

      <main className="flex-grow pt-32 pb-24">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-24 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-semibold mb-8 animate-fade-in">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
            The Future of Finance is Here
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-slate-900 tracking-tight leading-[1.1] mb-8">
            Manage your money <br className="hidden md:block" />
            <span className="text-gradient">with precision.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed">
            Stop guessing where your money goes. SpendSmart provides a crystal-clear view of your finances with powerful analytics and automated tracking.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-24">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto text-lg px-10 h-14 rounded-2xl shadow-xl shadow-blue-500/20 hover:shadow-blue-500/30 transition-all">
                Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-10 h-14 rounded-2xl border-slate-200 hover:bg-slate-50">
                View Demo
              </Button>
            </Link>
          </div>

          {/* Stats/Features Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {[
              {
                title: "Smart Tracking",
                desc: "Automatically categorize and track every transaction with AI-powered insights.",
                icon: TrendingUp,
                color: "bg-blue-50 text-blue-600 border-blue-100"
              },
              {
                title: "Intuitive Analytics",
                desc: "Visualize your spending patterns with beautiful, easy-to-understand interactive charts.",
                icon: PieChart,
                color: "bg-indigo-50 text-indigo-600 border-indigo-100"
              },
              {
                title: "Budget Mastery",
                desc: "Set smart limits and receive timely alerts to keep your financial goals on track.",
                icon: Target,
                color: "bg-emerald-50 text-emerald-600 border-emerald-100"
              }
            ].map((feature, idx) => (
              <div key={idx} className="glass-card p-10 flex flex-col items-start text-left group hover:-translate-y-2 transition-transform duration-300">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 border ${feature.color} group-hover:scale-110 transition-all duration-500`}>
                  <feature.icon size={28} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Secondary Features Section */}
          <div className="mt-40 text-left grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8 leading-tight">
                Designed for the <br />
                <span className="text-blue-600">modern individual.</span>
              </h2>
              <div className="space-y-8">
                {[
                  {
                    title: "Bank-Grade Security",
                    desc: "Your data is encrypted and protected with industry-leading security protocols.",
                    icon: ShieldCheck
                  },
                  {
                    title: "Multi-Currency Support",
                    desc: "Manage your finances across different currencies with real-time conversion.",
                    icon: Wallet
                  }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-blue-600">
                      <item.icon size={24} />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h4>
                      <p className="text-slate-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-tr from-blue-500/10 to-indigo-500/10 blur-3xl rounded-[3rem] -z-10"></div>
              <div className="glass-card p-4 aspect-video flex items-center justify-center border-slate-200/50 shadow-2xl">
                 <div className="w-full h-full rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center overflow-hidden">
                    <BarChart3 className="w-32 h-32 text-blue-200" />
                 </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
