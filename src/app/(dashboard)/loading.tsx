import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 md:left-72 bg-white/60 backdrop-blur-md z-50 flex items-center justify-center transition-all duration-300">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-blue-600/10 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
          <div className="absolute inset-0 w-16 h-16 rounded-2xl border-2 border-blue-600/20 animate-pulse"></div>
        </div>
        <div className="flex flex-col items-center">
          <h3 className="text-lg font-bold text-slate-900">Loading Smartly</h3>
          <p className="text-sm text-slate-500 font-medium">Fetching your financial data...</p>
        </div>
      </div>
    </div>
  );
}
