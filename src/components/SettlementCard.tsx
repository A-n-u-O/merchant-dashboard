"use client";

import { useTransactionStore } from "@/store/useTransactionStore";
import { Copy, CheckCircle2, Landmark, Wallet } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase"; // 1. Import Supabase

export const SettlementCard = () => {
  const { profile, user, fetchTransactions } = useTransactionStore();
  const [isCopying, setIsCopying] = useState(false);

  const handlePayment = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
    
    if (!(window as any).PaystackPop) {
      toast.error("Payment system initializing... Please wait.");
      return;
    }

    const handler = (window as any).PaystackPop.setup({
      key: publicKey,
      email: user?.email || "test@merchant.com",
      amount: 5000 * 100,
      currency: "NGN",
      metadata: { user_id: user?.id },
      
      // 2. THE FIX: Explicitly handle the database sync on success
      callback: async (response: any) => {
        const reference = response.reference;
        const toastId = toast.loading("Verifying settlement with bank...");

        try {
          // Manually push the transaction to Supabase immediately
          const { error } = await supabase.from("transactions").insert([
            {
              user_id: user?.id,
              amount: 5000,
              type: "credit",
              status: "success",
              reference: reference,
              description: "Paystack Card/Transfer Deposit",
              category: "Settlement",
            },
          ]);

          if (error) throw error;

          toast.success("₦5,000.00 Ledger Balance Updated", { id: toastId });
          
          // 3. Re-fetch all transactions so the table shows the new row
          await fetchTransactions();
          
        } catch (err: any) {
          console.error("Manual Sync Error:", err);
          toast.error("Payment successful, but failed to sync ledger.", { id: toastId });
        }
      },
      onClose: () => {
        toast.info("Transaction cancelled by user");
      }
    });
    handler.openIframe();
  };

  const copyToClipboard = () => {
    if (!profile.merchantId) return;
    const cleanId = profile.merchantId.replace("MID-", "81");
    navigator.clipboard.writeText(cleanId);
    setIsCopying(true);
    toast.success("Account Number Copied");
    setTimeout(() => setIsCopying(false), 2000);
  };

  return (
    <div className="relative group perspective-1000 space-y-4">
      {/* The Visual Card */}
      <div className="relative bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl overflow-hidden border border-white/10 transition-all duration-500 hover:shadow-blue-500/10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[80px] rounded-full -mr-20 -mt-20 animate-pulse" />
        
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-10">
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl">
              <Landmark className="w-6 h-6 text-blue-400" />
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Merchant Tier</p>
              <p className="text-xs font-bold text-emerald-400">{profile.tier}</p>
            </div>
          </div>

          <div className="space-y-1 mb-8">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Virtual Settlement ID</p>
            <div className="flex items-center gap-3">
              <h3 className="text-2xl font-mono font-bold tracking-widest">
                {profile.merchantId ? profile.merchantId.replace("MID-", "81 ") : "8100 0000 00"}
              </h3>
              <button onClick={copyToClipboard} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                {isCopying ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
              </button>
            </div>
          </div>

          <div className="flex justify-between items-end border-t border-white/5 pt-6">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Beneficiary</p>
              <p className="text-sm font-bold truncate max-w-[150px]">{profile.businessName}</p>
            </div>
            <div className="flex items-center gap-2 bg-blue-600/20 px-3 py-1.5 rounded-xl border border-blue-500/30">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping" />
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Live Rails</span>
            </div>
          </div>
        </div>
      </div>

      <button 
        type="button"
        onClick={handlePayment}
        className="relative z-[100] w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3 active:scale-95 group"
      >
        <Wallet className="w-4 h-4 group-hover:rotate-12 transition-transform" />
        Fund Account via Paystack
      </button>
    </div>
  );
};