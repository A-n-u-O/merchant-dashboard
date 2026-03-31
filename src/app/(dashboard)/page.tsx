"use client";

import { useEffect, useState } from "react";
import { AddTransactionForm } from "@/components/AddTransactionForm";
import { Chart } from "@/components/Chart";
import { Summary } from "@/components/Summary";
import { TransactionList } from "@/components/TransactionList";
import { useTransactionStore } from "@/store/useTransactionStore";
import { LayoutDashboard, ReceiptText, Loader2, LogOut, ArrowUpRight, History } from "lucide-react";
import { ReceiptModal } from "@/components/ReceiptModal";
import { CommandBar } from "@/components/CommandBar";
import { ProfileSettings } from "@/components/ProfileSettings";
import { useRouter } from "next/navigation";
import { SettlementCard } from "@/components/SettlementCard";

export default function Home() {
  const router = useRouter();
  const { user, profile, fetchTransactions, fetchProfile, signOut } = useTransactionStore();
  const [isSyncing, setIsSyncing] = useState(true);
  
  // 💡 TAB STATE: This controls what the user sees
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
        <p className="tracking-[0.3em] font-black text-xs uppercase">Authenticating Ledger</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen premium-gradient pb-20">
      {/* --- NAVBAR --- */}
      <nav className="bg-white/70 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="font-black text-xl tracking-tighter text-gray-900">
            {profile.businessName.split(' ')[0]}
            <span className="text-blue-600">
              {profile.businessName.split(' ')[1] || 'Portal'}
            </span>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest">
              <button 
                onClick={() => setActiveTab("dashboard")}
                className={`flex items-center gap-2 pb-1 transition-all ${activeTab === 'dashboard' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400 hover:text-gray-900'}`}
              >
                <LayoutDashboard className="h-3.5 w-3.5" /> Dashboard
              </button>
              <button 
                onClick={() => setActiveTab("settlements")}
                className={`flex items-center gap-2 pb-1 transition-all ${activeTab === 'settlements' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400 hover:text-gray-900'}`}
              >
                <ReceiptText className="h-3.5 w-3.5" /> Settlements
              </button>
            </div>
            <button onClick={() => signOut()} className="p-2 hover:bg-rose-50 text-gray-400 hover:text-rose-600 rounded-full transition-all">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-10">
        
        {/* --- DYNAMIC CONTENT --- */}
        {activeTab === "dashboard" ? (
          <div className="space-y-10">
            {/* TOP ROW: Identity & Fast Action */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-4 space-y-6">
                 <ProfileSettings />
                 <SettlementCard />
              </div>
              
              <div className="lg:col-span-8 space-y-6">
                <div className="flex items-center justify-between">
                   <h2 className="text-3xl font-black text-gray-900 tracking-tighter">Business Overview</h2>
                   <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></div>
                      <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Live Sync</span>
                   </div>
                </div>
                <Summary /> {/* Move Summary here so it's prominent */}
                <div className="glass-card rounded-[2.5rem] p-8">
                  <Chart />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-5xl font-black text-gray-900 tracking-tighter flex items-center gap-3">
                  <History className="w-10 h-10 text-blue-600" /> Settlement Ledger
                </h1>
                <p className="text-gray-500 mt-2 font-medium">Record manual settlements or track automated Paystack inflows.</p>
              </div>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
              {/* Manual Entry Form on the left in Settlements Tab */}
              <div className="xl:col-span-4">
                <div className="sticky top-28">
                  <AddTransactionForm />
                </div>
              </div>

              {/* Transaction List and Search on the right */}
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