"use client";

import { useEffect, useState } from "react";
import { AddTransactionForm } from "@/components/AddTransactionForm";
import { Chart } from "@/components/Chart";
import { Summary } from "@/components/Summary";
import { TransactionList } from "@/components/TransactionList";
import { useTransactionStore } from "@/store/useTransactionStore";
import { LayoutDashboard, ReceiptText, Loader2, LogOut, History } from "lucide-react";
import { ReceiptModal } from "@/components/ReceiptModal";
import { CommandBar } from "@/components/CommandBar";
import { ProfileSettings } from "@/components/ProfileSettings";
import { useRouter } from "next/navigation";
import { SettlementCard } from "@/components/SettlementCard";

export default function Home() {
  const router = useRouter();
  const { user, profile, fetchTransactions, fetchProfile, signOut } = useTransactionStore();
  const [isSyncing, setIsSyncing] = useState(true);
  const [activeTab, setActiveTab] = useState<"dashboard" | "settlements">("dashboard");

  useEffect(() => {
    const syncCloudData = async () => {
      if (!user) {
        router.push("/login");
        return;
      }
      try {
        await Promise.all([fetchProfile(), fetchTransactions()]);
      } catch (error) {
        console.error("Sync Error:", error);
      } finally {
        setIsSyncing(false);
      }
    };
    syncCloudData();
  }, [user, router, fetchProfile, fetchTransactions]);

  if (isSyncing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center premium-gradient text-blue-600 font-mono">
        <Loader2 className="animate-spin w-10 h-10 mb-4" />
        <p className="tracking-[0.3em] font-black text-[10px] uppercase">Authenticating Ledger</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen premium-gradient pb-20 overflow-x-hidden">
      {/* --- NAVBAR --- */}
      <nav className="bg-white/70 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="font-black text-lg md:text-xl tracking-tighter text-gray-900 truncate max-w-[150px] md:max-w-none">
             <span className="text-blue-600">{profile.businessName?.split(' ')[0]}</span> {profile.businessName?.split(' ')[1] || 'Portal'}
          </div>

          <div className="flex items-center gap-4 md:gap-8">
            <div className="flex items-center gap-4 md:gap-6 text-[10px] font-black uppercase tracking-widest">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`flex items-center gap-2 pb-1 transition-all ${activeTab === 'dashboard' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400 hover:text-gray-900'}`}
              >
                <LayoutDashboard className="h-3.5 w-3.5" /> <span className="hidden xs:inline">Dashboard</span>
              </button>
              <button
                onClick={() => setActiveTab("settlements")}
                className={`flex items-center gap-2 pb-1 transition-all ${activeTab === 'settlements' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400 hover:text-gray-900'}`}
              >
                <ReceiptText className="h-3.5 w-3.5" /> <span className="hidden xs:inline">Settlements</span>
              </button>
            </div>
            <button onClick={() => signOut()} className="p-2 hover:bg-rose-50 text-gray-400 hover:text-rose-600 rounded-full transition-all">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10">
        {activeTab === "dashboard" ? (
          <div className="space-y-8 md:space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">
              <div className="lg:col-span-4 space-y-6 order-2 lg:order-1">
                <ProfileSettings />
                <SettlementCard />
              </div>

              <div className="lg:col-span-8 space-y-6 order-1 lg:order-2">
                <div className="flex items-center justify-between px-2">
                  <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tighter">Overview</h2>
                  <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></div>
                    <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Live</span>
                  </div>
                </div>
                <Summary />
                <div className="glass-card rounded-[1.5rem] md:rounded-[2.5rem] p-4 md:p-8 overflow-hidden">
                  <Chart />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="px-2">
                <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter flex items-center gap-3">
                  <History className="w-8 h-8 md:w-10 md:h-10 text-blue-600" /> Ledger
                </h1>
                <p className="text-sm md:text-base text-gray-500 mt-2 font-medium italic">Monitoring for {profile.businessName}</p>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 md:gap-8">
              <div className="xl:col-span-4">
                <div className="xl:sticky xl:top-28">
                  <AddTransactionForm />
                </div>
              </div>
              <div className="xl:col-span-8 space-y-6">
                <CommandBar />
                <TransactionList />
              </div>
            </div>
          </div>
        )}
      </div>
      <ReceiptModal />
    </main>
  );
}