"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Currency = "$" | "€" | "£" | "Rs" | "¥";

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatAmount: (amount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("$");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("spendsmart_currency");
    if (saved && ["$", "€", "£", "Rs", "¥"].includes(saved)) {
      setCurrencyState(saved as Currency);
    }
  }, []);

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    localStorage.setItem("spendsmart_currency", newCurrency);
  };

  const formatAmount = (amount: number) => {
    if (!mounted) return `$${amount.toFixed(2)}`;
    // Some currencies have space between symbol and amount, some don't.
    // LKR uses "Rs " typically.
    const space = currency === "Rs" ? " " : "";
    return `${currency}${space}${amount.toFixed(2)}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatAmount }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
