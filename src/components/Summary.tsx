"use client";

import { useTransactionStore } from "@/store/useTransactionStore";
import { TrendingDown, TrendingUp, Wallet, CheckCircle2, Clock } from "lucide-react";

export const Summary = () => {
  const transactions = useTransactionStore((state) => state.transactions);

  // 1. Calculate based on Credit/Debit instead of Income/Expense
  const totalCredits = transactions
    .filter((tx) => tx.type === "credit" && tx.status === "success")
    .reduce((acc, tx) => acc + tx.amount, 0);

  const totalDebits = transactions
    .filter((tx) => tx.type === "debit" && tx.status === "success")
    .reduce((acc, tx) => acc + tx.amount, 0);

  // 2. Track Pending Volume (Crucial for Merchants)
  const pendingVolume = transactions
    .filter((tx) => tx.status === "pending")
    .reduce((acc, tx) => acc + tx.amount, 0);

  const netSettlement = totalCredits - totalDebits;

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-blue-600 rounded-lg">
          <Wallet className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Settlement Overview</h2>
          <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mt-0.5">Real-time Balance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Total Credits Card */}
        <div className="p-5 bg-emerald-50/50 rounded-xl border border-emerald-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-emerald-700 uppercase tracking-tight mb-1">Cleared Credits</p>
              <p className="text-2xl font-black text-emerald-900">
                ₦{totalCredits.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>
        </div>

        {/* Total Debits Card */}
        <div className="p-5 bg-gray-50 rounded-xl border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-tight mb-1">Total Payouts</p>
              <p className="text-2xl font-black text-gray-900">
                ₦{totalDebits.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
            <TrendingDown className="w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Net Settlement (The "Big Number") */}
        <div className="mt-4 p-6 bg-blue-600 rounded-2xl shadow-blue-200 shadow-lg text-white">
          <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-80 mb-1">Available Balance</p>
          <p className="text-4xl font-black mb-4">
            ₦{netSettlement.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
          
          {/* Pending Indicator - Shows the merchant money is on the way */}
          <div className="flex items-center gap-2 pt-4 border-t border-white/20">
            <Clock className="w-4 h-4 opacity-80" />
            <p className="text-xs font-medium">
              <span className="opacity-80">Pending Settlement:</span> 
              <span className="ml-1 font-bold italic">₦{pendingVolume.toLocaleString()}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};