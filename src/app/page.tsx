"use client";

import { useEffect, useState } from "react";
import { AddTransactionForm } from "@/components/AddTransactionForm";
import { Chart } from "@/components/Chart";
import { Summary } from "@/components/Summary";
import { TransactionList } from "@/components/TransactionList";
import { useTransactionStore } from "@/store/useTransactionStore";
import { LayoutDashboard, ReceiptText, Loader2 } from "lucide-react";
import { ReceiptModal } from "@/components/ReceiptModal";
import { CommandBar } from "@/components/CommandBar";
import { ProfileSettings } from "@/components/ProfileSettings";

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const { profile } = useTransactionStore();

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
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* Dynamic Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="font-black text-xl tracking-tight text-gray-900">
            {profile.businessName.split(' ')[0]}<span className="text-blue-600">{profile.businessName.split(' ')[1] || 'Portal'}</span>
          </div>
          <div className="flex items-center gap-6 text-sm font-bold text-gray-500">
            <div className="flex items-center gap-2 text-blue-600"><LayoutDashboard className="h-4 w-4" /> Dashboard</div>
            <div className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors"><ReceiptText className="h-4 w-4" /> Settlements</div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Merchant Ledger</h1>
          <p className="text-gray-500 mt-2 font-medium italic">High-trust financial monitoring for {profile.businessName}.</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* LEFT SIDEBAR: Identity & Stats */}
          <div className="xl:col-span-4 space-y-8">
            <ProfileSettings />
            <Summary />
            <AddTransactionForm />
          </div>

          {/* MAIN CONTENT: Insights & Ledger */}
          <div className="xl:col-span-8 space-y-8">
            {/* Visual Insights Section */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Business Insights</h2>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded">Live Data</span>
              </div>
              <Chart />
            </div>

            {/* The Command Center & List */}
            <div className="space-y-4">
              <CommandBar />
              <TransactionList />
            </div>
          </div>
        </div>
      </div>

      {/* Global Modals */}
      <ReceiptModal />
    </main>
  );
}