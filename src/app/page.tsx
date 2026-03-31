"use client";

import { useEffect, useState } from "react";
import { AddTransactionForm } from "@/components/AddTransactionForm";
import { Chart } from "@/components/Chart";
import { Summary } from "@/components/Summary";
import { TransactionList } from "@/components/TransactionList";
import { useTransactionStore } from "@/store/useTransactionStore";
import { LayoutDashboard, ReceiptText, ShieldCheck, Loader2 } from "lucide-react";

export default function Home() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    useTransactionStore.persist.rehydrate();
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-blue-600 font-mono font-bold">
        <Loader2 className="animate-spin w-8 h-8 mb-4" />
        <p>INITIALIZING SECURE LEDGER...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-8 w-8 text-blue-600" />
            <div className="font-black text-xl tracking-tight text-gray-900">Merchant<span className="text-blue-600">Portal</span></div>
          </div>
          <div className="flex items-center gap-6 text-sm font-bold text-gray-500">
             <div className="flex items-center gap-2 text-blue-600"><LayoutDashboard className="h-4 w-4" /> Dashboard</div>
             <div className="flex items-center gap-2"><ReceiptText className="h-4 w-4" /> Settlements</div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Transaction Ledger</h1>
          <p className="text-gray-500 mt-2 font-medium">Manage your Moniepoint settlements and track operational cashflow.</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          <div className="xl:col-span-4 space-y-8">
            <Summary />
            <AddTransactionForm />
          </div>
          <div className="xl:col-span-8 space-y-8">
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Inflow vs Outflow Trends</h2>
              <Chart />
            </div>
            <TransactionList />
          </div>
        </div>
      </div>
    </main>
  );
}