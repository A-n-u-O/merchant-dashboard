"use client";

import { useTransactionStore } from "@/store/useTransactionStore";
import { TrendingDown, TrendingUp, Wallet, Clock } from "lucide-react";

export const Summary = () => {
  const transactions = useTransactionStore((state) => state.transactions);

  const totalCredits = transactions.filter((tx) => tx.type === "credit" && tx.status === "success").reduce((acc, tx) => acc + tx.amount, 0);
  const totalDebits = transactions.filter((tx) => tx.type === "debit" && tx.status === "success").reduce((acc, tx) => acc + tx.amount, 0);
  const pendingVolume = transactions.filter((tx) => tx.status === "pending").reduce((acc, tx) => acc + tx.amount, 0);
  const netSettlement = totalCredits - totalDebits;

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-blue-600 rounded-lg">
          <Wallet className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-black text-gray-900">Settlement Overview</h2>
          <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mt-0.5">Real-time Balance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black text-emerald-700 uppercase tracking-wider mb-1">Cleared Credits</p>
              <p className="text-2xl font-black text-emerald-900">₦{totalCredits.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
            </div>
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>
        </div>

        <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-wider mb-1">Total Payouts</p>
              <p className="text-2xl font-black text-gray-900">₦{totalDebits.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
            </div>
            <TrendingDown className="w-5 h-5 text-gray-400" />
          </div>
        </div>

        <div className="mt-2 p-6 bg-blue-600 rounded-2xl shadow-blue-600/30 shadow-xl text-white">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">Available Balance</p>
          <p className="text-4xl font-black mb-5">₦{netSettlement.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          
          <div className="flex items-center gap-2 pt-4 border-t border-white/20">
            <Clock className="w-4 h-4 opacity-80" />
            <p className="text-xs font-medium">
              <span className="opacity-80">Pending Volume:</span> 
              <span className="ml-1 font-bold italic text-blue-100">₦{pendingVolume.toLocaleString()}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};