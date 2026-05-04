import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/layout/Providers";
import { Toaster } from "@/components/ui/Toast";

export const metadata: Metadata = {
  title: "SpendSmart - Smart Financial Management",
  description: "Experience the next generation of personal finance tracking with SpendSmart.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body className="min-h-screen bg-mesh text-slate-900 selection:bg-blue-100 selection:text-blue-900">
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
