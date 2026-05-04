"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Wallet } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setIsLoading(false);

    if (result?.error) {
      toast.error("Invalid email or password");
    } else {
      toast.success("Successfully logged in!");
      router.push("/dashboard");
      router.refresh();
    }
  };

  const handleDemoLogin = () => {
    setEmail("demo@spendsmart.com");
    setPassword("demo1234");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "linear-gradient(135deg, #f0f4ff 0%, #f5f3ff 50%, #eef2ff 100%)" }}>
      <div className="w-full max-w-md">
        <div className="glass-card p-8 sm:p-10">
          {/* Logo */}
          <div className="flex flex-col items-center justify-center mb-8">
            <Link href="/" className="flex items-center gap-2 mb-6 group">
              <div className="bg-primary-600 p-2 rounded-lg text-white group-hover:scale-105 transition-transform duration-150 shadow-sm">
                <Wallet size={24} />
              </div>
              <span className="font-bold text-2xl tracking-tight text-slate-900">SpendSmart</span>
            </Link>
            <h1 className="text-2xl font-semibold text-slate-900">Welcome back</h1>
            <p className="text-sm text-slate-500 mt-1">Enter your details to access your account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <Input label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" required />
            <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
            <Button type="submit" className="w-full mt-2" isLoading={isLoading}>Sign In</Button>
          </form>

          <div className="mt-6 flex items-center justify-between">
            <span className="w-1/5 border-b border-slate-200 lg:w-1/4" />
            <span className="text-xs text-center text-slate-400 uppercase tracking-wider">or</span>
            <span className="w-1/5 border-b border-slate-200 lg:w-1/4" />
          </div>

          {process.env.NODE_ENV !== "production" && (
            <Button type="button" variant="outline" className="w-full mt-4" onClick={handleDemoLogin}>
              Load Demo Credentials
            </Button>
          )}

          <p className="mt-8 text-center text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-medium text-primary-600 hover:text-primary-500 transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
