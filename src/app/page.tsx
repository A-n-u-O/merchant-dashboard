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
  
  // Pull profile and the cloud-fetch action from the store
  const { profile, fetchTransactions } = useTransactionStore();

  useEffect(() => {
    // 1. Rehydrate local profile (Merchant Name, Tier)
    useTransactionStore.persist.rehydrate();
    
    // 2. Fetch all transaction records from Supabase PostgreSQL
    fetchTransactions();
    
    setIsClient(true);
  }, [fetchTransactions]);

  if (!isClient) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center premium-gradient text-blue-600 font-mono font-bold">
        <Loader2 className="animate-spin w-8 h-8 mb-4" />
        <p className="tracking-widest">SYNCING CLOUD LEDGER...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen premium-gradient pb-20">
      {/* Premium Glass Navbar */}
      <nav className="bg-white/70 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="font-black text-xl tracking-tight text-gray-900">
            {profile.businessName.split(' ')[0]}
            <span className="text-blue-600">
              {profile.businessName.split(' ')[1] || 'Portal'}
            </span>
          </div>
          <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
            <div className="flex items-center gap-2 text-blue-600 border-b-2 border-blue-600 pb-1">
              <LayoutDashboard className="h-3.5 w-3.5" /> Dashboard
            </div>
            <div className="flex items-center gap-2 cursor-pointer hover:text-gray-900 transition-colors">
              <ReceiptText className="h-3.5 w-3.5" /> Settlements
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <header className="mb-10">
          <h1 className="text-5xl font-black text-gray-900 tracking-tighter">
            Merchant <span className="text-blue-600">Ledger</span>
          </h1>
          <p className="text-gray-500 mt-2 font-medium">
            Cloud-synced financial monitoring for <span className="font-bold text-gray-700">{profile.businessName}</span>.
          </p>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* LEFT SIDEBAR: Identity & Stats */}
          <div className="xl:col-span-4 space-y-8">
            <ProfileSettings />
            <Summary />
            <AddTransactionForm />
          </div>

          {/* MAIN CONTENT: Insights & Ledger */}
          <div className="xl:col-span-8 space-y-8">
            {/* Visual Insights Section - Glassmorphism applied */}
            <div className="glass-card rounded-[2rem] p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Business Insights</h2>
                  <p className="text-xs text-gray-400 font-medium">Inflow vs Outflow Trends</p>
                </div>
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2.5 py-1 rounded-full">
                  Live Sync
                </span>
              </div>
              <Chart />
            </div>

            {/* The Command Center & List */}
            <div className="space-y-6">
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