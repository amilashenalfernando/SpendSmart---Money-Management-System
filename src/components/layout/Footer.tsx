export function Footer() {
  return (
    <footer className="w-full py-8 text-center text-slate-400 border-t border-slate-200/60 mt-20">
      <div className="flex flex-col items-center justify-center gap-2">
        <p className="font-medium text-slate-600">SpendSmart &copy; {new Date().getFullYear()}</p>
        <p className="text-sm">Take control of your money, securely.</p>
      </div>
    </footer>
  );
}
