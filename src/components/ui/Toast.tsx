"use client";

import { Toaster as HotToaster } from "react-hot-toast";

export function Toaster() {
  return (
    <HotToaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: "rgba(255,255,255,0.95)",
          color: "#0f172a",
          border: "1px solid rgba(255,255,255,0.8)",
          backdropFilter: "blur(12px)",
          boxShadow: "0 4px 16px rgba(100,120,200,0.10)",
          borderRadius: "12px",
          fontSize: "14px",
          padding: "12px 16px",
        },
        success: {
          iconTheme: { primary: "#10b981", secondary: "white" },
        },
        error: {
          iconTheme: { primary: "#ef4444", secondary: "white" },
        },
      }}
    />
  );
}
