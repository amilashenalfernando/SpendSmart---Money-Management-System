export function Footer() {
  return (
    <footer className="w-full py-12 text-center mt-32 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
      <div className="flex flex-col items-center justify-center gap-4 relative z-10">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-xl tracking-tight text-slate-900">
            Spend<span className="text-blue-600">Smart</span>
          </span>
        </div>
        <p className="text-slate-500 max-w-sm mx-auto leading-relaxed">
          The most intuitive way to manage your personal finances and achieve your goals.
        </p>
        <div className="h-8 w-[1px] bg-slate-200"></div>
        <p className="font-semibold text-slate-400 text-sm tracking-wider uppercase">
          &copy; {new Date().getFullYear()} SpendSmart. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
