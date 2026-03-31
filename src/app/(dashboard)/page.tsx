"use client";

import { useEffect, useState } from "react";
import { AddTransactionForm } from "@/components/AddTransactionForm";
import { Chart } from "@/components/Chart";
import { Summary } from "@/components/Summary";
import { TransactionList } from "@/components/TransactionList";
import { useTransactionStore } from "@/store/useTransactionStore";
import { LayoutDashboard, ReceiptText, Loader2, LogOut } from "lucide-react";
import { ReceiptModal } from "@/components/ReceiptModal";
import { CommandBar } from "@/components/CommandBar";
import { ProfileSettings } from "@/components/ProfileSettings";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const { user, profile, fetchTransactions, fetchProfile, signOut } = useTransactionStore();
  const [isSyncing, setIsSyncing] = useState(true);

  useEffect(() => {
    const syncCloudData = async () => {
      // Check if user session exists in store
      if (!user) {
        router.push("/login");
        return;
      }

      try {
        // Sync everything from Supabase
        await Promise.all([fetchProfile(), fetchTransactions()]);
      } catch (error) {
        console.error("Sync Error:", error);
      } finally {
        setIsSyncing(false);
      }
    };

    syncCloudData();
  }, [user, router, fetchProfile, fetchTransactions]);

  // Loading State - High Fidelity
  if (isSyncing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center premium-gradient text-blue-600 font-mono">
        <div className="relative">
            <div className="absolute -inset-4 bg-blue-500/20 blur-xl rounded-full animate-pulse"></div>
            <Loader2 className="animate-spin w-10 h-10 mb-4 relative" />
        </div>
        <p className="tracking-[0.3em] font-black text-xs uppercase mt-4">Authenticating Ledger</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen premium-gradient pb-20">
      <nav className="bg-white/70 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="font-black text-xl tracking-tighter text-gray-900">
            {profile.businessName.split(' ')[0]}
            <span className="text-blue-600">
              {profile.businessName.split(' ')[1] || 'Portal'}
            </span>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
                <div className="flex items-center gap-2 text-blue-600 border-b-2 border-blue-600 pb-1">
                <LayoutDashboard className="h-3.5 w-3.5" /> Dashboard
                </div>
                <div className="flex items-center gap-2 cursor-pointer hover:text-gray-900 transition-colors">
                <ReceiptText className="h-3.5 w-3.5" /> Settlements
                </div>
            </div>
            <button 
                onClick={() => signOut()}
                className="p-2 hover:bg-rose-50 text-gray-400 hover:text-rose-600 rounded-full transition-all"
            >
                <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <header className="mb-10">
          <h1 className="text-5xl font-black text-gray-900 tracking-tighter">
            Merchant <span className="text-blue-600">Ledger</span>
          </h1>
          <p className="text-gray-500 mt-2 font-medium">
            Cloud-synced monitoring for <span className="text-gray-900 font-bold underline decoration-blue-500/30">{profile.businessName}</span>.
          </p>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          <div className="xl:col-span-4 space-y-8 bg-slate-50/50 p-6 rounded-[2.5rem] border border-white">
   <ProfileSettings />
   <Summary />
   <AddTransactionForm />
</div>

          <div className="xl:col-span-8 space-y-8">
            <div className="glass-card rounded-[2.5rem] p-8 relative overflow-hidden">
              {/* Decorative background element to kill AI look */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full -mr-16 -mt-16"></div>
              
              <div className="flex items-center justify-between mb-8 relative">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Business Insights</h2>
                  <p className="text-xs text-gray-400 font-medium">Inflow vs Outflow Trends</p>
                </div>
                <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></div>
                    <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">
                    Live Sync
                    </span>
                </div>
              </div>
              <Chart />
            </div>

            <div className="space-y-6">
              <CommandBar />
              <TransactionList />
            </div>
          </div>
        </div>
      </div>

      <ReceiptModal />
    </main>
  );
}