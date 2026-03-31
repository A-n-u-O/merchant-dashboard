"use client";

import { useTransactionStore } from "@/store/useTransactionStore";
import { Copy, CheckCircle2, CreditCard, Landmark } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const SettlementCard = () => {
  const { profile, updateProfile } = useTransactionStore();
  const [isCopying, setIsCopying] = useState(false);

  const copyToClipboard = () => {
    if (!profile.merchantId) return;
    navigator.clipboard.writeText(profile.merchantId.replace("MID-", "81")); // Mock account
    setIsCopying(true);
    toast.success("Account Number Copied");
    setTimeout(() => setIsCopying(false), 2000);
  };

  return (
    <div className="relative group perspective-1000">
      {/* The Card Face */}
      <div className="relative bg-slate-900 rounded-[2rem] p-8 text-white shadow-2xl overflow-hidden border border-white/10 transition-all duration-500 hover:rotate-x-2">
        {/* Animated Background Mesh */}
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
                {profile.merchantId ? profile.merchantId.replace("MID-", "81 ") : "GENERATE ID"}
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
    </div>
  );
};